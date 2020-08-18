export class PluginManager {
  constructor(world) {
    this.world = world
    this.plugins = new Map()
  }

  register(plugin) {
    if (this.plugins.has(plugin)) {
      console.warn(`ECS: already registered plugin '${plugin.name}'`)
      return
    }
    plugin.plugins.forEach(plugin => {
      this.register(plugin)
    })
    plugin.systems.forEach(System => {
      this.world.systems.register(System)
    })
    plugin.components.forEach(Component => {
      this.world.components.register(Component)
    })
    this.plugins.set(plugin, true)
    console.log(`ECS: registered plugin '${plugin.name}'`)
  }
}
