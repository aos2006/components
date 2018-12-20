import Icon from '@latoken-component/Icon';
import JSONLocalStorage from '@latoken-component/Utils/utils/JSONLocalStorage';
import { autobind } from 'core-decorators';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import reStore from './reStore';

interface IMediaQueryDebuggerProps {}

@observer
export default class MediaQueryDebugger extends React.Component<IMediaQueryDebuggerProps> {
  @observable visible = false;

  componentDidMount(): void {
    this.visible = JSONLocalStorage.get('MediaQueryDebugger');
    window._MediaQueryDebuggerToggle = this.toggle;
  }

  @autobind
  show() {
    this.visible = true;
    JSONLocalStorage.set('MediaQueryDebugger', true);
  }

  @autobind
  hide() {
    this.visible = false;
    JSONLocalStorage.set('MediaQueryDebugger', false);
  }

  @autobind
  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  render() {
    if (!this.visible) {
      return null;
    }
    return (
      <div
        className={'MediaQueryDebugger'}
        style={{
          position: 'fixed',
          bottom: '0px',
          right: '0px',
          padding: '5px 10px',
          backgroundColor: 'rgba(255, 255, 255, 0.77)',
          borderRadius: '10px 0 0 0',
          border: '1px solid #e8e8e8',
        }}
      >
        <table style={{ textAlign: 'center' }}>
          <tbody>
            <tr key={'head'}>
              <th key={'name'} />
              <th key={'size'}>Size{'  '}</th>
              <th key={'more'}>More{'  '}</th>
              <th key={'less'}>Less{'  '}</th>
              <th key={'only'}>Only</th>
            </tr>
            {reStore.responsiveArray.map(item => (
              <tr key={item}>
                <td style={{ textAlign: 'right' }} key={'name'}>
                  {item}
                </td>
                <td key={'size'}>{reStore.getSize(item)}px</td>
                <td key={'more'}>
                  {reStore[item] ? (
                    <Icon glyph={'plus-circle'} />
                  ) : (
                    <Icon style={{ color: 'red' }} glyph={'times-circle'} />
                  )}
                </td>
                <td key={'less'}>
                  {reStore[item + '_less'] ? (
                    <Icon glyph={'plus-circle'} />
                  ) : (
                    <Icon style={{ color: 'red' }} glyph={'times-circle'} />
                  )}
                </td>
                <td key={'only'}>
                  {reStore[item + '_only'] ? (
                    <Icon glyph={'plus-circle'} />
                  ) : (
                    <Icon style={{ color: 'red' }} glyph={'times-circle'} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
