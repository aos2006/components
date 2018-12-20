import Icon from '@latoken-component/icon';
import { observer } from 'mobx-react';
import * as React from 'react';
import reStore from '../reStore';

interface IReStoreTesterProps {}

@observer
export default class ReStoreTester extends React.Component<IReStoreTesterProps> {
  render() {
    return (
      <div>
        <h3>reStore state:</h3>
        <div style={{ padding: 10, textAlign: 'center' }}>
          <table>
            <tr>
              <th>Size  </th>
              <th>More  </th>
              <th>Less  </th>
              <th>Only</th>
            </tr>
            {reStore.responsiveArray.map(item => (
              <tr>
                <td>{item}</td>
                <td>
                  {reStore[item] ? (
                    <Icon glyph={'plus-circle'} />
                  ) : (
                    <Icon style={{ color: 'red' }} glyph={'times-circle'} />
                  )}
                </td>
                <td>
                  {reStore[item + '_less'] ? (
                    <Icon glyph={'plus-circle'} />
                  ) : (
                    <Icon style={{ color: 'red' }} glyph={'times-circle'} />
                  )}
                </td>
                <td>
                  {reStore[item + '_only'] ? (
                    <Icon glyph={'plus-circle'} />
                  ) : (
                    <Icon style={{ color: 'red' }} glyph={'times-circle'} />
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
  }
}
