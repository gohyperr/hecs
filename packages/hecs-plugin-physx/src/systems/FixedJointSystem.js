import { System, Groups, Not, Modified } from 'hecs'
import { Transform, WorldTransform } from 'hecs-plugin-core'
import {
  FixedJoint,
  FixedJointRef,
  FixedJointBroke,
  RigidBodyRef,
} from '../components'

export class FixedJointSystem extends System {
  order = Groups.Initialization

  static queries = {
    new: [WorldTransform, RigidBodyRef, FixedJoint, Not(FixedJointRef)],
    removedWorld: [Not(WorldTransform), FixedJointRef],
    removedBody: [Not(RigidBodyRef), FixedJointRef],
    removed: [Not(FixedJoint), FixedJointRef],
    modified: [Modified(FixedJoint), FixedJointRef],
    broken: [FixedJointBroke],
  }

  update() {
    this.queries.new.forEach(entity => {
      this.build(entity)
    })
    this.queries.removedWorld.forEach(entity => {
      this.release(entity)
    })
    this.queries.removedBody.forEach(entity => {
      this.release(entity)
    })
    this.queries.removed.forEach(entity => {
      this.release(entity)
    })
    this.queries.modified.forEach(entity => {
      this.build(entity)
    })
    this.queries.broken.forEach(entity => {
      const joint = entity.get(FixedJointRef).value
      joint.release()
      entity.remove(FixedJoint)
      entity.remove(FixedJointRef)
      entity.remove(FixedJointBroke)
    })
  }

  release(entity) {
    const joint = entity.get(FixedJointRef).value
    joint.release()
    entity.remove(FixedJointRef)
  }

  build(entity) {
    const { physics } = this.world.physics
    const spec = entity.get(FixedJoint)

    const entityBody = entity.get(RigidBodyRef).value
    const entityWorld = entity.get(WorldTransform)

    let bodyA
    let transformA
    let bodyB
    let transformB

    // The configuration for these is a little confusing as
    // bodyA is this entity and sometimes transformA is the target entity

    // if spec.entity
    // ------------
    // bodyA        = entity RigidBodyRef
    // transformA   = target WorldTransform
    // bodyB        = target RigidBodyRef
    // transformB   = entity WorldTransform

    if (spec.entity) {
      const targetEntity = this.world.entities.getById(spec.entity)
      if (!targetEntity) {
        return console.log(
          `FixedJointSystem: ${entity.name} targets unknown entity`
        )
      }
      const targetBody = targetEntity.get(RigidBodyRef)?.value
      if (!targetBody) {
        return console.log(
          `FixedJointSystem: ${entity.name} targets ${targetEntity.name} but it has no RigidBodyRef`
        )
      }
      const targetWorld = targetEntity.get(WorldTransform)
      if (!targetWorld) {
        return console.log(
          `FixedJointSystem: ${entity.name} targets ${targetEntity.name} but it has no WorldTransform`
        )
      }

      bodyA = entity.get(RigidBodyRef).value
      transformA = {
        translation: targetWorld.position,
        rotation: targetWorld.rotation,
      }
      bodyB = targetBody
      transformB = {
        translation: entityWorld.position,
        rotation: entityWorld.rotation,
      }
    }

    // if not spec.entity
    // ------------
    // bodyA        = entity RigidBodyRef
    // transformA   = Identity
    // bodyB        = null
    // transformB   = entity WorldTransform

    if (!spec.entity) {
      bodyA = entityBody
      transformA = {
        translation: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
      }
      bodyB = null
      transformB = {
        translation: entityWorld.position,
        rotation: entityWorld.rotation,
      }
    }

    const joint = PhysX.PxFixedJointCreate(
      physics,
      bodyA,
      transformA,
      bodyB,
      transformB
    )

    // PhysX defaults break force to FLT_MAX (float max)
    // which results in an unbreakable joint.
    // This plugin uses 0 to denote unbreakable.
    joint.setBreakForce(
      spec.breakForce ? spec.breakForce : Number.MAX_SAFE_INTEGER,
      spec.breakTorque ? spec.breakTorque : Number.MAX_SAFE_INTEGER
    )

    const existing = entity.get(FixedJointRef)
    if (existing) {
      existing.joint.release()
      existing.joint = joint
      existing.modified()
    } else {
      entity.add(FixedJointRef, { value: joint })
    }
  }
}
