import { StateComponent, NumberType } from 'hecs'

export class ModelLoading extends StateComponent {
  static props = {
    id: {
      type: NumberType,
    },
  }
}
