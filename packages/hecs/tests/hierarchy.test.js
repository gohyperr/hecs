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

  test('traversal', () => {
    const grandfather = world.entities.create('grandfather').activate()
    const father = world.entities.create('father').activate()
    const son = world.entities.create('son').activate()
    son.setParent(father)
    father.setParent(grandfather)
    let path

    path = [father, grandfather]
    son.traverseAncestors(ancestor => {
      expect(ancestor.name).toBe(path.shift().name)
    })

    path = [grandfather, father, son]
    grandfather.traverse(child => {
      expect(child.name).toBe(path.shift().name)
    })
  })

  test('serialisation/deserialisation', () => {
    let parent = world.entities.create().activate()
    let child = world.entities.create().activate()
    child.setParent(parent)

    const parentJSON = parent.toJSON()
    const childJSON = child.toJSON()

    expect(parentJSON.parent).toBe(null)
    expect(parentJSON.children.length).toBe(1)
    expect(parentJSON.children[0]).toBe(child.id)
    expect(childJSON.parent).toBe(parent.id)
    expect(childJSON.children.length).toBe(0)

    parent.destroy()
    child.destroy()

    parent = world.entities.create().fromJSON(parentJSON).activate()
    child = world.entities.create().fromJSON(childJSON).activate()

    expect(parent.getParent()).toBe(null)
    expect(parent.getChildren().length).toBe(1)
    expect(parent.getChildren()[0]).toBe(child)

    expect(child.getParent()).toBe(parent)
    expect(child.getChildren().length).toBe(0)
  })
})
