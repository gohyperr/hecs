import { SystemManager } from './SystemManager'
import { QueryManager } from './QueryManager'
import { ArchetypeManager } from './ArchetypeManager'
import { EntityManager } from './EntityManager'
import { ComponentManager } from './ComponentManager'
import { createPlugin } from './createPlugin'

export class World {
  constructor(options = {}) {
    this.id = 0
    this.version = 0
    this.plugins = new Map()
    this.providers = {}
    this.systems = new SystemManager(this)
    this.queries = new QueryManager(this)
    this.archetypes = new ArchetypeManager(this)
    this.entities = new EntityManager(this)
    this.components = new ComponentManager(this)
    this.registerPlugin(
      createPlugin({
        name: 'root',
        ...options,
      })
    )
    this.archetypes.init()
    this.systems.init()
  }

  registerPlugin(plugin) {
    if (this.plugins.has(plugin)) {
      console.warn(`ECS: already registered plugin '${plugin.name}'`)
      return
    }
    plugin.plugins.forEach(plugin => {
      this.registerPlugin(plugin)
    })
    plugin.systems.forEach(System => {
      this.systems.register(System)
    })
    plugin.components.forEach(Component => {
      this.components.register(Component)
    })
    for (const name in plugin.providers) {
      if (this.providers[name]) {
        throw new Error(`ECS: provider ${name} already taken`)
      }
      this.providers[name] = plugin.providers[name]
    }
    this.plugins.set(plugin, true)
    console.log(`ECS: registered plugin '${plugin.name}'`)
  }

  update(delta) {
    this.version++
    this.systems.update(delta)
  }

  reset() {
    this.entities.reset()
    this.update()
    this.systems.reset()
  }

  toJSON() {
    const data = {
      nextEntityId: this.entities.nextEntityId,
      entities: [],
    }
    this.entities.entities.forEach(entity =>
      data.entities.push(entity.toJSON())
    )
    return data
  }

  fromJSON(data) {
    this.entities.nextEntityId = data.nextEntityId
    data.entities.forEach(entity => {
      this.entities.create(entity.name, entity.id).fromJSON(entity).activate()
    })
  }
}
