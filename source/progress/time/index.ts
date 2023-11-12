
import { EasingFunction, createEasingFunctionManager } from '../common/easing-function'
import { createDrivableManager } from '../common/progress-driver/helper'
import { ArrangeableObject, Arrangeable, createArrangeableManager } from '../common/arrangeable'
import { type ProgressDriver, type Drivable } from '../index'

export type ProgressDirection = 'normal' | 'reverse' | 'alternate'

/**
 * 时间；动画的驱动
 */
export class TimeProgressDriver implements ProgressDriver, ArrangeableObject {
  private _time = 0
  private _duration = 300 // TODO：优化对 0 的处理方式
  private _frameId: number | undefined
  private _repeat: number | 'Infinity' = 1
  private _direction: ProgressDirection = 'normal'
  private _drivableManager = createDrivableManager()
  private _arrangeableManager = createArrangeableManager()
  private _easingFunctionManager = createEasingFunctionManager()

  private transformDirection(progress: number) {
    if (this._direction === 'normal') return progress
    if (this._direction === 'reverse') return (1 - progress)
    if (this._direction === 'alternate') {
      const round = Math.floor(this._time / this._duration)
      return (round % 2 === 0) ? progress : (1 - progress)
    }
    throw new Error('')
  }

  private callDrivable() {
    const residue = Math.fround(this._time % this._duration)
    const percentage = Math.abs(residue / this._duration)
    const normalized = percentage === 0 ? (this._time === 0 ? 0 : 1) : percentage
    const transformDirectionProgress = this.transformDirection(normalized)
    const progress = this._easingFunctionManager.call(transformDirectionProgress)
    this._drivableManager.call(progress)
  }

  private isCompleted() {
    if (this._repeat === Infinity || this._repeat === 'Infinity') return false
    return this._time >= (this._repeat * this._duration)
  }

  private startFrame() {
    if (this._frameId != null) return
    this.nextFrame()
  }

  private nextFrame(prevTime?: number) {
    if (this.isCompleted()) {
      this.pause() // 先处理当前的结束逻辑
      this._arrangeableManager.call() // 再执行 then
      return
    }

    const nowTime = Date.now()
    this._time += nowTime - (prevTime ?? nowTime)

    if (typeof this._repeat === 'number') {
      const totalTime = this._repeat * this._duration
      if (this._time > totalTime) this._time = totalTime // 对齐到末尾
    }

    this.callDrivable()
    const callback = () => this.nextFrame(nowTime)
    this._frameId = requestAnimationFrame(callback)
  }

  duration(v: number): TimeProgressDriver {
    // 优雅的支持为 0 的情况
    this._duration = isFinite(v) ? v : 1
    return this
  }

  repeat(v: number | 'Infinity'): TimeProgressDriver {
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
