import { Component } from 'hecs'
import { EntityType } from '../types'

export class Parent extends Component {
  static label = 'Parent'
  static editor = false
  static props = {
    id: {
      type: EntityType,
      label: 'Entity',
    },
  }
}
