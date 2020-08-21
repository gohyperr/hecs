import { createPlugin } from 'hecs'

import * as Components from './components'
import * as Systems from './systems'
import { Presentation } from './Presentation'

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
  name: 'hecs-plugin-three',
  systems,
  components,
  decorate(world) {
    world.presentation = new Presentation(world)
  },
})
