import _ from 'lodash';

const optionsCache = {
  mobile: {
    disabledFeatures: 'left_toolbar header_widget timeframes_toolbar edit_buttons_in_legend context_menus control_bar border_around_the_chart'.split(
      ' '
    ),
    enabledFeatures: [],
  },
};

const TradingViewLibrary = {
  BARS: 0,
  CANDLES: 1,
  LINE: 2,
  AREA: 3,
  HEIKEN_ASHI: 8,
  HOLLOW_CANDLES: 9,

  gEl(opt_id) {
    return document.getElementById(opt_id);
  },

  gId() {
    return `tradingview_${(1048576 * (1 + Math.random()) || 0).toString(16).substring(1)}`;
  },

  onready(completed) {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', completed, false);
    } else {
      window.attachEvent('onload', completed);
    }
  },

  css(css) {
    const svg = document.getElementsByTagName('head')[0];
    /** @type {Element} */
    const s = document.createElement('style');
    /** @type {string} */

    s.type = 'text/css';
    if (s.styleSheet) {
      /** @type {Node} */
      s.styleSheet.cssText = css;
    } else {
      /** @type {Text} */
      const cssNew = document.createTextNode(css);

      s.appendChild(cssNew);
    }
    svg.appendChild(s);
  },

  bindEvent(el, targetEvent, cb) {
    if (el.addEventListener) {
      el.addEventListener(targetEvent, cb, false);
    } else if (el.attachEvent) {
      el.attachEvent(`on${targetEvent}`, cb);
    }
  },

  unbindEvent(el, type, callback) {
    if (el.removeEventListener) {
      el.removeEventListener(type, callback, false);
    } else if (el.detachEvent) {
      el.detachEvent(`on${type}`, callback);
    }
  },
};

class Widget {
  constructor(options) {
    this.id = TradingViewLibrary.gId();
    if (!options.datafeed) {
      throw Error('Datafeed is not defined');
    }
    const defaults = {
      width: 800,
      height: 500,
      symbol: 'AA',
      interval: 'D',
      timeframe: null,
      timezone: '',
      container: '',
      path: '',
      locale: 'en',
      toolbar_bg: null,
      drawingsAccess: null,
      studiesAccess: null,
      widgetbar: {
        datawindow: false,
        details: false,
        watchlist: false,
        watchlist_settings: {
          default_symbols: [],
        },
      },
      overrides: {
        'mainSeriesProperties.showCountdown': false,
      },
      studiesOverrides: {},
      brokerConfig: {},
      fullscreen: false,
      autosize: false,
      disabledFeatures: [],
      enabledFeatures: [],
      indicators_file_name: null,
      custom_css_url: null,
      auto_save_delay: null,
      debug: false,
      time_frames: [
        {
          text: '5y',
          resolution: 'W',
        },
        {
          text: '1y',
          resolution: 'W',
        },
        {
          text: '6m',
          resolution: '120',
        },
        {
          text: '3m',
          resolution: '60',
        },
        {
          text: '1m',
          resolution: '30',
        },
        {
          text: '5d',
          resolution: '5',
        },
        {
          text: '1d',
          resolution: '1',
        },
      ],
      client_id: '0',
      user_id: '0',
      charts_storage_url: null,
      charts_storage_api_version: '1.0',
      logo: {},
      favorites: {
        intervals: [],
        chartTypes: [],
      },
      rss_news_feed: null,
      settingsAdapter: null,
    };

    this.options = _.merge({}, defaults, {
      width: options.width,
      height: options.height,
      symbol: options.symbol,
      interval: options.interval,
      timeframe: options.timeframe,
      timezone: options.timezone,
      container: options.container_id,
      path: options.library_path,
      locale: options.locale,
      toolbar_bg: options.toolbar_bg,
      drawingsAccess: options.drawings_access,
      studiesAccess: options.studies_access,
      widgetbar: options.widgetbar,
      overrides: options.overrides,
      studiesOverrides: options.studies_overrides,
      savedData: options.saved_data || options.savedData,
      snapshotUrl: options.snapshot_url,
      uid: this.id,
      datafeed: options.datafeed,
      customFormatters: options.customFormatters,
      tradingController: options.trading_controller,
      brokerFactory: options.brokerFactory,
      brokerConfig: options.brokerConfig,
      logo: options.logo,
      autosize: options.autosize,
      fullscreen: options.fullscreen,
      disabledFeatures: options.disabled_features,
      enabledFeatures: options.enabled_features,
      indicators_file_name: options.indicators_file_name,
      custom_css_url: options.custom_css_url,
      auto_save_delay: options.auto_save_delay,
      debug: options.debug,
      client_id: options.client_id,
      user_id: options.user_id,
      charts_storage_url: options.charts_storage_url,
      charts_storage_api_version: options.charts_storage_api_version,
      favorites: options.favorites,
      numeric_formatting: options.numeric_formatting,
      rss_news_feed: options.rss_news_feed,
      newsProvider: options.news_provider,
      studyCountLimit: options.study_count_limit,
      symbolSearchRequestDelay: options.symbol_search_request_delay,
      loadLastChart: options.load_last_chart,
      settingsAdapter: options.settings_adapter,
    });
    this.options.time_frames = options.time_frames || defaults.time_frames;
    if (options.preset) {
      let optionsPreset = options.preset;

      if (optionsCache[optionsPreset]) {
        optionsPreset = optionsCache[optionsPreset];

        this.options.disabledFeatures =
          this.options.disabledFeatures.length > 0
            ? this.options.disabledFeatures.concat(optionsPreset.disabledFeatures)
            : optionsPreset.disabledFeatures;
        this.options.enabledFeatures =
          this.options.enabledFeatures.length > 0
            ? this.options.enabledFeatures.concat(optionsPreset.enabledFeatures)
            : optionsPreset.enabledFeatures;
      } else {
        console.warn(`Unknown preset: \`${optionsPreset}\``);
      }
    }
    /** @type {Array} */
    this._ready_handlers = [];
    this.create();
  }

  _innerWindow() {
    return TradingViewLibrary.gEl(this.id).contentWindow;
  }

  _autoResizeChart() {
    if (this.options.fullscreen) {
      /** @type {string} */
      TradingViewLibrary.gEl(this.id).style.height = `${window.innerHeight}px`;
    }
  }

  create() {
    const content = this.render();
    const that = this;
    let li;

    if (this.options.container) {
      li = TradingViewLibrary.gEl(this.options.container);

      li.innerHTML = content;
    } else {
      document.write(content);
    }
    if (this.options.autosize || this.options.fullscreen) {
      li = TradingViewLibrary.gEl(this.id);
      /** @type {string} */
      li.style.width = '100%';
      if (!this.options.fullscreen) {
        /** @type {string} */
        li.style.height = '100%';
      }
    }
    this._autoResizeChart();
    /**
     * @param {?} dataAndEvents
     * @return {undefined}
     */
    this._onWindowResize = dataAndEvents => {
      that._autoResizeChart();
    };
    window.addEventListener('resize', this._onWindowResize);
    const el = TradingViewLibrary.gEl(this.id);
    /** @type {null} */
    let cb = null;
    /**
     * @return {undefined}
     */

    cb = () => {
      TradingViewLibrary.unbindEvent(el, 'load', cb);
      el.contentWindow.widgetReady(() => {
        let k;
        /** @type {boolean} */

        that._ready = true;
        k = that._ready_handlers.length;
        for (; k--; ) {
          that._ready_handlers[k].call(that);
        }
        el.contentWindow._initializationFinished();
      });
    };
    TradingViewLibrary.bindEvent(el, 'load', cb);
  }

  render() {
    window[this.options.uid] = {
      datafeed: this.options.datafeed,
      customFormatters: this.options.customFormatters,
      tradingController: this.options.tradingController,
      brokerFactory: this.options.brokerFactory,
      overrides: this.options.overrides,
      studiesOverrides: this.options.studiesOverrides,
      disabledFeatures: this.options.disabledFeatures,
      enabledFeatures: this.options.enabledFeatures,
      brokerConfig: this.options.brokerConfig,
      favorites: this.options.favorites,
      logo: this.options.logo,
      numeric_formatting: this.options.numeric_formatting,
      rss_news_feed: this.options.rss_news_feed,
      newsProvider: this.options.newsProvider,
      loadLastChart: this.options.loadLastChart,
      settingsAdapter: this.options.settingsAdapter,
    };
    if (this.options.savedData) {
      window[this.options.uid].chartContent = {
        json: this.options.savedData,
      };
    }
    /** @type {string} */
    const a = `${this.options.path ||
      ''}static/tv-chart.017b428a4ef9c1e9362a.html#localserver=1&symbol=${encodeURIComponent(
      this.options.symbol
    )}&interval=${encodeURIComponent(this.options.interval)}${
      this.options.timeframe ? `&timeframe=${encodeURIComponent(this.options.timeframe)}` : ''
    }${this.options.toolbar_bg ? `&toolbarbg=${this.options.toolbar_bg.replace('#', '')}` : ''}${
      this.options.studiesAccess
        ? `&studiesAccess=${encodeURIComponent(JSON.stringify(this.options.studiesAccess))}`
        : ''
    }&widgetbar=${encodeURIComponent(JSON.stringify(this.options.widgetbar))}${
      this.options.drawingsAccess
        ? `&drawingsAccess=${encodeURIComponent(JSON.stringify(this.options.drawingsAccess))}`
        : ''
    }&timeFrames=${encodeURIComponent(
      JSON.stringify(this.options.time_frames)
    )}&locale=${encodeURIComponent(this.options.locale)}&uid=${encodeURIComponent(
      this.options.uid
    )}&clientId=${encodeURIComponent(this.options.client_id)}&userId=${encodeURIComponent(
      this.options.user_id
    )}${
      this.options.charts_storage_url
        ? `&chartsStorageUrl=${encodeURIComponent(this.options.charts_storage_url)}`
        : ''
    }${
      this.options.charts_storage_api_version
        ? `&chartsStorageVer=${encodeURIComponent(this.options.charts_storage_api_version)}`
        : ''
    }${
      this.options.indicators_file_name
        ? `&indicatorsFile=${encodeURIComponent(this.options.indicators_file_name)}`
        : ''
    }${
      this.options.custom_css_url
        ? `&customCSS=${encodeURIComponent(this.options.custom_css_url)}`
        : ''
    }${
      this.options.auto_save_delay
        ? `&autoSaveDelay=${encodeURIComponent(this.options.auto_save_delay)}`
        : ''
    }&debug=${this.options.debug}${
      this.options.snapshotUrl ? `&snapshotUrl=${encodeURIComponent(this.options.snapshotUrl)}` : ''
    }${this.options.timezone ? `&timezone=${encodeURIComponent(this.options.timezone)}` : ''}${
      this.options.studyCountLimit
        ? `&studyCountLimit=${encodeURIComponent(this.options.studyCountLimit)}`
        : ''
    }${
      this.options.symbolSearchRequestDelay
        ? `&ssreqdelay=${encodeURIComponent(this.options.symbolSearchRequestDelay)}`
        : ''
    }`;

    return `<iframe id="${this.id}" name="${this.id}"  src="${a}"${
      this.options.autosize || this.options.fullscreen
        ? ''
        : ` width="${this.options.width}" height="${this.options.height}"`
    } frameborder="0" allowTransparency="true" scrolling="no" allowfullscreen style="display:block;"></iframe>`;
  }

  onChartReady(next_callback) {
    if (this._ready) {
      next_callback.call(this);
    } else {
      this._ready_handlers.push(next_callback);
    }
  }

  setSymbol(symbol, interval, graphic) {
    this._innerWindow().tradingViewApi.changeSymbol(symbol, interval, graphic);
  }

  startFullscreen() {
    this._innerWindow().tradingViewApi.startFullscreen();
  }

  chart(deepDataAndEvents) {
    return this._innerWindow().tradingViewApi.chart(deepDataAndEvents);
  }

  activeChart() {
    return this._innerWindow().tradingViewApi.activeChart();
  }

  createButton(toolName) {
    return this._innerWindow().createButton(toolName);
  }

  remove() {
    try {
      window.removeEventListener('resize', this._onWindowResize);
      this._ready_handlers.splice(0, this._ready_handlers.length);
      delete window[this.options.uid];
      const el = TradingViewLibrary.gEl(this.id);

      el.contentWindow.destroyChart();
      el.parentNode.removeChild(el);
    } catch (e) {}
  }

  subscribe(callback, deepDataAndEvents) {
    this._innerWindow().tradingViewApi.subscribe(callback, deepDataAndEvents);
  }

  unsubscribe(subscriber, p_obj) {
    this._innerWindow().tradingViewApi.unsubscribe(subscriber, p_obj);
  }

  closePopupsAndDialogs() {
    this._innerWindow().tradingViewApi.closePopupsAndDialogs();
  }

  addCustomCSSFile(deepDataAndEvents) {
    this._innerWindow().addCustomCSSFile(deepDataAndEvents);
  }

  save(successCB) {
    this._innerWindow().tradingViewApi.saveChart(successCB);
  }

  load(req, loadingLang) {
    this._innerWindow().tradingViewApi.loadChart({
      json: req,
      extendedData: loadingLang,
    });
  }
}

/**
 * @param {string} name
 * @return {undefined}
 */
function addToWrapper(name) {
  /**
   * @param {?} dataAndEvents
   * @return {undefined}
   */
  Widget.prototype[name] = dataAndEvents => {
    console.warn(
      `Method \`${name}\` is obsolete. Please use \`chart.${name}()\` subscription method instead.`
    );
  };
}

addToWrapper('onSymbolChange');
addToWrapper('onIntervalChange');

[
  ['onTick'],
  ['onAutoSaveNeeded'],
  ['onScreenshotReady'],
  ['onBarMarkClicked', 'onMarkClick'],
  ['onTimescaleMarkClicked', 'onTimescaleMarkClick'],
].forEach(methods => {
  /**
   * @param {?} deepDataAndEvents
   * @return {undefined}
   */
  Widget.prototype[methods[0]] = function(deepDataAndEvents) {
    const restoreScript = methods[1] || methods[0];

    console.warn(
      `Method \`${
        methods[0]
      }\` is obsolete. Please use \`widget.subscribe("${restoreScript}", callback)\` instead.`
    );
    this.subscribe(restoreScript, deepDataAndEvents);
  };
});

export default Widget;
