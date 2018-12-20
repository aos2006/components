#example use
`widget_inner.js`
```jsx static
import './styles/inner.styl';
import '../src/polyfills';

import React, { Component } from 'react';
import { render } from 'react-dom';

import Extender from './modules/Extender';
import { isFramed } from './modules/Constants';

class App extends Component {
  container = null;

  componentDidMount() {
    if (window.RPC_Client) {
      window.RPC_Client.sayToParent('resize', { height: `${this.container.offsetHeight}px` });
    }
  }

  render() {
    return <div ref={node => (this.container = node)}>Widget</div>;
  }
}

if (!isFramed) {
  render(<App />, document.getElementById('Widget_app'));
} else {
  new Extender()
    .setup({
      frameName: 'widget',
      parentNamespace: 'SuperWebsite',
    })

    // Методы, которые фрейм может вызывать во внешнем сайте
    .defineClientQuestions({
      frameInitiated: {},
      resize: {},
    })

    // Методы, которые внешний сайт вызывает во фрейме
    .defineClientAnswers({
      checkExistence(params) {
        window.RPC_Client.sayToParent('frameInitiated');

        return params;
      },
      startDrawing() {
        render(<App />, document.getElementById('Widget_app'));
      },
    })
    .P_init()
    .catch(error => console.error(error));
}
```

`widget_outer.js`
```jsx static
import Extender from './modules/Extender';

import { ready, isString, isElement, isFunction } from './modules/Constants';

const ext = new Extender();

function passEventToOuterWebsite(event, data) {
  if (isFunction(window.LATOKEN_WidgetCallback)) {
    window.LATOKEN_WidgetCallback(event, data);
  }
}

window.LATOKEN_WidgetOpen = ({ target, link }) => {
  if (isElement(target) && isString(link)) {
    ext.XDM_initServer({
      name: 'SuperWebsite',
      element: target,
      url: link,
      overflowY: 'hidden',
    });
  } else {
    console.error('LATOKEN_WidgetOpen: wrong parameters');
  }
};

ready(() =>
  ext
    .setup({
      frameName: 'SuperWebsite',
      waitingTimeout: 10000,
      totalFrames: 1,
    })

    // Методы, который с внешнего сайта мы можем вызывать во фрейме виджета
    .defineServerQuestions({
      checkExistence: {},
      startDrawing: {},
    })

    // Методы, которые фрейм может вызывать во внешнем сайте
    .defineServerAnswers({
      frameInitiated() {
        this.sayToClient('startDrawing');
      },
      resize({ width, height }) {
        passEventToOuterWebsite('resize', { width, height });
      },
    })

    // Инициализация
    .P_init()
    .then(extParams => {
      if (!extParams.initStatus) {
        return Promise.reject(new Error('XDM initialization failed'));
      }

      if (isFunction(window.LATOKEN_OnMethodsReady)) {
        window.LATOKEN_OnMethodsReady();
      }

      return Promise.resolve();
    })
    .catch(error => console.error(error))
);
```


`widget_sample.html`
```jsx static
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title>LATOKEN</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="viewport" content="width=device-width, height=device-height, user-scalable=no, initial-scale=1, maximum-scale=1">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-TileColor" content="#161f37">
  <meta name="theme-color" content="#ffffff">
</head>
<body>
<style>
  html, body {
    padding: 0;
    margin: 0;
  }
</style>
<div>
  <h1>Super Website</h1>
  <div id="Widget_Container" style="width: 300px; height: 300px; position: absolute; left: 50%; margin-left: -150px; top: 100px; border: 1px solid red; transition: all .6s"></div>
</div>
<script>
  const targetDiv = document.getElementById('Widget_Container');

  window.LATOKEN_OnMethodsReady = function() {
    console.log('SuperWebsite: included script told it\'s methods are ready');
    console.log('SuperWebsite: try to open widget in #Widget_Container');

    window.LATOKEN_WidgetOpen({ target: targetDiv, link: 'http://wallet.latoken.lc:8060/widget.html' });
    window.LATOKEN_WidgetCallback = function(event, data) {
      console.log('SuperWebsite: got event from widget! ' + event + ' ' + JSON.stringify(data));

      targetDiv.style.height = data.height;
    };
  }
</script>
<script>
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "/static/js/widget_outer.js?dc=" + new Date().getTime();
  document.body.appendChild(s);
</script>

</body>
</html>
```


`widget.html`
```jsx static
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title>LATOKEN</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="viewport" content="width=device-width, height=device-height, user-scalable=no, initial-scale=1, maximum-scale=1">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-TileColor" content="#161f37">
  <meta name="theme-color" content="#ffffff">
</head>
<body>
<div id="Widget_app"></div>
</body>
</html>
```
