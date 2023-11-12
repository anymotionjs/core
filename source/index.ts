import { Plugin, pluginManager } from './plugin'

export { Plugin, PluginContext } from './plugin'
export { Tween, TweenPropertyDrive, TweenPropertyDriver } from './tween'
export { easingFunction, ProgressDriver } from './progress'
export { ScrollProgressDriver } from './progress'
export { TimeProgressDriver } from './progress'

export function use(...plugins: Plugin[]) {
  pluginManager.use(...plugins)
}
