| :warning: Important: This package is WIP and is not ready for use |
| --- |

# Hecs Plugin Three

A plugin for Hecs that adds functionality to render three.js models and primitives. When used in node or without a viewport configured then appropriate systems become inactive.

---

## Usage

Install via npm/yarn:

```
yarn add hecs hecs-plugin-core hecs-plugin-three three
```

Add the plugin to your plugin list when creating a World

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

### World.presentation.scene

This is the three.js scene used internally. It's available if you need it but completely optional.

### World.presentation.setViewport(DOMElement)

Configuring this with a DOMElement will attach the renderer and start rendering your scenes to it. Interally it uses ResizeObserver to watch for resize and automatically updates the camera and renderer perspectives. When no viewport is defined nothing will be rendered and some systems will run passively. Can be unset with `null`

### World.presentation.takePhoto(width, height)

Allows you to take a photo of the scene at any arbitrary size, from the point of view of the camera. The returned value is a base64 string representing the image. Internally this uses CanvasElement.toDataURL().
This is useful for editors to generate thumbnails of a scene, but could also be used during a running simulation to take photos.

### Camera (Component)

Adding this component to an entity controls where the camera is in the scene. This component is a singleton so adding it to another entity will remove it from any previous entity.

Requires: `Transform`

```js
import { Transform } from 'hecs-plugins-core'
import { Camera } from 'hecs-plugins-three'

entity
  .add(Transform)
  .add(Camera)
```

### Model (Component)

Adding this component to an entity will load and render a GLTF asset.

Field|Type|Default|Description
---|---|---|---
asset|Asset|new Asset()|The asset to load and use for the model

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

### Shape (Component)

Adding this component to an entity will build and render a primitive shape

Field|Type|Default|Description
---|---|---|---
kind|String|'BOX'|The kind of shape to build. Must be one of `BOX`, `SPHERE` or `CAPSULE`
boxSize|Vector3|new Vector3(1, 1, 1)|The size of the box. Only applicable when kind is `BOX`.
sphereRadius|Number|0.5|The radius of the sphere. Only applicable when kind is `SPHERE`.
sphereWidthSegments|Number|16|The width segments of the sphere. Only applicable when kind is `SPHERE`.
sphereHeightSegments|Number|12|The height segments of the sphere. Only applicable when kind is `SPHERE`.
capsuleRadius|Number|0.5|The radius of the capsule. Only applicable when kind is `CAPSULE`.
capsuleHeight|Number|1|The height of the capsule. Only applicable when kind is `CAPSULE`.
capsuleSegments|Number|5|The number of segments for the capsule. Only applicable when kind is `CAPSULE`.
color|Color|'#fff'|The color of the shape.

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

### Object3D (Component)

All entities with a `Transform` are given an `Object3D` component which is added to the scene at the correct hierarchical position (eg when using a `Parent` component). This container is used internally for all `Model` and `Shape` meshes that are created.

Field|Type|Default|Description
---|---|---|---
value|Object3D|new Object3D()|The object3d

Advanced: You can use this container to add and remove your own meshes without needing to worry about scene hierarchy. See how this can be done in the ModelSystem and ShapeSystem.

### Image (Component)

Adding this component to an entity will render an image at its location

Field|Type|Default|Description
---|---|---|---
asset|Asset|new Asset()|The image asset to render
width|Number|1|The width of the plane the image is displayed on.
height|Number|1|The height of the plane the image is displayed on.
fit|String|'CONTAIN'|The fitting mode. `CONTAIN` means the image will be made to fit inside of the width and height props. `COVER` means the image will be resized to ensure it covers all width and height surface, cropping the overflow.

Requires: `Transform`


```js
import { Transform, Asset } from 'hecs-plugins-core'
import { Image } from 'hecs-plugins-three'

entity
  .add(Transform)
  .add(Image, { 
    asset: new Asset('billboard-sign.png'),
    width: 6,
    height: 3,
    fit: 'COVER',
  })
```