export interface IObserverContext {
  params: { [key: string]: string };
}

export type TAddObserverResult = {
  remove: () => void;
};

export type TCallback = (context: IObserverContext) => void;
abstract class ShortcutCenterBaseClass {
  private _devMode_: boolean = false;
  public abstract addObserver(
    rule: string,
    callback: TCallback
  ): TAddObserverResult;
  public abstract removeAllObservers(): void;
  public abstract execute(shortcutCommand: string): void;
  public set dev(value: boolean) {
    this._devMode_ = value;
  }
  public get dev(): boolean {
    return this._devMode_;
  }
}

export default ShortcutCenterBaseClass;
