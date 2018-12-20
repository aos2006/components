import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import Icon from '@latoken-component/icon';
import { Circle } from 'rc-progress';
import classNames from 'classnames';

const statusColorMap = {
  normal: '#108ee9',
  exception: '#ff5500',
  success: '#87d068',
};

export default class Progress extends Component {
  render() {
    const props = this.props;
    const {
      prefixCls,
      className,
      percent = 0,
      status,
      format,
      trailColor,
      size,
      type,
      strokeWidth,
      width,
      showInfo,
      gapDegree = 0,
      gapPosition,
      ...restProps
    } = props;
    const progressStatus =
      parseInt(percent.toString(), 10) >= 100 && !('status' in props)
        ? 'success'
        : status || 'normal';
    let progressInfo;
    let progress;
    const textFormatter = format || (percentNumber => `${percentNumber}%`);

    if (showInfo) {
      let text;
      const iconType = type === 'circle' || type === 'dashboard' ? '' : '-circle';

      if (progressStatus === 'exception') {
        text = format ? textFormatter(percent) : createElement(Icon, { type: `cross${iconType}` });
      } else if (progressStatus === 'success') {
        text = format ? textFormatter(percent) : createElement(Icon, { type: `check${iconType}` });
      } else {
        text = textFormatter(percent);
      }
      progressInfo = createElement('span', { className: `${prefixCls}-text` }, text);
    }
    if (type === 'line') {
      const percentStyle = {
        width: `${percent}%`,
        height: strokeWidth || (size === 'small' ? 6 : 8),
      };

      progress = createElement(
        'div',
        null,
        createElement(
          'div',
          { className: `${prefixCls}-outer` },
          createElement(
            'div',
            { className: `${prefixCls}-inner` },
            createElement('div', { className: `${prefixCls}-bg`, style: percentStyle })
          )
        ),
        progressInfo
      );
    } else if (type === 'circle' || type === 'dashboard') {
      const circleSize = width || 120;
      const circleStyle = {
        width: circleSize,
        height: circleSize,
        fontSize: circleSize * 0.15 + 6,
      };
      const circleWidth = strokeWidth || 6;
      const gapPos = gapPosition || (type === 'dashboard' && 'bottom') || 'top';
      const gapDeg = gapDegree || (type === 'dashboard' && 75);

      progress = createElement(
        'div',
        { className: `${prefixCls}-inner`, style: circleStyle },
        createElement(Circle, {
          percent,
          strokeWidth: circleWidth,
          trailWidth: circleWidth,
          strokeColor: statusColorMap[progressStatus],
          trailColor,
          prefixCls,
          gapDegree: gapDeg,
          gapPosition: gapPos,
        }),
        progressInfo
      );
    }
    const classString = classNames(
      prefixCls,
      {
        [`${prefixCls}-${(type === 'dashboard' && 'circle') || type}`]: true,
        [`${prefixCls}-status-${progressStatus}`]: true,
        [`${prefixCls}-show-info`]: showInfo,
        [`${prefixCls}-${size}`]: size,
      },
      className
    );

    return createElement('div', Object.assign({}, restProps, { className: classString }), progress);
  }
}

Progress.defaultProps = {
  type: 'line',
  percent: 0,
  showInfo: true,
  trailColor: '#f3f3f3',
  prefixCls: 'ant-progress',
  size: 'default',
};

Progress.propTypes = {
  status: PropTypes.oneOf(['normal', 'exception', 'active', 'success']),
  type: PropTypes.oneOf(['line', 'circle', 'dashboard']),
  showInfo: PropTypes.bool,
  percent: PropTypes.number,
  width: PropTypes.number,
  strokeWidth: PropTypes.number,
  trailColor: PropTypes.string,
  format: PropTypes.func,
  gapDegree: PropTypes.number,
  default: PropTypes.oneOf(['default', 'small']),
};
