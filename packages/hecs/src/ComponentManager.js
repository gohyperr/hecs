export class ComponentManager {
  constructor(world) {
    this.world = world
    this.count = 0
    this.lastComponentId = 0
    this.componentsByName = {}
  }

  register(Component) {
    Component.id = this.lastComponentId++
    this.componentsByName[Component.name] = Component
    this.count++
    return this
  }

  getByName(name) {
    return this.componentsByName[name]
  }
}
