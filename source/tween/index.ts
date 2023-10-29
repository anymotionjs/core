import { Time } from '../time'
import { pluginManager } from '../plugin'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TweenProperties {}
}

export type TweenPropertyDriver = (
  propertiesPair: TweenPropertiesPair,
  element: Element
) => TweenPropertyDrive | null

export interface TweenPropertyDrive {
  transform: (progress: number) => void
}

interface TweenPropertiesPair {
  from?: TweenProperties
  to?: TweenProperties
}

export class Tween {
  public time = new Time()
  private _elements: Element[] = []
  private _to: TweenProperties = {}
  private _from: TweenProperties = {}
  private _propertyDrives: TweenPropertyDrive[] = []

  constructor(elementSelector: string | Element) {
    if (elementSelector instanceof Element) {
      this._elements.push(elementSelector)
    }

    if (typeof elementSelector === 'string') {
      this._elements.push(...document.querySelectorAll(elementSelector))
    }

    this.time.listen(progress => {
      if (this._elements.length === 0) return
      if (this._propertyDrives.length === 0) return
      for (const drive of this._propertyDrives) {
        drive.transform(progress)
      }
    })
  }

  private createDrives() {
    if (this._elements == null) return
    if (this._from == null && this._to == null) return // 不能都为 null
    if (Object.keys(this._from).length === 0 && Object.keys(this._to).length === 0) return // 不能都为空对象 {}

    const newDrives: TweenPropertyDrive[] = []
    const pair = { from: this._from, to: this._to }
    for (const creator of pluginManager.getTweenPropertyDrivers()) {
      for (const element of this._elements) {
        const driver = creator(pair, element)
        if (driver != null) newDrives.push(driver)
      }
    }

    this._propertyDrives = newDrives
  }

  to(properties: TweenProperties): Tween {
    this._to = properties
    this.createDrives()
    return this
  }

  from(properties: TweenProperties): Tween {
    this._from = properties
    this.createDrives()
    return this
  }
}

export type TweenTo = (typeof Tween.prototype)['to']
export type TweenForm = (typeof Tween.prototype)['from']
