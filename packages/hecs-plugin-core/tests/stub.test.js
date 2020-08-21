import { World, Not } from 'hecs'
import CorePlugin, { Asset } from '../src'

describe('stub', () => {
  test('is stubbed', () => {
    const world = new World({
      plugins: [CorePlugin],
    })
    expect(Not).toBeDefined()
    expect(Asset).toBeDefined()
    expect(world.systems.systems.length).toBe(1)
  })
})
