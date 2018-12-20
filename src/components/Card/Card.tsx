import Tabs, { TabsSize } from '@latoken-component/tabs';
import { throttleByAnimationFrameDecorator } from 'antd/lib/_util/throttleByAnimationFrame';
import warning from 'antd/lib/_util/warning';
import classNames from 'classnames';
import _ from 'lodash';
import * as React from 'react';
import styles from './style/index.styl';
import Grid from './Grid';
import Meta from './Meta';

export { CardGridProps } from './Grid';
export { CardMetaProps } from './Meta';

export type CardType = 'inner';

export interface CardTabListType {
  key: string;
  tab: React.ReactNode;
}

export interface CardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  loading?: boolean;
  noHovering?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
  id?: string;
  className?: string;
  type?: CardType;
  cover?: React.ReactNode;
  actions?: React.ReactNode[];
  tabList?: CardTabListType[];
  onTabChange?(key: string): void;
  activeTabKey?: string;
  defaultActiveTabKey?: string;
  tabSize?: TabsSize;
}

export default class Card extends React.Component<CardProps, {}> {
  static Grid: typeof Grid = Grid;
  static Meta: typeof Meta = Meta;
  resizeEvent: any;
  updateWiderPaddingCalled: boolean;
  state = {
    widerPadding: false,
  };
  onTabChange = (key: string) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };
  saveRef = (node: HTMLDivElement) => {
    this.container = node;
  };
  private container: HTMLDivElement;

  componentDidMount() {
    this.updateWiderPadding();

    window.addEventListener('resize', this.updateWiderPadding);

    if ('noHovering' in this.props) {
      warning(
        !this.props.noHovering,
        '`noHovering` of Card is deperated, you can remove it safely or use `hoverable` instead.'
      );
      warning(
        !!this.props.noHovering,
        '`noHovering={false}` of Card is deperated, use `hoverable` instead.'
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWiderPadding);

    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    (this.updateWiderPadding as any).cancel();
  }

  @throttleByAnimationFrameDecorator()
  updateWiderPadding() {
    if (!this.container) {
      return;
    }
    // 936 is a magic card width pixer number indicated by designer
    const WIDTH_BOUDARY_PX = 936;
    if (this.container.offsetWidth >= WIDTH_BOUDARY_PX && !this.state.widerPadding) {
      this.setState({ widerPadding: true }, () => {
        this.updateWiderPaddingCalled = true; // first render without css transition
      });
    }
    if (this.container.offsetWidth < WIDTH_BOUDARY_PX && this.state.widerPadding) {
      this.setState({ widerPadding: false }, () => {
        this.updateWiderPaddingCalled = true; // first render without css transition
      });
    }
  }

  isContainGrid() {
    let containGrid;
    React.Children.forEach(this.props.children, (element: JSX.Element) => {
      if (element && element.type && element.type === Grid) {
        containGrid = true;
      }
    });
    return containGrid;
  }

  getAction(actions: React.ReactNode[]) {
    if (!actions || !actions.length) {
      return null;
    }
    const actionList = actions.map((action, index) => (
      <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
        <span>{action}</span>
      </li>
    ));
    return actionList;
  }

  // For 2.x compatible
  getCompatibleHoverable() {
    const { noHovering, hoverable } = this.props;
    if ('noHovering' in this.props) {
      return !noHovering || hoverable;
    }
    return !!hoverable;
  }

  render() {
    const {
      className,
      extra,
      bodyStyle,
      noHovering,
      hoverable,
      title,
      loading,
      bordered = true,
      type,
      cover,
      actions,
      tabList,
      children,
      activeTabKey,
      defaultActiveTabKey,
      tabSize,
      ...others
    } = this.props;

    const classString = classNames('lat-card', styles.card, className, {
      [styles[`card-loading`]]: loading,
      [styles[`card-bordered`]]: bordered,
      [styles[`card-hoverable`]]: this.getCompatibleHoverable(),
      [styles[`card-wider-padding`]]: this.state.widerPadding,
      [styles[`card-padding-transition`]]: this.updateWiderPaddingCalled,
      [styles[`card-contain-grid`]]: this.isContainGrid(),
      [styles[`card-contain-tabs`]]: tabList && tabList.length,
      [styles[`card-type-${type}`]]: !!type,
    });

    const loadingBlock = (
      <div className={styles[`card-loading-content`]}>
        <p className={styles[`card-loading-block`]} style={{ width: '94%' }} />
        <p>
          <span className={styles[`card-loading-block`]} style={{ width: '28%' }} />
          <span className={styles[`card-loading-block`]} style={{ width: '62%' }} />
        </p>
        <p>
          <span className={styles[`card-loading-block`]} style={{ width: '22%' }} />
          <span className={styles[`card-loading-block`]} style={{ width: '66%' }} />
        </p>
        <p>
          <span className={styles[`card-loading-block`]} style={{ width: '56%' }} />
          <span className={styles[`card-loading-block`]} style={{ width: '39%' }} />
        </p>
        <p>
          <span className={styles[`card-loading-block`]} style={{ width: '21%' }} />
          <span className={styles[`card-loading-block`]} style={{ width: '15%' }} />
          <span className={styles[`card-loading-block`]} style={{ width: '40%' }} />
        </p>
      </div>
    );

    const hasActiveTabKey = activeTabKey !== undefined;
    const extraProps = {
      [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
        ? activeTabKey
        : defaultActiveTabKey,
    };

    let head;
    const tabs =
      tabList && tabList.length ? (
        <Tabs
          {...extraProps}
          className={styles[`card-head-tabs`]}
          size={tabSize || 'large'}
          onChange={this.onTabChange}
        >
          {tabList.map(item => <Tabs.TabPane tab={item.tab} key={item.key} />)}
        </Tabs>
      ) : null;
    if (title || extra || tabs) {
      head = (
        <div className={styles[`card-head`]}>
          <div className={styles[`card-head-wrapper`]}>
            {title && <div className={styles[`card-head-title`]}>{title}</div>}
            {extra && <div className={styles[`card-extra`]}>{extra}</div>}
          </div>
          {tabs}
        </div>
      );
    }
    const coverDom = cover ? <div className={styles[`card-cover`]}>{cover}</div> : null;
    const body = (
      <div className={styles[`card-body`]} style={bodyStyle}>
        {loading ? loadingBlock : children}
      </div>
    );
    const actionDom =
      actions && actions.length ? (
        <ul className={styles[`card-actions`]}>{this.getAction(actions)}</ul>
      ) : null;
    const divProps = _.omit(others, ['onTabChange']);
    return (
      <div {...divProps} className={classString} ref={this.saveRef}>
        {head}
        {coverDom}
        {body}
        {actionDom}
      </div>
    );
  }
}
