import type { TweenPropertyDrive } from '..'

declare global {
  interface TweenProperties {
    scale?: string
  }
}

export const scale: TweenPropertyDrive = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: (_propertiesPair, _progress, _element) => {
    return
  }
}
