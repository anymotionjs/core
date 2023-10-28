import { EasingFunction, easingFunction as InnerEasingFunction } from './easing-function'
export type { EasingFunction } from './easing-function'

type Listener = (
  /** 百分比； 0-1 */
  progress: number
) => void

export type Direction = 'normal' | 'reverse' | 'alternate'

/**
 * 时间；动画的驱动
 */
export class Time {
  static EasingFunction = InnerEasingFunction

  private _time = 0
  private _round = 1
  private _repeat = 1
  private _duration = 1 // TODO：优化对 0 的处理方式
  private _frameId: number | undefined
  private _direction: Direction = 'normal'
  private _listeners = new Map<string, Listener>()
  private _easingFunction = Time.EasingFunction.linear

  private noticeListeners() {
    const rate = Math.abs(this._time / this._duration)
    const progress = this._easingFunction(rate)
    this._listeners.forEach(listener => listener(progress))
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
    this.nextFrame()
  }

  private nextFrame(prevTime?: number) {
    const mustPrevTime = prevTime ?? Date.now()

    this._frameId = requestAnimationFrame(() => {
      if (this.isCompleted()) return
      const consumedTime = Date.now() - mustPrevTime
      this._time += (consumedTime * this.getDirection())

      if (this._time < 0) {
        this._round += 1
        if (this._direction === 'reverse') {
          this._time = this._duration
        }
      }

      if (this._time > this._duration) {
        this._round += 1
        if (this._direction === 'normal') {
          this._time = 0
        }
      }

      this.noticeListeners()
      this.nextFrame()
    })
  }

  duration(v: number): Time {
    // 优雅的支持为 0 的情况
    this._duration = isFinite(v) ? v : 1
    return this
  }

  repeat(v: number): Time {
    this._repeat = v
    return this
  }

  direction(v: Direction): Time {
    this._direction = v
    return this
  }

  easingFunction(func: EasingFunction): Time {
    this._easingFunction = func
    return this
  }

  paly(): Time {
    if (this.isCompleted()) this._time = 0
    this.startFrame()
    return this
  }

  pause(): Time {
    if (this._frameId) {
      cancelAnimationFrame(this._frameId)
      this._frameId = undefined
    }
    return this
  }

  listen(listener: Listener) {
    const id = Math.random().toFixed(16)
    this._listeners.set(id, listener)
    return () => this._listeners.delete(id)
  }
}
