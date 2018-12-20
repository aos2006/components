import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { constantColors } from '@latoken-component/utils';

export default class SVGGraph extends Component {
  static propTypes = {
    bottomPadding: PropTypes.number,
    data: PropTypes.array.isRequired,
    /** Массив массивов. Первый параметр - цвет, второй - прозрачность */
    gradientColors: PropTypes.arrayOf(PropTypes.array),
    graphClass: PropTypes.string,
    height: PropTypes.number,
    key: PropTypes.string,
    leftPadding: PropTypes.number,
    lineOfssetBottom: PropTypes.number,
    onClick: PropTypes.func,
    rightPadding: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    topPadding: PropTypes.number,
    width: PropTypes.number,
  };

  static defaultProps = {
    bottomPadding: -1,
    gradientColors: [[constantColors.blue1, '0.3'], [constantColors.blue1, '0.05']],
    graphClass: '',
    height: 80,
    key: null,
    leftPadding: -1,
    lineOfssetBottom: 20,
    onClick: null,
    rightPadding: -1,
    stroke: constantColors.blue1,
    strokeWidth: 1,
    topPadding: 0,
    width: 240,
  };

  render() {
    const {
      bottomPadding,
      data,
      gradientColors,
      graphClass,
      height,
      key,
      leftPadding,
      lineOfssetBottom,
      onClick,
      rightPadding,
      stroke,
      strokeWidth,
      topPadding,
      width,
    } = this.props;

    const graphWidth = width - leftPadding - rightPadding;
    const graphHeight = height - topPadding - bottomPadding;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const adder = min === 0 ? 0 : lineOfssetBottom;
    const lower = min === 0 ? 100 : 100 - lineOfssetBottom;

    const graphData = max === min ? [0.0005, 0.0005] : data;
    const total = graphData.length;

    let path = `M0,${graphHeight}L`;

    graphData.forEach((d, index) => {
      const value = Math.floor((d - min) / (max - min) * lower + adder - strokeWidth);
      let lineHeight = value / 100 * graphHeight;

      if (isNaN(lineHeight) || !Number.isFinite(lineHeight)) lineHeight = height / 2;

      const x = Math.floor(index * (graphWidth / (total - 1)));
      const y = Math.floor(graphHeight - lineHeight);

      path = `${path}${x},${y}L`;
    });

    path = `${path}${graphWidth},${graphHeight}Z`;

    const gradientNodeId = `lineargradient${key || Math.floor(Math.random() * 10000)}`;

    const gradient =
      gradientColors.length > 0 ? (
        <linearGradient id={gradientNodeId} x1="0" y1="0" x2="0" y2="1">
          {gradientColors.map(([color, opacity], i) => (
            <stop
              key={i}
              offset={`${100 * i / (gradientColors.length - 1)}%`}
              stopColor={color}
              stopOpacity={opacity || 1}
            />
          ))}
        </linearGradient>
      ) : null;

    const svgProps = { width, height };

    if (onClick) {
      svgProps.onClick = onClick;
    }

    const pathProps = { d: path, stroke, strokeWidth };

    if (graphClass) {
      pathProps.className = graphClass;
    }

    if (gradientColors.length > 0) {
      const userAgent = navigator.userAgent;
      const isSafari = !userAgent.match(/chrome/i) && Boolean(userAgent.match(/safari/i)); // Bug in safari LAT- 891

      pathProps.fill = isSafari ? '#cdeaef' : `url(#${gradientNodeId})`;
    }

    return (
      <svg {...svgProps}>
        {gradient}
        <g transform={`translate(${leftPadding},${topPadding})`}>
          <path {...pathProps} />
        </g>
      </svg>
    );
  }
}
