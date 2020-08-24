import { StateComponent, RefType } from 'hecs'

export class ModelMesh extends StateComponent {
  static props = {
    value: {
      type: RefType,
    },
  }
}
