import { Groups } from './Groups'

export class System {
  order = Groups.Simulation

  constructor(world) {
    this.world = world
    this.queries = {}
    this.active = true
    this.createQueries(this.constructor.queries)
  }

  createQueries(queries) {
    for (const queryName in queries) {
      const Components = queries[queryName]
      this.queries[queryName] = this.world.queries.create(Components)
    }
  }

  init(world) {}

  update() {}

  reset() {}
}
