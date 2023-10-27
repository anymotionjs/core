import type { TweenPropertyDrive } from '..'

declare global {
  interface TweenProperties {
    background?: string
    backgroundColor?: string
  }
}

export const background: TweenPropertyDrive = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: (_propertiesPair, _progress, _element) => {
    return
  }
}
