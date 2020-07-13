export class ComponentManager {
  constructor(world) {
    this.world = world
    this.lastComponentId = 0
    this.componentsByName = {}
  }

  register(Components) {
    if (!Array.isArray(Components)) Components = [Components]
    Components.forEach(Component => {
      Component.id = this.lastComponentId++
      this.componentsByName[Component.name] = Component
    })
    return this
  }

  getByName(name) {
    return this.componentsByName[name]
  }
}
