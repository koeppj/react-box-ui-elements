// types/box-ui-elements__i18n__bundles__en-US/index.d.ts
declare module 'box-ui-elements/i18n/bundles/en-US' {
    // Type for the boxCldrData if not typed elsewhere
    export interface BoxCldrData {
      NumberFormat?: unknown;
      NumbersData?: unknown;
      NameItem?: unknown;
      LanguagesData?: unknown;
      LocaleData?: unknown;
      // You can define these properly if you have details
    }
  
  
    export const language: 'en-US';
    export const locale: 'en';
    export const messages:Record<string, string>;
    export const boxCldrData: BoxCldrData;
  }
  