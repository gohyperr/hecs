import { Component, StringType, NumberType } from 'hecs'
import { Vector3, Vector3Type } from 'hecs-plugin-core'

export class Collider extends Component {
  static props = {
    shape: {
      type: StringType,
      default: 'BOX',
      editor: {
        label: 'Shape',
        input: 'Select',
        options: [
          { label: 'Box', value: 'BOX' },
          { label: 'Sphere', value: 'SPHERE' },
        ],
      },
    },
    boxSize: {
      type: Vector3Type,
      default: new Vector3(1, 1, 1),
      editor: {
        label: 'Size',
        requires: [{ prop: 'shape', value: 'BOX' }], // TODO: fix and re-test as it is broken
      },
    },
    sphereRadius: {
      type: NumberType,
      default: 0.5,
      editor: {
        label: 'Radius',
        requires: [{ prop: 'shape', value: 'SPHERE' }], // TODO: fix and re-test as it is broken
      },
    },
    material: {
      type: Vector3Type,
      default: new Vector3(0.6, 0.6, 0),
      editor: {
        label: 'Material',
      },
    },
    layer: {
      type: NumberType,
      editor: {
        label: 'Layer',
        input: 'Layer',
      },
    },
  }
  static editor = {
    label: 'Collider',
  }
}
