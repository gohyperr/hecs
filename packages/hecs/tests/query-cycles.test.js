import { World, System, Component, Not, Modified } from '../src'

/**
 * TODO: how do we test that modified in B is seen in C and then A again in next cycle?
 */

class Tracker extends Component {}

class SystemA extends System {
  static queries = {
    exists: [Tracker],
    modified: [Modified(Tracker)],
    not: [Not(Tracker)],
  }

  update() {
    this.counts = { exists: 0, modified: 0, not: 0 }
    this.queries.exists.forEach(() => this.counts.exists++)
    this.queries.modified.forEach(() => this.counts.modified++)
    this.queries.not.forEach(() => this.counts.not++)
  }
}

class SystemB extends System {
  static queries = {
    exists: [Tracker],
    modified: [Modified(Tracker)],
    not: [Not(Tracker)],
  }

  update() {
    this.counts = { exists: 0, modified: 0, not: 0 }
    this.queries.exists.forEach(entity => {
      this.counts.exists++
      entity.get(Tracker).modified()
    })
    this.queries.modified.forEach(entity => {
      this.counts.modified++
    })
    this.queries.not.forEach(entity => {
      this.counts.not++
    })
  }
}

class SystemC extends System {
  static queries = {
    exists: [Tracker],
    modified: [Modified(Tracker)],
    not: [Not(Tracker)],
  }

  update() {
    this.counts = { exists: 0, modified: 0, not: 0 }
    this.queries.exists.forEach(() => this.counts.exists++)
    this.queries.modified.forEach(() => this.counts.modified++)
    this.queries.not.forEach(() => this.counts.not++)
  }
}

describe('query cycles', () => {
  test('todo', () => {
    expect(true).toBe(true)
  })
})

// describe('basic queries', () => {
//   const world = new World()
//   world.components.register(Transform)
//   world.systems.register(TransformSystem)

//   const system = world.systems.get(TransformSystem)
//   let block

//   test('initial update', () => {
//     world.update()
//     expect(system.counts.none).toBe(0)
//     expect(system.counts.active).toBe(0)
//     expect(system.counts.modified).toBe(0)
//   })

//   test('create entity', () => {
//     block = world.entities.create()
//     world.update()
//     expect(system.counts.none).toBe(0)
//     expect(system.counts.active).toBe(0)
//     expect(system.counts.modified).toBe(0)
//   })

//   test('activate entity', () => {
//     block.activate()
//     world.update()
//     expect(system.counts.none).toBe(1)
//     expect(system.counts.active).toBe(0)
//     expect(system.counts.modified).toBe(0)
//   })

//   test('add transform component', () => {
//     block.add(Transform)
//     world.update()
//     expect(system.counts.none).toBe(0)
//     expect(system.counts.active).toBe(1)
//     expect(system.counts.modified).toBe(0)
//   })

//   test('modify transform component', () => {
//     block.get(Transform).modified()
//     world.update()
//     expect(system.counts.none).toBe(0)
//     expect(system.counts.active).toBe(1)
//     expect(system.counts.modified).toBe(1)
//   })

//   test('leave unmodified', () => {
//     world.update()
//     expect(system.counts.none).toBe(0)
//     expect(system.counts.active).toBe(1)
//     expect(system.counts.modified).toBe(0)
//   })

//   test('remove component', () => {
//     block.remove(Transform)
//     world.update()
//     expect(system.counts.none).toBe(1)
//     expect(system.counts.active).toBe(0)
//     expect(system.counts.modified).toBe(0)
//   })

//   test('deactivate entity', () => {
//     block.deactivate()
//     world.update()
//     expect(system.counts.none).toBe(0)
//     expect(system.counts.active).toBe(0)
//     expect(system.counts.modified).toBe(0)
//   })

//   test('re-activate entity', () => {
//     block.activate()
//     world.update()
//     expect(system.counts.none).toBe(1)
//     expect(system.counts.active).toBe(0)
//     expect(system.counts.modified).toBe(0)
//   })
// })
