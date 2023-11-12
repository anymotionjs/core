export type Arrangeable =
  | ArrangeableCreator
  | ArrangeableObject

export interface ArrangeableCreator {
  (): ArrangeableObject
}

export type ArrangeableObject = {
  play(): ArrangeableObject
  then(...arrangeable: Arrangeable[]): ArrangeableObject
}
