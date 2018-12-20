import Button from '@latoken-component/button';
import Icon from '@latoken-component/icon';
import { spaceSeparate } from '@latoken-component/utils';
import { notification } from 'antd';
import cn from 'classnames';
import { autobind } from 'core-decorators';
import React, { CSSProperties, PureComponent } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { InjectedI18nAndTranslateProps, translate } from 'react-i18next';
import styles from './hash.styl';

interface HashProps {
  isLink?: boolean;
  className?: string;
  style?: CSSProperties;
  lengthAfter?: number;
  intervalsSpace?: number;
  urlBase?: string;
  children: string;
  copying?: boolean;
}

@translate('ComponentsLibrary')
export default class Hash extends PureComponent<HashProps & InjectedI18nAndTranslateProps, {}> {
  static defaultProps = {
    isLink: false,
    lengthAfter: 4,
    urlBase: 'https://etherscan.io/address',
  };

  @autobind
  handlerCopying() {
    const { t } = this.props;
    notification.success({
      message: t(`Success copy`),
      description: <div className={styles.message}>{this.props.children}</div>,
      duration: 5,
    });
  }

  resolveHash(hash: string): string {
    const { intervalsSpace } = this.props;
    let result = hash;
    if (intervalsSpace) {
      result = spaceSeparate(result, '\u00A0', intervalsSpace);
    }
    return result;
  }

  render() {
    const {
      children,
      className,
      style,
      isLink = false,
      lengthAfter,
      urlBase,
      copying,
    } = this.props;
    const hash = children as string;
    const resolveHash = this.resolveHash(hash);

    if (!hash || hash.length < lengthAfter) {
      return '–';
    }

    const before = resolveHash.slice(0, -lengthAfter);
    const after = resolveHash.slice(-lengthAfter);

    if (isLink) {
      const href =
        urlBase.lastIndexOf('#') !== -1 ||
        urlBase.lastIndexOf('?') !== -1 ||
        /\/$/.test(urlBase) ||
        'mailto:' === urlBase
          ? `${urlBase}${children}`
          : `${urlBase}/${children}`;

      return (
        <div className={styles.wrap}>
          {copying ? (
            <CopyToClipboard text={hash} onCopy={this.handlerCopying}>
              <Button type={'link'}>
                <Icon glyph={'copy'} className={styles.copyIcon} />{' '}
              </Button>
            </CopyToClipboard>
          ) : null}
          <Button
            className={cn(styles.Hash, className)}
            style={style}
            href={href}
            target="_blank"
            type={'link'}
          >
            <span className={styles.before}>{before}</span>
            <span className={styles.after}>{after}</span>
            <Icon className={styles.linkIcon} glyph={'external-link'} />
          </Button>
        </div>
      );
    }

    const Wrap = copying
      ? ({ children }) => (
          <CopyToClipboard text={hash} onCopy={this.handlerCopying}>
            {children}
          </CopyToClipboard>
        )
      : ({ children }) => <>{children}</>;

    return (
      <Wrap>
        <Button className={cn(styles.Hash, className)} style={style} type={'link'}>
          {copying ? <Icon glyph={'copy'} className={styles.copyIcon} /> : null}
          <span className={styles.before}>{before}</span>
          <span className={styles.after}>{after}</span>
        </Button>
      </Wrap>
    );
  }
}
