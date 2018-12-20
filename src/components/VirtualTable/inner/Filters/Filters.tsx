import Icon from 'components/Icon/Icon';
import { Checkbox, Dropdown, Menu } from 'antd';
import cn from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { IFilterItem } from '../../interfaces';
import styles from './Filters.styl';

interface IFiltersProps {
  className?: string;
  filters: IFilterItem[];

  handlePick(value: string[]): void;
  handleReset(value: string[]): void;
}

@observer
class Filters extends Component<IFiltersProps> {
  @observable visible = false;
  @observable pickedFilters: string[] = [];
  @observable isActive = false;

  handleVisibleChange = isVisible => {
    this.visible = isVisible;
  };

  handleFilterChange: React.ChangeEventHandler<HTMLInputElement> = ev => {
    const { checked, value } = ev.target;

    return checked
      ? this.pickedFilters.push(value)
      : (this.pickedFilters = this.pickedFilters.filter(val => val !== value));
  };

  handleReset = () => {
    this.visible = false;
    this.isActive = false;
    this.pickedFilters = [];
    this.props.handleReset(this.pickedFilters);
  };

  handleSuccess = () => {
    this.visible = false;
    this.isActive = true;
    this.props.handlePick(this.pickedFilters);
  };

  render() {
    return (
      <div className={cn([styles.filters, this.props.className])}>
        <Dropdown
          visible={this.visible}
          onVisibleChange={this.handleVisibleChange}
          overlay={
            <Menu mode="vertical">
              {this.props.filters.map((filter, index) => (
                <Menu.Item key={index}>
                  <Checkbox onChange={this.handleFilterChange} value={filter.value}>
                    {filter.label}
                  </Checkbox>
                </Menu.Item>
              ))}
              <Menu.Divider />
              <footer className={styles.menuFooter}>
                <div className={styles.filterAction} onClick={this.handleSuccess}>
                  OK
                </div>
                <div className={styles.filterAction} onClick={this.handleReset}>
                  Reset
                </div>
              </footer>
            </Menu>
          }
          trigger={['click']}
        >
          <a className="ant-dropdown-link" href="#">
            {this.isActive && <Icon glyph="filter" className={styles.icon} />}

            {!this.isActive && (
              <Icon glyph="filter-o" className={cn([styles.icon, styles.iconDisabled])} />
            )}
          </a>
        </Dropdown>
      </div>
    );
  }
}

export default Filters;
