| :warning: Important: This package is WIP and is not ready for use |
| --- |

# Hecs Plugin Three

A plugin for Hecs that adds functionality to render three.js models and primitives. When used in node or without a viewport configured then appropriate systems become inactive.

---

## Usage

1. Install peer dependencies `three` and `hecs-plugin-core`, then
2. Add the plugin to your plugin list when creating a World

```js
import { World } from 'hecs'
import ThreePlugin from 'hecs-plugin-three'

const world = new World({
  plugins: [ThreePlugin],
  systems: [/* your systems */],
  components: [/* your components */],
})
```

A world instance with this plugin installed can now use all of the features below:

---

## World.presentation.scene

This is the three.js scene used internally. It's available if you need it but completely optional.

## World.presentation.setViewport(DOMElement)

Configuring this with a DOMElement will attach the renderer and start rendering your scenes to it. Interally it uses ResizeObserver to watch for resize and automatically updates the camera and renderer perspectives. When no viewport is defined nothing will be rendered and some systems will run passively. Can be unset with `null`

## Camera (Component)

Adding this component to an entity controls where the camera is in the scene. This component is a singleton so adding it to another entity will remove it from any previous entity.

Requires: `Transform`

```js
import { Transform } from 'hecs-plugins-core'
import { Camera } from 'hecs-plugins-three'

entity
  .add(Transform)
  .add(Camera)
```

## Model (Component)

Adding this component to an entity will load and render a GLTF asset.

Requires: `Transform`

Advanced: You can determine whether a model is still loading by looking for a `ModelLoading` component. Once loaded, a `ModelMesh` component is available to access the actual three.js mesh.


```js
import { Transform } from 'hecs-plugins-core'
import { Asset, Model } from 'hecs-plugins-three'

entity
  .add(Transform)
  .add(Model, { 
    asset: new Asset('me.com/spaceship.glb') 
  })
```

## Shape (Component)

Adding this component to an entity will build and render a primitive shape

Requires: `Transform`

Advanced: A `ShapeMesh` component is available to access the actual three.js mesh.


```js
import { Transform, Vector3 } from 'hecs-plugins-core'
import { Shape } from 'hecs-plugins-three'

entity
  .add(Transform)
  .add(Shape, { 
    kind: 'BOX',
    boxSize: new Vector3(1, 1, 1),
    color: 'purple'
  })
```

## Object3D (Component)

All entities with a `Transform` are given an `Object3D` component which is added to the scene at the correct hierarchical position (eg when using a `Parent` component). This container is used internally for all `Model` and `Shape` meshes that are created.

Advanced: You can use this container to add and remove your own meshes without needing to worry about scene hierarchy. See how this can be done in ModelSystem and ShapeSystem.