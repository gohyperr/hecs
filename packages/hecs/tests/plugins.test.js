import { createPlugin, World } from '../src'

const FooPlugin = createPlugin({
  name: 'hecs-plugin-foo',
  decorate(world) {
    world.hasFooPlugin = true
  },
})

const BarPlugin = createPlugin({
  name: 'hecs-plugin-bar',
  plugins: [FooPlugin],
  decorate(world) {
    world.hasBarPlugin = true
  },
})

describe('plugins', () => {
  test('plugins dependent plugins are automatically installed', () => {
    const world = new World({
      plugins: [BarPlugin],
    })
    expect(world.hasFooPlugin).toBe(true)
    expect(world.hasBarPlugin).toBe(true)
  })
})
