import i18next, { TranslationFunction, TranslationOptions } from 'i18next';

export default function i18nextWithName<
  TResult = any,
  TValues extends object = object,
  TKeys extends string = string
>(ns: string): TranslationFunction {
  return (key: TKeys | TKeys[], options?: TranslationOptions<TValues>) => {
    if (options) {
      options.ns = ns;
    }
    return i18next.t(key, options || { ns });
  };
}
