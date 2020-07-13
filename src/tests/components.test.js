import { World, System, Component, StateComponent, Not, Modified } from '../'

class Model extends Component {}

class ModelSystem extends System {
  static queries = {
    none: [Not(Model)],
    active: [Model],
  }

  update() {
    this.none = 0
    this.active = 0
    this.queries.none.forEach(() => this.none++)
    this.queries.active.forEach(() => this.active++)
  }
}

describe('components', () => {
  const world = new World()
  world.components.register([Model])
  world.systems.register(ModelSystem)

  const system = world.systems.get(ModelSystem)
  let block = world.entities.create().activate()

  test('initial update', () => {
    world.update()
    expect(system.none).toBe(1)
    expect(system.active).toBe(0)
  })

  test('add component', () => {
    block.add(Model)
    world.update()
    expect(system.none).toBe(0)
    expect(system.active).toBe(1)
  })

  test('deactivate entity', () => {
    /**
     * Because the entity has no StateComponents, the entity
     * is immediately made inactive and removed from all queries
     */
    expect(block.active).toBe(true)
    block.deactivate()
    expect(block.active).toBe(false)
    world.update()
    expect(system.none).toBe(0)
    expect(system.active).toBe(0)
  })

  test('re-activate entity', () => {
    block.activate()
    expect(block.active).toBe(true)
    world.update()
    expect(system.none).toBe(0)
    expect(system.active).toBe(1)
  })
})
