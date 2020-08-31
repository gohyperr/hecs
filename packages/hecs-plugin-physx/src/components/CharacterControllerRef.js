import { StateComponent, RefType } from 'hecs'

export class CharacterControllerRef extends StateComponent {
  static props = {
    value: {
      type: RefType,
    },
  }
}
