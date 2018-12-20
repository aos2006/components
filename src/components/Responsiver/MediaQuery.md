
xs: 320,
sm: 576,
md: 768,
lg: 992,
xl: 1200,
xxl: 1600,

```js
<div>
  <h3>Default:</h3>
  <div style={{padding:10}}>
    <MediaQuery form={"xs"} >xs {' '}</MediaQuery>
    <MediaQuery form={"sm"} >sm {' '}</MediaQuery>
    <MediaQuery form={"md"} >md {' '}</MediaQuery>
    <MediaQuery form={"lg"} >lg {' '}</MediaQuery>
    <MediaQuery form={"xl"} >xl {' '}</MediaQuery>
    <MediaQuery form={"xxl"} >xxl {' '}</MediaQuery>
  </div>
  
  <h3>Less:</h3>
  <div style={{padding:10}}>
    <MediaQuery form={"xs"}  to={'less'}>xs-less {' '}</MediaQuery>
    <MediaQuery form={"sm"}  to={'less'}>sm-less {' '}</MediaQuery> 
    <MediaQuery form={"md"}  to={'less'}>md-less {' '}</MediaQuery> 
    <MediaQuery form={"lg"}  to={'less'}>lg-less {' '}</MediaQuery> 
    <MediaQuery form={"xl"}  to={'less'}>xl-less {' '}</MediaQuery> 
    <MediaQuery form={"xxl"} to={'less'}>xxl-less {' '}</MediaQuery>
  </div>
  
  <h3>Only:</h3>
  <div style={{padding:10}}>
    <MediaQuery form={"xs"}  to={"only"}>xs-only {' '}</MediaQuery>
    <MediaQuery form={"sm"}  to={"only"}>sm-only {' '}</MediaQuery>
    <MediaQuery form={"md"}  to={"only"}>md-only {' '}</MediaQuery>
    <MediaQuery form={"lg"}  to={"only"}>lg-only {' '}</MediaQuery>
    <MediaQuery form={"xl"}  to={"only"}>xl-only {' '}</MediaQuery>
    <MediaQuery form={"xxl"} to={"only"}>xxl-only {' '}</MediaQuery>
  </div>
  <h3>From to:</h3>
  <div style={{padding:10}}>
    <MediaQuery form={"xs"} to={"sm"}>from xs to sm {' '}</MediaQuery>
    <MediaQuery form={"sm"} to={"md"}>from sm to md {' '}</MediaQuery>
    <MediaQuery form={"md"} to={"lg"}>from md to lg {' '}</MediaQuery>
    <MediaQuery form={"lg"} to={"xl"}>from lg to xl {' '}</MediaQuery>
    <MediaQuery form={"xl"} to={"xxl"}>from xl to xxl {' '}</MediaQuery>
  </div>
</div>
```
