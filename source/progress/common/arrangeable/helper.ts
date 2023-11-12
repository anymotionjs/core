import { Arrangeable } from './type'

export function createArrangeableManager() {
  const list: Arrangeable[] = []

  return {
    add(...data: Arrangeable[]) {
      list.push(...data)
    },
    call() {
      for (const arrangeable of list) {
        if (typeof arrangeable === 'function') {
          arrangeable().play()
        }

        if (typeof arrangeable === 'object') {
          if ('play' in arrangeable) {
            if (typeof arrangeable.play === 'function') {
              arrangeable.play()
            }
          }
        }
      }
    }
  }
}
