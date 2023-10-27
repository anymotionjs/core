import type { TweenPropertyDrive } from '..'

declare global {
  interface TweenProperties {
    rotate?: string
  }
}

export const rotate: TweenPropertyDrive = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: (_propertiesPair, _progress, _element) => {
    return
  }
}
