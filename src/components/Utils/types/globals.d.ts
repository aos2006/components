declare var isInsideLibrary: boolean;
declare var isInsideStatic: boolean;
declare var isInsideWallet: boolean;

interface Window {
  logException: (e: Error) => void;
}
