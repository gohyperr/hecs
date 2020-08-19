import { Component } from 'hecs'
import * as Types from '../types'

export class Foo extends Component {
  static props = {
    value: {
      type: Types.Color,
      label: 'Shape',
    },
  }
}
