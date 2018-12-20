- ant: https://ant.design/components/tabs/ 
- github: https://github.com/ant-design/ant-design/blob/master/components/tabs 
- issue: https://github.com/ant-design/ant-design/issues?q=is%3Aopen+is%3Aissue+label%3A"Component%3A+Tabs"


Tabs make it easy to switch between different views.


## API

### Tabs

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| activeKey | Current TabPane's key | string | - |
| animated | Whether to change tabs with animation. Only works while `tabPosition="top"\|"bottom"` | boolean \| {inkBar:boolean, tabPane:boolean} | `true`, `false` when `type="card"` |
| defaultActiveKey | Initial active TabPane's key, if `activeKey` is not set. | string | - |
| hideAdd | Hide plus icon or not. Only works while `type="editable-card"` | boolean | `false` |
| size | preset tab bar size | `large` \| `default` \| `small` | `default` |
| tabBarExtraContent | Extra content in tab bar | React.ReactNode | - |
| tabBarGutter | The gap between tabs | number | - |
| tabBarStyle | Tab bar style object | object | - |
| tabPosition | Position of tabs | `top` \| `right` \| `bottom` \| `left` | `top` |
| type | Basic style of tabs | `line` \| `card` \| `editable-card` | `line` |
| onChange | Callback executed when active tab is changed | Function(activeKey) {} | - |
| onEdit | Callback executed when tab is added or removed. Only works while `type="editable-card"` | (targetKey, action): void | - |
| onNextClick | Callback executed when next button is clicked | Function | - |
| onPrevClick | Callback executed when prev button is clicked | Function | - |
| onTabClick | Callback executed when tab is clicked | Function | - |

### Tabs.TabPane

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| forceRender | Forced render of content in tabs, not lazy render after clicking on tabs | boolean | false |
| key | TabPane's key | string | - |
| tab | Show text in TabPane's head | string\|ReactNode | - |


```jsx harmony
const Default = require('./examples').default;
const Disabled = require('./examples').Disabled;
const TabWithIcon = require('./examples').TabWithIcon;
const SlidingTabsDemo = require('./examples').SlidingTabsDemo;
const TabBarExtra = require('./examples').TabBarExtra;
const TabSize = require('./examples').TabSize;
const TabPosition = require('./examples').TabPosition;
const TabEdit = require('./examples').TabEdit;
const TabEditExternal = require('./examples').TabEditExternal;

<div >
  <Default/>  
  <hr/>
  <Disabled/>
  <hr/>
  <TabWithIcon/>
  <hr/>
  <SlidingTabsDemo/>
  <hr/>
  <TabBarExtra/>
  <hr/>
  <TabSize/>
  <hr/>
  <TabPosition/>
  <hr/>
  <TabEdit/>
  <hr/>
  <TabEditExternal/>
</div>
```
