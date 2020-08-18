import { World, System, Component, Not, Modified } from '../src'

class Transform extends Component {}

class TransformSystem extends System {
  static queries = {
    none: [Not(Transform)],
    active: [Transform],
    modified: [Modified(Transform)],
  }

  update() {
    this.counts = { none: 0, active: 0, modified: 0 }
    this.queries.none.forEach(() => this.counts.none++)
    this.queries.active.forEach(() => this.counts.active++)
    this.queries.modified.forEach(() => this.counts.modified++)
  }
}

describe('basic queries', () => {
  const world = new World({
    systems: [TransformSystem],
    components: [Transform],
  })

  const system = world.systems.get(TransformSystem)
  let block

  test('initial update', () => {
    world.update()
    expect(system.counts.none).toBe(0)
    expect(system.counts.active).toBe(0)
    expect(system.counts.modified).toBe(0)
  })

  test('create entity', () => {
    block = world.entities.create()
    world.update()
    expect(system.counts.none).toBe(0)
    expect(system.counts.active).toBe(0)
    expect(system.counts.modified).toBe(0)
  })

  test('activate entity', () => {
    block.activate()
    world.update()
    expect(system.counts.none).toBe(1)
    expect(system.counts.active).toBe(0)
    expect(system.counts.modified).toBe(0)
  })

  test('add transform component', () => {
    block.add(Transform)
    world.update()
    expect(system.counts.none).toBe(0)
    expect(system.counts.active).toBe(1)
    expect(system.counts.modified).toBe(0)
  })

  test('modify transform component', () => {
    block.get(Transform).modified()
    world.update()
    expect(system.counts.none).toBe(0)
    expect(system.counts.active).toBe(1)
    expect(system.counts.modified).toBe(1)
  })

  test('leave unmodified', () => {
    world.update()
    expect(system.counts.none).toBe(0)
    expect(system.counts.active).toBe(1)
    expect(system.counts.modified).toBe(0)
  })

  test('remove component', () => {
    block.remove(Transform)
    world.update()
    expect(system.counts.none).toBe(1)
    expect(system.counts.active).toBe(0)
    expect(system.counts.modified).toBe(0)
  })

  test('deactivate entity', () => {
    block.deactivate()
    world.update()
    expect(system.counts.none).toBe(0)
    expect(system.counts.active).toBe(0)
    expect(system.counts.modified).toBe(0)
  })

  test('re-activate entity', () => {
    block.activate()
    world.update()
    expect(system.counts.none).toBe(1)
    expect(system.counts.active).toBe(0)
    expect(system.counts.modified).toBe(0)
  })
})
