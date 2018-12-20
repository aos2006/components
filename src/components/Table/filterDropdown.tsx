import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import closest from 'dom-closest';
import classNames from 'classnames';
import Dropdown from 'antd/lib/dropdown';
import Icon from '@latoken-component/icon';
import Checkbox from 'antd/lib/checkbox';
import Radio from 'antd/lib/radio';
import FilterDropdownMenuWrapper from './FilterDropdownMenuWrapper';
import { FilterMenuProps, FilterMenuState, ColumnProps, ColumnFilterItem } from './interface';
import styles from './style/index.styl';

export default class FilterMenu<T> extends React.Component<FilterMenuProps<T>, FilterMenuState> {
  static defaultProps = {
    handleFilter() {},
    column: {},
  };

  neverShown: boolean;

  constructor(props: FilterMenuProps<T>) {
    super(props);

    const visible =
      'filterDropdownVisible' in props.column ? props.column.filterDropdownVisible : false;

    this.state = {
      selectedKeys: props.selectedKeys,
      keyPathOfSelectedItem: {}, // 记录所有有选中子菜单的祖先菜单
      visible,
    };
  }

  componentDidMount() {
    const { column } = this.props;
    this.setNeverShown(column);
  }

  componentWillReceiveProps(nextProps: FilterMenuProps<T>) {
    const { column } = nextProps;
    this.setNeverShown(column);
    const newState = {} as {
      selectedKeys: string[];
      visible: boolean;
    };
    if ('selectedKeys' in nextProps) {
      newState.selectedKeys = nextProps.selectedKeys;
    }
    if ('filterDropdownVisible' in column) {
      newState.visible = column.filterDropdownVisible as boolean;
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  setNeverShown = (column: ColumnProps<T>) => {
    const rootNode = ReactDOM.findDOMNode(this);
    const filterBelongToScrollBody = !!closest(rootNode, `.ant-table-scroll`);
    if (filterBelongToScrollBody) {
      // When fixed column have filters, there will be two dropdown menus
      // Filter dropdown menu inside scroll body should never be shown
      // To fix https://github.com/ant-design/ant-design/issues/5010 and
      // https://github.com/ant-design/ant-design/issues/7909
      this.neverShown = !!column.fixed;
    }
  };

  setSelectedKeys = ({ selectedKeys }: { selectedKeys: string[] }) => {
    this.setState({ selectedKeys });
  };

  setVisible(visible: boolean) {
    const { column } = this.props;
    if (!('filterDropdownVisible' in column)) {
      this.setState({ visible });
    }
    if (column.onFilterDropdownVisibleChange) {
      column.onFilterDropdownVisibleChange(visible);
    }
  }

  handleClearFilters = () => {
    this.setState(
      {
        selectedKeys: [],
      },
      this.handleConfirm
    );
  };

  handleConfirm = () => {
    this.setVisible(false);
    this.confirmFilter();
  };

  onVisibleChange = (visible: boolean) => {
    this.setVisible(visible);
    if (!visible) {
      this.confirmFilter();
    }
  };

  confirmFilter() {
    if (this.state.selectedKeys !== this.props.selectedKeys) {
      this.props.confirmFilter(this.props.column, this.state.selectedKeys);
    }
  }

  renderMenuItem(item: ColumnFilterItem) {
    const { column } = this.props;
    const multiple = 'filterMultiple' in column ? column.filterMultiple : true;
    const input = multiple ? (
      <Checkbox checked={this.state.selectedKeys.indexOf(item.value.toString()) >= 0} />
    ) : (
      <Radio checked={this.state.selectedKeys.indexOf(item.value.toString()) >= 0} />
    );

    return (
      <MenuItem key={item.value}>
        {input}
        <span>{item.text}</span>
      </MenuItem>
    );
  }

  hasSubMenu() {
    const {
      column: { filters = [] },
    } = this.props;
    return filters.some(item => !!(item.children && item.children.length > 0));
  }

  renderMenus(items: ColumnFilterItem[]): React.ReactElement<any>[] {
    return items.map(item => {
      if (item.children && item.children.length > 0) {
        const { keyPathOfSelectedItem } = this.state;
        const containSelected = Object.keys(keyPathOfSelectedItem).some(
          key => keyPathOfSelectedItem[key].indexOf(item.value) >= 0
        );
        const subMenuCls = containSelected
          ? `${this.props.dropdownPrefixCls}-submenu-contain-selected`
          : '';
        return (
          <SubMenu title={item.text} className={subMenuCls} key={item.value.toString()}>
            {this.renderMenus(item.children)}
          </SubMenu>
        );
      }
      return this.renderMenuItem(item);
    });
  }

  handleMenuItemClick = (info: { keyPath: string; key: string }) => {
    if (info.keyPath.length <= 1) {
      return;
    }
    const keyPathOfSelectedItem = this.state.keyPathOfSelectedItem;
    if (this.state.selectedKeys.indexOf(info.key) >= 0) {
      // deselect SubMenu child
      delete keyPathOfSelectedItem[info.key];
    } else {
      // select SubMenu child
      keyPathOfSelectedItem[info.key] = info.keyPath;
    }
    this.setState({ keyPathOfSelectedItem });
  };

  renderFilterIcon = (isSelected = this.props.selectedKeys.length > 0) => {
    const { column, locale } = this.props;
    const filterIcon = column.filterIcon as any;
    const dropdownSelectedClass = isSelected ? styles[`filter-selected`] : '';

    return filterIcon ? (
      React.cloneElement(filterIcon as any, {
        title: locale.filterTitle,
        className: classNames(filterIcon.className, {
          [styles[`filter-icon`]]: true,
        }),
      })
    ) : (
      <Icon
        title={locale.filterTitle}
        glyph={isSelected ? 'filter' : 'filter-o'}
        className={classNames(dropdownSelectedClass, styles[`filter-icon`])}
      />
    );
  };
  render() {
    const { column, locale, dropdownPrefixCls, getPopupContainer } = this.props;
    // default multiple selection in filter dropdown
    const multiple = 'filterMultiple' in column ? column.filterMultiple : true;
    const dropdownMenuClass = classNames({
      [`${dropdownPrefixCls}-menu-without-submenu`]: !this.hasSubMenu(),
    });
    const menus = column.filterDropdown ? (
      <FilterDropdownMenuWrapper>{column.filterDropdown}</FilterDropdownMenuWrapper>
    ) : (
      <FilterDropdownMenuWrapper className={styles[`filter-dropdown`]}>
        <Menu
          multiple={multiple}
          onClick={this.handleMenuItemClick}
          prefixCls={`${dropdownPrefixCls}-menu`}
          className={dropdownMenuClass}
          onSelect={this.setSelectedKeys}
          onDeselect={this.setSelectedKeys}
          selectedKeys={this.state.selectedKeys}
          getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode}
        >
          {this.renderMenus(column.filters!)}
        </Menu>
        <div className={styles[`filter-dropdown-btns`]}>
          <a
            className={styles[`filter-dropdown-link`] + ' ' + styles['confirm']}
            onClick={this.handleConfirm}
          >
            {locale.filterConfirm}
          </a>
          <a
            className={styles[`filter-dropdown-link`] + ' ' + styles['clear']}
            onClick={this.handleClearFilters}
          >
            {locale.filterReset}
          </a>
        </div>
      </FilterDropdownMenuWrapper>
    );

    return (
      <Dropdown
        trigger={['click']}
        overlay={menus}
        visible={this.neverShown ? false : this.state.visible}
        onVisibleChange={this.onVisibleChange}
        getPopupContainer={getPopupContainer}
        // forceRender TODO: вернуть когда обновтися Dropdown из нового antd@3.3.0
      >
        {this.renderFilterIcon()}
      </Dropdown>
    );
  }
}