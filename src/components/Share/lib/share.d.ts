export type IShareServices =
  | 'blogger'
  | 'collections'
  | 'delicious'
  | 'digg'
  | 'evernote'
  | 'facebook'
  | 'gplus'
  | 'linkedin'
  | 'lj'
  | 'moimir'
  | 'odnoklassniki'
  | 'pinterest'
  | 'pocket'
  | 'qzone'
  | 'reddit'
  | 'renren'
  | 'sinaWeibo'
  | 'skype'
  | 'surfingbird'
  | 'telegram'
  | 'tencentWeibo'
  | 'tumblr'
  | 'twitter'
  | 'viber'
  | 'vkontakte'
  | 'whatsapp';

export type IShareLang = 'az' | 'be' | 'en' | 'hy' | 'ka' | 'kk' | 'ro' | 'ru' | 'tr' | 'tt' | 'uk';

export interface IShareContent {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  hashtags?: string; // for twitter
  accessToken?: string; // for fb
}

export interface IShareTheme {
  /**  Признак того, что загрузка стилей отключена. Если добавить параметр, соцсети будут отображаться в виде текстового вертикального списка.*/
  bare?: boolean;
  /** Позиция кнопки Скопировать ссылку. Кнопка Скопировать ссылку может отображаться, если используется параметр limit. */
  copy?: 'last' | 'first' | 'hidden';
  /** Признак того, что на кнопке соцсети отображается счетчик публикаций.*/
  counter?: boolean;
  /** Направление списка кнопок.*/
  direction?: 'horizontal' | 'vertical';
  /** Язык блока. Локализуются подписи кнопок соцсетей и кнопка*/
  lang?: IShareLang;
  /** Количество соцсетей, отображаемых в виде кнопок. Используется если нужно встроить в блок много соцсетей, а также чтобы блок занимал мало места на странице. Не вошедшие в лимит соцсети будут отображаться в pop-up по нажатию кнопки . */
  limit?: number;
  /** Идентификатор директивы Content Security Policy. Используется для подтверждения безопасности скрипта блока «Поделиться». */
  nonce?: string;
  /** Направление открытия pop-up.*/
  popupDirection?: 'bottom' | 'top';
  /**  Расположение pop-up относительно контейнера блока. Значение outer может понадобиться в том случае, если из-за специфики верстки вашего сайта pop-up обрезается соседними элементами страницы. */
  popupPosition?: 'inner' | 'outer';
  /**Список идентификаторов социальных сетей, отображаемых в блоке.*/
  services?: string;
  /** Размер кнопок соцсетей. */
  size?: 'm' | 's';
}

export interface IYaShare2Props {
  content?: IShareContent;
  contentByService?: { [key in IShareServices]?: IShareContent };
  theme?: IShareTheme;
  hooks: {
    onready?(): void;
    onshare?(name: IShareServices): void;
  };
}

export interface YaShare2 {
  constructor(node: string | HTMLDivElement, props: IYaShare2Props): void;

  updateContent(content: IShareContent): void;

  updateContentByService(content: { [key in IShareServices]: IShareContent }): void;

  destroy(): void;
}

export type YaShareFactory = (node: string | HTMLDivElement, props: IYaShare2Props) => YaShare2;

declare global {
  interface Window {
    Ya: {
      share2: YaShareFactory;
    };
  }
}
