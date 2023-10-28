import { Tween } from './tween'
import { Time, Direction } from './time'
import { ComposeTween, Timeline } from './timeline'

function from(elementSelector: string | Element, from: TweenProperties) {
  return new Tween(elementSelector).from(from)
}

function to(elementSelector: string | Element, to: TweenProperties) {
  return new Tween(elementSelector).to(to)
}

function timeline(tween: ComposeTween) {
  return new Timeline().compose(tween)
}

export { Tween } from './tween'
export default { from, to, timeline, Time }
export { Time, Direction, EasingFunction } from './time'
