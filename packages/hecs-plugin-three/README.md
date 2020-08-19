# Hecs Plugin Three (WIP)

A plugin for Hecs that adds functionality to render three.js models and primitives.

---

## Usage

1. Install the peerDependency `three.js`
2. Add the plugin to your plugin list when creating a World
3. You can now use all of the features below

```js
import { World } from 'hecs'
import ThreePlugin from 'hecs-plugin-three'

const world = new World({
  plugins: [ThreePlugin],
  systems: [/* your systems */],
  components: [/* your components */],
})
```

---

## Three Provider

Use this to set the viewport (DOM element) you want to render to. 

The viewport is watched using a ResizeObserver internally and will update the camera and renderer automatically.

```js
const three = world.get('three')
const viewport = document.body.querySelector('viewport')
three.setViewport(viewport)
```

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

All entities with a `Transform` are given an `Object3D` component which is the container all `Model` and `Shape` meshes are added to. If the entity also contains a valid `Parent` then this object3d is automatically added as a child to it's parent object3d container.

Advanced: You can use this container to add and remove your own meshes without needing to worry about scene hierarchy. See how this can be done in the ModelSystem and ShapeSystem.