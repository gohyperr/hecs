import { World } from 'hecs'
import ThreePlugin, { Object3D } from '../src'

describe('stub', () => {
  test('is stubbed', () => {
    const world = new World({
      plugins: [ThreePlugin],
    })
    expect(Object3D).toBeDefined()
    expect(world.systems.systems.length).toBe(5)
  })
})
