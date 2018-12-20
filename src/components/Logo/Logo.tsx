import * as React from 'react';
import { Link } from 'react-router-dom';
import * as _ from 'lodash';
import styles from './styles.styl';

interface IWrapProps {
  href?: string;
  to?: string;
  style?: React.CSSProperties;
  children: any;
}

class Wrap extends React.PureComponent<IWrapProps> {
  render() {
    const { children, href, to, style } = this.props;

    if (_.isString(href)) {
      return (
        <a href={href} className={styles.wrap} style={style}>
          {children}
        </a>
      );
    }
    if (_.isString(to)) {
      return (
        <Link to={to} className={styles.wrap} style={style}>
          {children}
        </Link>
      );
    }

    return (
      <div className={styles.wrap} style={style}>
        {children}
      </div>
    );
  }
}

interface ILogoProps {
  /** Делает лого квадратным */
  square?: boolean;
  /** Белая тема */
  white?: boolean;
  width?: number;
  height?: number;
  /** Нативная ссылка  */
  href?: string;
  /** Сылка через react-routes */
  to?: string;
  className?: string;
  style?: React.CSSProperties;
  styleSvg?: React.CSSProperties;
}
/**
 * Logo.
 */
export default class Logo extends React.PureComponent<ILogoProps> {
  static defaultProps = {
    square: false,
    white: false,
    style: {},
    styleSvg: {},
  };

  static colors = {
    default: '#161F37',
    white: '#fff',
  };

  render() {
    const { square, white, width, height, href, to, style, styleSvg, className } = this.props;

    return (
      <Wrap href={href} to={to} style={Object.assign({ width, height }, style)}>
        <svg
          className={`${styles.svg} ${className || ''}`}
          viewBox={`0 0 ${square ? 111.5 : 467.7} 111.5`}
          width={square ? 111.5 : 467.7}
          height={111.5}
          style={Object.assign(
            {
              fill: white ? Logo.colors.white : Logo.colors.default,
            },
            styleSvg
          )}
        >
          <path d="M130.8,28.9h11.2v43.8h26.7v9.6h-37.8V28.9z" />
          <path
            d="M190.6,28.9h12.6l18.9,53.4H210l-3.5-11h-19.7l-3.6,11h-11.7L190.6,28.9z M189.9,62.1h13.7l-6.7-21
				L189.9,62.1z"
          />
          <path d="M261.5,28.9v9.5h-16v44h-11.2v-44h-16.1v-9.5H261.5z" />
          <path
            d="M307.1,77.6c-4,4.2-9.9,6.2-17.5,6.2c-7.6,0-13.5-2.1-17.5-6.2c-5.4-5.1-8.1-12.4-8.1-22
				c0-9.8,2.7-17.1,8.1-22c4-4.2,9.9-6.2,17.5-6.2c7.6,0,13.5,2.1,17.5,6.2c5.4,4.9,8.1,12.2,8.1,22
				C315.2,65.1,312.5,72.5,307.1,77.6z M300.2,69.5c2.6-3.3,3.9-7.9,3.9-13.9c0-6-1.3-10.6-3.9-13.9c-2.6-3.3-6.1-4.9-10.5-4.9
				c-4.4,0-7.9,1.6-10.6,4.9c-2.6,3.3-3.9,7.9-3.9,13.9s1.3,10.7,3.9,13.9c2.6,3.3,6.2,4.9,10.6,4.9
				C294.1,74.3,297.6,72.7,300.2,69.5z"
          />
          <path d="M323.2,28.9h11v22l20.6-22h14.4l-21.9,22l23,31.4H356L339.5,59l-5.4,5.5v17.9h-11V28.9z" />
          <path d="M415.4,38.4h-28.3v11.3H413V59h-25.9v13.7h29.6v9.6h-40.5V28.9h39.2V38.4z" />
          <path d="M424.4,28.9h11.7l21.2,37.2V28.9h10.4v53.4h-11.2l-21.7-37.9v37.9h-10.4V28.9z" />
          <polygon points="61.7,60.8 73,60.8 67.4,45.1" />
          <path
            d="M55.7,0C25,0,0,25,0,55.7c0,30.8,25,55.7,55.7,55.7s55.7-25,55.7-55.7C111.5,25,86.5,0,55.7,0z M80.6,82.1
			l-3.8-10.7H57.9l-3.8,10.7h-3.3h-8H31.4h-5.7h-5.6l18.9-52.7h11.3l-15.1,42h11.3l15.1-42l0,0h0H73h0l0,0L92,82.1H80.6z"
          />
        </svg>
      </Wrap>
    );
  }
}
