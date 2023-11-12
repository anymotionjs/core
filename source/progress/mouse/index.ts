import { createDrivableManager } from '../common/progress-driver/helper'
import { createArrangeableManager, Arrangeable } from '../common/arrangeable'
import { EasingFunction, createEasingFunctionManager } from '../common/easing-function'
import type { Drivable, ProgressDriver } from '../index'

export class MouseProgressDriver implements ProgressDriver {
  private _drivableManager = createDrivableManager()
  private _arrangeableManager = createArrangeableManager()
  private _easingFunctionManager = createEasingFunctionManager()
  
  ease(func: EasingFunction): MouseProgressDriver {
    this._easingFunctionManager.set(func)
    return this
  }

  drive(...drive: Drivable[]): MouseProgressDriver {
    this._drivableManager.add(...drive)
    return this
  }

  then(...arrangeable: Arrangeable[]): MouseProgressDriver {
    this._arrangeableManager.add(...arrangeable)
    return this
  }
}
