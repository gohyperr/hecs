import { createPlugin } from 'hecs'
import CorePlugin from 'hecs-plugin-core'

import * as Components from './components'
import * as Systems from './systems'
import { Physics } from './Physics'

export * from './types'
export * from './components'

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
  name: 'hecs-plugin-physx',
  plugins: [CorePlugin],
  systems,
  components,
  decorate(world) {
    if (!PhysX) {
      throw new Error(
        'hecs-plugin-physx: PhysX should be loaded and available globally under "PhysX"'
      )
    }
    world.physics = new Physics(world)
  },
})
