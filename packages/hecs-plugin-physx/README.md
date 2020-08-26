| :warning: Important: This package is WIP and is not ready for use |
| --- |

# Hecs Plugin PhysX

A plugin for Hecs that adds functionality to simulate physx-js bodies.

---

## Usage

Install via npm/yarn:

```
yarn add hecs hecs-plugin-physx physx-js
```

This plugin depends on physx-js and expects you to load the wasm module as a global variable `PhysX` before instantiating your World. (note: this isn't ideal and will be improved on)

```js
import PHYSX from 'physx-js'
import { World } from 'hecs'
import PhysXPlugin from 'hecs-plugin-physx'

function createWorld() {
  const world = new World({
    plugins: [PhysXPlugin],
    systems: [/* your systems */],
    components: [/* your components */],
  })
}

window.PhysX = PHYSX({
  onRuntimeInitialized() {
    createWorld()
  }
})
```

A world instance with this plugin installed can now use all of the features below:

---

### World.physics

This prop is available if you want to extends the plugin. It contains all the shared parts for simulation such as the scene, layers and cooking.

### World.physics.layers

Use this to specify which layers collide with each other. Layers are set on each Collider component (see below). There are 7 layers available and they all collide with each other by default.

```js
const { layers } = world.physics
const Layers = {
  DEFAULT: 0,
  GHOST: 1,
}
layers.setCollision(Layers.DEFAULT, Layers.GHOST, false)
```

### World.physics.setPassive(Boolean)

In certain cases such as an editor, you may want to register the plugin and its components but not have the physics simulated. Setting passive to false will disable the systems that build rigid bodies, collider shapes, and simulate physics.

### RigidBody (Component)

This component describes the rigidbody the entity should have.

Field|Type|Default|Description
---|---|---|---
kind|String|'STATIC'|The kind of rigidbody. Options are `STATIC`, `KINEMATIC` and `DYNAMIC`
linearVelocity|Vector3|new Vector3()|The linear velocity of the body. Ignored unless kind is `DYNAMIC`.
angularVelocity|Vector3|new Vector3()|The angular velocity of the body. Ignored unless kind is `DYNAMIC`.
mass|Number|1|The mass of the body. Ignored unless kind is `DYNAMIC`.

```js
import { Transform } from 'hecs-plugins-core'
import { RigidBody } from 'hecs-plugins-physx'

entity
  .add(Transform)
  .add(RigidBody, { kind: 'DYNAMIC' })
```

Notes: Internally the plugin looks for a RigidBody component and will build the actual rigid body and attach it as a RigidBodyRef component. You can use this if you need to access the actual rigid body.

### Collider (Component)

Describes a collider shape that should be attached to a rigid body. The shape will be attached to the closest entity that has a RigidBody component, starting from the current entity and walking up its parents. You can create compound colliders by having one parent RigidBody entity and multiple child Collider entities. 

Field|Type|Default|Description
---|---|---|---
shape|String|'BOX'|The shape of the collider. Options are `BOX` and `SPHERE`
boxSize|Vector3|new Vector3(1, 1, 1)|The size of the box. Only used when shape is `BOX`.
sphereRadius|Number|0.5|The radius of the sphere. Only used when shape is `SPHERE`.
material|Vector3|new Vector3(0.6, 0.6, 0)|The material of the collider shape. X is static friction, Y is dynamic friction, Z is restitution
layer|Number|0|The layer this shape lives on. By default all shapes collide with each other.

Notes: Internally this plugin looks for a Collider component, builds the shape and adds it as a ColliderRef component. It also attaches a ColliderBody component which contains the actual RigidBody is has been attached to.


```js
import { Transform, Vector3 } from 'hecs-plugins-core'
import { Collider } from 'hecs-plugins-physx'

entity
  .add(Transform)
  .add(Collider, { 
    shape: 'BOX',
    boxSize: new Vector3(2, 4, 2),
  })
```

### FixedJoint (Component)

Describes a fixed joint that should be attached to another entity.

Field|Type|Default|Description
---|---|---|---
entity|String|''|The entity to attach the fixed joint to. If unset, the joint is attached to world space.
breakForce|Number|0|The force needed to break the joint. Zero is unbreakable.
breakTorque|Number|0|The torque needed to break the joint. Zero is unbreakable.

Notes: Internally this plugin looks for a FixedJoint component, constructs the actual joint and adds it as a FixedJointRef component. When a fixed joint breaks, the FixedJoint and FixedJointRef components will be removed automatically. If you are adding your own functionality that depends on a fixed joint it is better to use the actual ref to determine it's existence.


```js
import { Transform, Vector3 } from 'hecs-plugins-core'
import { RigidBody, Collider, FixedJoint } from 'hecs-plugins-physx'

entity
  .add(Transform)
  .add(RigidBody, { kind: 'DYNAMIC' })
  .add(Collider)
  .add(FixedJoint)
```