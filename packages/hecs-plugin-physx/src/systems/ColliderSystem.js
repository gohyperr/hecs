import { System, Groups, Not, Modified } from 'hecs'
import { Parent, Transform } from 'hecs-plugin-core'
import {
  RigidBodyRef,
  Collider,
  ColliderRef,
  ColliderBody,
} from '../components'

export class ColliderSystem extends System {
  order = Groups.Initialization

  static queries = {
    new: [Collider, Not(ColliderRef)],
    modified: [Modified(Collider), ColliderRef],
    unattached: [ColliderRef, Not(ColliderBody)],
    removed: [Not(Collider), ColliderRef],
  }

  update() {
    // create ColliderRef from spec
    this.queries.new.forEach(entity => {
      this.build(entity)
    })

    // replace ColliderRef from new spec
    this.queries.modified.forEach(entity => {
      const shape = entity.get(ColliderRef).value
      const body = entity.get(ColliderBody)?.value
      if (body) {
        body.detachShape(shape, true)
        entity.remove(ColliderBody)
      }
      shape.delete()
      entity.remove(ColliderRef)
      this.build(entity)
    })

    // attempt to attach ColliderRef to own/parent RigidBody
    this.queries.unattached.forEach(entity => {
      this.attach(entity)
    })

    // remove ColliderRef
    this.queries.removed.forEach(entity => {
      const shape = entity.get(ColliderRef).value
      const body = entity.get(ColliderBody)?.value
      if (body) {
        body.detachShape(shape, true)
        entity.remove(ColliderBody)
      }
      shape.delete()
      entity.remove(ColliderRef)
    })
  }

  build(entity) {
    const { physics, layers } = this.world.physics
    const spec = entity.get(Collider)
    const transform = entity.get(Transform)

    let geometry
    if (spec.shape === 'SPHERE') {
      geometry = new PhysX.PxSphereGeometry(spec.sphereRadius)
    } else if (spec.shape === 'BOX') {
      // PhysX uses half-extents for size
      geometry = new PhysX.PxBoxGeometry(
        spec.boxSize.x / 2,
        spec.boxSize.y / 2,
        spec.boxSize.z / 2
      )
    } else {
      throw new Error(`ColliderSystem: invalid shape (${spec.shape})`)
    }

    let material = physics.createMaterial(
      spec.material.x,
      spec.material.y,
      spec.material.z
    )

    let flags = new PhysX.PxShapeFlags(
      PhysX.PxShapeFlag.eSCENE_QUERY_SHAPE.value |
        PhysX.PxShapeFlag.eSIMULATION_SHAPE.value
    )

    let shape = physics.createShape(geometry, material, false, flags)
    let layer = layers[spec.layer] || layers.Default

    shape.setSimulationFilterData(layer.data)
    shape.setQueryFilterData(layer.data)

    if (transform) {
      shape.setLocalPose({
        translation: transform.position,
        rotation: transform.rotation,
      })
    }

    entity.add(ColliderRef, { value: shape })

    geometry.delete()
    material.delete()
    flags.delete()
  }

  attach(entity) {
    const transform = entity.get(Transform)
    const shape = entity.get(ColliderRef).value
    let body = entity.get(RigidBodyRef)?.value

    // If this entity has its own RigidBody attach the shape with
    // an identity transform
    if (body) {
      shape.setLocalPose({
        translation: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
      })
      body.attachShape(shape)
      entity.add(ColliderBody, { value: body })
    }

    // Otherwise attempt to attach shape to a parent RigidBody
    // using local offset transforms
    if (!body) {
      let cursor = 0
      let parentId = entity.get(Parent)?.id
      while (parentId) {
        const parent = this.world.entities.getById(parentId)
        if (!parent) {
          console.log(
            `ColliderSystem: ${entity.name} has parentId but no parent found, waiting...`
          )
          break
        }
        body = parent.get(RigidBodyRef)?.value
        if (body) {
          // console.log(`ColliderSystem: ${entity.name} found body`)
          break
        }
        parentId = parent.get(Parent)?.id
        cursor++
        if (cursor >= 10) {
          console.log(`ColliderSystem: ${entity.name} cursor limit reached`)
          break
        }
        // console.log(`ColliderSystem: ${entity.name} next parentId`, parentId)
      }
      if (body) {
        shape.setLocalPose({
          translation: transform.position,
          rotation: transform.rotation,
        })
        body.attachShape(shape)
        entity.add(ColliderBody, { value: body })
      } else {
        console.log(
          'ColliderSystem: no RigidBody found on any parents, waiting...'
        )
      }
    }
  }
}
