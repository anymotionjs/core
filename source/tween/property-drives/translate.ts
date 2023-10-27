import type { TweenPropertyDrive } from '..'

declare global {
  interface TweenProperties {
    translate?: string
  }
}

export const translate: TweenPropertyDrive = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: (_propertiesPair, _progress, _element) => {
    return
  }
}
