declare module 'react-i18next/src/translate' {
  type Omit<T, K extends keyof T> = Pick<
    T,
    ({ [P in keyof T]: P } &
      { [P in K]: never } & { [x: string]: never; [x: number]: never })[keyof T]
  >;

  export type IReactComponent<P = any> =
    | React.StatelessComponent<P>
    | React.ComponentClass<P>
    | React.ClassicComponentClass<P>;

  export type Translate = <TNamespace extends string>(
    namespaces?: TNamespace | TNamespace[],
    options?: Omit<any, 'translateFuncName'> & { withRef?: false }
  ) => <T extends IReactComponent>(target: T) => T;

  const translate: Translate;
  export default translate;
}

declare module 'react-i18next' {
  import { TranslationFunction, withNamespaces } from 'i18next';

  import {
    getDefaults,
    getI18n,
    reactI18nextModule,
    ReactI18NextOptions,
    setDefaults,
    setI18n,
  } from 'react-i18next/src/context';
  import Trans from 'react-i18next/src/trans';
  import translate from 'react-i18next/src/translate';

  interface InjectedI18nAndTranslateProps
    extends Partial<InjectedI18nProps & InjectedTranslateProps> {}

  export {
    setDefaults,
    getDefaults,
    withNamespaces,
    setI18n,
    getI18n,
    reactI18nextModule,
    Trans,
    translate,
    InjectedI18nProps,
    InjectedTranslateProps,
    InjectedI18nAndTranslateProps,
  };
}
