import { System, Groups } from 'hecs'
import {
  Transform,
  WorldTransform,
  Parent,
  Matrix4,
  Vector3,
  Quaternion,
} from 'hecs-plugin-core'
import { RigidBody, RigidBodyRef } from '../components'
import { createFixedTimestep } from '../utils/createFixedTimestep'

const TIMESTEP = 1 / 60
const v3_1 = new Vector3()
const q_1 = new Quaternion()
const m4_1 = new Matrix4()
const m4_2 = new Matrix4()
const m4_3 = new Matrix4()
const scale = new Vector3(1, 1, 1)

export class PhysicsSystem extends System {
  order = Groups.Simulation

  static queries = {
    default: [RigidBodyRef, Transform, WorldTransform],
  }

  init() {
    this.update = createFixedTimestep(TIMESTEP, this.fixedUpdate.bind(this))
  }

  fixedUpdate() {
    const { scene } = this.world.physics

    this.queries.default.forEach(entity => {
      const world = entity.get(WorldTransform)
      const spec = entity.get(RigidBody)
      const body = entity.get(RigidBodyRef).value

      // @todo Should we teleport if the distance is huge?

      if (spec.kind === 'KINEMATIC') {
        body.setKinematicTarget({
          translation: world.position,
          rotation: world.rotation,
        })
      }
      if (spec.kind === 'STATIC' || spec.kind === 'DYNAMIC') {
        body.setGlobalPose(
          {
            translation: world.position,
            rotation: world.rotation,
          },
          false
        )
      }
      if (spec.kind === 'DYNAMIC') {
        body.setAngularVelocity(spec.angularVelocity, false)
        body.setLinearVelocity(spec.linearVelocity, true) // autowake is true here, may be more performant?
      }
    })

    scene.simulate(TIMESTEP, true)
    scene.fetchResults(true)

    this.queries.default.forEach(entity => {
      const parentId = entity.get(Parent)?.id
      const local = entity.get(Transform)
      const world = entity.get(WorldTransform)
      const spec = entity.get(RigidBody)
      const body = entity.get(RigidBodyRef).value

      if (spec.kind === 'DYNAMIC') {
        const pose = body.getGlobalPose()

        if (!parentId) {
          local.position.copy(pose.translation)
          local.rotation.copy(pose.rotation)
        } else {
          // Example:
          // worldY = 3 localY = 1 (this means parentWorldY = 2)
          // simulate()
          // simWorldY = 2.9
          // newWorldY = 2.9 newLocalY = 0.9
          // newLocalY = localY + (simWorldY - worldY)

          // copy sim values into three.js constructs
          v3_1.copy(pose.translation)
          q_1.copy(pose.rotation)
          // make a sim world matrix
          m4_1.compose(v3_1, q_1, scale)
          // make an inverse world matrix
          m4_2.getInverse(world.matrix)
          // -world * sim (diff to apply to local)
          m4_3.multiplyMatrices(m4_2, m4_1)
          // add diff matrix to local
          local.matrix.multiply(m4_3)
          // decompose and update world
          local.matrix.decompose(local.position, local.rotation, local.scale)
          world.matrix.copy(m4_1)
          world.matrix.decompose(world.position, world.rotation, world.scale)
        }

        spec.angularVelocity.copy(body.getAngularVelocity())
        spec.linearVelocity.copy(body.getLinearVelocity())
      }
    })
  }
}
