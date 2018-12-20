* ant: https://ant.design/components/card/
* github:https://github.com/ant-design/ant-design/edit/master/components/card
* issue: https://github.com/ant-design/ant-design/labels/Component%3A%20Card
```jsx harmony

const ant = require('antd');
const Tab = require('./examples/tab').default;
const {Row, Col } = ant;

<div style={{ fontSize: 30, background: '#ECECEC', padding: '30px' }}>
  <Row gutter={16}>
    <Col span={8}>
      <Card title="Card title" extra={<a href="#">More</a>}>
         <p>Card content</p>
         <p>Card content</p>
         <p>Card content</p>
       </Card>
    </Col>
    <Col span={8}>
      <Card loading title="Card title">
          Whatever content
      </Card>
    </Col>
    <Col span={8}>
    <Card title="Card title">
        <p
          style={{
            fontSize: 14,
            color: 'rgba(0, 0, 0, 0.85)',
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          Group title
        </p>
        <Card
          type="inner"
          title="Inner Card title"
          extra={<a href="#">More</a>}
        >
          Inner Card content
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="Inner Card title"
          extra={<a href="#">More</a>}
        >
          Inner Card content
        </Card>
      </Card>
    </Col>
  </Row>
  <br/>
  <Tab/>
</div>
```
