import * as Components from './components'
import * as Systems from './systems'
import { createPlugin } from 'hecs'

export * from './types'
export * from './components'

export { Asset } from './Asset'
export { Quaternion } from './Quaternion'
export { Vector3 } from './Vector3'

export { Components }

// convert Components into an array
const components = []
for (const key in Components) {
  components.push(Components[key])
}

// convert Systems into an array
const systems = []
for (const key in Systems) {
  systems.push(Systems[key])
}

export default createPlugin({
  name: 'hecs-plugin-core',
  systems,
  components,
})
