import { Entity } from './Entity'

export class EntityManager {
  constructor(world) {
    this.world = world
    this.entities = new Map()
    this.nextEntityId = 0
  }

  create(name, id) {
    if (!id) id = `${this.world.id}:${this.nextEntityId++}`
    const entity = new Entity(this.world, name, id)
    return entity
  }

  getById(id) {
    return this.entities.get(id)
  }

  onEntityActive(entity) {
    this.entities.set(entity.id, entity)
  }

  onEntityInactive(entity) {
    this.entities.delete(entity.id)
  }

  reset() {
    this.entities.forEach(entity => {
      entity.destroy()
    })
  }
}
