import { Groups } from './Groups'

export class System {
  order = Groups.Simulation
  constructor(world) {
    this.world = world
    this.queries = {}
    this.active = true
    for (const queryName in this.constructor.queries) {
      const Components = this.constructor.queries[queryName]
      this.queries[queryName] = this.world.queries.create(Components)
    }
  }
  init() {}
  update() {}
  reset() {}
}
