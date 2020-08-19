import { World } from 'hecs'
import CorePlugin, { Foo, Color } from '../src'

describe('stub', () => {
  test('is stubbed', () => {
    const world = new World({
      plugins: [CorePlugin],
    })
    expect(Foo).toBeDefined()
    expect(Color).toBeDefined()
    expect(world.systems.systems.length).toBe(1)
  })
})
