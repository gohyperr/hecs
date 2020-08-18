/**
 * An Archetype is an exact, distinct set of components.
 * Entities always belong to exactly one archetype at a time.
 */
export class Archetype {
  constructor(world, id, Components) {
    this.world = world
    this.id = id
    this.Components = Components
    this.entities = []
  }
}
