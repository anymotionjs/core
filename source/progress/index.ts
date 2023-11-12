import { EasingFunction } from './common/easing-function'

export { easingFunction } from './common/easing-function'
export { ScrollProgressDriver } from './scroll'
export { TimeProgressDriver } from './time'

export type ProgressListener = (progress: number) => void

export interface Drivable {
  progress(v: number): void
}

export interface ProgressDriver {
  drive(drivable: Drivable): ProgressDriver
  ease(func: EasingFunction): ProgressDriver
}
