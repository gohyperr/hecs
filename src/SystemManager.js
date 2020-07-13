export class SystemManager {
  constructor(world) {
    this.world = world
    this.Systems = new Map()
    this.systems = []
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
    })
    return this
  }

  get(System) {
    return this.Systems.get(System)
  }

  update() {
    for (let i = 0; i < this.systems.length; i++) {
      this.tick++
      const system = this.systems[i]
      system?.update()
    }
  }
}
