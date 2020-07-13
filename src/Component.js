export class Component {
  static props = {}

  constructor(world, values = {}) {
    this.world = world
    this.name = this.constructor.name
    this.props = []
    this.modifiedUntilSystemTick = 0
    for (const propName in this.constructor.props) {
      let prop = this.constructor.props[propName]
      if (!prop.type) prop = { type: prop }
      prop.name = propName
      let value = values[prop.name]
      if (value === undefined) value = prop.default
      this[prop.name] = prop.type.initial(value)
      this.props.push(prop)
    }
  }

  toJSON() {
    const data = {}
    for (let i = 0; i < this.props.length; i++) {
      const { type, name } = this.props[i]
      data[name] = type.toJSON(this[name])
    }
    return data
  }

  fromJSON(data) {
    for (let i = 0; i < this.props.length; i++) {
      const { type, name } = this.props[i]
      this[name] = type.fromJSON(data[name], this[name])
    }
    return this
  }

  modified() {
    /**
     * When a component is marked as changed it will show up
     * in Changed() queries for one cycle starting from the current
     * system it was changed in and ending in the system that runs
     * before it. See `Query.js` for how change detection is checked
     **/
    this.modifiedUntilSystemTick =
      this.world.systems.tick + this.world.systems.systems.length
  }
}
