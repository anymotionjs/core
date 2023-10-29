import { TweenPropertyDriver } from '../tween'

export const globalPlugins: Plugin[] = []
export const globalTweenPropertyDrivers: TweenPropertyDriver[] = []

export interface Plugin {
  apply(ctx: PluginContext): void
}

export interface PluginContext {
  registerPropertyDriver(...drivers: TweenPropertyDriver[]): void
}

class PluginManager {
  private tweenPropertyDrivers = new Map<Plugin, TweenPropertyDriver[]>()

  private addTweenPropertyDrivers(plugin: Plugin, drivers: TweenPropertyDriver[]) {
    this.tweenPropertyDrivers.set(plugin, drivers)
  }

  getTweenPropertyDrivers(): TweenPropertyDriver[] {
    const result: TweenPropertyDriver[] = []
    const values = this.tweenPropertyDrivers.values()
    for (const item of values) result.push(...item)
    return result
  }

  use(...plugins: Plugin[]) {
    for (const plugin of plugins) {
      if (typeof plugin.apply === 'function') {
        plugin.apply({
          registerPropertyDriver: (...drivers) => {
            this.addTweenPropertyDrivers(plugin, drivers)
          }
        })
      }
    }
  }
}

export const pluginManager = new PluginManager()
