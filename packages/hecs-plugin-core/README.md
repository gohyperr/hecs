| :warning: Important: This package is WIP and is not ready for use |
| --- |

# Hecs Plugin Core

A plugin for Hecs for that adds scene hierarchy and some other common components and types. It is used by `hecs-plugin-three` and `hecs-plugin-physx`.

---

## Usage

Install via npm/yarn:

```
yarn add hecs hecs-plugin-core
```

Add the plugin to your plugin list when creating a World

```js
import { World } from 'hecs'
import CorePlugin from 'hecs-plugin-core'

const world = new World({
  plugins: [CorePlugin],
  systems: [/* your systems */],
  components: [/* your components */],
})
```

A world instance with this plugin installed can now use all of the features below:

---

### Parent (Component)

Adding this component to an entity signifies it is a child of another entity.

Field|Type|Default|Description
---|---|---|---
id|String|''|The parent entity ID

Example:
```js
import { Parent } from 'hecs-plugin-core'

entity.add(Parent, { id: '2:3' })
```

### Transform (Component)

The `Transform` component adds 3D spatial awareness to an entity. The `Transform` component represents the local transform of the entity in respect to its parent (or world coordinates).

Field|Type|Default|Description
---|---|---|---
position|Vector3|new Vector3(0, 0, 0)|The local position of the entity
rotation|Quaternion|new Quaternion(0, 0, 0, 1)|The local rotation of the entity
scale|Vector3|new Vector3(1, 1, 1)|The local scale of the entity

Example: 
```js
import { Transform } from 'hecs-plugin-core'

entity.add(Transform, { 
  position: new Vector3(1, 2, 3),
})
```

### WorldTransform (Component)

`WorldTransform` has the same properties as the `Transform` component and is automatically added to all entities with a `Transform` component. If the entity has no `Parent` then the `WorldTransform` will be the same as the `Transform`.
You shouldn't need to be add this manually, it is intended to be used as a read-only source of information you can send to physics/rendering etc.

Field|Type|Default|Description
---|---|---|---
position|Vector3|new Vector3(0, 0, 0)|The world position of the entity
rotation|Quaternion|new Quaternion(0, 0, 0, 1)|The world rotation of the entity
scale|Vector3|new Vector3(1, 1, 1)|The world scale of the entity

---

### Vector3 (Type)

Adds a new `Vector3` type and class to be used on components. The class works exactly the same as three.js but is standalone, bundled with this plugin.

Defaults to `new Vector3(0, 0, 0)` if no default is specified on the component

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

### Quaternion (Type)

Adds a new `Quaternion` type and class to be used on components. The class works exactly the same the three.js version but is bundled standalone with this plugin.

Defaults to `new Quaternion(0, 0, 0, 1)` if no default is specified on the component

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

### Asset (Type)

The `Asset` type and class describes a file that can be loaded and used by a system. It is used in `hecs-plugin-three` to load GLTF meshes but could also be used for any other kind of file.

Defaults to `new Asset()` if no default is specified on the component

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