import { World, System, Component, StateComponent, Not, Modified } from '../'

class Model extends Component {}

class ModelMesh extends StateComponent {}

class ModelSystem extends System {
  static queries = {
    added: [Model, Not(ModelMesh)],
    active: [Model, ModelMesh],
    removed: [Not(Model), ModelMesh],
  }

  update() {
    this.counts = { added: 0, active: 0, removed: 0 }
    this.queries.added.forEach(entity => {
      entity.add(ModelMesh)
      this.counts.added++
    })
    this.queries.active.forEach(() => this.counts.active++)
    this.queries.removed.forEach(entity => {
      entity.remove(ModelMesh)
      this.counts.removed++
    })
  }
}

describe('state components', () => {
  const world = new World()
  world.components.register([Model, ModelMesh])
  world.systems.register(ModelSystem)

  const system = world.systems.get(ModelSystem)
  let block = world.entities.create().activate()

  test('initial update', () => {
    world.update()
    expect(system.counts.added).toBe(0)
    expect(system.counts.active).toBe(0)
    expect(system.counts.removed).toBe(0)
  })

  test('add model', () => {
    block.add(Model)
    world.update()
    expect(system.counts.added).toBe(1)
    expect(system.counts.active).toBe(1)
    expect(system.counts.removed).toBe(0)
    world.update()
    expect(system.counts.added).toBe(0)
    expect(system.counts.active).toBe(1)
    expect(system.counts.removed).toBe(0)
  })

  test('deactivate entity', () => {
    /**
     * Because the entity has a StateComponent only
     * regular components are removed and the entity
     * will remain active until the StateComponents
     * have been deallocated
     */
    block.deactivate()
    expect(block.active).toBe(true)
    world.update()
    expect(block.active).toBe(false)
    expect(system.counts.added).toBe(0)
    expect(system.counts.active).toBe(0)
    expect(system.counts.removed).toBe(1)
  })

  test('re-activate entity', () => {
    block.activate()
    expect(block.active).toBe(true)
    world.update()
    expect(system.counts.added).toBe(1)
    expect(system.counts.active).toBe(1)
    expect(system.counts.removed).toBe(0)
  })

  test('destroy entity', () => {
    block.destroy()
    expect(block.active).toBe(true)
    world.update()
    expect(block.active).toBe(false)
    expect(system.counts.added).toBe(0)
    expect(system.counts.active).toBe(0)
    expect(system.counts.removed).toBe(1)
  })
})
