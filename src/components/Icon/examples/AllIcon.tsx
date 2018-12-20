import * as React from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';
import { message } from 'antd';
import Icon from '../Icon';

interface IAllIconProps {}

const context = require.context('../icons', true, /\.svg$/);
const NAMES = [];

context.keys().forEach(svgPath => {
  const iconName = svgPath.replace('./', '').replace('.svg', '');
  NAMES.push(iconName);
});
export default class AllIcon extends React.Component<IAllIconProps> {
  render() {
    return (
      <div style={{ fontSize: 30, color: '#aaag' }}>
        {NAMES.map(name => {
          return (
            <CopyToClipboard
              key={name}
              text={`<Icon glyph={"${name}"}/>`}
              onCopy={() => message.success('Copy name ' + name)}
            >
              <Icon
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
                glyph={name}
                title={name}
              />
            </CopyToClipboard>
          );
        })}
      </div>
    );
  }
}
