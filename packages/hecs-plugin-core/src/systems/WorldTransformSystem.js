import { System, Not, Groups } from 'hecs'
import { WorldTransform, Transform, Parent } from '../components'
import { Matrix4 } from '../Matrix4'

export class WorldTransformSystem extends System {
  order = Groups.Simulation - 10

  static queries = {
    new: [Transform, Not(WorldTransform)],
    active: [Transform, WorldTransform],
    removed: [Not(Transform), WorldTransform],
  }

  init() {
    this.frame = 0
  }

  update() {
    this.frame++
    this.queries.new.forEach(entity => {
      entity.add(WorldTransform)
      console.log(`WorldTransform: added to ${entity.name}`)
    })
    this.queries.active.forEach(entity => {
      this.updateTransform(entity.id)
    })
    this.queries.removed.forEach(entity => {
      entity.remove(WorldTransform)
      console.log(`WorldTransform: removed from ${entity.name}`)
    })
  }

  updateTransform(entityId) {
    const entity = this.world.entities.getById(entityId)

    const transform = entity.get(Transform)
    const world = entity.get(WorldTransform)
    const parentId = entity.get(Parent)?.id

    if (world.frame === this.frame) {
      return world
    }

    if (!transform.matrix) transform.matrix = new Matrix4()
    if (!world.matrix) world.matrix = new Matrix4()

    transform.matrix.compose(
      transform.position,
      transform.rotation,
      transform.scale
    )

    if (parentId) {
      const parentWorld = this.updateTransform(parentId)
      world.matrix.multiplyMatrices(parentWorld.matrix, transform.matrix)
    } else {
      world.matrix.copy(transform.matrix)
    }

    world.matrix.decompose(world.position, world.rotation, world.scale)
    world.frame = this.frame

    return world
  }
}
