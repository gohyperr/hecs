export class SystemManager {
  constructor(world) {
    this.world = world
    this.Systems = new Map()
    this.systems = []
    this.systemsByName = {}
    this.tick = 0
  }

  register(Systems) {
    if (!Array.isArray(Systems)) Systems = [Systems]
    Systems.forEach(System => {
      if (this.Systems.has(System)) {
        console.warn('SystemManager: system already registered')
        return
      }
      const system = new System(this.world)
      this.Systems.set(System, system)
      this.systems.push(system)
      this.systemsByName[System.name] = system
      system.init()
    })
    return this
  }

  get(System) {
    return this.Systems.get(System)
  }

  getByName(name) {
    return this.systemsByName[name]
  }

  update() {
    for (let i = 0; i < this.systems.length; i++) {
      this.tick++
      const system = this.systems[i]
      if (system.active) system.update()
    }
  }

  reset() {
    this.systems.forEach(system => {
      system.reset()
    })
  }
}
