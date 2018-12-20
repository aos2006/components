import * as React from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '@latoken-component/icon';
import { Omit } from '@latoken-component/utils/types/antd/_util/type';
import { LocationDescriptor } from 'history';
import styles from './style/index.styl';
import { Link } from 'react-router-dom';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);

function isString(str: any) {
  return typeof str === 'string';
}

// Insert one space between two chinese characters automatically.
function insertSpace(child: React.ReactChild, needInserted: boolean): React.ReactChild | null {
  // Check the child if is undefined or null.
  if (child == null) {
    return null;
  }
  const SPACE = needInserted ? ' ' : '';
  // strictNullChecks oops.
  if (
    typeof child !== 'string' &&
    typeof child !== 'number' &&
    isString(child.type) &&
    isTwoCNChar(child.props.children)
  ) {
    return React.cloneElement(child, {}, child.props.children.split('').join(SPACE));
  }
  if (typeof child === 'string') {
    if (isTwoCNChar(child)) {
      child = child.split('').join(SPACE);
    }
    return <span>{child}</span>;
  }
  return child;
}

export type IButtonType = 'default' | 'primary' | 'ghost' | 'danger' | 'bay' | 'sale' | 'link';
export type IButtonShape = 'circle' | 'circle-outline';
export type IButtonSize = 'small' | 'default' | 'large' | 'big';
export type IButtonHtmlType = 'submit' | 'button' | 'reset';

export interface BaseButtonProps<T> extends Omit<React.HTMLProps<T>, 'ref' | 'size'> {
  type?: IButtonType;
  icon?: string;
  shape?: IButtonShape;
  size?: IButtonSize;
  loading?: boolean | { delay?: number };
  className?: string;
  active?: boolean;
  block?: boolean;
  htmlType?: IButtonHtmlType;
  to?: LocationDescriptor;
}

export interface NativeAProps extends BaseButtonProps<HTMLAnchorElement> {
  href: string;
}

export interface NativeButtonProps extends BaseButtonProps<HTMLButtonElement> {}

export interface NativeDivProps extends BaseButtonProps<HTMLDivElement> {}

export type ButtonProps =
  | NativeAProps
  | NativeButtonProps
  | { to: any } & NativeAProps
  | NativeDivProps;

interface IWrapProps {
  href?: string;
  string?: string;
  to?: LocationDescriptor;
  type?: string;
  children: React.ReactChildren;
}

class WrapButton extends React.PureComponent<IWrapProps> {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const { children, href, to, type, ...props } = this.props;

    if (_.isString(href)) {
      return (
        <a href={href} target={'_blank'} {...props}>
          {children}
        </a>
      );
    }
    if (!_.isNil(to) && this.context.router) {
      return (
        <Link to={to} {...props}>
          {children}
        </Link>
      );
    }
    if (_.isString(type)) {
      return (
        <button type={type} {...props}>
          {children}
        </button>
      );
    }
    return <div {...props}>{children}</div>;
  }
}

export default class Button extends React.Component<ButtonProps, any> {
  static __ANT_BUTTON = true;

  static defaultProps = {
    loading: false,
  };

  static propTypes = {
    type: PropTypes.oneOf(['default', 'primary', 'danger', 'ghost', 'bay', 'sale', 'link']),
    shape: PropTypes.oneOf(['circle', 'circle-outline']),
    size: PropTypes.oneOf(['big', 'large', 'default', 'small']),
    htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
    onClick: PropTypes.func,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
    icon: PropTypes.string,
    active: PropTypes.bool,
  };

  timeout: number;
  delayTimeout: number;

  constructor(props: ButtonProps) {
    super(props);
    this.state = {
      loading: props.loading,
      clicked: false,
      hasTwoCNChar: false,
    };
  }

  handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // Add click effect
    this.setState({ clicked: true });
    clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => this.setState({ clicked: false }), 500);

    const onClick = this.props.onClick as ((
      e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>
    ) => void);
    if (onClick) {
      onClick(e);
    }
  };

  componentDidMount() {
    this.fixTwoCNChar();
  }

  componentWillReceiveProps(nextProps: ButtonProps) {
    const currentLoading = this.props.loading;
    const loading = nextProps.loading;

    if (currentLoading) {
      clearTimeout(this.delayTimeout);
    }

    if (typeof loading !== 'boolean' && loading && loading.delay) {
      this.delayTimeout = window.setTimeout(() => this.setState({ loading }), loading.delay);
    } else {
      this.setState({ loading });
    }
  }

  componentDidUpdate() {
    this.fixTwoCNChar();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  }

  fixTwoCNChar() {
    // Fix for HOC usage like <FormatMessage />
    const node = findDOMNode(this) as HTMLElement;
    const buttonText = node.textContent || node.innerText;
    if (this.isNeedInserted() && isTwoCNChar(buttonText)) {
      if (!this.state.hasTwoCNChar) {
        this.setState({
          hasTwoCNChar: true,
        });
      }
    } else if (this.state.hasTwoCNChar) {
      this.setState({
        hasTwoCNChar: false,
      });
    }
  }

  isNeedInserted() {
    const { icon, children } = this.props;
    return React.Children.count(children) === 1 && !icon;
  }

  render() {
    const {
      type,
      shape,
      size,
      className,
      htmlType,
      children,
      icon,
      active,
      disabled,
      block,
      ...others
    } = this.props;

    const { loading, clicked, hasTwoCNChar } = this.state;

    // large => lg
    // small => sm
    let sizeCls = '';
    switch (size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
        break;
      case 'big':
        sizeCls = 'big';
        break;
      default:
        break;
    }

    const classes = classNames(
      className,
      'lat-btn',
      styles.btn,
      styles[`${type}`],
      styles[`${shape}`],
      styles[`${sizeCls}`],
      {
        [styles[`icon-only`]]: !children && icon,
        [styles[`loading`]]: loading,
        [styles[`clicked`]]: clicked,
        [styles[`block`]]: block,
        [styles[`two-chinese-chars`]]: hasTwoCNChar,
        [styles[`active`]]: active,
      }
    );

    const iconType = loading ? 'loading' : icon;
    const iconNode = iconType ? <Icon glyph={iconType} /> : null;
    const kids =
      children || children === 0
        ? React.Children.map(children, child => insertSpace(child, this.isNeedInserted()))
        : null;

    return (
      <WrapButton
        {..._.omit(others, ['loading']) as any}
        type={htmlType}
        className={classes}
        onClick={!disabled ? this.handleClick : null}
        disabled={disabled}
      >
        {iconNode}
        {kids}
        <span className={styles.fathom} />
      </WrapButton>
    );
  }
}
