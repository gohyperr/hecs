export class LayerManager {
  constructor() {
    this.list = []
    this.byId = {}

    // build default layers
    // note: this can go up to id=30 but displaying a UI for it is horrible
    // we can solve this when we need more than 7
    const NUM_LAYERS = 7
    let id = 0
    while (id < NUM_LAYERS) {
      const layer = new Layer(id)
      this.list.push(layer)
      this.byId[id] = layer
      id++
    }
  }

  setCollision(id1, id2, shouldCollide) {
    const l1 = this.get(id1)
    const l2 = this.get(id2)
    l1.setCollision(l2, shouldCollide)
  }

  get(id) {
    return this.byId[id]
  }

  logCollisionMatrix = () => {
    let done = {}
    const table = {}
    this.list.forEach(layer1 => {
      const row = {}
      this.list
        .slice()
        .reverse()
        .forEach(layer2 => {
          let pair = layer1.value | layer2.value
          if (done[pair]) return // ignore as this pair has already been plotted
          row[layer2.name] = layer1.collidesWith(layer2) ? '✅' : '❌'
          done[pair] = true
        })
      table[layer1.name] = row
    })
    console.table(table)
  }

  toJSON() {
    return this.list.map(layer => layer.toJSON())
  }

  fromJSON(data) {
    this.list.forEach((layer, i) => layer.fromJSON(data[i]))
    return this
  }
}

class Layer {
  constructor(id) {
    this.id = id
    this.name = `Layer ${id}`
    this.value = 1 << id
    this.mask = 2147483647 // all other layers enabled by default
    this.data = new PhysX.PxFilterData(this.value, this.mask, 0, 0)
  }

  setMask(mask) {
    this.mask = mask
    this.data.word1 = this.mask
  }

  collidesWith(layer) {
    return (this.value & layer.mask) !== 0
  }

  setCollision = (layer2, shouldCollide) => {
    const layer1 = this
    if (shouldCollide) {
      layer1.setMask(layer1.mask | layer2.value)
      layer2.setMask(layer2.mask | layer1.value)
    } else {
      layer1.setMask(layer1.mask & ~layer2.value)
      layer2.setMask(layer2.mask & ~layer1.value)
    }
  }

  logInfo = () => {
    console.log({
      id: this.id,
      name: this.name,
      value: this.value,
      bValue: this.value.toString(2),
      mask: this.mask,
      bMask: this.mask.toString(2),
    })
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      value: this.value,
      mask: this.mask,
    }
  }

  fromJSON(data) {
    this.id = data.id
    this.name = data.name
    this.value = data.value
    this.mask = data.mask
    this.data.word0 = this.value
    this.data.word1 = this.mask
    return this
  }
}
