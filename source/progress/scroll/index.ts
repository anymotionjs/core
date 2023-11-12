import { createElementSelector } from '../../helps'
import { createDrivableManager } from '../common/progress-driver'
import { EasingFunction, createEasingFunctionManager } from '../common/easing-function'
import { Arrangeable, ArrangeableObject, createArrangeableManager } from '../common/arrangeable'

import type { Drivable, ProgressDriver } from '../index'

type Axis = 'horizontal' | 'vertical'

export class ScrollProgressDriver implements ProgressDriver, ArrangeableObject {
  private _distance = 0 // 滚动距离
  private _axis: Axis = 'vertical' // 关注的轴
  private _drivableManager = createDrivableManager()
  private _containerSelector = createElementSelector()
  private _arrangeableManager = createArrangeableManager()
  private _easingFunctionManager = createEasingFunctionManager()

  constructor(containerSelector: string | Element) {
    this._containerSelector.setSelector(containerSelector)
  }

  play(): ScrollProgressDriver {
    let startedPlayOffset = 0 // 开始时的距离
    const [container] = this._containerSelector.getElements()

    const getProcessInfo = () => {

      if (this._axis === 'horizontal') {
        const { clientWidth } = container
        const scrollLeft = container.scrollLeft || 0
        const scrollWidth = container.scrollWidth || 0
        return { progress: scrollLeft, total: scrollWidth - clientWidth }
      }

      if (this._axis === 'vertical') {
        const { clientHeight } = container
        const scrollTop = container.scrollTop || 0
        const scrollHeight = container.scrollHeight || 0
        return { progress: scrollTop, total: scrollHeight - clientHeight }
      }

      throw new Error('???')
    }

    const scrollListener = () => {
      const { progress, total } = getProcessInfo()
      const relativeProcess = (progress - startedPlayOffset) / total
      if (relativeProcess > 1 || relativeProcess > this._distance) return
      this._drivableManager.call(this._easingFunctionManager.call(relativeProcess))
    }

    if (container == null) return this
    startedPlayOffset = getProcessInfo().progress
    container.addEventListener('scroll', scrollListener)
    return this
  }

  axis(axis: Axis) {
    this._axis = axis
    return this
  }

  distance(v: number): ScrollProgressDriver {
    this._distance = v
    return this
  }

  ease(func: EasingFunction): ScrollProgressDriver {
    this._easingFunctionManager.set(func)
    return this
  }

  drive(...drive: Drivable[]): ScrollProgressDriver {
    this._drivableManager.add(...drive)
    return this
  }

  then(...arrangeable: Arrangeable[]): ScrollProgressDriver {
    this._arrangeableManager.add(...arrangeable)
    return this
  }
}
