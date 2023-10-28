import { Tween } from '../tween'

export type ComposeTween = (Tween[] | Tween)[]

export class Timeline {
  compose(tween: ComposeTween) {}
}
