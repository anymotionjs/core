
import { createElementSelector } from '../helps'
import { pluginManager } from '../plugin'
import { Drivable } from '../progress'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TweenProperties {}
}

export type TweenPropertyDriver = (
  propertiesPair: TweenPropertiesPair,
  element: Element
) => TweenPropertyDrive | null

export interface TweenPropertyDrive {
  drive: (progress: number) => void
}

interface TweenPropertiesPair {
  from?: TweenProperties
  to?: TweenProperties
}

function findAdjacentNumbers(arr: number[], num: number): [number, number] {
  const adjacentNumbers: [number, number] = [0, 1]
  const sortedArr = arr.sort((a, b) => a - b)

  for (let i = 0; i < sortedArr.length; i++) {
    if (sortedArr[i] > num) {
      adjacentNumbers[1] = sortedArr[i]
      // 碰到第一个比 num 大的就跳出循环
      break
    }

    adjacentNumbers[0] = sortedArr[i]
  }

  return adjacentNumbers
}

function tweenRelativePropertyDrive(drive: TweenPropertyDrive, range: [number, number]): TweenPropertyDrive {
  const proxy: TweenPropertyDrive = {
    drive(progress) {
      const [from, to] = range
      const totalDuration = to - from
      const relativeProgress = (progress - from) / totalDuration
      drive.drive(relativeProgress)
    }
  }

  Object.setPrototypeOf(proxy, drive)
  return proxy
}

export class Tween implements Drivable {
  private _elementSelector = createElementSelector()
  private _keyFrames = new Map<number, TweenProperties>()
  private _propertyDrives = new Map<number, TweenPropertyDrive[]>()

  constructor(...elementSelector: Array<string | Element>) {
    this._elementSelector.setSelector(...elementSelector)
  }

  private getPropertyDrives(progress: number): TweenPropertyDrive[] {
    if (!this._keyFrames.has(0)) this._keyFrames.set(0, {})
    if (!this._keyFrames.has(1)) this._keyFrames.set(1, {})

    const keys = Array.from(this._keyFrames.keys())
    const [fromProgress, toProgress] = findAdjacentNumbers(keys, progress)

    const toProperty = this._keyFrames.get(toProgress)
    const fromProperty = this._keyFrames.get(fromProgress)
    const toPropertyDrives = this._propertyDrives.get(toProgress) || []
    // 查找当前区间的动画（不存在则创建）
    if (toPropertyDrives.length === 0) {
      const elements = this._elementSelector.getElements()
      for (const driver of pluginManager.getTweenPropertyDrivers()) {
        for (const element of elements) {
          const drive = driver({ from: fromProperty, to: toProperty }, element)
          // 通过 tweenRelativePropertyDrive 将 progress 映射成局部的 progress
          if (drive != null) toPropertyDrives.push(tweenRelativePropertyDrive(drive, [fromProgress, toProgress]))
        }
      }

      this._propertyDrives.set(toProgress, toPropertyDrives)
    }

    const result = this._propertyDrives.get(toProgress) || []
    return result
  }

  progress(v: number) {
    if (this._elementSelector.getElements().length === 0) return

    const propertyDrives = this.getPropertyDrives(v)
    for (const drive of propertyDrives) {
      drive.drive(v)
    }
  }

  to(properties: TweenProperties): Tween {
    this.addKeyFrame(1, properties)
    return this
  }

  from(properties: TweenProperties): Tween {
    this.addKeyFrame(0, properties)
    return this
  }

  addKeyFrame(progress: number, properties: TweenProperties): Tween
  addKeyFrame(progress: number[], properties: TweenProperties): Tween
  addKeyFrame(progress: number[] | number, properties: TweenProperties): Tween {
    if (Object.keys(properties).length === 0) throw new Error('??')

    const progressArray = Array.isArray(progress) ? progress : [progress]
    for (const progress of progressArray) {
      this._keyFrames.set(progress, properties)
    }

    // 更新了 keyFrames 则重新生成 Drives
    this._propertyDrives.clear()
    return this
  }
}
