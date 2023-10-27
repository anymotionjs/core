import { Time } from '../time'
import * as drives from './property-drives'

declare global {
  interface TweenProperties {
    [key: string]: unknown
  }
}

export interface TweenPropertyDrive {
  transform: (propertiesPair: TweenPropertiesPair, progress: number, element: Element) => void
}

interface TweenPropertiesPair {
  form?: TweenProperties
  to: TweenProperties
}

export class Tween {
  public time = new Time()
  private _to: TweenProperties = {}
  private _form: TweenProperties = {}
  private _propertyDrives = Object.values(drives)

  constructor(element: string | Element) {
    this.time.listen(progress => {
      const realElements: Element[] = []
      if (typeof element === 'string') {
        realElements.concat(...document.querySelectorAll(element))
      } else {
        realElements.concat(element)
      }

      if (realElements.length === 0) return
      const pair: TweenPropertiesPair = { form: this._form, to: this._to }
      for (let index = 0; index < this._propertyDrives.length; index++) {
        const propertyDrive = this._propertyDrives[index]
        for (let index = 0; index < realElements.length; index++) {
          propertyDrive.transform(pair, progress, realElements[index])
        }
      }
    })
  }

  to(properties: TweenProperties): Tween {
    this._to = properties
    return this
  }

  form(properties: TweenProperties): Tween {
    this._form = properties
    return this
  }
}
