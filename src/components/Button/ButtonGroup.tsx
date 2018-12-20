// import * as React from 'react';
// import classNames from 'classnames';
// import {ButtonSize} from './index';
//
// export interface ButtonGroupProps {
//   size?: ButtonSize;
//   style?: React.CSSProperties;
//   className?: string;
// }
//
// const ButtonGroup: React.SFC<ButtonGroupProps> = (props) => {
//   const {size, className, ...others} = props;
//
//   // large => lg
//   // small => sm
//   let sizeCls = '';
//   switch (size) {
//     case 'large':
//       sizeCls = 'lg';
//       break;
//     case 'small':
//       sizeCls = 'sm';
//     default:
//       break;
//   }
//
//   const classes = classNames(sizeCls, className);
//
//   return <div {...others} className={classes}/>;
// };
//
// export default ButtonGroup;
