import { Drivable } from './type'

export function createDrivableManager() {
  const list: Drivable[] = []

  return {
    add(...data:Drivable[]) {
      list.push(...data)
    },

    call(v: number) {
      for (const arrangeable of list) {
        arrangeable.progress(v)
      }
    }
  }
}
