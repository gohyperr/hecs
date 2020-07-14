import { Entity } from './Entity'

export class EntityManager {
  constructor(world) {
    this.world = world
    this.entities = new Map()
    this.lastEntityId = 0
  }

  create(name, id) {
    if (!id) id = `${this.world.id}:${this.lastEntityId++}`
    const entity = new Entity(this.world, name, id)
    return entity
  }

  onEntityActive(entity) {
    this.entities.set(entity.id, entity)
  }

  onEntityInactive(entity) {
    this.entities.delete(entity.id)
  }
}
