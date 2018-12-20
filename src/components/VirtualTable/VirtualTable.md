VirtualTable
---------------
### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| tableClassName | String |  | Optional class для таблицы `GridStore` element. |
| rowClassName | String |  | Optional class для  `GridStore Row` element. |
| list | Array |  | Список данных |
| headerClassName | String |  | Optional class для  `GridStore Header Cell` element. |
| disableHeader | Boolean |  | Вкл/выкл шапку таблицы |
| headerHeight | Number | | Высота шапки таблицы |
| type | String oneOf(medium, small) | |  Устанавливает тип  размера таблицы
| staticHeight | Number |  | Устанавливает статическую высоту для таблицы По умолчание расчет высоты происходит по формуле (rowCount * rowHeight) < MAX_HEIGHT(default = 800px).
| onRowClick | Function |  | Callback при клике на строку таблицы `(Object): void` |
| rowHeight | Number |  | Высота строки таблицы. По умолчанию берется из существующих типов |
| sort | Function |  | Callback который вызывается при клике на ячейку в header(вызов происходит только, если у колонки есть параметр disableSort: false) `({ ISortDirection: string,  sortBy: string }): void` |
| sortBy | String |  | Наименование ключа по которому происходит сортировка  `dataKey` |
| ISortDirection | String ASC or DESC |  | Параметр указывающий тукущее направление сортировки |

### Параметр Columns: Array<IColumn>

#### Column Object
| Property | Description |
|:---|:---|
| width | Ширина колонки |
| id | Обязательный параметр - уникальный идентификатор(Можно использовать uui) |
| dataKey | Ключ для сортировки таблицы по значение |
| disableSort: Boolean | Отключение сортировки для ячейки |
| label | Используется для генерации названия шапки ячейки |
| align (default left) | Выравнивание ячейки по горизонтали доступные вариации center right |
| getComponent: `(Object): JSX.Element` | Принимает на вход один параметр в виде объекта данных из списка. Является Observer. |

### GridStore Store
#### Public actions

##### search() `Function(searchValue: String)`
Поиск по все таблице и всем ключам элемента списка.
##### reset()
Сброс состояния

##### restore()
Устанавливает значение списка равное изначальному

##### filter() `Function(Callback: boolean)`

##### sort() `Function({ sortBy, ISortDirection })`
Сортирует текущий спискок.

##### where() `Function(predicateFn: boolean, callback)`
Находит элементы в соответствии с предикатом и вызывает для каждого найденного элемента callback, передавая элемент

##### getByKey() `Function(key 'id', value)`
Возвращает элемент по ключу

#### Public observable values

##### searchValue
текущее значение поисквого запроса

##### sortBy
Текущее значение ключа сортировки.

##### ISortDirection
Текущее значение направление сортировки

### Examples
```javascript
const Layout = require('./examples/Layout').default;
<Layout />
```
