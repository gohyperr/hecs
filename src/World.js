import { SystemManager } from './SystemManager'
import { QueryManager } from './QueryManager'
import { ArchetypeManager } from './ArchetypeManager'
import { EntityManager } from './EntityManager'
import { ComponentManager } from './ComponentManager'

export class World {
  constructor(options = {}) {
    this.version = 0
    this.systems = new SystemManager(this)
    this.queries = new QueryManager(this)
    this.archetypes = new ArchetypeManager(this, options.numComponents)
    this.entities = new EntityManager(this)
    this.components = new ComponentManager(this)
  }

  update() {
    this.version++
    this.systems.update()
  }
}
