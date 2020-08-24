import { Component } from 'hecs'
import { AssetType } from 'hecs-plugin-core'

export class Model extends Component {
  static props = {
    asset: {
      type: AssetType,
      editor: {
        label: 'Asset',
        accept: '.glb,.gltf',
      },
    },
  }
  static editor = {
    label: 'Model',
  }
}
