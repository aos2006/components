import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import cn from 'classnames';
import Widget from './Widget';
import { Button, Select } from 'antd';
import HtmlBody from '@latoken-component/HtmlBody';
import styles from './styles.styl';
import ChartStore from './ChartStore';

const Option = Select.Option;

function getChartLocale(language) {
  if (!language) {
    return 'en';
  }

  switch (language) {
    case 'kr':
      return 'ko';
    case 'cn':
    case 'zh-Hans':
      return 'zh';
    default:
      return language;
  }
}

interface TradingViewProps {
  symbolId: number | string;
  url?: string;
  type?: string;
  description?: string;
  pricescale?: number;
  language?: string;
  size?: 'small' | boolean;
  innerStyles?: any;
  library_path?: string;
  store?: ChartStore;
}

const minutesArray = [
  { label: 'MIN', resolution: 'min', disabled: true },
  { label: '1M', resolution: '1' },
  { label: '5M', resolution: '5' },
  { label: '15M', resolution: '15' },
  { label: '30M', resolution: '30' },
];

function MinuteSelect({ noData, resolution, setResolution }) {
  const selectedMinute =
    _.findIndex(minutesArray, ['resolution', resolution]) === -1 ? 'min' : resolution;

  const selectMinuteClassName = cn({
    [styles.select]: true,
    [styles.selectActive]: selectedMinute !== 'min',
  });

  return (
    <Select
      disabled={noData}
      value={selectedMinute}
      className={selectMinuteClassName}
      onChange={setResolution}
      dropdownClassName={styles.selectDropdown}
    >
      {minutesArray.map(({ label, resolution, disabled }) => (
        <Option key={resolution} value={resolution} disabled={disabled}>
          {label}
        </Option>
      ))}
    </Select>
  );
}

const hoursArray = [
  { label: 'HOUR', resolution: 'hour', disabled: true },
  { label: '1H', resolution: '60' },
  { label: '4H', resolution: `${60 * 4}` },
  { label: '6H', resolution: `${60 * 6}` },
  { label: '12H', resolution: `${60 * 12}` },
];

function HourSelect({ noData, resolution, setResolution }) {
  const selectedHour =
    _.findIndex(hoursArray, ['resolution', resolution]) === -1 ? 'hour' : resolution;

  const selectHourClassName = cn({
    [styles.select]: true,
    [styles.selectActive]: selectedHour !== 'hour',
  });

  return (
    <Select
      disabled={noData}
      value={selectedHour}
      className={selectHourClassName}
      onChange={setResolution}
      dropdownClassName={styles.selectDropdown}
    >
      {hoursArray.map(({ label, resolution, disabled }) => (
        <Option key={resolution} value={resolution} disabled={disabled}>
          {label}
        </Option>
      ))}
    </Select>
  );
}

const separateResolutionsArray = [
  { label: '1D', resolution: '1D' },
  { label: '1W', resolution: '1W' },
];

@observer
export default class Chart extends Component<TradingViewProps> {
  widget: Widget;
  chartWrapper: null | HTMLElement = null;
  checkToolbarInterval: null | number = null;

  @observable chartOffsetTop: number = 0;
  @observable chartHeight: number = 464;
  @observable minChartHeight: number = 452;
  @observable isResizing: boolean = false;
  @observable leftToolbarOpened: boolean = false;
  @observable tId: number = 0;

  store: ChartStore = null;
  containerId = null;

  constructor(props) {
    super(props);

    this.containerId = this._generateContainerId();

    if (props.store) {
      this.store = props.store;
    } else {
      this.store = new ChartStore({
        symbolId: props.symbolId,
        url: props.url,
        description: props.desciption,
        type: props.type,
        pricescale: props.pricescale,
      });
    }
  }

  _generateContainerId = () => {
    let i = 1;
    while (document.getElementById(`tradingview-widget-${i}`)) i++;

    return `tradingview-widget-${i}`;
  };

  _generateDataFeed = () => {
    const { store } = this;

    const feedConfig = {
      supports_search: false,
      supports_group_request: false,
      supported_resolutions: store.supportedChartResolutions,
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: false,
    };

    const mockedMethods = [
      'getServerTime',
      'getMarks',
      'getTimescaleMarks',
      'searchSymbols',
      'calculateHistoryDepth',
      'getQuotes',
      'subscribeQuotes',
      'unsubscribeQuotes',
      'unsubscribeBars',
    ];

    const dataFeed = {
      onReady: callback => setTimeout(() => callback(feedConfig), 0),
      resolveSymbol: (assetIdStr, onSymbolResolvedCallback) =>
        store.resolveChartSymbol(onSymbolResolvedCallback),
      getBars: (...args) => store.fetchChartData(...args),
      subscribeBars: (symbolInfo, resolution, onRealtimeCallback) =>
        store.subscribeBars(onRealtimeCallback),
    };

    mockedMethods.forEach(methodName => {
      dataFeed[methodName] = () => Promise.resolve();
    });

    return dataFeed;
  };

  componentDidMount() {
    // const { globals } = this.props;

    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    if (this.props.symbolId != null && this.chartWrapper != null) {
      this.chartOffsetTop = Math.floor(
        this.chartWrapper.getBoundingClientRect().top + document.documentElement.scrollTop
      );

      this.initWidget(this.props.symbolId);
    }

    /**
     * Хак, скрывающий легенду со значениями в верхнем левом углу, потому что конфиг
     * TradingView не работает
     *
     */
    // if (globals.isMobile) {
    //решение на стилях, не работает из-за рассинхрона ифрейма
    // @ts-ignore
    // const iframe = document.getElementsByTagName('iframe')[0];
    // const iFDoc = iframe.contentWindow.document;
    // const styleTag = iFDoc.createElement('style');
    // styleTag.type = 'text/css';
    // styleTag.appendChild(iFDoc.createTextNode(`.pane-legend {display: none;}`));
    // console.log(styleTag);
    // iFDoc.head.appendChild(styleTag);
    // решение на интервалах, работает, но выглядит грязно
    // iFDoc.body.appendChild(styleTag);
    // @ts-ignore
    // this.tId = setInterval(() => {
    //   const legend =
    //     iframe.contentDocument &&
    //     iframe.contentDocument.getElementsByClassName('pane-legend-line')[0];
    //   if (legend && _.get(legend, 'style.display') !== 'none') {
    //     // @ts-ignore
    //     legend.style.display = 'none';
    //   }
    //   // };
    // }, 1000);
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { store } = this;

    if (nextProps.symbolId != null) {
      store.setChartParams(nextProps);

      if (this.props.symbolId !== nextProps.symbolId) {
        store.resetChart();

        if (!this.widget) {
          this.chartOffsetTop = Math.floor(
            this.chartWrapper.getBoundingClientRect().top + document.documentElement.scrollTop
          );

          return this.initWidget(nextProps.symbolId);
        }

        /**
         * Редкий мутный кейс - когда виджет инициализирован, но во фрейме не закончил расчеты,
         * и при этом пришел апдейт по сокету, поэтому оборачиваем чтобы приложение не падало
         */

        try {
          this.widget.setSymbol(String(nextProps.symbolId), this.widget.options.interval);
        } catch (e) {
          //console.log('Expected rare error', e.message);
        }

        this.setResolution(store.lastResolution);
      }
    }
  }

  componentDidUpdate() {
    const { language, symbolId } = this.props;

    // Смена языка, к сожалению, возможна только пересозданием графика
    if (this.widget && this.widget.options.locale !== getChartLocale(language)) {
      this.destroyWidget();
      this.initWidget(symbolId);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);

    this.destroyWidget();

    // if (this.tId) {
    //   clearInterval(this.tId);
    // }
  }

  initWidget = symbolId => {
    const { size, language } = this.props;
    const { store, containerId } = this;

    const config = {
      autosize: true,
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      container_id: containerId,
      datafeed: this._generateDataFeed(),
      overrides: {
        'paneProperties.background': '#ffffff',
        'paneProperties.vertGridProperties.color': '#E6E6E6',
        'paneProperties.horzGridProperties.color': '#E6E6E6',
        'paneProperties.crossHairProperties.color': '#989898',

        //	Margins (percent). Used for auto scaling.
        'paneProperties.topMargin': 20,
        'paneProperties.bottomMargin': 5,

        // Параметры текстов слева вверху на графике
        'paneProperties.legendProperties.showStudyArguments': true,
        'paneProperties.legendProperties.showStudyTitles': true,
        'paneProperties.legendProperties.showStudyValues': true,
        'paneProperties.legendProperties.showSeriesTitle': false,
        'paneProperties.legendProperties.showSeriesOHLC': true,
        'paneProperties.legendProperties.hideLegend': false,
        // Параметры лэйблов справа и снизу от графика
        'scalesProperties.fontSize': 12,

        // Отступ баров от правого края графика
        'timeScale.rightOffset': 5,

        //	Series style. See the supported values below
        //		Bars = 0
        //		Candles = 1
        //		Line = 2
        //		Area = 3
        //		Heiken Ashi = 8
        //		Hollow Candles = 9
        //		Renko = 4
        //		Kagi = 5
        //		Point&Figure = 6
        //		Line Break = 7
        'mainSeriesProperties.style': 1,

        'mainSeriesProperties.showCountdown': false,
        'mainSeriesProperties.showLastValue': true,
        'mainSeriesProperties.visible': true,
        'mainSeriesProperties.showPriceLine': true,
        'mainSeriesProperties.priceLineWidth': 1,
        'mainSeriesProperties.lockScale': false,
        'mainSeriesProperties.minTick': 'default',
        'mainSeriesProperties.extendedHours': false,

        //	Candles styles
        'mainSeriesProperties.candleStyle.upColor': '#3DBD7D',
        'mainSeriesProperties.candleStyle.downColor': '#E36776',
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': true,
        'mainSeriesProperties.candleStyle.borderColor': '#378658',
        'mainSeriesProperties.candleStyle.wickUpColor': 'rgba( 115, 115, 117, 1)',
        'mainSeriesProperties.candleStyle.wickDownColor': 'rgba( 115, 115, 117, 1)',
        'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,

        // Это обводка для свеч, но также используется для легенды (вверху слева).
        // Внимание! Для легенды хардкорно заменяется на константные цвета в ядре графика
        'mainSeriesProperties.candleStyle.borderUpColor': '#225437',
        'mainSeriesProperties.candleStyle.borderDownColor': '#5b1a13',
      },
      disabled_features: [
        'context_menus',
        'control_bar',
        'datasource_copypaste',
        'display_market_status',
        'dont_show_boolean_study_arguments',
        //'edit_buttons_in_legend',
        'header_undo_redo',
        'header_compare',
        //'header_settings',
        //'header_indicators',
        'header_interval_dialog_button',
        'header_saveload',
        'border_around_the_chart',
        'header_symbol_search',
        'header_screenshot',
        'header_resolutions',
        //'header_chart_type',
        //'header_fullscreen_button',
        'hide_last_na_study_output',
        'legend_context_menu',
        //'left_toolbar',
        'main_series_scale_menu',
        //'timeframes_toolbar',
        'use_localstorage_for_settings',
        'timezone_menu',
      ],
      time_frames: [
        {
          text: '1y',
          resolution: '1W',
          description: '1 year',
        },
        {
          text: '3m',
          resolution: '1D',
          description: '3 months',
        },
        {
          text: '1m',
          resolution: '240',
          description: '1 month',
        },
        {
          text: '1w',
          resolution: '60',
          description: '1 week',
        },
        {
          text: '1d',
          resolution: '30',
          description: '1 day',
        },
      ],
      timeframe: store.activeChartTimeframe,
      enabled_features: [],
      interval: store.lastResolution,
      timezone: 'Europe/Moscow',
      library_path: this.props.library_path || `/prod_statics/charting_library/`,
      locale: getChartLocale(language),
      symbol: symbolId,
    };

    if (size === 'small') {
      config.overrides['paneProperties.legendProperties.hideLegend'] = true;
      config.disabled_features = config.disabled_features.concat([
        'timeframes_toolbar',
        'header_fullscreen_button',
      ]);
    }

    this.widget = new Widget(config);

    store.symbolId = symbolId;

    this.widget.onChartReady(() => {
      store.activeChart = this.widget.activeChart();

      this.checkToolbarInterval = window.setInterval(() => {
        this.leftToolbarOpened = store.activeChart.getCheckableActionState('drawingToolbarAction');
      }, 500);

      try {
        const toggleTitlesButton = this.widget
          ._innerWindow()
          .document.getElementsByClassName('pane-legend-minbtn')[0];
        toggleTitlesButton.click();
      } catch (e) {}
    });
  };

  destroyWidget = () => {
    const { store } = this;

    store.activeChart = null;
    store.activeChartReady = false;
    clearInterval(this.checkToolbarInterval);

    if (this.widget) {
      this.widget.remove();
      this.widget = null;
    }
  };

  setResolution = resolution => {
    const { store } = this;

    if (store.activeChart) {
      store.activeChart.setResolution(String(resolution));
    }
  };

  onMouseDown = e => {
    this.isResizing = true;
  };

  onMouseUp = e => {
    this.isResizing = false;
  };

  onMouseMove = _.throttle(event => {
    if (!this.isResizing) {
      return false;
    }

    const { clientY } = event;

    let newHeight = clientY + document.documentElement.scrollTop - this.chartOffsetTop;

    if (newHeight < this.minChartHeight) {
      newHeight = this.minChartHeight;
    }

    this.chartHeight = newHeight;

    return true;
  }, 2);

  render() {
    const { innerStyles } = this.props;
    const { store, containerId } = this;
    const noData = store.chartBarsArray.length === 0;

    return (
      <div className={styles.chartContainer}>
        <div
          className={cn(styles.chartHeader, this.leftToolbarOpened && styles.withToolbar)}
          id="Mobile_ChartHeader"
        >
          <MinuteSelect
            resolution={store.resolution}
            noData={noData}
            setResolution={this.setResolution}
          />
          <HourSelect
            resolution={store.resolution}
            noData={noData}
            setResolution={this.setResolution}
          />
          {separateResolutionsArray.map(({ label, resolution: targetResolution }) => (
            <Button
              key={targetResolution}
              className={cn(styles.button, store.resolution === targetResolution && styles.active)}
              disabled={noData}
              onClick={() => this.setResolution(targetResolution)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div
          className={styles.chartWrapper}
          ref={node => (this.chartWrapper = node)}
          style={innerStyles || { height: this.chartHeight }}
        >
          <div onMouseDown={this.onMouseDown} className={styles.resizer} />
          <HtmlBody toggleClass={styles.noSelect} isActive={this.isResizing} />
          <div
            className={cn(styles.chartWrapperInner, this.isResizing && styles.overflowed)}
            id={containerId}
            style={innerStyles}
          />
        </div>
      </div>
    );
  }
}
