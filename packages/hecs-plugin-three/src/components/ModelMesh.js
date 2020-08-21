import { StateComponent } from 'hecs'
import { Object3DType } from '../types'

export class ModelMesh extends StateComponent {
  static props = {
    value: {
      type: Object3DType,
      label: 'Object3D',
    },
  }
}
