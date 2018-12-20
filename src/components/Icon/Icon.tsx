import React, { PureComponent } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.styl';

const context = require.context('./icons', true, /\.svg$/);
const GLYPHS = {};

context.keys().forEach(svgPath => {
  const iconName = svgPath.replace('./', '').replace('.svg', '');
  GLYPHS[iconName] = context(svgPath);
});

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  glyph: string;
  spin?: boolean;
}

export default class Icon extends PureComponent<IconProps, {}> {
  static propTypes = {
    glyph: PropTypes.string.isRequired,
    className: PropTypes.string,
    spin: PropTypes.bool,
  };

  render() {
    const { glyph, className, spin, ...props } = this.props;
    return (
      <div
        {...props}
        dangerouslySetInnerHTML={{ __html: GLYPHS[glyph] }}
        className={cn(
          'lat-icon',
          styles.icon,
          className,
          (glyph === 'loading' || spin) && styles.spin
        )}
      />
    );
  }
}
