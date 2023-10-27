export type EasingFunction = (t: number) => number

import * as base from './base'
import * as bezier from './bezier'

export const easingFunction = { ...base, ...bezier }
