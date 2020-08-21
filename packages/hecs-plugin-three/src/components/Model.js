import { Component } from 'hecs'
import { AssetType } from 'hecs-plugin-core'

export class Model extends Component {
  static label = 'Model'
  static props = {
    asset: {
      type: AssetType,
      label: 'Asset',
      accept: '.glb,.gltf',
    },
  }
}
