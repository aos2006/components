import React from 'react';
import uuid from 'uuid/v1';
import { IColumn } from '../interfaces';
import TableStore, { IProxy } from 'components/VirtualTable/models/GridStore';
import VirtualTable from 'components/VirtualTable/VirtualTable';
import { listFiller } from 'components/VirtualTable/examples/utils/utils';
import styles from './Layout.styl';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text } from '@storybook/addon-knobs';
import { observable } from 'mobx';

interface IData {
  coin: string;
  time: string;
  price: string;
  address: string;
}

const list: IData[] = listFiller(
  [
    { coin: 'ETH', time: '10.12.12', price: '10.9', address: 'askldjfaksdjfksjdkjkjasdfjaksdjf' },
    { coin: 'BTC', time: '10.11.11', price: '10.8', address: 'askldjfaksdjfksjdkjkjasdfjaksdjf' },
    { coin: 'EOS', time: '10.10.10', price: '10.7', address: 'askldjfaksdjfksjdkjkjasdfjaksdjf' },
    { coin: 'XMR', time: '10.22.22', price: '10.6', address: 'askldjfaksdjfksjdkjkjasdfjaksdjf' },
  ],
  50
);

class Proxy implements IProxy<IData> {
  subscribers = [];

  onDataChange(fn) {
    this.subscribers.push(fn);
  }

  fetch(data) {
    setTimeout(() => this.subscribers.forEach(fn => fn('dimoh')), 2000);
  }
}

const p = new Proxy();

const oneGridStore = new TableStore();
const twoGridStore = new TableStore(p, { mode: 'server' });

oneGridStore.set(list);
twoGridStore.set(list);

const columns: Array<IColumn> = [
  {
    id: uuid(),
    disableSort: false,
    dataKey: 'coin',
    width: 100,
    // width: '25%',
    label: 'Coin',
    filters: [
      {
        label: 'BTC',
        value: 'BTC',
      },
      {
        label: 'ETH',
        value: 'ETH',
      },
      {
        label: 'XMR',
        value: 'XMR',
      },
    ],
    getComponent: data => <span>{data.coin}</span>,
  },
  {
    id: uuid(),
    disableSort: false,
    dataKey: 'time',
    // width: '25%',
    label: 'Time',
    getComponent: data => <span>{data.time}</span>,
  },
  {
    id: uuid(),
    disableSort: false,
    dataKey: 'price',
    // width: '25%',
    label: 'Price',
    getComponent: data => <span>{data.price}</span>,
  },
  {
    id: uuid(),
    dataKey: 'address',
    disableSort: true,
    width: 300,
    // width: '25%',
    label: 'Adddress',
    getComponent: data => <span>{data.address}</span>,
  },
];

class Test extends React.Component {
  render() {
    try {
      return (
        <VirtualTable
          columns={columns}
          onRowRender={() => {}}
          list={[]}
          staticHeight={300}
          list={[1, 2, 3]}
        />
      );
    } catch (e) {
      console.log(e);
    }
  }
}
storiesOf('VirtualTable', module).add('Base', () => {
  return <Test />;
});

// @observer
// export default class TableSizes extends PureComponent {
//     render() {
//         return (
//             <div>
//                 <h1 className={styles.title}>Examples:</h1>
//                 <h2 className={styles.subtitle}>Static Height</h2>
//                 <VirtualTable
//                     onFiltersPick={twoGridStore.setFilters}
//                     columns={columns.map(item => ({
//                         ...item,
//                         disableSort: true,
//                     }))}
//                     type="medium"
//                     list={list}
//                     staticHeight={300}
//                 />
//                 <h2 className={styles.subtitle}>Small Type</h2>
//                 <VirtualTable
//                     staticHeight={300}
//                     columns={columns.map(item => ({
//                         ...item,
//                         disableSort: true,
//                     }))}
//                     type="small"
//                     list={list}
//                 />
//                 <h2 className={styles.subtitle}>Medium Type</h2>
//                 <VirtualTable
//                     staticHeight={300}
//                     columns={columns.map(item => ({
//                         ...item,
//                         disableSort: true,
//                     }))}
//                     type="medium"
//                     list={list}
//                 />
//                 <h2 className={styles.subtitle}>Sorting Example</h2>
//                 <VirtualTable
//                     staticHeight={300}
//                     columns={columns}
//                     type="medium"
//                     list={oneGridStore.list}
//                     sort={oneGridStore.sort}
//                     sortDirection={oneGridStore.sortDirection}
//                     sortBy={oneGridStore.sortBy}
//                 />
//                 <h2 className={styles.subtitle}>Search Example</h2>
//                 <Input
//                     className={styles.input}
//                     onChange={ev => twoGridStore.search(ev.target.value)}
//                     value={twoGridStore.searchQuery}
//                     placeholder="Введите текст"
//                 />
//                 <VirtualTable
//                     staticHeight={300}
//                     columns={columns}
//                     type="medium"
//                     list={twoGridStore.list}
//                     sort={twoGridStore.sort}
//                     sortDirection={twoGridStore.sortDirection}
//                     sortBy={twoGridStore.sortBy}
//                 />
//
//                 <h2 className={styles.subtitle}>Align Examples</h2>
//                 <h3>Only Right</h3>
//                 <VirtualTable
//                     staticHeight={300}
//                     columns={columns.map(item => ({ ...item, align: 'right' }))}
//                     type="medium"
//                     list={list}
//                 />
//
//                 <h3>Only Center</h3>
//                 <VirtualTable
//                     staticHeight={300}
//                     columns={columns.map(item => ({ ...item, align: 'center' }))}
//                     type="medium"
//                     list={list}
//                 />
//                 <h2 className={styles.subtitle}>Striped</h2>
//                 <VirtualTable staticHeight={300} striped list={list} columns={columns} type="small" />
//
//                 <h2 className={styles.subtitle}>No Ddata</h2>
//                 <VirtualTable staticHeight={300} striped list={[]} columns={columns} type="small" />
//                 <h2 className={styles.subtitle}>Auto column width</h2>
//                 <VirtualTable staticHeight={300} striped list={list} columns={columns} type="small" />
//                 <h2 className={styles.subtitle}>Pagination Example</h2>
//                 <VirtualTable
//                     staticHeight={300}
//                     striped
//                     list={twoGridStore.list}
//                     columns={columns}
//                     type="small"
//                 >
//                     {({ sortBy, sortDirection }) => (
//                         <Pagination
//                             pageCount={twoGridStore.queryParams.page}
//                             align="right"
//                             pageRangeDisplayed={5}
//                             marginPagesDisplayed={5}
//                             paginationClassName={styles.pagination}
//                             onPageChange={twoGridStore.pageChange}
//                         />
//                     )}
//                 </VirtualTable>
//             </div>
//         );
//     }
// }
