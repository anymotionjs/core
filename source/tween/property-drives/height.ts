import type { TweenPropertyDrive } from '..'

declare global {
  interface TweenProperties {
    height?: number | string
  }
}

export const height: TweenPropertyDrive = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: (_propertiesPair, _progress, _element) => {
    return
  }
}
