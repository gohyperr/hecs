export class ComponentManager {
  constructor(world) {
    this.world = world
    this.count = 0
    this.lastComponentId = 0
    this.componentsByName = {}
  }

  register(Component) {
    if (this.componentsByName[Component.name]) {
      throw new Error(`hecs: component already registered '${Component.name}'`)
    }
    Component.id = this.lastComponentId++
    this.componentsByName[Component.name] = Component
    this.count++
    return this
  }

  getByName(name) {
    return this.componentsByName[name]
  }
}
