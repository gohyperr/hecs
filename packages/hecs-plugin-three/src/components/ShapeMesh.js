import { StateComponent } from 'hecs'
import { Object3DType } from '../types'

export class ShapeMesh extends StateComponent {
  static props = {
    value: {
      type: Object3DType,
    },
  }
}
