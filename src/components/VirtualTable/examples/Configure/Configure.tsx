import { Input } from 'antd';
import React, { Component } from 'react';
import styles from './Configure.styl';

class Configure extends Component {
  render() {
    return (
      <div className={styles.formGroup}>
        <Input placeholder="Введи текст что бы осуществить поиск по таблице" />
      </div>
    );
  }
}

export default Configure;
