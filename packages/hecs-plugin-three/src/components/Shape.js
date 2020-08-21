import { Component, NumberType } from 'hecs'
import { SelectType, Vector3Type, ColorType, Vector3 } from 'hecs-plugin-core'

export class Shape extends Component {
  static label = 'Shape'
  static props = {
    kind: {
      type: SelectType,
      label: 'Kind',
      options: [
        { label: 'Box', value: 'BOX' },
        { label: 'Sphere', value: 'SPHERE' },
        { label: 'Capsule', value: 'CAPSULE' },
      ],
      default: 'BOX',
    },
    boxSize: {
      type: Vector3Type,
      label: 'Size',
      default: new Vector3(1, 1, 1),
      requires: [{ prop: 'kind', value: 'BOX' }],
    },
    sphereRadius: {
      type: NumberType,
      label: 'Radius',
      default: 0.5,
      requires: [{ prop: 'kind', value: 'SPHERE' }],
    },
    sphereWidthSegments: {
      type: NumberType,
      label: 'Width Segments',
      default: 16,
      requires: [{ prop: 'kind', value: 'SPHERE' }],
    },
    sphereHeightSegments: {
      type: NumberType,
      label: 'Height Segments',
      default: 12,
      requires: [{ prop: 'kind', value: 'SPHERE' }],
    },
    capsuleRadius: {
      type: NumberType,
      label: 'Radius',
      default: 0.5,
      requires: [{ prop: 'kind', value: 'CAPSULE' }],
    },
    capsuleHeight: {
      type: NumberType,
      label: 'Height',
      default: 1,
      requires: [{ prop: 'kind', value: 'CAPSULE' }],
    },
    capsuleSegments: {
      type: NumberType,
      label: 'Segments',
      default: 5,
      requires: [{ prop: 'kind', value: 'CAPSULE' }],
    },
    color: {
      type: ColorType,
      label: 'Color',
    },
  }
}
