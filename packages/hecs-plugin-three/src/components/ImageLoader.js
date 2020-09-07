import { StateComponent, NumberType, RefType } from 'hecs'

export class ImageLoader extends StateComponent {
  static props = {
    id: {
      type: NumberType,
    },
    texture: {
      type: RefType,
    },
  }
}
