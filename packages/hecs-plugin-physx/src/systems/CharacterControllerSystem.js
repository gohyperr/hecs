import { System, Groups, Not, Modified } from 'hecs'
import { WorldTransform, Transform, Vector3 } from 'hecs-plugin-core'
import { CharacterController, CharacterControllerRef } from '../components'

const DEG2RAD = Math.PI / 180

export class CharacterControllerSystem extends System {
  order = Groups.Initialization

  static queries = {
    added: [WorldTransform, CharacterController, Not(CharacterControllerRef)],
    modified: [Modified(CharacterController), CharacterControllerRef],
    removed: [Not(CharacterController), CharacterControllerRef],
  }

  update() {
    this.queries.added.forEach(entity => {
      this.build(entity)
    })
    this.queries.modified.forEach(entity => {
      this.build(entity)
    })
    this.queries.removed.forEach(entity => {
      const ref = entity.get(CharacterControllerRef)
      ref.value.release()
      ref.value = null
      entity.remove(CharacterControllerRef)
    })
  }

  build(entity) {
    const { physics, controllerManager } = this.world.physics
    const spec = entity.get(CharacterController)
    const world = entity.get(WorldTransform)

    const desc = new PhysX.PxCapsuleControllerDesc()
    desc.height = spec.height
    desc.radius = spec.radius
    desc.slopeLimit = spec.slopeLimit * DEG2RAD
    const material = physics.createMaterial(0.2, 0.2, 0.2)
    desc.setMaterial(material)
    desc.contactOffset = spec.contactOffset
    desc.stepOffset = spec.stepOffset
    const controller = controllerManager.createController(desc)
    // controller.setSimulationFilterData(layers.get(1).data)
    controller.setFootPosition(world.position)

    desc.delete()
    material.delete()

    if (entity.has(CharacterControllerRef)) {
      const ref = entity.get(CharacterControllerRef)
      ref.value.release()
      ref.value = controller
      ref.modified()
    } else {
      entity.add(CharacterControllerRef, { value: controller })
    }
  }
}
