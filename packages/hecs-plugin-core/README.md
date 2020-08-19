| :warning: Important: This package is WIP and is not ready for use |
| --- |

# Hecs Plugin Core

| Note: this package is WIP, not published to NPM or ready for use

This is a plugin for Hecs that adds a bunch of core components and types to the ECS. It is used by `hecs-plugin-three` and `hecs-plugin-physx` to provide some common components shared between them.

---

## Usage

Add the plugin to your plugin list when creating a World:

```js
import { World } from 'hecs'
import CorePlugin from 'hecs-plugin-core'

const world = new World({
  plugins: [CorePlugin],
  systems: [/* your systems */],
  components: [/* your components */],
})
```

---

## New Components

### Parent

The `Parent` component adds scene hierarchy functionality to the ECS.

```js
entity.add(Parent, { id: 'someEntityId' })
```

### Transform

The `Transform` component adds 3D spatial awareness to an entity. The `Transform` component represents the local transform of the entity in respect to its parent (or world coordinates).

```js
entity.add(Transform, { 
  position: new Vector3(1, 2, 3),
  rotation: new Quaternion(),
  scale: new Vector3(),
})
```

### WorldTransform

`WorldTransform` has the same properties as the `Transform` component and is automatically added - by this plugin - to all entities with a `Transform` component. If the entity has no `Parent` then the `WorldTransform` will be the same as the `Transform`.
This shouldn't be added manually to entities and is intended to be used as a read-only source of information to be sent into things like physics or rendering.

---

## New Types

### Vector3

Adds a new `Vector3` type and class to be used on components. This construct mimics the three.js version but does not require it.

Defaults to `new Vector3(0, 0, 0)`

```js
import { Component } from 'hecs'
import { Vector3Type, Vector3 } from 'hecs-plugin-core'

export class Cube extends Component {
  static props = {
    position: {
      type: Vector3Type,
      default: new Vector3(0, 1, 0),
    }
  }
}
```

### Quaternion

Adds a new `Quaternion` type and class to be used on components. This construct mimics the three.js version but does not require it.

Defaults to `new Quaternion(0, 0, 0, 1)`

```js
import { Component } from 'hecs'
import { QuaternionType, Quaternion } from 'hecs-plugin-core'

export class Cube extends Component {
  static props = {
    rotation: {
      type: QuaternionType,
    }
  }
}
```

### Entity

The `Entity` type is essentially the same as `String` but is recognized specifically as the ID of an Entity

```js
import { Component } from 'hecs'
import { EntityType } from 'hecs-plugin-core'

export class Attach extends Component {
  static props = {
    toId: {
      type: EntityType,
    },
  }
}
```

### Asset

The `Asset` type describes a file that can be loaded and used by a system.

Defaults to `null`

```js
import { Component } from 'hecs'
import { AssetType, Asset } from 'hecs-plugin-core'

export class Model extends Component {
  static props = {
    asset: {
      type: AssetType,
      default: new Asset('https://mydomain.com/spaceship.glb')
    },
  }
}
```

### Color

Adds a new `Color` type to be used on components.

Defaults to `#ffffff` (white)

```js
import { Component } from 'hecs'
import { ColorType } from 'hecs-plugin-core'

export class Cube extends Component {
  static props = {
    color: {
      type: ColorType,
    }
  }
}
```

### Select

The `Select` type works exactly like a `String` but is recognized specifically as a value from a list of options.

```js
import { Component } from 'hecs'
import { SelectType } from 'hecs-plugin-core'

export class Shape extends Component {
  static props = {
    kind: {
      type: SelectType,
      label: 'Kind',
      options: [
        { label: 'Box', value: 'BOX' },
        { label: 'Sphere', value: 'SPHERE' },
      ],
      default: 'BOX',
    },
  }
}
```