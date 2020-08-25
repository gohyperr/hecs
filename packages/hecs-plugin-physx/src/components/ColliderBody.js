import { StateComponent, RefType } from 'hecs'

export class ColliderBody extends StateComponent {
  static props = {
    value: {
      type: RefType,
    },
  }
}
