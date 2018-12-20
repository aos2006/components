import React, { Component, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './StepsLine.styl';

interface IStepsLineProps {
  items: Array<string | ReactNode>;
  active: number;
  labelSize?: 'small' | 'normal';
  onChange?: (index: string) => void;
}

export default class StepsLine extends Component<IStepsLineProps, {}> {
  handlerChange(i) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(i);
    }
  }

  render() {
    const { items, active, labelSize, onChange } = this.props;
    const blue = '#0096ac';
    const gray = '#d3d3d3';
    let background;
    const step = 100 / (items.length - 1);
    if (active >= items.length) {
      background = blue;
    } else {
      background =
        `linear-gradient(to right, ${blue} 0%,` +
        ` ${blue} ${active * step}%, ${gray} ${(active + 1) * step}%, ${gray} 100%)`;
    }
    return (
      <div className={styles.Steps}>
        <div
          className={styles.lineLayer}
          style={{
            background,
          }}
        />
        <div className={styles.circlesLayer}>
          {items.map((item, i) => (
            <div
              key={i}
              className={classNames(styles.stepWrapper, {
                [styles.active]: i <= active,
                [styles.current]: i === active,
                [styles['is-action']]: Boolean(onChange),
              })}
              onClick={this.handlerChange.bind(this, i)}
            >
              <div className={styles.stepCircle}>{i + 1}</div>
              <div
                className={classNames(styles[`stepLabel`], styles[`stepLabel--size-${labelSize}`])}
              >
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
