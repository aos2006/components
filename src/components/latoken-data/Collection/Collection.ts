import { action, computed, observable } from 'mobx';
import { isNumeric } from '../utils/utils';

class Collection<T = any> {
  // TODO: move to persisten data structure
  coreList = [];
  resultList: T[];
  sorter = null;

  @observable initialList: T[] = [];

  @observable sortDirection = 'ASC';

  @observable activeMod = '';

  @observable searchQuery = '';

  @observable sortBy = '';

  constructor(list: T[] = [], sortDirection = 'ASC', sortBy = '', sorter = null) {
    this.initialList = list;
    this.coreList = list;
    this.sortDirection = sortDirection;
    this.sortBy = sortBy;
    this.sorter = sorter;
  }

  @computed
  get searchList(): T[] {
    return this.searchQuery
      ? this.initialList.filter(item => this.findInObj(this.searchQuery, item))
      : this.initialList;
  }

  @computed
  get sortedList(): T[] {
    const compareFn = this.sorter
      ? this.sorter
      : (a, b) => this.sortCompare(a, b, this.sortDirection);

    return this.searchList.sort(compareFn);
  }

  @computed
  get list(): T[] {
    return this.sortedList;
  }

  findInObj = (txt, obj) => {
    const newTxt = txt.toLowerCase();

    return Array.from(Object.keys(obj)).some(key => {
      const itemValue = String(obj[key]).toLowerCase();

      return itemValue.includes(newTxt);
    });
  };

  @action.bound
  search(query) {
    this.searchQuery = query;
    this.resultList = this.initialList.filter(item => this.findInObj(query, item));
  }

  @action.bound
  restore() {
    this.initialList = this.coreList;
  }

  filter(fn) {
    this.initialList = this.initialList.filter(fn);
  }

  convertToPossibleType = value => {
    if (isNumeric(value)) {
      return parseFloat(value);
    }

    return value;
  };

  sortCompare = (a, b, type = 'ASC'): number => {
    const aValue = this.convertToPossibleType(a[this.sortBy]);
    const bValue = this.convertToPossibleType(b[this.sortBy]);

    if (aValue < bValue && type === 'ASC') {
      return 1;
    }
    if (aValue > bValue && type === 'ASC') {
      return -1;
    }
    if (aValue > bValue && type === 'DESC') {
      return 1;
    }
    if (aValue < bValue && type === 'DESC') {
      return -1;
    }

    return 0;
  };

  reset() {
    this.initialList = [];
    this.resultList = [];
    this.searchQuery = '';
    this.sortDirection = null;
    this.sortBy = '';
    this.activeMod = '';
  }

  getByKey(key = 'id', value) {
    return computed(() => this.initialList.find(item => item[key] === value)).get();
  }

  where(predicate, callback) {
    return this.initialList.filter(item => {
      const result = predicate(item);
      if (result) {
        callback(item);
      }

      return result;
    });
  }

  @action.bound
  setSearchValue(value) {
    this.searchQuery = value;
  }

  @action.bound
  set(list) {
    this.initialList = list;
    this.coreList = list;
  }

  @action.bound
  setSortBy(value) {
    this.sortBy = value;
  }

  @action.bound
  setSortDirection(value) {
    this.sortDirection = value;
  }

  @action.bound
  sort({ sortDirection, sortBy, sorter = null }) {
    this.sortDirection = sortDirection;
    this.sortBy = sortBy;
    this.sorter = sorter;
  }

  @action.bound
  add(item) {
    this.initialList.push(item);
  }
}

export default Collection;
