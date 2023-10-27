import { EasingFunction, easingFunction as InnerEasingFunction } from './easing-function'

const mimInterval = 8 //ms ~=120fps

type Listener = (
  /** 百分比； 0-1 */
  progress: number
) => void

/**
 * 
 */
export class Time {
  private _time = 0
  private _duration = mimInterval
  private _timeoutId: number | undefined
  private _listeners = new Map<string, Listener>()
  private _easingFunction = InnerEasingFunction.linear

  private noticeListeners() {
    const residue = this._time % this._duration
    const rate = residue / this._duration
    const progress = this._easingFunction(rate)
    this._listeners.forEach(listener => listener(progress))
  }

  private updateTime() {
    this._timeoutId = window.setTimeout(() => {
      this._time += mimInterval
      this.updateTime()
      this.noticeListeners()
    }, mimInterval)
  }

  duration(v: number): Time {
    // _duration 最小值为 mimInterval
    this._duration = isFinite(v) ? v : mimInterval
    return this
  }

  easingFunction(func: EasingFunction): Time {
    this._easingFunction = func
    return this
  }

  paly(): Time {
    this.updateTime()
    return this
  }

  pause(): Time {
    if (this._timeoutId) clearTimeout(this._timeoutId)
    return this
  }

  listen(listener: Listener) {
    const id = Math.random().toFixed(16)
    this._listeners.set(id, listener)
    return () => this._listeners.delete(id)
  }
}
