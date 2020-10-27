import { World } from '../src'

describe('added and removed events', () => {
  const active = []
  const inactive = []
  const world = new World({
    systems: [],
    components: [],
  })
  world.on('entity-active', entity => active.push(entity))
  world.on('entity-inactive', entity => inactive.push(entity))

  test('events', () => {
    expect(active.length).toBe(0)
    expect(inactive.length).toBe(0)

    const foo = world.entities.create().activate()

    expect(active.length).toBe(1)
    expect(inactive.length).toBe(0)

    foo.destroy()

    expect(active.length).toBe(1)
    expect(inactive.length).toBe(1)
  })
})
