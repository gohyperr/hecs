import { StateComponent, RefType } from 'hecs'

export class Object3D extends StateComponent {
  static props = {
    value: {
      type: RefType,
    },
  }
}
