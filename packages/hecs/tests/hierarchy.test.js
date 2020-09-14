import { World } from '../src'

describe('hierarchy', () => {
  const world = new World({
    systems: [],
    components: [],
  })

  test('defaults', () => {
    const entity = world.entities.create().activate()
    expect(entity.parent).toBe(null)
    expect(entity.children.length).toBe(0)
  })

  test('can add child to parent', () => {
    const parent = world.entities.create().activate()
    const child = world.entities.create().activate()
    child.setParent(parent)
    expect(child.getParent()).toBe(parent)
    expect(parent.parent).toBe(null)
    expect(parent.children.length).toBe(1)
    expect(parent.children[0]).toBe(child)
    expect(child.parent).toBe(parent)
    expect(child.children.length).toBe(0)
  })

  test('destroying parent destroys child', () => {
    const parent = world.entities.create().activate()
    const child = world.entities.create().activate()
    child.setParent(parent)
    expect(parent.active).toBe(true)
    expect(child.active).toBe(true)
    parent.destroy()
    expect(parent.active).toBe(false)
    expect(child.active).toBe(false)
  })
})
