import { Component } from 'hecs'
import { Vector3Type, QuaternionType } from '../types'
import { Vector3 } from '../Vector3'

export class WorldTransform extends Component {
  static label = 'World Transform'
  static editor = false
  static props = {
    position: {
      type: Vector3Type,
      label: 'Position',
    },
    rotation: {
      type: QuaternionType,
      label: 'Rotation',
    },
    scale: {
      type: Vector3Type,
      label: 'Scale',
      default: new Vector3(1, 1, 1),
    },
  }
}
