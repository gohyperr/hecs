import EventEmitter from 'eventemitter3'
import { SystemManager } from './SystemManager'
import { QueryManager } from './QueryManager'
import { ArchetypeManager } from './ArchetypeManager'
import { EntityManager } from './EntityManager'
import { ComponentManager } from './ComponentManager'
import { createPlugin } from './createPlugin'

export class World extends EventEmitter {
  constructor(options = {}) {
    super()
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
    ).then(() => {
      this.archetypes.init()
      this.systems.init()
      this.emit('ready')
    })
  }

  async registerPlugin(plugin) {
    if (this.plugins.has(plugin)) {
      console.warn(`hecs: already registered plugin '${plugin.name}'`)
      return
    }
    this.plugins.set(plugin, true)

    // Async forEach, adhering strictly to sequence
    await plugin.plugins.reduce(async (memo, plugin) => {
      await memo
      await this.registerPlugin(plugin)
    }, undefined)

    plugin.systems.forEach(System => {
      this.systems.register(System)
    })
    plugin.components.forEach(Component => {
      this.components.register(Component)
    })
    return Promise.resolve(plugin.decorate(this)).then(() => {
      console.log(`hecs: registered plugin '${plugin.name}'`)
    })
  }

  update(delta) {
    this.version++
    this.systems.update(delta)
  }

  reset() {
    this.entities.reset()
    this.update((1 / 60) * 2)
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
