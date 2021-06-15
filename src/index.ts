import ShortcutCenterBaseClass, {
  IObserverContext,
  TCallback,
} from "./baseClass";
import { v4 as generateUUID } from "uuid";
import chalk from "chalk";
import { match, pathToRegexp, Key } from "path-to-regexp";

class ShortcutCenter extends ShortcutCenterBaseClass {
  private observers: { [key: string]: { [key: string]: TCallback } } = {};
  private shortcutRules: {
    [key: string]: { matchRule: RegExp; keys: Array<Key> };
  } = {};

  constructor() {
    super();
  }

  // public functions

  public addObserver(rule: string, callback: TCallback) {
    this.addRuleIndexIfNeeded(rule);

    const observerId = generateUUID();
    this.observers[rule][observerId] = callback;
    return {
      remove: () => {
        delete this.observers[rule][observerId];
      },
    };
  }

  public removeAllObservers() {
    this.observers = {};
  }

  public execute(shortcutCommand: string) {
    if (this.dev) {
      console.log(
        chalk.blue("[Dev][execute shortcutCommand]"),
        shortcutCommand
      );
    }
    for (let [key, { matchRule: matchRule, keys }] of Object.entries(
      this.shortcutRules
    )) {
      if ((matchRule as RegExp).test(shortcutCommand)) {
        let params: { [key: string]: string } = {};
        {
          // get context params
          const matchFunction = match(matchRule, {
            decode: decodeURIComponent,
          });
          const matchResult = matchFunction(shortcutCommand);

          if (matchResult) {
            for (let [key, value] of Object.entries(matchResult.params)) {
              params[keys[Number(key)].name] = value;
            }
          }
        }

        const observerExecuteContext = {
          params,
        } as IObserverContext;
        if (this.dev) {
          console.log(
            chalk.blue("[Dev][observerExecuteContext]"),
            observerExecuteContext
          );
        }
        const observerGroup = this.observers[key];
        for (let [_, callback] of Object.entries(observerGroup)) {
          callback(observerExecuteContext);
        }
        break;
      }
    }
  }

  // private functions

  private addRuleIndexIfNeeded(rule: string) {
    // add group for observer map
    if (!this.observers[rule]) {
      this.observers[rule] = {};
    }

    // add match rules
    const keys: Array<Key> = [];
    const matchRule = pathToRegexp(rule, keys);
    this.shortcutRules[rule] = {
      matchRule: matchRule,
      keys: keys,
    };

    // console log dev info
    if (this.dev) {
      console.log(chalk.blue("[Dev][shortcutRules]"), this.shortcutRules);
    }
  }
}

export default ShortcutCenter;
