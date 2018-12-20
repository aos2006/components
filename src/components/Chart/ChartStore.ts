import _ from 'lodash';
import { action, autorun, IObservableArray, observable, toJS } from 'mobx';
import { createError, logError } from '@latoken-component/utils/index';
import { makeRequest } from '@latoken-component/utils/utils/api/actions';
import { errorTypes } from '@latoken-component/utils';
import mergeChartData from './helpers/mergeChartData';

export interface IRawBarObject {
  c: number[]; // closes
  h: number[]; // highs
  l: number[]; // lows
  o: number[]; // opens
  s: 'ok' | 'no_data' | 'error'; // status
  t: number[]; // times
  v: number[]; // volumes
}

export interface IBarObject {
  time: number;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number | null;
}

export interface ISymbolInfo {
  description: string;
  has_intraday: boolean;
  has_no_volume: boolean;
  minmov2: number;
  minmov: number;
  name: string;
  pricescale: number;
  session: string;
  supported_resolutions: string[];
  ticker: string;
  timezone: string;
  type: string;
}

export type IFetchChartData = (
  symbolInfo?: ISymbolInfo,
  resolution?: string,
  from?: number, // UNIX timestamp
  to?: number, // UNIX timestamp
  onHistoryCallback?: (bar: IBarObject[], meta: { noData: boolean }) => void,
  onErrorCallback?: (reason: string) => void,
  firstDataRequest?: any
) => Promise<any>;

interface IChartParams {
  symbolId: number;
  url?: string;
  description?: string;
  type?: string;
  pricescale?: number;
}

function handleSilentError(error) {
  if (_.get(error, 'name') === errorTypes.SILENT) {
    return Promise.resolve();
  }

  throw error;
}

// Настройки для открытого графика
export default class ChartStore {
  @observable symbolId: number;
  @observable description: string = null;
  @observable pricescale: number = 1;
  @observable type: string = 'cryptoCurrencyPair';

  @observable url: string = `/charts/history`;

  @observable activeChart = null;
  @observable activeChartReady: boolean = false;
  @observable activeChartTimeframe: '1y' | '3m' | '1m' | '1w' | '1d' = '1m'; // from timeFramesArray
  supportedChartResolutions: string[] = [
    '1',
    '5',
    '15',
    '30',
    '60',
    `${60 * 4}`,
    `${60 * 6}`,
    `${60 * 12}`,
    '1D',
    '1W',
  ];
  @observable lastResolution: string = '240';

  @observable chartBarsArray: IObservableArray<IBarObject> = observable.array();
  @observable onHistoryCallback: (bar: IBarObject[], meta?: { noData: boolean }) => void;
  @observable resolution: string = this.lastResolution;
  //symbolInfo: ISymbolInfo;
  updateFunction: (bar: IBarObject) => void;

  constructor(params?: IChartParams) {
    if (params) {
      this.setChartParams(params);
    }

    /**
     * При дозагрузке данных графика вызываем его колбэк
     */

    autorun(() => {
      const { onHistoryCallback, chartBarsArray } = this;

      if (_.isFunction(onHistoryCallback)) {
        onHistoryCallback(toJS(chartBarsArray));
      }
    });

    /**
     * Запоминаем последнее разрешение свечей
     */

    autorun(() => {
      if (this.resolution != null && this.resolution !== this.lastResolution) {
        this.lastResolution = this.resolution;
      }
    });
  }

  @action.bound
  fetchChartData: IFetchChartData = function fetchChartData(
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    mode
  ) {
    const requestedSymbolId = this.symbolId;
    const requestedResolution = resolution || this.resolution || this.lastResolution;

    return makeRequest({
      url: this.url,
      method: 'get',
      withCredentials: false,
      params: {
        symbol: String(requestedSymbolId),
        resolution: String(requestedResolution),
        from,
        to,
      },
    })
      .then(this.checkToError)
      .then(data => {
        return this.fetchChartDataSuccess(
          data.data,
          requestedSymbolId,
          requestedResolution,
          mode,
          onErrorCallback,
          onHistoryCallback
        );
      })
      .catch(handleSilentError)
      .catch(error => {
        if (onErrorCallback) {
          onErrorCallback(`network error`);
        }

        return logError(error);
      });
  };

  @action.bound
  checkToError(res) {
    if (!res || res.result === false) {
      return Promise.reject(createError('error', _.get(res, 'error') || 'UNKNOWN_ERROR'));
    }

    return res;
  }

  @action.bound
  fetchChartDataSuccess(
    data: IRawBarObject,
    requestedSymbolId,
    requestedResolution,
    mode,
    onErrorCallback,
    onHistoryCallback
  ) {
    if (data.s === 'no_data') {
      return onHistoryCallback([], { noData: true });
    } else if (data.s !== 'ok' || requestedSymbolId !== this.symbolId) {
      return onErrorCallback(data.s);
    }

    const { chartBarsArray, updateFunction } = this;

    /**
     * Если мы уже имеем данные по текущему resolution, то мерджим, чтобы иметь
     * полный набор данных в сторе (хотя график может и сам мерджить из кусков).
     *
     * Если не имеем - проставляем первичные данные
     *
     * Mode:
     * true - первичный запрос по паре,
     * false - вторичный запрос (дозапрос для расширенного периода)
     * isRealtime - вторичный запрос при совершении сделки кем-либо (сигнал прилетает по сокету)
     *
     */

    if (requestedResolution === this.resolution && chartBarsArray.length > 0 && mode !== true) {
      const readyData = mergeChartData(chartBarsArray, this._formatBarsArray(data));

      /**
       * При получении реалтаймовых данных обновляем предыдущую (если добавилась новая)
       * и текущую свечу
       *
       */

      if (mode === 'isRealtime') {
        const lastBar_current = toJS(chartBarsArray[chartBarsArray.length - 1]);
        const prevBar_new = toJS(readyData[readyData.length - 2]);
        const lastBar_new = toJS(readyData[readyData.length - 1]);

        if (_.isFunction(updateFunction) && !_.isEqual(lastBar_current, lastBar_new)) {
          const isNewBar = lastBar_new.time > lastBar_current.time;

          // Магия, чтобы реалтаймовые бары привязывались к предыдущим барам

          if (isNewBar) {
            prevBar_new.open = lastBar_current.open;
            updateFunction(prevBar_new);
          }

          lastBar_new.open = prevBar_new.close;
          updateFunction(lastBar_new);
        }
      }

      this.chartBarsArray.replace(readyData);
    } else {
      this.chartBarsArray.replace(this._formatBarsArray(data));
      this.onHistoryCallback = onHistoryCallback;

      // Не понимаю почему, но при запросе на '1W' библиотека делает запрос на 'D',
      // но работает при этом в недельном режиме
      this.resolution = requestedResolution === 'D' ? '1W' : requestedResolution;
    }
  }

  @action.bound
  subscribeBars(onRealtimeCallback) {
    this.updateFunction = onRealtimeCallback;
    this.activeChartReady = true;
  }

  @action.bound
  resolveChartSymbol = (onSymbolResolvedCallback: (symbolInfo: ISymbolInfo) => void) =>
    setTimeout(() => {
      return onSymbolResolvedCallback({
        description: this.description,
        has_intraday: true,
        has_no_volume: false,
        minmov2: 0,
        minmov: 1,
        name: String(this.symbolId),
        pricescale: this.pricescale,
        session: '0000-2400:1234567',
        supported_resolutions: this.supportedChartResolutions,
        ticker: String(this.symbolId),
        timezone: 'Europe/London',
        type: this.type,
      });
    }, 5);

  _getBarValues = (data: IRawBarObject, ohlPresent, volumePresent, index) => {
    // Ставим цену открытия соответствующей цене закрытия предыдущей свечи

    const prevClose = data.c[index - 1] != null ? data.c[index - 1] : null;
    const close = data.c[index];

    return {
      time: data.t[index] * 1000,
      close,
      open: prevClose != null ? prevClose : ohlPresent ? data.o[index] : close,
      high: ohlPresent ? data.h[index] : close,
      low: ohlPresent ? data.l[index] : close,
      volume: volumePresent ? data.v[index] : null,
    };
  };

  _formatBarsArray = (data: IRawBarObject) => {
    const bars: IBarObject[] = [];
    const barsCount = data.t.length;
    const ohlPresent = data.o != null;
    const volumePresent = data.v != null;

    for (let i = 0; i < barsCount; ++i) {
      bars.push(this._getBarValues(data, ohlPresent, volumePresent, i));
    }

    return bars;
  };

  //new functions
  @action.bound
  realtimeUpdateChart = _.debounce((from, to) => {
    return this.fetchChartData(null, null, from, to, () => false, () => false, 'isRealtime');
  }, 300);

  @action.bound
  updateChart() {
    const { chartBarsArray } = this;

    if (chartBarsArray.length > 1) {
      const prevBar = chartBarsArray[chartBarsArray.length - 2];

      const from = prevBar.time / 1000;
      const to = parseInt(String(new Date().valueOf() / 1000), 10) + 100;

      this.realtimeUpdateChart(from, to);
    }
  }

  @action.bound
  resetChart() {
    this.activeChartTimeframe = '1m';

    if (this.activeChart) {
      this.activeChart.resetData();
    }

    this.resolution = this.lastResolution;
    this.chartBarsArray = observable.array();
  }

  @action.bound
  setChartParams({ symbolId, url, description, type, pricescale }: IChartParams) {
    if (symbolId) this.symbolId = symbolId;

    if (description) this.description = description;
    if (type) this.type = type;
    if (pricescale) this.pricescale = pricescale;
    if (url) this.url = url;
  }
}
