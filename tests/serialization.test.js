import { World, Component, StateComponent, LocalComponent } from '../src'

class Comp extends Component {}
class LocalComp extends LocalComponent {}
class StateComp extends StateComponent {}

describe('serialization', () => {
  const world = new World()
  world.components.register([Comp, LocalComp, StateComp])

  const entity = world.entities.create().add(Comp).add(LocalComp).add(StateComp)

  test('only regular components are serialized', () => {
    const data = entity.toJSON()

    expect(data.id).toBeDefined()
    expect(data.name).toBe(null)
    expect(data.Comp).toBeDefined()
    expect(data.LocalComp).not.toBeDefined()
    expect(data.StateComp).not.toBeDefined()
  })
})
