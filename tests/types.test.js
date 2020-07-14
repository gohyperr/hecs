import { World, Component, Types } from '../src'

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

class BaseTypes extends Component {
  static props = {
    boolean: Types.Boolean,
    number: Types.Number,
    text: Types.Text,
    json: Types.JSON,
  }
}

class ConfiguredTypes extends Component {
  static props = {
    boolean: { type: Types.Boolean, default: true },
    number: { type: Types.Number, default: 5 },
    text: { type: Types.Text, default: 'Hello' },
    json: { type: Types.JSON, default: { foo: 'bar' } },
  }
}

describe('types', () => {
  const world = new World()
  world.components.register([BaseTypes, ConfiguredTypes])

  let entity = world.entities.create()

  describe('base types', () => {
    test('defaults', () => {
      entity.add(BaseTypes)
      const component = entity.get(BaseTypes)
      expect(component.boolean).toBe(false)
      expect(component.number).toBe(0)
      expect(component.text).toBe('')
      expect(component.json).toBe(null)
    })

    test('defaults JSON', () => {
      const data = entity.toJSON()
      expect(data.id).toBe(entity.id)
      expect(data.name).toBe(null)
      expect(data.BaseTypes).toBeDefined()
      expect(data.BaseTypes.boolean).toBe(false)
      expect(data.BaseTypes.number).toBe(0)
      expect(data.BaseTypes.text).toBe('')
      expect(data.BaseTypes.json).toBe(null)
      entity.remove(BaseTypes)

      const entity2 = world.entities.create().fromJSON(data)
      expect(entity2.id).toBe(data.id)
      expect(entity2.name).toBe(data.name)
      const component = entity2.get(BaseTypes)
      expect(component.boolean).toBe(false)
      expect(component.number).toBe(0)
      expect(component.text).toBe('')
      expect(component.json).toBe(null)
    })

    test('provided values', () => {
      entity.add(BaseTypes, {
        boolean: true,
        number: 5,
        text: 'Hello',
        json: { bar: 'baz' },
      })
      const component = entity.get(BaseTypes)
      expect(component.boolean).toBe(true)
      expect(component.number).toBe(5)
      expect(component.text).toBe('Hello')
      expect(component.json.bar).toBe('baz')
    })

    test('provided values JSON', () => {
      const data = entity.toJSON()
      expect(data.id).toBe(entity.id)
      expect(data.name).toBe(null)
      expect(data.BaseTypes).toBeDefined()
      expect(data.BaseTypes.boolean).toBe(true)
      expect(data.BaseTypes.number).toBe(5)
      expect(data.BaseTypes.text).toBe('Hello')
      expect(data.BaseTypes.json).toBe(JSON.stringify({ bar: 'baz' }))
      entity.remove(BaseTypes)

      const entity2 = world.entities.create().fromJSON(data)
      expect(entity2.id).toBe(data.id)
      expect(entity2.name).toBe(data.name)
      const component = entity2.get(BaseTypes)
      expect(component.boolean).toBe(true)
      expect(component.number).toBe(5)
      expect(component.text).toBe('Hello')
      expect(component.json.bar).toBe('baz')
    })
  })

  describe('configured types', () => {
    test('defaults', () => {
      entity.add(ConfiguredTypes)
      const component = entity.get(ConfiguredTypes)
      expect(component.boolean).toBe(true)
      expect(component.number).toBe(5)
      expect(component.text).toBe('Hello')
      expect(component.json.foo).toBe('bar')
      entity.remove(ConfiguredTypes)
    })

    test('provided values', () => {
      entity.add(ConfiguredTypes, {
        boolean: false,
        number: 2,
        text: 'Bye',
        json: { bar: 'baz' },
      })
      const component = entity.get(ConfiguredTypes)
      expect(component.boolean).toBe(false)
      expect(component.number).toBe(2)
      expect(component.text).toBe('Bye')
      expect(component.json.bar).toBe('baz')
      entity.remove(ConfiguredTypes)
    })
  })
})
