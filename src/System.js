export class System {
  constructor(world, order) {
    this.world = world
    this.order = order
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
