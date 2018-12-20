/* eslint-disable consistent-this,prefer-rest-params,no-param-reassign */
require('./easyXDM');

import LoggerClass from './Logger';

import { isObject, isFramed } from './Constants';

export default class Extender {
  constructor() {
    this.xdm = window.easyXDM;
  }

  setup(options) {
    if (!options || !isObject(options)) return this;

    this.loadedClients = {};
    this.upperCheckTimeout = null;

    this.options = Object.assign(options, {
      frameName: options.frameName || 'unknownFrame',
      waitingTimeout: options.waitingTimeout || 1200,
    });
    this.logger = new LoggerClass(this.options.frameName);

    return this;
  }

  _wrongParams = params => !isObject(params);

  _addLoggerToMethods(rawMethods, finalMethods = {}) {
    const _extender = this;

    function addLogger(superFunction, funcName) {
      return function() {
        const loggingObject = arguments[0] || {};

        _extender._sendToLogger(funcName, loggingObject);

        return superFunction.apply(this, arguments);
      };
    }

    for (const funcName in rawMethods) {
      finalMethods[funcName] = addLogger(rawMethods[funcName], funcName);
    }

    return finalMethods;
  }

  _checkObject(method, object = {}) {
    return isObject(object)
      ? object
      : {
          errMsg: `${method} передает неверные параметры типа ${typeof object}`,
          errBody: object,
          crit: true,
        };
  }

  _sendToLogger = (method, logObject) => {
    logObject.funcName = method;
    logObject.frameNative = this.options.frameName;

    this.logger.global('pushToLog', { logObject });
  };

  _raiseError = (errMsg, errBody) =>
    this._sendToLogger('checkExistence', {
      errMsg,
      errBody,
      crit: true,
    });

  _startTimeout = () => {
    clearTimeout(this.upperCheckTimeout);
    this.upperCheckTimeout = setTimeout(() => {
      const loadedClients = this.loadedClients;

      let hasErrors = false;

      Object.keys(loadedClients).forEach(type => {
        const [_url, _status] = loadedClients[type];

        if (_status !== 'loaded') {
          hasErrors = true;

          this._raiseError(`Frame ${type} has error`, JSON.stringify(loadedClients[type]));
        }
      });
    }, this.options.waitingTimeout);
  };

  defineClientAnswers(clientAnswers) {
    if (this._wrongParams(clientAnswers)) return this;

    this.clientAnswers = this._addLoggerToMethods(clientAnswers);

    return this;
  }

  defineClientQuestions(clientQuestions) {
    if (this._wrongParams(clientQuestions)) return this;

    this.clientQuestions = clientQuestions;

    return this;
  }

  defineServerAnswers(serverAnswers) {
    if (this._wrongParams(serverAnswers)) return this;

    this.serverAnswers = this._addLoggerToMethods(serverAnswers);

    return this;
  }

  defineServerQuestions(serverQuestions) {
    if (this._wrongParams(serverQuestions)) return this;

    this.serverQuestions = serverQuestions;

    return this;
  }

  P_init() {
    if (this._wrongParams(this.options) || !this.xdm) return Promise.resolve({ initStatus: false });

    const _extender = this;

    this.xdm.Rpc.prototype.name = '';
    this.xdm.Rpc.prototype.setName = _extender.XDM_setServerName;
    this.xdm.Rpc.prototype.sayToClient = (() =>
      function() {
        return _extender.XDM_say.call(this, _extender, ...arguments);
      })();
    this.xdm.Rpc.prototype.sayToParent = (() =>
      function() {
        if (!isFramed) return false;

        return _extender.XDM_say.call(this, _extender, ...arguments);
      })();

    this.xdmClient = this.xdm.noConflict(_extender.options.parentNamespace);
    this.xdmServer = this.xdm.noConflict(_extender.options.frameName);

    // Make Client automatically if got clientMethods
    this.XDM_initClient();

    return Promise.resolve({
      initStatus: true,
      logger: _extender.logger,
      makeServer: this.XDM_initServer.bind(this),
    });
  }

  XDM_setServerName(name) {
    this.name = name;

    return this;
  }

  XDM_say(_extender, method, object) {
    object = Object.assign(_extender._checkObject(method, object), {
      timeCall: new Date().getTime(),
      frameCaller: _extender.options.frameName,
    });

    if (typeof object.crit !== 'undefined') {
      _extender._sendToLogger(method, object);

      return this;
    }

    if (typeof this[method] === 'undefined') {
      _extender._sendToLogger(
        method,
        Object.assign(object, {
          errMsg: 'Called method is undefined',
          errBody: method,
          crit: true,
        })
      );

      return this;
    }

    return this[method](
      object,
      successResponse => false,
      errorResponse =>
        _extender._sendToLogger(method, {
          errMsg: `Unrecognized error in ${this.name}`,
          errBody: errorResponse.message,
          crit: true,
        })
    );
  }

  XDM_initClient() {
    if (!isFramed || !this.clientAnswers) return this;

    const params = {
      isHost: false,
      protocol: '1',
      allowRedirects: true,
    };

    /*
         * Very important part is Object.assign
         * because RPC overwrites this[methods]
         * so if there are many clients on one page,
         * "this" context will always point to the first client
         *
         */

    window.RPC_Client = new this.xdmClient.Rpc(params, {
      local: Object.assign({}, this.clientAnswers),
      remote: Object.assign({}, this.clientQuestions),
    }).setName(this.options.frameName);
  }

  XDM_initServer = ({ name, element, url, overflowY = 'hidden' }) => {
    if (!this.serverAnswers) return this;

    // eslint-disable-next-line consistent-this
    const _extender = this;

    const frameParams = {
      src: url,
      scrolling: 'yes',
      allowTransparency: 'true',
      style: {
        top: 0,
        left: 0,
        overflowX: 'hidden',
        overflowY,
        zIndex: 3,
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
    };

    const serverParams = {
      container: element,
      remote: url,
      props: frameParams,
      protocol: '1',
      allowRedirects: true,
      isHost: true,
      onLoad() {
        const passedToFrameParams = {
          timeCall: new Date().getTime(),
          frameCaller: _extender.options.frameName,
          serverName: name,
        };

        if (_extender.loadedClients[name][1] === 'init') {
          _extender.loadedClients[name] = [this.src, 'checking'];

          /*
                     * Check existence of our XDM in frame
                     *
                     * also pass serverName here for identifying
                     * in which frame Client is opened
                     *
                     */

          window.RPC_Servers[name].checkExistence(
            passedToFrameParams,
            successResponse => {
              /*
                             * Client should return untouched params
                             * to identify that it's our XDM
                             *
                             */

              _extender.loadedClients[name][1] = 'loaded';
            },
            errorResponse =>
              _extender._raiseError(`Unrecognized error in ${name}`, errorResponse.message)
          );
        } else {
          window.RPC_Servers[name].checkExistence(
            passedToFrameParams,
            successResponse => false,
            errorResponse =>
              _extender._raiseError(`Unrecognized error in ${name}`, errorResponse.message)
          );
        }
      },
    };

    window.RPC_Servers = window.RPC_Servers || {};

    /**
     * Start checking timer
     *
     */

    if (!this.loadedClients[name]) this.loadedClients[name] = [null, 'init'];

    this._startTimeout();

    /**
     * Very important part is Object.assign
     * because RPC overwrites this[methods]
     * so if there are many servers on one page,
     * "this" context will always point to the first server
     *
     */

    window.RPC_Servers[name] = new this.xdmServer.Rpc(serverParams, {
      local: Object.assign({}, this.serverAnswers),
      remote: Object.assign({}, this.serverQuestions),
    }).setName(name);
  };
}
