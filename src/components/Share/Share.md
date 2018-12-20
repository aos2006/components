- api: https://tech.yandex.ru/share/doc/dg/api-docpage/
- examples: https://tech.yandex.ru/share/

```js
<div>
  <h3>Default:</h3>
  <div style={{padding:10}}>
    <Share theme={{copy:'first', counter: true, limit:3, lang: 'en', bare: true}}/>  
  </div>
  
  <h3>Size:</h3>
  <div style={{padding:10}}>
    <Share size={50} /> {' '}
    <Share size={30} /> {' '}
    <Share size={'s'} />  
  </div>
  
  <h3>Services:</h3>
  <div style={{padding:10}}>
    <Share 
    services={[
      'blogger',
      'collections',
      'delicious',
      'digg',
      'evernote',
      'facebook',
      'gplus',
      'linkedin',
      'lj',
      'moimir',
      'odnoklassniki',
      'pinterest',
      'pocket',
      'qzone',
      'reddit',
      'renren',
      'sinaWeibo',
      'skype',
      'surfingbird',
      'telegram',
      'tencentWeibo',
      'tumblr',
      'twitter',
      'viber',
      'vkontakte',
      'whatsapp'
    ]}
    />  
  </div>
</div>
```
