# Hyperr ECS

A high performance ECS framework for the web.

See [TECHNICAL.md](TECHNICAL.md) for details on performance and the internals of this library.

## Quickstart

```js
import { World, System, Component, StateComponent, Types, Not, Modified } from 'hyperr-ecs'
import { Object3D } from './types'

class Model extends Component {
  static props = {
    type: Types.Text,
  }
}

class Mesh extends StateComponent {
  static props = {
    value: Object3D,
  }
}

class ModelSystem extends System {
  static queries = {
    added: [Model, Not(Mesh)],
    modified: [Modified(Model), Mesh],
    removed: [Not(Model), Mesh],
  }

  update() {
    this.queries.added.forEach(entity => {
      const model = entity.get(Model)
      const object3d = getModel(model.type)
      entity.add(Mesh, { value: object3d })
    })
    this.queries.modified.forEach(entity => {
      entity.remove(Mesh)
      const model = entity.get(Model)
      const object3d = getModel(model.type)
      entity.add(Mesh, { value: object3d })
    })
    this.queries.removed.forEach(entity => {
      const object3d = entity.get(Mesh).value
      object3d.dispose()
      entity.remove(Mesh)
    })
  }
}

const world = new World({
  systems: [ModelSystem],
  components: [Model, Mesh]
})

world.entities.create().add(Model, { type: 'basketball' }).activate()

function update() {
  world.update()
  requestAnimationFrame(update)
}
update()
```

## Worlds

### Creating a world

```js
import { World } from 'hyperr-ecs'
import CorePlugin from 'hyperr-ecs-plugin-core'
import MySystem from './MySystem'
import MyComponent from './MyComponent'

const world = new World({
  plugins: [CorePlugin],
  systems: [MySystem],
  components: [MyComponent]
})
```

### Updating the world

```js
world.update()
```

## Entities

### Creating an entity

```js
const basketball = world.entities.create()
```

### Adding components

```js
basketball.add(Model, { path: 'basketball.glb' })
```

### Retrieving components

```js
const model = basketball.get(Model)
```

### Marking a component as modified

If you use queries that need to know when components are modified you will
need to mark them as modified.

```js
const model = basketball.get(Model)
model.path = 'basketball-2.glb'
model.modified()
```

### Removing components

```js
basketball.remove(Model)
```

### Activating an entity

Entities are inactive by default and are not simulated in world queries until they are activated:

```js
basketball.activate()
```

### Deactivating an entity

If you want to remove an entity from the world but still keep it around, use deactivate.
When deactivated, all Components are temporarily removed except StateComponents, so that
System queries can still process and deallocate any resources. Once all StateComponents are
removed the enitity is completely removed from all queries.

```js
basketball.deactivate()
```

### Destroying an entity

If you want to completely remove an entity, use destroy. All Components are removed except
StateComponents so that System queries can still process and deallocate resources. Once all
StateComponents are removed the entity is completely destroyed.

```js
basketball.destroy()
```

## Components

### Defining components

```js
import { Component, Types } from 'hyperr-ecs'

export class Model extends Component {
  static props = {
    path: Types.Text
  }
}
```

## LocalComponents

LocalComponents work exactly the same as Components except they are ignored when calling
`world.toJSON()` or `entity.toJSON()`. LocalComponents should be used in a network 
environment when the data doesn't need to be synced between other servers or clients.

```js
import { LocalComponent } from 'hyperr-ecs'
import { Axis } from './types'

export class Input extends LocalComponent {
  static props = {
    axis: Types.Axis2D
  }
}
```

## StateComponents

StateComponents work the same as regular Components but are kept around after
an entity is deactivated or destroyed, so that Systems can process or deallocate 
resources.

```js
import { StateComponent } from 'hyperr-ecs'
import { Object3D } from './types'

export class Mesh extends StateComponent {
  static props = {
    value: Types.Object3D
  }
}
```

## Systems

### Creating systems

```js
import { System, Not, Changed } from 'hyperr-ecs'
import { Mesh } from './components'

export class ModelSystem extends System {
  static queries = {
    added: [Model, Not(Mesh)],
    modified: [Modified(Model), Mesh],
    removed: [Not(Model), Mesh],
  }

  update() {
    this.queries.added.forEach(entity => {
      const model = entity.get(Model)
      const object3d = getModel(model.type)
      entity.add(Mesh, { value: object3d })
    })
    this.queries.modified.forEach(entity => {
      entity.remove(Mesh)
      const model = entity.get(Model)
      const object3d = getModel(model.type)
      entity.add(Mesh, { value: object3d })
    })
    this.queries.removed.forEach(entity => {
      const object3d = entity.get(Mesh).value
      object3d.dispose()
      entity.remove(Mesh)
    })
  }
}
```