import { Query } from './Query'

export class QueryManager {
  constructor(world) {
    this.world = world
    this.queries = []
  }

  create(Components) {
    const query = new Query(this.world, Components)
    this.queries.push(query)
    return query
  }

  onArchetypeCreated(archetype) {
    for (let q = 0; q < this.queries.length; q++) {
      const query = this.queries[q]
      query.onArchetypeCreated(archetype)
    }
  }
}
