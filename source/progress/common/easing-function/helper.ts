import { linear } from './base'
import { EasingFunction } from './type'

export function createEasingFunctionManager() {
  let list: EasingFunction[] = [linear]

  return {
    set(...data: EasingFunction[]) {
      list = data
    },

    call(v: number): number {
      return list.reduce((result, easing) => result * easing(v), 1)
    }
  }
}
