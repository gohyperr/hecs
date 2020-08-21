import { StateComponent, NumberType } from 'hecs'

export class ModelLoading extends StateComponent {
  static label = 'Model Loading'
  static props = {
    id: {
      type: NumberType,
      label: 'ID',
    },
  }
}
