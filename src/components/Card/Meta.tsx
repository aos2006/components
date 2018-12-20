import * as React from 'react';
import classNames from 'classnames';
import styles from './style/index.styl';

export interface CardMetaProps {
  style?: React.CSSProperties;
  className?: string;
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export default (props: CardMetaProps) => {
  const { className, avatar, title, description, ...others } = props;
  const classString = classNames(styles[`card-meta`], className);
  const avatarDom = avatar ? <div className={styles[`card-meta-avatar`]}>{avatar}</div> : null;
  const titleDom = title ? <div className={styles[`card-meta-title`]}>{title}</div> : null;
  const descriptionDom = description ? (
    <div className={styles[`card-meta-description`]}>{description}</div>
  ) : null;
  const MetaDetail =
    titleDom || descriptionDom ? (
      <div className={styles[`card-meta-detail`]}>
        {titleDom}
        {descriptionDom}
      </div>
    ) : null;
  return (
    <div {...others} className={classString}>
      {avatarDom}
      {MetaDetail}
    </div>
  );
};
