import cn from 'classnames';
import _ from 'lodash';
import * as React from 'react';
import './lib/share';
import {
  IShareContent,
  IShareLang,
  IShareServices,
  IShareTheme,
  IYaShare2Props,
  YaShare2,
} from './lib/share';
import styles from './Share.styl';

export interface IShareProps {
  services?: IShareServices[];
  className?: string;
  style?: React.CSSProperties;
  size?: number | 'm' | 's';
  lang?: IShareLang;
  content?: IShareContent;
  contentByService?: { [key in IShareServices]: IShareContent };
  theme?: IShareTheme;

  onReady?(): void;

  onShare?(name: IShareServices): void;
}

export default class Share extends React.PureComponent<IShareProps> {
  static defaultProps = {
    size: 'm',
    services: ['facebook', 'twitter', 'skype', 'whatsapp', 'telegram'],
    lang: 'en',
    content: {},
    contentByService: {},
  };
  static identifications: { [id: number]: boolean } = {};
  identification = this.createId();
  node: HTMLDivElement;
  yaShare2: YaShare2;
  uniqueClassName = `Share__${this.identification}`;

  createId() {
    const id = Math.ceil(_.random(true) * 1000000);
    if (!Share.identifications[id]) {
      Share.identifications[id] = true;
      return id;
    }
    return this.createId();
  }

  componentDidMount(): void {
    const { content, contentByService, theme, onReady, onShare, services, size, lang } = this.props;

    const config: IYaShare2Props = {
      theme: {
        ...theme,
        lang,
        services: services.length ? services.join(',') : null,
        size: _.isString(size) ? size : null,
      },
      content,
      contentByService,
      hooks: {
        onready: onReady,
        onshare: onShare,
      },
    };

    this.yaShare2 = window.Ya.share2(this.node, config);
  }

  componentWillUnmount(): void {
    this.yaShare2.destroy();
    Share.identifications[this.identification] = false;
  }

  getNode = node => (this.node = node);

  render() {
    const { className, style, size } = this.props;
    const hasStyle = _.isNumber(size);
    return (
      <div className={cn(styles.Share, className, this.uniqueClassName)} style={style}>
        <div ref={this.getNode} />
        {hasStyle ? (
          <style>
            {`
            .${this.uniqueClassName} .ya-share2__icon {height: ${size}px;
              width: ${size}px;
              background-size: ${size}px ${size}px;
            }
            .${
              this.uniqueClassName
            } .ya-share2__list_direction_horizontal > .ya-share2__item  + .ya-share2__item {
              margin-left: ${Math.ceil((size as number) / 8)}px;
            }
          `}
          </style>
        ) : null}
      </div>
    );
  }
}
