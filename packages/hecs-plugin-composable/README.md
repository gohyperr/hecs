# Hecs Plugin Composable

A plugin for Hecs that adds the ability to compose multiple positional, rotational, and scale transformations on the same entity.

While this type of composition can also be achieved by creating parent/child entities for each type of transformation, this method is simpler and about 30% faster.

**Example use case:** Suppose you make a game where coins bounce up and down as well as spin as they bounce. These visual transformations don't affect the underlying physics of the coin--it's just for show. `hecs-plugin-composable` can be used to add OscillatePosition and OscillateRotation components to achieve the desired effect.

## Usage

Example:

```js
import ComposablePlugin, {
  ComposableTransform,
  NoisyPosition,
  NoisyRotation,
  NoisyScale,
  OscillatePosition,
  OscillateRotation,
  OscillateScale,
} from "hecs-plugin-composable";

import { World } from "hecs";
import { Euler } from "three";

import { Vector3, Quaternion } from "hecs-plugin-core";
import ThreePlugin, { Shape, Camera, LookAt } from "hecs-plugin-three";

const world = new World({
  plugins: [ThreePlugin, ComposablePlugin],
});

world.presentation.setViewport(document.body);

// Simplify future box-making with a prefab function
function makeBox({ x = 0, y = 0, z = 0, w = 1, h = 1, d = 1, color = "red" }) {
  return world.entities
    .create("Box")
    .add(ComposableTransform, {
      position: new Vector3(x, y, z),
    })
    .add(Shape, {
      color,
      boxSize: new Vector3(w, h, d),
    });
}

// Create the floor
const origin = makeBox({
  y: -0.505,
  w: 8,
  h: 0.1,
  d: 6,
  color: "white",
}).activate();

// Create a box that moves randomly
const orangeBox = makeBox({ x: 0, y: 0, z: -2, color: "orange" })
  .add(NoisyPosition, { speed: 4, magnitude: new Vector3(0, 2, 4) })
  .activate();

// Create a box that grows and shrinks
const blueBox = makeBox({ x: -2, y: 0, z: 0, color: "blue" })
  .add(NoisyScale, {
    speed: 4,
    magnitude: new Vector3(1, 1, 1),
  })
  .activate();

// Create a box that wiggles
const brownBox = makeBox({ x: 2, y: 0, z: 0, color: "brown" })
  .add(NoisyRotation, { speed: 4, magnitude: new Vector3(0, 1, 0) })
  .activate();

// Combine several effects: OscillateRotation, OscillatePosition, NoisyPosition
const blackBox = makeBox({y: 0.6, color: "black"})
  .add(OscillateRotation, {
    min: new Quaternion().setFromEuler(new Euler(0, 0, -Math.PI / 4)),
    max: new Quaternion().setFromEuler(new Euler(0, 0, Math.PI / 4)),
  })
  .add(OscillatePosition, {
    frequency: 2,
    max: new Vector3(0, 0.5, 0),
  })
  .add(NoisyPosition, { speed: 2, magnitude: new Vector3(0, 0, 10) })
  .activate();

// Create the singleton camera
const camera = world.entities
  .create("Camera")
  .add(ComposableTransform, {
    position: new Vector3(0, 5, 5),
  })
  .add(LookAt, {
    entity: origin.id,
  })
  .add(Camera)
  .activate();

const gameLoop = (time) => {
  world.update(1000/60);
};

world.presentation.setLoop(gameLoop);
```

### ComposableTransform (Component)

The `ComposableTransform` component must be added to every entity that uses other components in this plugin.

Once added, it is expected that `ComposableTransform` owns the `hecs-plugin-core` `Transform` component's `position`, `rotation`, and `scale` properties. To move, rotate, or scale an entity, you can do so by modifying `ComposableTransform`'s `position`, `rotation`, and `scale` properties, and these will then be automatically copied to `Transform` (with any composable offsets added in).


### OscillatePosition (Component)

Makes the entity move back and forth (oscillate) via the `position` property of `ComposableTransform`.

Requires: `ComposableTransform`

```js
entity
  .add(ComposableTransform)
  .add(OscillatePosition, {
    phase: 0,
    frequency: 2,
    min: new Vector3(0, -0.5, 0),
    max: new Vector3(0, 0.5, 0),
  })
```

### OscillateRotation (Component)

Makes the entity rotate back and forth (oscillate) via the `rotation` property of `ComposableTransform`.

Requires: `ComposableTransform`

```js
entity
  .add(ComposableTransform)
  .add(OscillateRotation, {
    phase: 0,
    frequency: 2,
    min: new Quaternion().setFromEuler(new Euler(0, 0, -Math.PI / 4)),
    max: new Quaternion().setFromEuler(new Euler(0, 0, Math.PI / 4)),
  })
```

### OscillateScale (Component)

Makes the entity grow and shrink (oscillate) via the `scale` property of `ComposableTransform`.

Requires: `ComposableTransform`

```js
entity
  .add(ComposableTransform)
  .add(OscillateScale, {
    phase: 0,
    frequency: 2,
    // NOTE: Make sure axes you DON'T want scaled are set to 1
    min: new Vector3(1, 1, 1),
    max: new Vector3(1, 2, 1),
  })
```

### NoisyPosition (Component)

Adds noise to the `position` property of `ComposableTransform`.

Requires: `ComposableTransform`

```js
entity
  .add(ComposableTransform)
  .add(NoisyPosition, {
    speed: 2,
    magnitude: new Vector3(0, 0, 10)
  })
```

### NoisyRotation (Component)

Adds noise to the `rotation` property of `ComposableTransform`.

Requires: `ComposableTransform`

```js
entity
  .add(ComposableTransform)
  .add(NoisyRotation, {
    speed: 1,
    magnitude: new Vector3(0, 1, 0)
  })
```

### NoisyScale (Component)

Adds noise to the `scale` property of `ComposableTransform`.

Requires: `ComposableTransform`

```js
entity
  .add(ComposableTransform)
  .add(NoisyScale, {
    speed: 1,
    magnitude: new Vector3(1, 1, 1)
  })
```

