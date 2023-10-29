import { Time } from './time'
import { Tween } from './tween'
import { Plugin, pluginManager } from './plugin'
import { ComposeTween, Timeline } from './timeline'

export { Plugin, PluginContext } from './plugin'
export { Time, Direction, EasingFunction } from './time'
export { Tween, TweenPropertyDrive, TweenPropertyDriver } from './tween'

export function from(elementSelector: string | Element, from: TweenProperties) {
  return new Tween(elementSelector).from(from)
}

export function to(elementSelector: string | Element, to: TweenProperties) {
  return new Tween(elementSelector).to(to)
}

export function timeline(tween: ComposeTween) {
  return new Timeline().compose(tween)
}

export function use(...plugins: Plugin[]) {
  pluginManager.use(...plugins)
}

export default { use, from, to, timeline, Time }
