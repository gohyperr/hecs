export class SystemManager {
  constructor(world) {
    this.world = world
    this.Systems = new Map()
    this.systems = []
    this.systemsByName = {}
    this.tick = 0
  }

  register(System, order = 0) {
    if (this.Systems.has(System)) {
      console.warn('ECS: system already registered')
      return
    }
    const system = new System(this.world, order)
    this.Systems.set(System, system)
    let position = 0
    for (let i = 0; i < this.systems.length; i++) {
      const other = this.systems[i]
      if (other.order > system.order) break
      position = i
    }
    this.systems.splice(position + 1, 0, system)
    this.systemsByName[System.name] = system
    system.init()
    return this
  }

  get(System) {
    return this.Systems.get(System)
  }

  getByName(name) {
    return this.systemsByName[name]
  }

  update(delta) {
    for (let i = 0; i < this.systems.length; i++) {
      this.tick++
      const system = this.systems[i]
      if (system.active) system.update(delta)
    }
  }

  reset() {
    this.systems.forEach(system => {
      system.reset()
    })
  }
}
