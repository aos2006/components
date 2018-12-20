import React from 'react';
import styles from '../styles.styl';
import Icon from '@latoken-component/icon';

function DragMarker() {
  return (
    <span className={styles.dragMarker}>
      <Icon glyph={'caret'} />
    </span>
  );
}

export default DragMarker;
