# Hyperfy ECS

A high performance ECS framework for the web.

See [TECHNICAL.md](TECHNICAL.md) for details on performance and the internals of this library.

## Quickstart

```js
import { World, System, Component, StateComponent, Types, Not, Modified } from 'hyperfy-ecs'
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

const world = new World()
world.systems.register(ModelSystem)
world.components.register([Model, Mesh])

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
import { World } from 'hyperfy-ecs'

const world = new World()
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

Entities are inactive by default and are not simulated in the world until they are activated:

```js
basketball.activate()
```

### Deactivating an entity

If you want to remove an entity from the world but still keep it around, use deactivate.
When deactivated, all Components are temporarily removed except StateComponents, so that
System queries can still process and deallocate any resources.

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
import { Component, Types } from 'hyperfy-ecs'

export class Model extends Component {
  static props = {
    path: Types.Text
  }
}
```

### Registering components

```js
world.components.register(Model)
```

This method also accepts an array of Components.

## StateComponents

StateComponents work the same way as regular Components but are kept around after
an entity is deactivated or destroyed so that Systems can process or deallocate 
resources.

```js
import { StateComponent } from 'hyperfy-ecs'
import { Object3D } from './types'

export class Mesh extends StateComponent {
  static props = {
    value: Types.Object3D
  }
}
```

## Systems

### Defining systems

```js
import { System, Not, Changed } from 'hyperfy-ecs'
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

### Registering systems

```js
world.systems.register(ModelSystem)
```

This method also accepts an array of Systems