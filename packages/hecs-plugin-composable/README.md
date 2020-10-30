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

import { Euler } from "three";

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

// Combine several effects to make a dancing box
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

// Create the singleton camera, and point it at the floor
const camera = world.entities
  .create("Camera")
  .add(ComposableTransform, {
    position: new Vector3(0, 5, 5),
  })
  .add(LookAt, { entity: origin.id, })
  .add(Camera)
  .activate();

const gameLoop = (time) => {
  world.update(1000/60);
};

world.presentation.setLoop(gameLoop);
```
