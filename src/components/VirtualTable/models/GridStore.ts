import { Collection } from 'components/latoken-data';
import { action, computed, observable, reaction } from 'mobx';
import moment from 'moment';
import { IFetchData, IResponseList } from '../interfaces';

const DEFAULT_CONFIG = {
  mode: 'client',
  tmode: 'client',
  pageRange: 2,
  offset: 0,
  total: 0,
  limit: 20,
  page: 1,
};

type ITableConfig = typeof DEFAULT_CONFIG;

type ITableConfigOptionals = Partial<ITableConfig>;

export interface IProxy<T = any> {
  fetch(data: IFetchData): any;

  onDataChange(fn: (response: IResponseList<T>) => void): any;
}

class GridStore<T = any> extends Collection<T> {
  Proxy: IProxy<T>;
  paramsChangeReaction = null;
  @observable
  config = DEFAULT_CONFIG;
  @observable
  filters = {};
  @observable
  filtersCount = 1;

  constructor(Proxy?: IProxy<T>, config?: ITableConfigOptionals) {
    super();
    this.config = {
      ...this.config,
      ...config,
    };

    this.Proxy = Proxy;

    if (this.config.mode === 'server') {
      this.Proxy.onDataChange(this.handleDataChange);

      this.paramsChangeReaction = reaction(
        () => ({
          page: this.config.page,
          limit: this.config.limit,
          isFilterChanged: this.filtersCount,
          filters: this.filters,
          offset: this.config.offset,
          pageRange: this.config.pageRange,
          searchQuery: this.searchQuery,
          sortBy: this.sortBy,
          sortDirection: this.sortDirection,
        }),
        data => {
          this.Proxy.fetch(data);
        }
      );
    }
  }

  @computed
  get queryParams(): IFetchData {
    return {
      filters: this.filters,
      page: this.config.page,
      offset: this.config.offset,
      limit: this.config.limit,
      pageRange: this.config.pageRange,
      searchQuery: this.searchQuery,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
    };
  }

  @action.bound
  setFilters(name, list) {
    this.filters[name] = list;
    this.filtersCount = this.calculateFiltersLength();
  }

  calculateFiltersLength = () =>
    Object.keys(this.filters).reduce((acc, key) => acc + this.filters[key].length, 0);

  @action.bound
  resetFilters() {
    this.filters = {};
  }

  @computed
  get pageRange() {
    return this.config.pageRange;
  }
  @computed
  get offset() {
    return this.config.offset;
  }

  load() {
    this.Proxy.fetch(this.queryParams);
  }

  @computed
  get totalPages() {
    return Math.ceil(this.config.total / this.config.limit);
  }

  @action.bound
  pageChange = ({ selected }: { selected: number }) => {
    this.config.page = selected;
  };

  @action.bound
  updateConfig(config) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  @action.bound
  handleDataChange({ data, total }: IResponseList<T>) {
    if (!Array.isArray(data)) {
      throw Error('Uncorrect data type, data must be Array');
    }

    this.set(data);
    this.config.total = total || 0;
  }

  @action.bound
  rangeDate({ from, to, key }, dateFormat = 'DD.MM') {
    if (!from && !to) {
      return this.restore();
    }

    const startDate = moment(from);
    const endDate = moment(to);

    this.filter(item => {
      const currentDate = moment(item[key], dateFormat);

      return currentDate.isBetween(startDate, endDate);
    });
  }
}

export default GridStore;
