import type { EasingFunction } from './type'

// 线性缓动函数
export const linear: EasingFunction = (t: number) => t

// 平方缓动函数
export const easeInQuad: EasingFunction = (t: number) => t * t
export const easeOutQuad: EasingFunction = (t: number) => t * (2 - t)
export const easeInOutQuad: EasingFunction = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

// 立方缓动函数
export const easeInCubic: EasingFunction = (t: number) => t * t * t
export const easeOutCubic: EasingFunction = (t: number) => --t * t * t + 1
export const easeInOutCubic: EasingFunction = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

// 四次方缓动函数
export const easeInQuart: EasingFunction = (t: number) => t * t * t * t
export const easeOutQuart: EasingFunction = (t: number) => 1 - --t * t * t * t
export const easeInOutQuart: EasingFunction = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t

// 五次方缓动函数
export const easeInQuint: EasingFunction = (t: number) => t * t * t * t * t
export const easeOutQuint: EasingFunction = (t: number) => 1 + --t * t * t * t * t
export const easeInOutQuint: EasingFunction = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t

// 正弦缓动函数
export const easeInSine: EasingFunction = (t: number) => 1 - Math.cos((t * Math.PI) / 2)
export const easeOutSine: EasingFunction = (t: number) => Math.sin((t * Math.PI) / 2)
export const easeInOutSine: EasingFunction = (t: number) => (1 - Math.cos(Math.PI * t)) / 2

// 指数缓动函数
export const easeInExpo: EasingFunction = (t: number) => Math.pow(2, 10 * (t - 1))
export const easeOutExpo: EasingFunction = (t: number) => 1 - Math.pow(2, -10 * t)
export const easeInOutExpo: EasingFunction = (t: number) => {
  t /= 0.5
  if (t < 1) {
    return 0.5 * Math.pow(2, 10 * (t - 1))
  }
  return 0.5 * (2 - Math.pow(2, -10 * --t))
}

// 弹性缓动函数
export const easeInElastic: EasingFunction = (t: number) =>
  t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
export const easeOutElastic: EasingFunction = (t: number) =>
  t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1
export const easeInOutElastic: EasingFunction = (t: number) => {
  t /= 0.5
  if (t === 2) return 1
  const p = (Math.PI * 2) * (t - 1 / 4)
  return t < 1
    ? -0.5 * Math.pow(2, 10 * --t) * Math.sin(p)
    : Math.pow(2, -10 * --t) * Math.sin(p) * 0.5 + 1
}

// 弹跳缓动函数
export const easeInBounce: EasingFunction = (t: number) => 1 - easeOutBounce(1 - t)
export const easeOutBounce: EasingFunction = (t: number) => {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t
  } else if (t < 2 / 2.75) {
    t -= 1.5 / 2.75
    return 7.5625 * t * t + 0.75
  } else if (t < 2.5 / 2.75) {
    t -= 2.25 / 2.75
    return 7.5625 * t * t + 0.9375
  } else {
    t -= 2.625 / 2.75
    return 7.5625 * t * t + 0.984375
  }
}
