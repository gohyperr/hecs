import { System, Groups, Not, Modified } from 'hecs'
import { Transform } from 'hecs-plugin-core'
import { RigidBody, RigidBodyRef } from '../components'

export class RigidBodySystem extends System {
  order = Groups.Initialization

  static queries = {
    added: [RigidBody, Not(RigidBodyRef)],
    modified: [Modified(RigidBody), RigidBodyRef],
    removed: [Not(RigidBody), RigidBodyRef],
  }

  update() {
    const { scene, entityIdByActor } = this.world.physics

    // create RigidBodyRef from spec
    this.queries.added.forEach(entity => {
      this.build(entity)
    })

    // replace RigidBodyRef with new spec
    this.queries.modified.forEach(entity => {
      const spec = entity.get(RigidBody)
      const body = entity.get(RigidBodyRef).value
      scene.removeActor(body, null)
      entityIdByActor.delete(body.$$.ptr)

      // @note We cant delete the reference because ColliderSystem
      // needs to detach its shape from this.
      // body.delete()

      this.build(entity)
    })

    // remove RigidBody
    this.queries.removed.forEach(entity => {
      const body = entity.get(RigidBodyRef).value
      scene.removeActor(body, null)
      entityIdByActor.delete(body.$$.ptr)

      // @note We cant delete the reference because ColliderSystem
      // needs to detach its shape from this.
      // body.delete()

      entity.remove(RigidBodyRef)
    })
  }

  build(entity) {
    const { physics, scene, entityIdByActor } = this.world.physics
    const spec = entity.get(RigidBody)
    const transform = entity.get(Transform)

    let body
    if (spec.kind === 'STATIC') {
      body = physics.createRigidStatic({
        translation: transform.position,
        rotation: transform.rotation,
      })
    } else if (spec.kind === 'KINEMATIC') {
      body = physics.createRigidDynamic({
        translation: transform.position,
        rotation: transform.rotation,
      })
      body.setRigidBodyFlag(PhysX.PxRigidBodyFlag.eKINEMATIC, true)
      body.setRigidBodyFlag(PhysX.PxRigidBodyFlag.eENABLE_CCD, false)
    } else if (spec.kind === 'DYNAMIC') {
      body = physics.createRigidDynamic({
        translation: transform.position,
        rotation: transform.rotation,
      })
      body.setRigidBodyFlag(PhysX.PxRigidBodyFlag.eKINEMATIC, false)
      body.setRigidBodyFlag(PhysX.PxRigidBodyFlag.eENABLE_CCD, true)
      body.setMass(spec.mass)
    }

    entity.add(RigidBodyRef, { value: body })
    entityIdByActor.set(body.$$.ptr, entity.id)
    scene.addActor(body, null)
  }
}
