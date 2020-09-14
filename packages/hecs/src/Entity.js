import { Component } from './Component'
import { StateComponent } from './StateComponent'

export class Entity {
  constructor(world, name, id, meta) {
    this.world = world
    this.id = id
    this.name = name || null
    this.meta = meta || {}
    this.Components = []
    this.components = new Map()
    this.parent = null
    this.children = []
    this.inactiveComponents = []
    this.archetypeId = world.archetypes.initialId
    this.active = false
  }

  add(Component, values, ret) {
    let component
    if (!Component.isComponent) {
      component = Component
      Component = Component.constructor
    } else {
      component = new Component(this.world, values)
    }
    const replacing = this.components.has(Component)
    this.components.set(Component, component)
    if (replacing) {
      component.modified()
    } else {
      this.Components.push(Component)
      this.world.archetypes.onEntityComponentChange(this, Component, true)
    }
    return ret ? component : this
  }

  get(Component) {
    return this.components.get(Component)
  }

  has(Component) {
    return !!this.components.get(Component)
  }

  remove(Component) {
    if (!this.components.has(Component)) {
      console.warn('Entity: cannot remove component as it doesnt have one')
      return
    }
    this.components.delete(Component)
    const idx = this.Components.indexOf(Component)
    this.Components.splice(idx, 1)
    this.world.archetypes.onEntityComponentChange(this, Component, false)
    if (!this.Components.length && (this.deactivating || this.destroying)) {
      this.active = false
      this.deactivating = false
      this.destroying = false
      this.world.entities.onEntityInactive(this)
      this.world.archetypes.onEntityInactive(this)
    }
    return this
  }

  setParent(entity) {
    // remove current parent (if any)
    if (this.parent) {
      const idx = this.parent.children.indexOf(this)
      this.parent.children.splice(idx, 1)
      this.parent = null
    }
    // add new parent (if any)
    if (entity) {
      this.parent = entity
      entity.children.push(this)
    }
  }

  getParent() {
    return this.parent
  }

  activate() {
    if (this.active) {
      console.warn('Entity: cannot activate as entity is already active')
      return
    }
    while (this.inactiveComponents.length) {
      const component = this.inactiveComponents.pop()
      const Component = component.constructor
      this.components.set(Component, component)
      this.Components.push(Component)
      this.world.archetypes.onEntityComponentChange(this, Component, true)
    }
    this.active = true
    this.deactivating = false
    this.destroying = false
    this.world.entities.onEntityActive(this)
    this.world.archetypes.onEntityActive(this)
    return this
  }

  deactivate() {
    /**
     * Temporarily removes all Components except StateComponents.
     * If there are no StateComponents the entity is immediately removed
     * from the world and all queries.
     * If any StateComponents do exist then the entity stays active until
     * systems have removed all StateComponents.
     */
    for (let i = this.Components.length - 1; i >= 0; --i) {
      const Component = this.Components[i]
      if (Component.__proto__ === StateComponent) {
        this.deactivating = true
      } else {
        const component = this.components.get(Component)
        this.components.delete(Component)
        this.Components.splice(i, 1)
        this.inactiveComponents.push(component)
        this.world.archetypes.onEntityComponentChange(this, Component, false)
      }
    }
    if (!this.deactivating) {
      this.active = false
      this.world.entities.onEntityInactive(this)
      this.world.archetypes.onEntityInactive(this)
    }
    return this
  }

  destroy() {
    /**
     * Removes all Components except StateComponents.
     * If there are no StateComponents the entity is removed from the world and
     * all queries immediately.
     * If any StateComponents do exist then the entity stays active until
     * systems have removed all StateComponents.
     */
    for (let i = this.Components.length - 1; i >= 0; --i) {
      const Component = this.Components[i]
      if (Component.__proto__ === StateComponent) {
        this.destroying = true
      } else {
        this.components.delete(Component)
        this.Components.splice(i, 1)
        this.world.archetypes.onEntityComponentChange(this, Component, false)
      }
    }
    if (!this.destroying) {
      this.active = false
      this.world.entities.onEntityInactive(this)
      this.world.archetypes.onEntityInactive(this)
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].destroy()
    }
    return this
  }

  toJSON() {
    const data = {
      id: this.id,
      name: this.name,
      meta: { ...this.meta },
    }
    this.components.forEach(component => {
      if (component.constructor.__proto__ === Component) {
        data[component.name] = component.toJSON()
      }
    })
    return data
  }

  fromJSON(data) {
    this.id = data.id
    this.name = data.name
    this.meta = data.meta
    for (const key in data) {
      if (key === 'id' || key === 'name' || key === 'meta') continue
      const Component = this.world.components.getByName(key)
      this.add(Component, undefined, true).fromJSON(data[key])
    }
    return this
  }
}
