export class Query {
  constructor(world, Components) {
    this.world = world
    this.Components = Components
    this.Modified = []
    this.archetypes = []

    for (let i = 0; i < Components.length; i++) {
      const Component = Components[i]
      if (Component.isModified) {
        this.Modified.push(Component.Component)
      }
    }

    for (const archetypeId in this.world.archetypes.archetypes) {
      const archetype = this.world.archetypes.archetypes[archetypeId]
      if (this.matchesArchetype(archetype)) {
        this.archetypes.push(archetype)
      }
    }
  }

  isModified(entity) {
    for (let i = 0; i < this.Modified.length; i++) {
      const Component = this.Modified[i]
      const modifiedTick = entity.get(Component).modifiedUntilSystemTick
      const systemTick = this.world.systems.tick
      if (modifiedTick >= systemTick) {
        return true
      }
    }
    return false
  }

  forEach(callback) {
    for (let a = 0; a < this.archetypes.length; a++) {
      const entities = this.archetypes[a].entities

      // array is iterated in reverse so that if an entity is removed from
      // it during iteration it continues to run
      for (let e = entities.length - 1; e >= 0; --e) {
        const entity = entities[e]

        if (this.Modified.length) {
          if (this.isModified(entity)) callback(entity)
        } else {
          callback(entity)
        }
      }
    }
  }

  count() {
    const count = 0
    this.forEach(() => count++)
    return count
  }

  onArchetypeCreated(archetype) {
    if (this.matchesArchetype(archetype)) {
      this.archetypes.push(archetype)
    }
  }

  matchesArchetype(archetype) {
    let match = true
    for (let c = 0; c < this.Components.length; c++) {
      let Component = this.Components[c]
      const isNot = Component.isNot
      const isModified = Component.isModified
      if (isNot || isModified) Component = Component.Component
      if (isNot) {
        if (archetype.Components.indexOf(Component) !== -1) {
          match = false
          break
        }
      } else {
        if (archetype.Components.indexOf(Component) === -1) {
          match = false
          break
        }
      }
    }
    if (match) this.archetypes.push(archetype)
  }
}
