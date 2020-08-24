import { StateComponent, RefType } from 'hecs'

export class ShapeMesh extends StateComponent {
  static props = {
    value: {
      type: RefType,
    },
  }
}
