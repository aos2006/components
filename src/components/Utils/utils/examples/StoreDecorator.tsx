import React from 'react';
import GlobalsStore from '../../../../stores/GlobalsStore';
import ZIdentityStore from '../../../../stores/ZIdentityStore';
import { observer, store } from '../store-decorator';

// ВАЖНО используется observer из utils, а не из mobx-react
@observer
export default class StoreDecorator extends React.Component {
  // способ 1: имя свойства сотвецтвует имени store
  @store globals: GlobalsStore;
  // способ 2: имя store передается параметрои и сохроняется в свойства
  @store('identity') identityStore: ZIdentityStore;

  render() {
    return (
      <div>
        this.globals.authTab => {this.globals.authTab} <br />
        this.identityStore.language => {this.identityStore.language} <br />
      </div>
    );
  }
}
