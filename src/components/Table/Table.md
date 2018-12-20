- ant: https://ant.design/components/table/ 
- github:https://github.com/ant-design/ant-design/edit/master/components/table 
- issue: https://github.com/ant-design/ant-design/labels/Component%3A%20Table

## Table props

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| expandHide | Hides cells with icons expand | boolean | `false` |
| striped | Add zebra-striping to any table row  | boolean | `false` |

## Column props

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| align | Align cel in table | `'left' , 'right' , 'center'` | `null` | 
| help | Add icon (?) in header with  tooltip | `React.ReactNode`  | `null` | 


```jsx harmony 
const observable = require('mobx').observable;
const toJS = require('mobx').toJS;
const GlobalSettings = require('./examples/GlobalSettings').default;
const DefaultSettings = require('./examples/GlobalSettings').DefaultSettings;
const DynamicSettings = require('./examples/DynamicSettings').default;
const CustomSelection = require('./examples/CustomSelection').default;
const FilterAndSorter = require('./examples/FilterAndSorter').default;
const TreeData = require('./examples/TreeData').default;
const FixedColumnsAndHeader = require('./examples/FixedColumnsAndHeader').default;
console.log(DefaultSettings);
const settings = observable(DefaultSettings);
 
<div>
  <h3>Global settings</h3>
  <GlobalSettings store={settings}/>
  <h3>Dynamic settings</h3>
  <DynamicSettings store={settings}/> 
  <hr/>
  <h3>Custom selection</h3>
  <CustomSelection store={settings}/> 
  <hr/>
  <h3>Filter and sorter</h3>
  <FilterAndSorter store={settings}/> 
  <hr/>
  <h3>Tree Data</h3>
  <TreeData  store={settings}/> 
  <hr/>
  <h3>Fixed Columns and Header</h3>
  <FixedColumnsAndHeader store={settings}/> 
</div>
```
