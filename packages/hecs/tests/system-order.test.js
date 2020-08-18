import { World, System, Groups } from '../src'

describe('system order', () => {
  test('default order', () => {
    class SystemA extends System {}
    class SystemB extends System {}
    class SystemC extends System {}

    const world = new World({
      systems: [SystemA, SystemB, SystemC],
    })

    expect(world.systems.systems.length).toBe(3)
    expect(world.systems.systems[0].constructor).toBe(SystemA)
    expect(world.systems.systems[0].order).toBe(Groups.Simulation)
    expect(world.systems.systems[1].constructor).toBe(SystemB)
    expect(world.systems.systems[1].order).toBe(Groups.Simulation)
    expect(world.systems.systems[2].constructor).toBe(SystemC)
    expect(world.systems.systems[2].order).toBe(Groups.Simulation)
  })

  test('default order', () => {
    class SystemA extends System {
      order = 3
    }
    class SystemB extends System {
      order = 2
    }
    class SystemC extends System {
      order = 1
    }

    const world = new World({
      systems: [SystemA, SystemB, SystemC],
    })

    expect(world.systems.systems.length).toBe(3)
    expect(world.systems.systems[0].constructor).toBe(SystemC)
    expect(world.systems.systems[1].constructor).toBe(SystemB)
    expect(world.systems.systems[2].constructor).toBe(SystemA)
  })

  test('same order is added after pre-existing', () => {
    class SystemA extends System {
      order = 2
    }
    class SystemB extends System {
      order = 2
    }
    class SystemC extends System {
      order = 2
    }

    const world = new World({
      systems: [SystemC, SystemB, SystemA],
    })

    expect(world.systems.systems.length).toBe(3)
    expect(world.systems.systems[0].constructor).toBe(SystemC)
    expect(world.systems.systems[1].constructor).toBe(SystemB)
    expect(world.systems.systems[2].constructor).toBe(SystemA)
  })
})
