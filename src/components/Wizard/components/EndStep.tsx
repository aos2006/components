import React, { Component } from 'react';
import Icon from '@latoken-component/icon';

export default class EndStep extends Component {
  render() {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 30,
          margin: '40px 0px',
        }}
      >
        <Icon
          glyph="check"
          style={{
            fontSize: 140,
            color: '#00a854',
            marginTop: 40,
            marginBottom: 50,
          }}
        />

        <h3
          style={{
            textTransform: 'uppercase',
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 120,
          }}
        >
          Thank you!<br />
          <br />
          We will review your application and get back to you as soon as possible (average review
          time is 3-5 working days).
        </h3>
      </div>
    );
  }
}
