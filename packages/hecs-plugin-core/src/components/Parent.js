import { Component, StringType } from 'hecs'

export class Parent extends Component {
  static props = {
    id: {
      type: StringType,
      editor: {
        label: 'Entity',
        input: 'Entity',
      },
    },
  }
  static editor = {
    label: 'Parent',
    hidden: true,
  }
}
