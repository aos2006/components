declare var isInsideLibrary: boolean;
declare var isInsideStatic: boolean;
declare var isInsideWallet: boolean;
declare var metricsUrl: string | boolean;
declare var wsUrl: string | boolean;

interface SelectorNode {
  /**
   * Returns the specific selector from imported stylesheet as string
   */
  [key: string]: string;
}

interface Stringifyable {
  /**
   * Stringifies the imported stylesheet for use with inline style tags
   */
  toString(): string;
}

declare var isInsideLibrary: boolean;
declare var isInsideStatic: boolean;
declare var isInsideWallet: boolean;
declare var metricsUrl: string | boolean;
declare var wsUrl: string | boolean;

declare module '*.styl' {
  const styles: SelectorNode & Stringifyable;
  export default styles;
}

declare module '*.css' {

}

declare module '*.scss' {

}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

interface Window {
  logException: (e: Error) => void;
  web3: object;
  stores: any;
  mist: string;
  yandex_metrika_accounts: number[];
  isTest: boolean;
  i18n: any;
  Raven: any;
  LATOKEN_OnMethodsReady: () => void;
  LATOKEN_SendVisitorPath: (
    optiuns?: {
      title?: string;
      url: string;
    }
  ) => void;
  LATOKEN_toggle: () => void;
  LATOKEN_show: () => void;
  LATOKEN_hide: () => void;
  LATOKEN_WidgetOpen: ({ target: any, link: string }) => void;
  LATOKEN_WidgetCallback: (event: string, data: any) => void;
  LATOKEN_SetUserInfo: (data: any) => void;
}

declare const RECAPTCHA_SITE: string;
declare const RECAPTCHA_SITE_NEW: string;

interface Route {
  render: () => any;
}
interface Navigator {
  readonly clipboard: {
    writeText: (text: string) => Promise<any>;
  };
  readonly userLanguage: string;
}

type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | false;

interface ClassDictionary {
  [id: string]: boolean | undefined | null;
}

interface ClassArray extends Array<ClassValue> {} // tslint:disable-line no-empty-interface

declare const IS_REGRESS_TEST: boolean;
