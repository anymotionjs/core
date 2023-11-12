import { EasingFunction } from '../easing-function'

export type ProgressListener = (progress: number) => void

export interface Drivable {
  progress(v: number): void
}

export interface ProgressDriver {
  drive(drivable: Drivable): ProgressDriver
  ease(func: EasingFunction): ProgressDriver
}
