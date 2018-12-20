Example:
```jsx
const StoreDecorator = require('./examples/StoreDecorator').default;

<StoreDecorator/>  
```
```jsx static
import * as React from "react";
import {store, observer} from "@latoken-component/utils";

import GlobalsStore from 'stores/GlobalsStore';
import WalletStore from 'stores/WalletStore';

// ВАЖНО используется observer из utils, а не из mobx-react
@observer 
class MyComponents extends React.Comment {
  // способ 1: имя свойства сотвецтвует имени store
  @store global: GlobalsStore; 
  // способ 2: имя store передается параметрои и сохроняется в свойства
  @store('wallet') walletStore: WalletStore; 
  
  componentWillMount() {
    this.walletStore.fetchCurrency();
  }
  
  render() {
    return <ul>
        {
          this.walletStore.currency.map(currency=>{
            const currencyInfo = this.global.getCurrencyByCurrId(item.id)
            return <li key={item.id}>
              {currencyInfo.fullName} ({currencyInfo.shortName})
            </li>
          })    
        }
    </ul>
  }  
}
```
