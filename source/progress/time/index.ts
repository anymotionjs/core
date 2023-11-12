
import { EasingFunction, createEasingFunctionManager } from '../common/easing-function'
import { createDrivableManager } from '../common/progress-driver/helper'
import { ArrangeableObject, Arrangeable, createArrangeableManager } from '../common/arrangeable'
import { type ProgressDriver, type Drivable } from '../index'

export type ProgressDirection = 'normal' | 'reverse'

/**
 * 时间；动画的驱动
 */
export class TimeProgressDriver implements ProgressDriver, ArrangeableObject {
  private _time = 0
  private _round = 0
  private _repeat = 1
  private _duration = 300 // TODO：优化对 0 的处理方式
  private _frameId: number | undefined
  private _direction: ProgressDirection = 'normal'
  private _drivableManager = createDrivableManager()
  private _arrangeableManager = createArrangeableManager()
  private _easingFunctionManager = createEasingFunctionManager()

  private callDrivable() {
    const rate = Math.abs(this._time / this._duration)
    const progress = this._easingFunctionManager.call(rate)
    this._drivableManager.call(progress)
  }

  private getDirection() {
    if (this._direction === 'normal') return 1
    if (this._direction === 'reverse') return -1
    if (this._direction === 'alternate') return this._round % 2 === 0 ? 1 : -1
    throw new Error('')
  }

  private isCompleted() {
    if (this._repeat === Infinity) return false
    return this._round >= this._repeat
  }

  private startFrame() {
    if (this._frameId != null) return
    this._round = 0
    this.nextFrame()
  }

  private nextFrame() {
    const startTime = Date.now()

    this._frameId = requestAnimationFrame(() => {
      if (this.isCompleted()) {
        this.pause()
        this._arrangeableManager.call()
        return
      }

      const beforeTime = this._time
      const consumedTime = Date.now() - startTime
      this._time += (consumedTime * this.getDirection())

      // 结束和开始做手动对齐处理
      // 保证 0 和 1 一定会被执行
      if (beforeTime > 0 && this._time < 0) this._time = 0
      if (beforeTime < this._duration && this._time > this._duration) this._time = this._duration

      if (this._time === 0) {
        if (this._direction === 'reverse') {
          this._time = this._duration
          this._round += 1
        }
      }

      if (this._time === this._duration) {
        if (this._direction === 'normal') {
          this._time = 0
          this._round += 1
        }
      }

      this.callDrivable()
      this.nextFrame()
    })
  }

  duration(v: number): TimeProgressDriver {
    // 优雅的支持为 0 的情况
    this._duration = isFinite(v) ? v : 1
    return this
  }

  repeat(v: number): TimeProgressDriver {
    this._repeat = v
    return this
  }

  direction(v: ProgressDirection): TimeProgressDriver {
    this._direction = v
    return this
  }

  play(): TimeProgressDriver {
    if (this.isCompleted()) this._time = 0
    this.startFrame()
    return this
  }

  pause(): TimeProgressDriver {
    if (this._frameId) {
      cancelAnimationFrame(this._frameId)
      this._frameId = undefined
    }

    return this
  }

  ease(func: EasingFunction): TimeProgressDriver {
    this._easingFunctionManager.set(func)
    return this
  }

  drive(...drive: Drivable[]): TimeProgressDriver {
    this._drivableManager.add(...drive)
    return this
  }

  then(...arrangeable: Arrangeable[]): TimeProgressDriver {
    this._arrangeableManager.add(...arrangeable)
    return this
  }
}
