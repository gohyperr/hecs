import { SystemManager } from './SystemManager'
import { QueryManager } from './QueryManager'
import { ArchetypeManager } from './ArchetypeManager'
import { EntityManager } from './EntityManager'
import { ComponentManager } from './ComponentManager'

export class World {
  constructor({ idSize = 64 } = {}) {
    this.id = 0
    this.version = 0
    this.systems = new SystemManager(this)
    this.queries = new QueryManager(this)
    this.archetypes = new ArchetypeManager(this, idSize)
    this.entities = new EntityManager(this)
    this.components = new ComponentManager(this)
  }

  addPlugin(plugin) {
    plugin(this)
    return this
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
