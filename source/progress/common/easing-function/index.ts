export { EasingFunction } from './type'
export { createEasingFunctionManager } from './helper'

import * as base from './base'
import * as bezier from './bezier'

export const easingFunction = { ...base, ...bezier }
