import { StateComponent, RefType } from 'hecs'

export class ImageMesh extends StateComponent {
  static props = {
    value: {
      type: RefType,
    },
  }
}
