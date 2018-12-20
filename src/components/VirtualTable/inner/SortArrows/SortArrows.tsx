import cn from 'classnames';
import React from 'react';
import styles from './SortArrows.styl';

interface ISortArrowsProps {
  direction: string | 'ASC' | 'DESC';
  className?: string;
}

const SortArrows = ({ direction, className }: ISortArrowsProps) => (
  <div className={cn([styles.arrows, className])}>
    <div
      className={cn([
        styles.arrow,
        {
          [styles.active]: direction === 'ASC',
        },
      ])}
    >
      <svg viewBox="0 0 8 5" xmlns="http://www.w3.org/2000/svg" className={styles.arrowUp}>
        <g stroke="none" fill="currentColor" transform="translate(-46.000000, -16.000000)">
          <path d="M53.8515625,16.1484375 C53.9505213,16.2473963 54,16.3645827 54,16.5 C54,16.6354173 53.9505213,16.7526037 53.8515625,16.8515625 L50.3515625,20.3515625 C50.2526037,20.4505213 50.1354173,20.5 50,20.5 C49.8645827,20.5 49.7473963,20.4505213 49.6484375,20.3515625 L46.1484375,16.8515625 C46.0494787,16.7526037 46,16.6354173 46,16.5 C46,16.3645827 46.0494787,16.2473963 46.1484375,16.1484375 C46.2473963,16.0494787 46.3645827,16 46.5,16 L53.5,16 C53.6354173,16 53.7526037,16.0494787 53.8515625,16.1484375 Z" />
        </g>
      </svg>
    </div>
    <div
      className={cn([
        styles.arrow,
        {
          [styles.active]: direction === 'DESC',
        },
      ])}
    >
      <svg viewBox="0 0 8 5" xmlns="http://www.w3.org/2000/svg">
        <g stroke="none" fill="currentColor" transform="translate(-46.000000, -16.000000)">
          <path d="M53.8515625,16.1484375 C53.9505213,16.2473963 54,16.3645827 54,16.5 C54,16.6354173 53.9505213,16.7526037 53.8515625,16.8515625 L50.3515625,20.3515625 C50.2526037,20.4505213 50.1354173,20.5 50,20.5 C49.8645827,20.5 49.7473963,20.4505213 49.6484375,20.3515625 L46.1484375,16.8515625 C46.0494787,16.7526037 46,16.6354173 46,16.5 C46,16.3645827 46.0494787,16.2473963 46.1484375,16.1484375 C46.2473963,16.0494787 46.3645827,16 46.5,16 L53.5,16 C53.6354173,16 53.7526037,16.0494787 53.8515625,16.1484375 Z" />
        </g>
      </svg>
    </div>
  </div>
);

export default SortArrows;
