import { Component, NumberType, BooleanType } from 'hecs'

export class CharacterController extends Component {
  static props = {
    radius: {
      type: NumberType,
      default: 0.5,
      editor: {
        label: 'Radius',
      },
    },
    height: {
      type: NumberType,
      default: 1,
      editor: {
        label: 'Height',
      },
    },
    slopeLimit: {
      type: NumberType,
      default: 40, // in degrees | slopeLimit = cosf(PxMath::degToRad(45.0f)); | 0 is no limit ---- TODO REMOVE
      editor: {
        label: 'Slope Limit',
      },
    },
    contactOffset: {
      type: NumberType,
      default: 0.1, // PhysX Default
      editor: {
        label: 'Contact Offset',
      },
    },
    stepOffset: {
      type: NumberType,
      default: 0.5, // PhysX Default
      editor: {
        label: 'Step Offset',
      },
    },
  }
  static editor = {
    label: 'Character Controller',
  }
}
