import React from 'react';
import Responsive from 'react-responsive';

const breakPoints = {
  mobileS: 375,
  mobile: 768,
  desktop: 1024,
};

const respProps = {
  mobileS: { maxWidth: breakPoints.mobileS - 1 },
  mobile: { maxWidth: breakPoints.mobile - 1 },
  exceptS: { minWidth: breakPoints.mobileS, maxWidth: breakPoints.mobile - 1 },
  default: { minWidth: breakPoints.mobile },
};

export const Mobile = _props => {
  const { size, ...props } = _props;

  switch (size) {
    case 'XS':
      return <Responsive {...respProps.mobileS} {...props} />;

    case 'S':
      return <FlexResponsive {...respProps.exceptS} {...props} />;

    default:
      return <Responsive {...respProps.mobile} {...props} />;
  }
};

export const Default = props => <Responsive {...respProps.default} {...props} />;

export const FlexResponsive = _props => {
  const { from, to, ...props } = _props;
  let finalProps = {};

  if (respProps[from]) {
    finalProps = { ...finalProps, ...respProps[from] };
  }

  if (respProps[to]) {
    finalProps = { ...finalProps, ...respProps[from] };
  }

  return <Responsive {...finalProps} {...props} />;
};

export default {
  breakPoints,
};
