/**
 * easyXDM
 * http://easyxdm.net/
 * Copyright(c) 2009-2011, Øyvind Sean Kinsey, oyvind@kinsey.no.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(window, document, location, setTimeout, decodeURIComponent, encodeURIComponent) {
  const global = window;
  let channelId = Math.floor(Math.random() * 10000); // randomize the initial id in case of multiple closures loaded
  const emptyFn = Function.prototype;
  const reURI = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/; // returns groups for protocol (2), domain (3) and port (4)
  const reParent = /[\-\w]+\/\.\.\//; // matches a foo/../ expression
  const reDoubleSlash = /([^:])\/\//g; // matches // anywhere but in the protocol
  let namespace = ''; // stores namespace under which easyXDM object is stored on the page (empty if object is global)
  const easyXDM = {};
  const _easyXDM = window.easyXDM; // map over global easyXDM in case of overwrite
  let IFRAME_PREFIX = 'easyXDM_';
  let HAS_NAME_PROPERTY_BUG;
  let useHash = false; // whether to use the hash over the query
  let flashVersion; // will be set if using flash
  let HAS_FLASH_THROTTLED_BUG;

  // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
  function isHostMethod(object, property) {
    const t = typeof object[property];

    return t == 'function' || Boolean(t == 'object' && object[property]) || t == 'unknown';
  }

  function isHostObject(object, property) {
    return Boolean(typeof object[property] === 'object' && object[property]);
  }

  // end

  // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
  function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }

  // end
  function hasFlash() {
    let name = 'Shockwave Flash',
      mimeType = 'application/x-shockwave-flash';

    if (!undef(navigator.plugins) && typeof navigator.plugins[name] === 'object') {
      // adapted from the swfobject code
      const description = navigator.plugins[name].description;

      if (
        description &&
        !undef(navigator.mimeTypes) &&
        navigator.mimeTypes[mimeType] &&
        navigator.mimeTypes[mimeType].enabledPlugin
      ) {
        flashVersion = description.match(/\d+/g);
      }
    }
    if (!flashVersion) {
      let flash;

      try {
        flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        flashVersion = Array.prototype.slice.call(
          flash.GetVariable('$version').match(/(\d+),(\d+),(\d+),(\d+)/),
          1
        );
        flash = null;
      } catch (notSupportedException) {}
    }
    if (!flashVersion) {
      return false;
    }
    let major = parseInt(flashVersion[0], 10),
      minor = parseInt(flashVersion[1], 10);

    HAS_FLASH_THROTTLED_BUG = major > 9 && minor > 0;

    return true;
  }

  /*
     * Cross Browser implementation for adding and removing event listeners.
     */
  let on, un;

  if (isHostMethod(window, 'addEventListener')) {
    on = function(target, type, listener) {
      target.addEventListener(type, listener, false);
    };
    un = function(target, type, listener) {
      target.removeEventListener(type, listener, false);
    };
  } else if (isHostMethod(window, 'attachEvent')) {
    on = function(object, sEvent, fpNotify) {
      object.attachEvent(`on${sEvent}`, fpNotify);
    };
    un = function(object, sEvent, fpNotify) {
      object.detachEvent(`on${sEvent}`, fpNotify);
    };
  } else {
    throw new Error('Browser not supported');
  }

  /*
     * Cross Browser implementation of DOMContentLoaded.
     */
  let domIsReady = false,
    domReadyQueue = [],
    readyState;

  if ('readyState' in document) {
    // If browser is WebKit-powered, check for both 'loaded' (legacy browsers) and
    // 'interactive' (HTML5 specs, recent WebKit builds) states.
    // https://bugs.webkit.org/show_bug.cgi?id=45119
    readyState = document.readyState;
    domIsReady =
      readyState == 'complete' ||
      (~navigator.userAgent.indexOf('AppleWebKit/') &&
        (readyState == 'loaded' || readyState == 'interactive'));
  } else {
    // If readyState is not supported in the browser, then in order to be able to fire whenReady functions apropriately
    // when added dynamically _after_ DOM load, we have to deduce wether the DOM is ready or not.
    // We only need a body to add elements to, so the existence of document.body is enough for us.
    domIsReady = Boolean(document.body);
  }

  function dom_onReady() {
    if (domIsReady) {
      return;
    }
    domIsReady = true;
    for (let i = 0; i < domReadyQueue.length; i++) {
      domReadyQueue[i]();
    }
    domReadyQueue.length = 0;
  }

  if (!domIsReady) {
    if (isHostMethod(window, 'addEventListener')) {
      on(document, 'DOMContentLoaded', dom_onReady);
    } else {
      on(document, 'readystatechange', function() {
        if (document.readyState === 'complete') {
          dom_onReady();
        }
      });
      if (document.documentElement.doScroll && window === top) {
        var doScrollCheck = function() {
          if (domIsReady) {
            return;
          }
          // http://javascript.nwbox.com/IEContentLoaded/
          try {
            document.documentElement.doScroll('left');
          } catch (e) {
            setTimeout(doScrollCheck, 1);

            return;
          }
          dom_onReady();
        };

        doScrollCheck();
      }
    }

    // A fallback to window.onload, that will always work
    on(window, 'load', dom_onReady);
  }
  /**
   * This will add a function to the queue of functions to be run once the DOM reaches a ready state.
   * If functions are added after this event then they will be executed immediately.
   * @param {function} fn The function to add
   * @param {Object} scope An optional scope for the function to be called with.
   */
  function whenReady(fn, scope) {
    if (domIsReady) {
      fn.call(scope);

      return;
    }
    domReadyQueue.push(function() {
      fn.call(scope);
    });
  }

  /**
   * Returns an instance of easyXDM from the parent window with
   * respect to the namespace.
   *
   * @return An instance of easyXDM (in the parent window)
   */
  function getParentObject() {
    let obj = parent;

    if (namespace !== '') {
      for (let i = 0, ii = namespace.split('.'); i < ii.length; i++) {
        obj = obj[ii[i]];
      }
    }

    return obj.easyXDM;
  }

  /**
   * Removes easyXDM variable from the global scope. It also returns control
   * of the easyXDM variable to whatever code used it before.
   *
   * @param {String} ns A string representation of an object that will hold
   *                    an instance of easyXDM.
   * @return An instance of easyXDM
   */
  function noConflict(ns) {
    // window.easyXDM = _easyXDM;
    const oldXDM = window.easyXDM;

    window.easyXDM = oldXDM;
    namespace = ns;
    if (namespace) {
      IFRAME_PREFIX = `easyXDM_${namespace.replace('.', '_')}_`;
    }

    return easyXDM;
  }

  /*
     * Methods for working with URLs
     */
  /**
   * Get the domain name from a url.
   * @param {String} url The url to extract the domain from.
   * @return The domain part of the url.
   * @type {String}
   */
  function getDomainName(url) {
    return url.match(reURI)[3];
  }

  /**
   * Get the port for a given URL, or "" if none
   * @param {String} url The url to extract the port from.
   * @return The port part of the url.
   * @type {String}
   */
  function getPort(url) {
    return url.match(reURI)[4] || '';
  }

  /**
   * Returns  a string containing the schema, domain and if present the port
   * @param {String} url The url to extract the location from
   * @return {String} The location part of the url
   */
  function getLocation(url) {
    const m = url.toLowerCase().match(reURI);
    let proto = m[2],
      domain = m[3],
      port = m[4] || '';

    if ((proto == 'http:' && port == ':80') || (proto == 'https:' && port == ':443')) {
      port = '';
    }

    return `${proto}//${domain}${port}`;
  }

  /**
   * Resolves a relative url into an absolute one.
   * @param {String} url The path to resolve.
   * @return {String} The resolved url.
   */
  function resolveUrl(url) {
    // replace all // except the one in proto with /
    url = url.replace(reDoubleSlash, '$1/');

    // If the url is a valid url we do nothing
    if (!url.match(/^(http||https):\/\//)) {
      // If this is a relative path
      let path = url.substring(0, 1) === '/' ? '' : location.pathname;

      if (path.substring(path.length - 1) !== '/') {
        path = path.substring(0, path.lastIndexOf('/') + 1);
      }

      url = `${location.protocol}//${location.host}${path}${url}`;
    }

    // reduce all 'xyz/../' to just ''
    while (reParent.test(url)) {
      url = url.replace(reParent, '');
    }

    return url;
  }

  /**
   * Appends the parameters to the given url.<br/>
   * The base url can contain existing query parameters.
   * @param {String} url The base url.
   * @param {Object} parameters The parameters to add.
   * @return {String} A new valid url with the parameters appended.
   */
  function appendQueryParameters(url, parameters) {
    let hash = '',
      indexOf = url.indexOf('#');

    if (indexOf !== -1) {
      hash = url.substring(indexOf);
      url = url.substring(0, indexOf);
    }
    const q = [];

    for (const key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        q.push(`${key}=${encodeURIComponent(parameters[key])}`);
      }
    }

    return url + (useHash ? '#' : url.indexOf('?') == -1 ? '?' : '&') + q.join('&') + hash;
  }

  // build the query object either from location.query, if it contains the xdm_e argument, or from location.hash
  const query = (function(input) {
    input = input.substring(1).split('&');
    let data = {},
      pair,
      i = input.length;

    while (i--) {
      pair = input[i].split('=');
      data[pair[0]] = decodeURIComponent(pair[1]);
    }

    return data;
  })(/xdm_e=/.test(location.search) ? location.search : location.hash);

  /*
     * Helper methods
     */
  /**
   * Helper for checking if a variable/property is undefined
   * @param {Object} v The variable to test
   * @return {Boolean} True if the passed variable is undefined
   */
  function undef(v) {
    return typeof v === 'undefined';
  }

  /**
   * A safe implementation of HTML5 JSON. Feature testing is used to make sure the implementation works.
   * @return {JSON} A valid JSON conforming object, or null if not found.
   */
  var getJSON = function() {
    const cached = {};
    let obj = {
        a: [1, 2, 3],
      },
      json = '{"a":[1,2,3]}';

    if (
      typeof JSON !== 'undefined' &&
      typeof JSON.stringify === 'function' &&
      JSON.stringify(obj).replace(/\s/g, '') === json
    ) {
      // this is a working JSON instance
      return JSON;
    }
    if (Object.toJSON) {
      if (Object.toJSON(obj).replace(/\s/g, '') === json) {
        // this is a working stringify method
        cached.stringify = Object.toJSON;
      }
    }

    if (typeof String.prototype.evalJSON === 'function') {
      obj = json.evalJSON();
      if (obj.a && obj.a.length === 3 && obj.a[2] === 3) {
        // this is a working parse method
        cached.parse = function(str) {
          return str.evalJSON();
        };
      }
    }

    if (cached.stringify && cached.parse) {
      // Only memoize the result if we have valid instance
      getJSON = function() {
        return cached;
      };

      return cached;
    }

    return null;
  };

  /**
   * Applies properties from the source object to the target object.<br/>
   * @param {Object} target The target of the properties.
   * @param {Object} source The source of the properties.
   * @param {Boolean} noOverwrite Set to True to only set non-existing properties.
   */
  function apply(destination, source, noOverwrite) {
    let member;

    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        if (prop in destination) {
          member = source[prop];
          if (typeof member === 'object') {
            apply(destination[prop], member, noOverwrite);
          } else if (!noOverwrite) {
            destination[prop] = source[prop];
          }
        } else {
          destination[prop] = source[prop];
        }
      }
    }

    return destination;
  }

  // This tests for the bug in IE where setting the [name] property using javascript causes the value to be redirected into [submitName].
  function testForNamePropertyBug() {
    let form = document.body.appendChild(document.createElement('form')),
      input = form.appendChild(document.createElement('input'));

    input.name = `${IFRAME_PREFIX}TEST${channelId}`; // append channelId in order to avoid caching issues
    HAS_NAME_PROPERTY_BUG = input !== form.elements[input.name];
    document.body.removeChild(form);
  }

  /**
   * Creates a frame and appends it to the DOM.
   * @param config {object} This object can have the following properties
   * <ul>
   * <li> {object} prop The properties that should be set on the frame. This should include the 'src' property.</li>
   * <li> {object} attr The attributes that should be set on the frame.</li>
   * <li> {DOMElement} container Its parent element (Optional).</li>
   * <li> {function} onLoad A method that should be called with the frames contentWindow as argument when the frame is fully loaded. (Optional)</li>
   * </ul>
   * @return The frames DOMElement
   * @type DOMElement
   */
  function createFrame(config) {
    if (undef(HAS_NAME_PROPERTY_BUG)) {
      testForNamePropertyBug();
    }
    let frame;
    // This is to work around the problems in IE6/7 with setting the name property.
    // Internally this is set as 'submitName' instead when using 'iframe.name = ...'
    // This is not required by easyXDM itself, but is to facilitate other use cases

    if (HAS_NAME_PROPERTY_BUG) {
      frame = document.createElement(`<iframe name="${config.props.name}"/>`);
    } else {
      frame = document.createElement('IFRAME');
      frame.name = config.props.name;
    }

    frame.id = frame.name = config.props.name;
    delete config.props.name;

    if (typeof config.container === 'string') {
      config.container = document.getElementById(config.container);
    }

    if (!config.container) {
      // This needs to be hidden like this, simply setting display:none and the like will cause failures in some browsers.
      apply(frame.style, {
        position: 'absolute',
        top: '-2000px',
        // Avoid potential horizontal scrollbar
        left: '0px',
      });
      config.container = document.body;
    }

    // HACK: IE cannot have the src attribute set when the frame is appended
    //       into the container, so we set it to "javascript:false" as a
    //       placeholder for now.  If we left the src undefined, it would
    //       instead default to "about:blank", which causes SSL mixed-content
    //       warnings in IE6 when on an SSL parent page.
    const src = config.props.src;

    config.props.src = 'javascript:false';

    // transfer properties to the frame
    apply(frame, config.props);

    frame.border = frame.frameBorder = 0;
    frame.allowTransparency = true;
    config.container.appendChild(frame);

    if (config.onLoad) {
      on(frame, 'load', config.onLoad);
    }

    // set the frame URL to the proper value (we previously set it to
    // "javascript:false" to work around the IE issue mentioned above)
    if (config.usePost) {
      let form = config.container.appendChild(document.createElement('form')),
        input;

      form.target = frame.name;
      form.action = src;
      form.method = 'POST';
      if (typeof config.usePost === 'object') {
        for (const i in config.usePost) {
          if (config.usePost.hasOwnProperty(i)) {
            if (HAS_NAME_PROPERTY_BUG) {
              input = document.createElement(`<input name="${i}"/>`);
            } else {
              input = document.createElement('INPUT');
              input.name = i;
            }
            input.value = config.usePost[i];
            form.appendChild(input);
          }
        }
      }
      form.submit();
      form.parentNode.removeChild(form);
    } else {
      frame.src = src;
    }
    config.props.src = src;

    return frame;
  }

  /**
   * Check whether a domain is allowed using an Access Control List.
   * The ACL can contain * and ? as wildcards, or can be regular expressions.
   * If regular expressions they need to begin with ^ and end with $.
   * @param {Array/String} acl The list of allowed domains
   * @param {String} domain The domain to test.
   * @return {Boolean} True if the domain is allowed, false if not.
   */
  function checkAcl(acl, domain) {
    // normalize into an array
    if (typeof acl === 'string') {
      acl = [acl];
    }
    let re,
      i = acl.length;

    while (i--) {
      re = acl[i];
      re = new RegExp(
        re.substr(0, 1) == '^' ? re : `^${re.replace(/(\*)/g, '.$1').replace(/\?/g, '.')}$`
      );
      if (re.test(domain)) {
        return true;
      }
    }

    return false;
  }

  /*
     * Functions related to stacks
     */
  /**
   * Prepares an array of stack-elements suitable for the current configuration
   * @param {Object} config The Transports configuration. See easyXDM.Socket for more.
   * @return {Array} An array of stack-elements with the TransportElement at index 0.
   */
  function prepareTransportStack(config) {
    let protocol = config.protocol,
      stackEls;

    config.isHost = config.isHost === false ? false : config.isHost || undef(query.xdm_p);
    useHash = config.hash || false;

    if (!config.props) {
      config.props = {};
    }
    if (!config.isHost) {
      let chan;

      if (window.name && window.name.indexOf('chan') !== -1 && window.name.indexOf('8888') !== -1) {
        chan = window.name.slice(window.name.indexOf('chan'), window.name.indexOf('8888') + 4);
      }
      config.channel = chan || config.channel || query.xdm_c.replace(/["'<>\\]/g, '');
      config.secret = query.xdm_s;
      config.remote =
        config.allowRedirects === true
          ? 'http://ya.ru'
          : config.remote || query.xdm_e.replace(/["'<>\\]/g, '');
      protocol = config.protocol || query.xdm_p;

      if (config.acl && !checkAcl(config.acl, config.remote)) {
        throw new Error(`Access denied for ${config.remote}`);
      }
    } else {
      config.remote = resolveUrl(config.remote);
      config.channel = config.channel || `default${channelId++}`;
      config.secret = Math.random()
        .toString(16)
        .substring(2);

      if (undef(protocol)) {
        if (getLocation(location.href) == getLocation(config.remote)) {
          protocol = '4';
        } else if (isHostMethod(window, 'postMessage') || isHostMethod(document, 'postMessage')) {
          protocol = '1';
        } else if (config.swf && isHostMethod(window, 'ActiveXObject') && hasFlash()) {
          protocol = '6';
        } else if (
          navigator.product === 'Gecko' &&
          'frameElement' in window &&
          navigator.userAgent.indexOf('WebKit') == -1
        ) {
          protocol = '5';
        } else if (config.remoteHelper) {
          protocol = '2';
        } else {
          protocol = '0';
        }
      }
    }
    config.protocol = protocol; // for conditional branching
    switch (protocol) {
      case '0': // 0 = HashTransport
        apply(
          config,
          {
            interval: 100,
            delay: 2000,
            useResize: true,
            useParent: false,
            usePolling: false,
          },
          true
        );
        if (config.isHost) {
          if (!config.local) {
            // If no local is set then we need to find an image hosted on the current domain
            let domain = `${location.protocol}//${location.host}`,
              images = document.body.getElementsByTagName('img'),
              image;
            let i = images.length;

            while (i--) {
              image = images[i];
              if (image.src.substring(0, domain.length) === domain) {
                config.local = image.src;
                break;
              }
            }
            if (!config.local) {
              // If no local was set, and we are unable to find a suitable file, then we resort to using the current window
              config.local = window;
            }
          }

          const parameters = {
            xdm_c: config.channel,
            xdm_p: 0,
          };

          if (config.local === window) {
            // We are using the current window to listen to
            config.usePolling = true;
            config.useParent = true;
            config.local = `${location.protocol}//${location.host}${location.pathname}${
              location.search
            }`;
            parameters.xdm_e = config.local;
            parameters.xdm_pa = 1; // use parent
          } else {
            parameters.xdm_e = resolveUrl(config.local);
          }

          if (config.container) {
            config.useResize = false;
            parameters.xdm_po = 1; // use polling
          }
          config.remote = appendQueryParameters(config.remote, parameters);
        } else {
          apply(config, {
            channel: query.xdm_c,
            remote: query.xdm_e,
            useParent: !undef(query.xdm_pa),
            usePolling: !undef(query.xdm_po),
            useResize: config.useParent ? false : config.useResize,
          });
        }
        stackEls = [
          new easyXDM.stack.HashTransport(config),
          new easyXDM.stack.ReliableBehavior({}),
          new easyXDM.stack.QueueBehavior({
            encode: true,
            maxLength: 4000 - config.remote.length,
          }),
          new easyXDM.stack.VerifyBehavior({
            initiate: config.isHost,
          }),
        ];
        break;
      case '1':
        stackEls = [new easyXDM.stack.PostMessageTransport(config)];
        break;
      case '2':
        if (config.isHost) {
          config.remoteHelper = resolveUrl(config.remoteHelper);
        }
        stackEls = [
          new easyXDM.stack.NameTransport(config),
          new easyXDM.stack.QueueBehavior(),
          new easyXDM.stack.VerifyBehavior({
            initiate: config.isHost,
          }),
        ];
        break;
      case '3':
        stackEls = [new easyXDM.stack.NixTransport(config)];
        break;
      case '4':
        stackEls = [new easyXDM.stack.SameOriginTransport(config)];
        break;
      case '5':
        stackEls = [new easyXDM.stack.FrameElementTransport(config)];
        break;
      case '6':
        if (!flashVersion) {
          hasFlash();
        }
        stackEls = [new easyXDM.stack.FlashTransport(config)];
        break;
    }
    // this behavior is responsible for buffering outgoing messages, and for performing lazy initialization
    stackEls.push(
      new easyXDM.stack.QueueBehavior({
        lazy: config.lazy,
        remove: true,
      })
    );

    return stackEls;
  }

  /**
   * Chains all the separate stack elements into a single usable stack.<br/>
   * If an element is missing a necessary method then it will have a pass-through method applied.
   * @param {Array} stackElements An array of stack elements to be linked.
   * @return {easyXDM.stack.StackElement} The last element in the chain.
   */
  function chainStack(stackElements) {
    let stackEl,
      defaults = {
        incoming(message, origin) {
          this.up.incoming(message, origin);
        },
        outgoing(message, recipient) {
          this.down.outgoing(message, recipient);
        },
        callback(success) {
          this.up.callback(success);
        },
        init() {
          this.down.init();
        },
        destroy() {
          this.down.destroy();
        },
      };

    for (let i = 0, len = stackElements.length; i < len; i++) {
      stackEl = stackElements[i];
      apply(stackEl, defaults, true);
      if (i !== 0) {
        stackEl.down = stackElements[i - 1];
      }
      if (i !== len - 1) {
        stackEl.up = stackElements[i + 1];
      }
    }

    return stackEl;
  }

  /**
   * This will remove a stackelement from its stack while leaving the stack functional.
   * @param {Object} element The elment to remove from the stack.
   */
  function removeFromStack(element) {
    element.up.down = element.down;
    element.down.up = element.up;
    element.up = element.down = null;
  }

  /*
     * Export the main object and any other methods applicable
     */
  /**
   * @class easyXDM
   * A javascript library providing cross-browser, cross-domain messaging/RPC.
   * @version 2.4.19.3
   * @singleton
   */
  apply(easyXDM, {
    /**
     * The version of the library
     * @type {string}
     */
    version: '2.4.19.3',
    /**
     * This is a map containing all the query parameters passed to the document.
     * All the values has been decoded using decodeURIComponent.
     * @type {object}
     */
    query,
    /**
     * @private
     */
    stack: {},
    /**
     * Applies properties from the source object to the target object.<br/>
     * @param {object} target The target of the properties.
     * @param {object} source The source of the properties.
     * @param {boolean} noOverwrite Set to True to only set non-existing properties.
     */
    apply,

    /**
     * A safe implementation of HTML5 JSON. Feature testing is used to make sure the implementation works.
     * @return {JSON} A valid JSON conforming object, or null if not found.
     */
    getJSONObject: getJSON,
    /**
     * This will add a function to the queue of functions to be run once the DOM reaches a ready state.
     * If functions are added after this event then they will be executed immediately.
     * @param {function} fn The function to add
     * @param {object} scope An optional scope for the function to be called with.
     */
    whenReady,
    /**
     * Removes easyXDM variable from the global scope. It also returns control
     * of the easyXDM variable to whatever code used it before.
     *
     * @param {String} ns A string representation of an object that will hold
     *                    an instance of easyXDM.
     * @return An instance of easyXDM
     */
    noConflict,
  });

  /**
   * @class easyXDM.DomHelper
   * Contains methods for dealing with the DOM
   * @singleton
   */
  easyXDM.DomHelper = {
    /**
     * Provides a consistent interface for adding eventhandlers
     * @param {Object} target The target to add the event to
     * @param {String} type The name of the event
     * @param {Function} listener The listener
     */
    on,
    /**
     * Provides a consistent interface for removing eventhandlers
     * @param {Object} target The target to remove the event from
     * @param {String} type The name of the event
     * @param {Function} listener The listener
     */
    un,
    /**
     * Checks for the presence of the JSON object.
     * If it is not present it will use the supplied path to load the JSON2 library.
     * This should be called in the documents head right after the easyXDM script tag.
     * http://json.org/json2.js
     * @param {String} path A valid path to json2.js
     */
    requiresJSON(path) {
      if (!isHostObject(window, 'JSON')) {
        // we need to encode the < in order to avoid an illegal token error
        // when the script is inlined in a document.
        document.write(`${'<' + 'script type="text/javascript" src="'}${path}"><` + `/script>`);
      }
    },
  };

  (function() {
    // The map containing the stored functions
    const _map = {};

    /**
     * @class easyXDM.Fn
     * This contains methods related to function handling, such as storing callbacks.
     * @singleton
     * @namespace easyXDM
     */
    easyXDM.Fn = {
      /**
       * Stores a function using the given name for reference
       * @param {String} name The name that the function should be referred by
       * @param {Function} fn The function to store
       * @namespace easyXDM.fn
       */
      set(name, fn) {
        _map[name] = fn;
      },
      /**
       * Retrieves the function referred to by the given name
       * @param {String} name The name of the function to retrieve
       * @param {Boolean} del If the function should be deleted after retrieval
       * @return {Function} The stored function
       * @namespace easyXDM.fn
       */
      get(name, del) {
        if (!_map.hasOwnProperty(name)) {
          return;
        }
        const fn = _map[name];

        if (del) {
          delete _map[name];
        }

        return fn;
      },
    };
  })();

  /**
   * @class easyXDM.Socket
   * This class creates a transport channel between two domains that is usable for sending and receiving string-based messages.<br/>
   * The channel is reliable, supports queueing, and ensures that the message originates from the expected domain.<br/>
   * Internally different stacks will be used depending on the browsers features and the available parameters.
   * <h2>How to set up</h2>
   * Setting up the provider:
   * <pre><code>
   * var socket = new easyXDM.Socket({
   * &nbsp; local: "name.html",
   * &nbsp; onReady: function(){
   * &nbsp; &nbsp; &#47;&#47; you need to wait for the onReady callback before using the socket
   * &nbsp; &nbsp; socket.postMessage("foo-message");
   * &nbsp; },
   * &nbsp; onMessage: function(message, origin) {
   * &nbsp;&nbsp; alert("received " + message + " from " + origin);
   * &nbsp; }
   * });
   * </code></pre>
   * Setting up the consumer:
   * <pre><code>
   * var socket = new easyXDM.Socket({
   * &nbsp; remote: "http:&#47;&#47;remotedomain/page.html",
   * &nbsp; remoteHelper: "http:&#47;&#47;remotedomain/name.html",
   * &nbsp; onReady: function(){
   * &nbsp; &nbsp; &#47;&#47; you need to wait for the onReady callback before using the socket
   * &nbsp; &nbsp; socket.postMessage("foo-message");
   * &nbsp; },
   * &nbsp; onMessage: function(message, origin) {
   * &nbsp;&nbsp; alert("received " + message + " from " + origin);
   * &nbsp; }
   * });
   * </code></pre>
   * If you are unable to upload the <code>name.html</code> file to the consumers domain then remove the <code>remoteHelper</code> property
   * and easyXDM will fall back to using the HashTransport instead of the NameTransport when not able to use any of the primary transports.
   * @namespace easyXDM
   * @constructor
   * @cfg {String/Window} local The url to the local name.html document, a local static file, or a reference to the local window.
   * @cfg {Boolean} lazy (Consumer only) Set this to true if you want easyXDM to defer creating the transport until really needed.
   * @cfg {String} remote (Consumer only) The url to the providers document.
   * @cfg {String} remoteHelper (Consumer only) The url to the remote name.html file. This is to support NameTransport as a fallback. Optional.
   * @cfg {Number} delay The number of milliseconds easyXDM should try to get a reference to the local window.  Optional, defaults to 2000.
   * @cfg {Number} interval The interval used when polling for messages. Optional, defaults to 300.
   * @cfg {String} channel (Consumer only) The name of the channel to use. Can be used to set consistent iframe names. Must be unique. Optional.
   * @cfg {Function} onMessage The method that should handle incoming messages.<br/> This method should accept two arguments, the message as a string, and the origin as a string. Optional.
   * @cfg {Function} onReady A method that should be called when the transport is ready. Optional.
   * @cfg {DOMElement|String} container (Consumer only) The element, or the id of the element that the primary iframe should be inserted into. If not set then the iframe will be positioned off-screen. Optional.
   * @cfg {Array/String} acl (Provider only) Here you can specify which '[protocol]://[domain]' patterns that should be allowed to act as the consumer towards this provider.<br/>
   * This can contain the wildcards ? and *.  Examples are 'http://example.com', '*.foo.com' and '*dom?.com'. If you want to use reqular expressions then you pattern needs to start with ^ and end with $.
   * If none of the patterns match an Error will be thrown.
   * @cfg {Object} props (Consumer only) Additional properties that should be applied to the iframe. This can also contain nested objects e.g: <code>{style:{width:"100px", height:"100px"}}</code>.
   * Properties such as 'name' and 'src' will be overrided. Optional.
   */
  easyXDM.Socket = function(config) {
    // create the stack
    let stack = chainStack(
        prepareTransportStack(config).concat([
          {
            incoming(message, origin) {
              config.onMessage(message, origin);
            },
            callback(success) {
              if (config.onReady) {
                config.onReady(success);
              }
            },
          },
        ])
      ),
      recipient = getLocation(config.remote);

    // set the origin
    this.origin = getLocation(config.remote);

    /**
     * Initiates the destruction of the stack.
     */
    this.destroy = function() {
      stack.destroy();
    };

    /**
     * Posts a message to the remote end of the channel
     * @param {String} message The message to send
     */
    this.postMessage = function(message) {
      stack.outgoing(message, recipient);
    };

    stack.init();
  };

  /**
     * @class easyXDM.Rpc
     * Creates a proxy object that can be used to call methods implemented on the remote end of the channel, and also to provide the implementation
     * of methods to be called from the remote end.<br/>
     * The instantiated object will have methods matching those specified in <code>config.remote</code>.<br/>
     * This requires the JSON object present in the document, either natively, using json.org's json2 or as a wrapper around library spesific methods.
     * <h2>How to set up</h2>
     * <pre><code>
     * var rpc = new easyXDM.Rpc({
 * &nbsp; &#47;&#47; this configuration is equal to that used by the Socket.
 * &nbsp; remote: "http:&#47;&#47;remotedomain/...",
 * &nbsp; onReady: function(){
 * &nbsp; &nbsp; &#47;&#47; you need to wait for the onReady callback before using the proxy
 * &nbsp; &nbsp; rpc.foo(...
 * &nbsp; }
 * },{
 * &nbsp; local: {..},
 * &nbsp; remote: {..}
 * });
     * </code></pre>
     *
     * <h2>Exposing functions (procedures)</h2>
     * <pre><code>
     * var rpc = new easyXDM.Rpc({
 * &nbsp; ...
 * },{
 * &nbsp; local: {
 * &nbsp; &nbsp; nameOfMethod: {
 * &nbsp; &nbsp; &nbsp; method: function(arg1, arg2, success, error){
 * &nbsp; &nbsp; &nbsp; &nbsp; ...
 * &nbsp; &nbsp; &nbsp; }
 * &nbsp; &nbsp; },
 * &nbsp; &nbsp; &#47;&#47; with shorthand notation
 * &nbsp; &nbsp; nameOfAnotherMethod:  function(arg1, arg2, success, error){
 * &nbsp; &nbsp; }
 * &nbsp; },
 * &nbsp; remote: {...}
 * });
     * </code></pre>

     * The function referenced by  [method] will receive the passed arguments followed by the callback functions <code>success</code> and <code>error</code>.<br/>
     * To send a successfull result back you can use
     *     <pre><code>
     *     return foo;
     *     </pre></code>
     * or
     *     <pre><code>
     *     success(foo);
     *     </pre></code>
     *  To return an error you can use
     *     <pre><code>
     *     throw new Error("foo error");
     *     </code></pre>
     * or
     *     <pre><code>
     *     error("foo error");
     *     </code></pre>
     *
     * <h2>Defining remotely exposed methods (procedures/notifications)</h2>
     * The definition of the remote end is quite similar:
     * <pre><code>
     * var rpc = new easyXDM.Rpc({
 * &nbsp; ...
 * },{
 * &nbsp; local: {...},
 * &nbsp; remote: {
 * &nbsp; &nbsp; nameOfMethod: {}
 * &nbsp; }
 * });
     * </code></pre>
     * To call a remote method use
     * <pre><code>
     * rpc.nameOfMethod("arg1", "arg2", function(value) {
 * &nbsp; alert("success: " + value);
 * }, function(message) {
 * &nbsp; alert("error: " + message + );
 * });
     * </code></pre>
     * Both the <code>success</code> and <code>errror</code> callbacks are optional.<br/>
     * When called with no callback a JSON-RPC 2.0 notification will be executed.
     * Be aware that you will not be notified of any errors with this method.
     * <br/>
     * <h2>Specifying a custom serializer</h2>
     * If you do not want to use the JSON2 library for non-native JSON support, but instead capabilities provided by some other library
     * then you can specify a custom serializer using <code>serializer: foo</code>
     * <pre><code>
     * var rpc = new easyXDM.Rpc({
 * &nbsp; ...
 * },{
 * &nbsp; local: {...},
 * &nbsp; remote: {...},
 * &nbsp; serializer : {
 * &nbsp; &nbsp; parse: function(string){ ... },
 * &nbsp; &nbsp; stringify: function(object) {...}
 * &nbsp; }
 * });
     * </code></pre>
     * If <code>serializer</code> is set then the class will not attempt to use the native implementation.
     * @namespace easyXDM
     * @constructor
     * @param {Object} config The underlying transports configuration. See easyXDM.Socket for available parameters.
     * @param {Object} jsonRpcConfig The description of the interface to implement.
     */
  easyXDM.Rpc = function(config, jsonRpcConfig) {
    // expand shorthand notation
    if (jsonRpcConfig.local) {
      for (const method in jsonRpcConfig.local) {
        if (jsonRpcConfig.local.hasOwnProperty(method)) {
          var member = jsonRpcConfig.local[method];
          const server = this;

          if (typeof member === 'function') {
            jsonRpcConfig.local[method] = {
              method: (function(superFunction, server) {
                return (function(_super, server) {
                  return function() {
                    return _super.apply(server, arguments);
                  };
                })(member, server);
              })(member, server),
            };
          }
        }
      }
    }

    // create the stack
    const stack = chainStack(
      prepareTransportStack(config).concat([
        new easyXDM.stack.RpcBehavior(this, jsonRpcConfig),
        {
          callback(success) {
            if (config.onReady) {
              config.onReady(success);
            }
          },
        },
      ])
    );

    // set the origin
    this.origin = getLocation(config.remote);

    /**
     * Initiates the destruction of the stack.
     */
    this.destroy = function() {
      stack.destroy();
    };

    stack.init();
  };

  /**
   * @class easyXDM.stack.SameOriginTransport
   * SameOriginTransport is a transport class that can be used when both domains have the same origin.<br/>
   * This can be useful for testing and for when the main application supports both internal and external sources.
   * @namespace easyXDM.stack
   * @constructor
   * @param {Object} config The transports configuration.
   * @cfg {String} remote The remote document to communicate with.
   */
  easyXDM.stack.SameOriginTransport = function(config) {
    let pub, frame, send, targetOrigin;

    return (pub = {
      outgoing(message, domain, fn) {
        send(message);
        if (fn) {
          fn();
        }
      },
      destroy() {
        if (frame) {
          frame.parentNode.removeChild(frame);
          frame = null;
        }
      },
      onDOMReady() {
        targetOrigin = getLocation(config.remote);

        if (config.isHost) {
          // set up the iframe
          apply(config.props, {
            src: appendQueryParameters(config.remote, {
              xdm_e: `${location.protocol}//${location.host}${location.pathname}`,
              xdm_c: config.channel,
              xdm_p: 4, // 4 = SameOriginTransport
            }),
            name: `${IFRAME_PREFIX + config.channel}_provider`,
          });
          frame = createFrame(config);
          easyXDM.Fn.set(config.channel, function(sendFn) {
            send = sendFn;
            setTimeout(function() {
              pub.up.callback(true);
            }, 0);

            return function(msg) {
              pub.up.incoming(msg, targetOrigin);
            };
          });
        } else {
          send = getParentObject().Fn.get(config.channel, true)(function(msg) {
            pub.up.incoming(msg, targetOrigin);
          });
          setTimeout(function() {
            pub.up.callback(true);
          }, 0);
        }
      },
      init() {
        whenReady(pub.onDOMReady, pub);
      },
    });
  };

  /**
   * @class easyXDM.stack.PostMessageTransport
   * PostMessageTransport is a transport class that uses HTML5 postMessage for communication.<br/>
   * <a href="http://msdn.microsoft.com/en-us/library/ms644944(VS.85).aspx">http://msdn.microsoft.com/en-us/library/ms644944(VS.85).aspx</a><br/>
   * <a href="https://developer.mozilla.org/en/DOM/window.postMessage">https://developer.mozilla.org/en/DOM/window.postMessage</a>
   * @namespace easyXDM.stack
   * @constructor
   * @param {Object} config The transports configuration.
   * @cfg {String} remote The remote domain to communicate with.
   */
  easyXDM.stack.PostMessageTransport = function(config) {
    let pub, // the public interface
      frame, // the remote frame, if any
      callerWindow, // the window that we will call with
      targetOrigin; // the domain to communicate with
    /**
     * Resolves the origin from the event object
     * @private
     * @param {Object} event The messageevent
     * @return {String} The scheme, host and port of the origin
     */

    function _getOrigin(event) {
      if (event.origin) {
        // This is the HTML5 property
        return getLocation(event.origin);
      }
      if (event.uri) {
        // From earlier implementations
        return getLocation(event.uri);
      }
      if (event.domain) {
        // This is the last option and will fail if the
        // origin is not using the same schema as we are
        return `${location.protocol}//${event.domain}`;
      }
      throw 'Unable to retrieve the origin of the event';
    }

    /**
     * This is the main implementation for the onMessage event.<br/>
     * It checks the validity of the origin and passes the message on if appropriate.
     * @private
     * @param {Object} event The messageevent
     */
    function _window_onMessage(event) {
      const origin = _getOrigin(event);

      if (typeof event.data === 'string') {
        if (
          config.allowRedirects === true ||
          (origin == targetOrigin &&
            event.data.substring(0, config.channel.length + 1) == `${config.channel} `)
        ) {
          pub.up.incoming(event.data.substring(config.channel.length + 1), origin);
        }
      }
    }

    return (pub = {
      outgoing(message, domain, fn) {
        callerWindow.postMessage(
          `${config.channel} ${message}`,
          config.allowRedirects === true ? '*' : domain || targetOrigin
        );
        if (fn) {
          fn();
        }
      },
      destroy() {
        un(window, 'message', _window_onMessage);
        if (frame) {
          callerWindow = null;
          frame.parentNode.removeChild(frame);
          frame = null;
        }
      },
      onDOMReady() {
        targetOrigin = getLocation(config.remote);
        if (config.isHost) {
          // add the event handler for listening
          var waitForReady = function(event) {
            if (event.data == `${config.channel}-ready`) {
              // replace the eventlistener
              callerWindow =
                'postMessage' in frame.contentWindow
                  ? frame.contentWindow
                  : frame.contentWindow.document;
              un(window, 'message', waitForReady);
              on(window, 'message', _window_onMessage);
              setTimeout(function() {
                pub.up.callback(true);
              }, 0);
            }
          };

          on(window, 'message', waitForReady);

          // set up the iframe
          apply(config.props, {
            src: appendQueryParameters(config.remote, {
              xdm_e: getLocation(location.href),
              xdm_c: config.channel,
              xdm_p: 1, // 1 = PostMessage
            }),
            name: `${IFRAME_PREFIX + config.channel}_provider`,
          });
          frame = createFrame(config);
        } else {
          // add the event handler for listening
          on(window, 'message', _window_onMessage);
          callerWindow = 'postMessage' in window.parent ? window.parent : window.parent.document;
          callerWindow.postMessage(
            `${config.channel}-ready`,
            config.allowRedirects === true ? '*' : targetOrigin
          );

          setTimeout(function() {
            pub.up.callback(true);
          }, 0);
        }
      },
      init() {
        whenReady(pub.onDOMReady, pub);
      },
    });
  };

  easyXDM.stack.HashTransport = easyXDM.stack.FlashTransport = easyXDM.stack.FrameElementTransport = easyXDM.stack.NameTransport = function(
    config
  ) {
    return false;
  };

  /**
   * @class easyXDM.stack.ReliableBehavior
   * This is a behavior that tries to make the underlying transport reliable by using acknowledgements.
   * @namespace easyXDM.stack
   * @constructor
   * @param {Object} config The behaviors configuration.
   */
  easyXDM.stack.ReliableBehavior = function(config) {
    let pub, // the public interface
      callback; // the callback to execute when we have a confirmed success/failure
    let idOut = 0,
      idIn = 0,
      currentMessage = '';

    return (pub = {
      incoming(message, origin) {
        let indexOf = message.indexOf('_'),
          ack = message.substring(0, indexOf).split(',');

        message = message.substring(indexOf + 1);

        if (ack[0] == idOut) {
          currentMessage = '';
          if (callback) {
            callback(true);
          }
        }
        if (message.length > 0) {
          pub.down.outgoing(`${ack[1]},${idOut}_${currentMessage}`, origin);
          if (idIn != ack[1]) {
            idIn = ack[1];
            pub.up.incoming(message, origin);
          }
        }
      },
      outgoing(message, origin, fn) {
        currentMessage = message;
        callback = fn;
        pub.down.outgoing(`${idIn},${++idOut}_${message}`, origin);
      },
    });
  };

  /**
   * @class easyXDM.stack.QueueBehavior
   * This is a behavior that enables queueing of messages. <br/>
   * It will buffer incoming messages and dispach these as fast as the underlying transport allows.
   * This will also fragment/defragment messages so that the outgoing message is never bigger than the
   * set length.
   * @namespace easyXDM.stack
   * @constructor
   * @param {Object} config The behaviors configuration. Optional.
   * @cfg {Number} maxLength The maximum length of each outgoing message. Set this to enable fragmentation.
   */
  easyXDM.stack.QueueBehavior = function(config) {
    let pub,
      queue = [],
      waiting = true,
      incoming = '',
      destroying,
      maxLength = 0,
      lazy = false,
      doFragment = false;

    function dispatch() {
      if (config.remove && queue.length === 0) {
        removeFromStack(pub);

        return;
      }
      if (waiting || queue.length === 0 || destroying) {
        return;
      }
      waiting = true;
      const message = queue.shift();

      pub.down.outgoing(message.data, message.origin, function(success) {
        waiting = false;
        if (message.callback) {
          setTimeout(function() {
            message.callback(success);
          }, 0);
        }
        dispatch();
      });
    }

    return (pub = {
      init() {
        if (undef(config)) {
          config = {};
        }
        if (config.maxLength) {
          maxLength = config.maxLength;
          doFragment = true;
        }
        if (config.lazy) {
          lazy = true;
        } else {
          pub.down.init();
        }
      },
      callback(success) {
        waiting = false;
        const up = pub.up; // in case dispatch calls removeFromStack

        dispatch();
        up.callback(success);
      },
      incoming(message, origin) {
        if (doFragment) {
          let indexOf = message.indexOf('_'),
            seq = parseInt(message.substring(0, indexOf), 10);

          incoming += message.substring(indexOf + 1);
          if (seq === 0) {
            if (config.encode) {
              incoming = decodeURIComponent(incoming);
            }
            pub.up.incoming(incoming, origin);
            incoming = '';
          }
        } else {
          pub.up.incoming(message, origin);
        }
      },
      outgoing(message, origin, fn) {
        if (config.encode) {
          message = encodeURIComponent(message);
        }
        let fragments = [],
          fragment;

        if (doFragment) {
          // fragment into chunks
          while (message.length !== 0) {
            fragment = message.substring(0, maxLength);
            message = message.substring(fragment.length);
            fragments.push(fragment);
          }
          // enqueue the chunks
          while ((fragment = fragments.shift())) {
            queue.push({
              data: `${fragments.length}_${fragment}`,
              origin,
              callback: fragments.length === 0 ? fn : null,
            });
          }
        } else {
          queue.push({
            data: message,
            origin,
            callback: fn,
          });
        }
        if (lazy) {
          pub.down.init();
        } else {
          dispatch();
        }
      },
      destroy() {
        destroying = true;
        pub.down.destroy();
      },
    });
  };

  /**
   * @class easyXDM.stack.VerifyBehavior
   * This behavior will verify that communication with the remote end is possible, and will also sign all outgoing,
   * and verify all incoming messages. This removes the risk of someone hijacking the iframe to send malicious messages.
   * @namespace easyXDM.stack
   * @constructor
   * @param {Object} config The behaviors configuration.
   * @cfg {Boolean} initiate If the verification should be initiated from this end.
   */
  easyXDM.stack.VerifyBehavior = function(config) {
    let pub,
      mySecret,
      theirSecret,
      verified = false;

    function startVerification() {
      mySecret = Math.random()
        .toString(16)
        .substring(2);
      pub.down.outgoing(mySecret);
    }

    return (pub = {
      incoming(message, origin) {
        const indexOf = message.indexOf('_');

        if (indexOf === -1) {
          if (message === mySecret) {
            pub.up.callback(true);
          } else if (!theirSecret) {
            theirSecret = message;
            if (!config.initiate) {
              startVerification();
            }
            pub.down.outgoing(message);
          }
        } else if (message.substring(0, indexOf) === theirSecret) {
          pub.up.incoming(message.substring(indexOf + 1), origin);
        }
      },
      outgoing(message, origin, fn) {
        pub.down.outgoing(`${mySecret}_${message}`, origin, fn);
      },
      callback(success) {
        if (config.initiate) {
          startVerification();
        }
      },
    });
  };

  /**
   * @class easyXDM.stack.RpcBehavior
   * This uses JSON-RPC 2.0 to expose local methods and to invoke remote methods and have responses returned over the the string based transport stack.<br/>
   * Exposed methods can return values synchronous, asyncronous, or bet set up to not return anything.
   * @namespace easyXDM.stack
   * @constructor
   * @param {Object} proxy The object to apply the methods to.
   * @param {Object} config The definition of the local and remote interface to implement.
   * @cfg {Object} local The local interface to expose.
   * @cfg {Object} remote The remote methods to expose through the proxy.
   * @cfg {Object} serializer The serializer to use for serializing and deserializing the JSON. Should be compatible with the HTML5 JSON object. Optional, will default to JSON.
   */
  easyXDM.stack.RpcBehavior = function(proxy, config) {
    let pub,
      serializer = config.serializer || getJSON();
    let _callbackCounter = 0,
      _callbacks = {};

    /**
     * Serializes and sends the message
     * @private
     * @param {Object} data The JSON-RPC message to be sent. The jsonrpc property will be added.
     */
    function _send(data) {
      data.jsonrpc = '2.0';
      pub.down.outgoing(serializer.stringify(data));
    }

    /**
     * Creates a method that implements the given definition
     * @private
     * @param {Object} The method configuration
     * @param {String} method The name of the method
     * @return {Function} A stub capable of proxying the requested method call
     */
    function _createMethod(definition, method) {
      const slice = Array.prototype.slice;

      return function() {
        let l = arguments.length,
          callback,
          message = {
            method,
          };

        if (l > 0 && typeof arguments[l - 1] === 'function') {
          // with callback, procedure
          if (l > 1 && typeof arguments[l - 2] === 'function') {
            // two callbacks, success and error
            callback = {
              success: arguments[l - 2],
              error: arguments[l - 1],
            };
            message.params = slice.call(arguments, 0, l - 2);
          } else {
            // single callback, success
            callback = {
              success: arguments[l - 1],
            };
            message.params = slice.call(arguments, 0, l - 1);
          }
          _callbacks[String(++_callbackCounter)] = callback;
          message.id = _callbackCounter;
        } else {
          // no callbacks, a notification
          message.params = slice.call(arguments, 0);
        }
        if (definition.namedParams && message.params.length === 1) {
          message.params = message.params[0];
        }
        // Send the method request
        _send(message);
      };
    }

    /**
     * Executes the exposed method
     * @private
     * @param {String} method The name of the method
     * @param {Number} id The callback id to use
     * @param {Function} method The exposed implementation
     * @param {Array} params The parameters supplied by the remote end
     */
    function _executeMethod(method, id, fn, params) {
      if (!fn) {
        if (id) {
          _send({
            id,
            error: {
              code: -32601,
              message: 'Procedure not found.',
            },
          });
        }

        return;
      }

      let success, error;

      if (id) {
        success = function(result) {
          success = emptyFn;
          _send({
            id,
            result,
          });
        };
        error = function(message, data) {
          error = emptyFn;
          const msg = {
            id,
            error: {
              code: -32099,
              message,
            },
          };

          if (data) {
            msg.error.data = data;
          }
          _send(msg);
        };
      } else {
        success = error = emptyFn;
      }
      // Call local method
      if (!isArray(params)) {
        params = [params];
      }
      try {
        const result = fn.method.apply(fn.scope, params.concat([success, error]));

        if (!undef(result)) {
          success(result);
        }
      } catch (ex1) {
        error(ex1.message);
      }
    }

    return (pub = {
      incoming(message, origin) {
        if (typeof message !== 'string' || message.slice(0, 1) !== '{' || message.slice(-1) !== '}')
          return;
        const data = serializer.parse(message);

        if (data.method) {
          // A method call from the remote end
          if (config.handle) {
            config.handle(data, _send);
          } else {
            _executeMethod(data.method, data.id, config.local[data.method], data.params);
          }
        } else {
          // A method response from the other end
          const callback = _callbacks[data.id];

          if (data.error) {
            if (callback.error) {
              callback.error(data.error);
            }
          } else if (callback.success) {
            callback.success(data.result);
          }
          delete _callbacks[data.id];
        }
      },
      init() {
        if (config.remote) {
          // Implement the remote sides exposed methods
          for (const method in config.remote) {
            if (config.remote.hasOwnProperty(method)) {
              proxy[method] = _createMethod(config.remote[method], method);
            }
          }
        }
        pub.down.init();
      },
      destroy() {
        for (const method in config.remote) {
          if (config.remote.hasOwnProperty(method) && proxy.hasOwnProperty(method)) {
            delete proxy[method];
          }
        }
        pub.down.destroy();
      },
    });
  };
  global.easyXDM = easyXDM;
})(window, document, location, window.setTimeout, decodeURIComponent, encodeURIComponent);
