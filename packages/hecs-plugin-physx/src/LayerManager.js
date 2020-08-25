export class LayerManager {
  constructor() {
    this.n = -1
    this.layers = []
  }

  create = layerName => {
    this.n++
    const layer = new Layer(layerName, 1 << this.n)
    this.layers.push(layer)
    this[layerName] = layer
  }

  setCollision = (layer1, layer2, collision) => {
    layer1.mask = layer1.mask & (collision ? layer2.value : ~layer2.value)
    layer2.mask = layer2.mask & (collision ? layer1.value : ~layer1.value)
    layer1.update()
    layer2.update()
  }

  getCollision = (layer1, layer2) => {
    return (layer1.value & layer2.mask) !== 0
  }

  logCollisionMatrix = () => {
    let done = {}
    const table = {}
    this.layers.forEach(layer1 => {
      const row = {}
      this.layers
        .slice()
        .reverse()
        .forEach(layer2 => {
          let pair = layer1.value | layer2.value
          if (done[pair]) return // ignore as this pair has already been plotted
          row[layer2.name] = this.getCollision(layer1, layer2) ? '✅' : '❌'
          done[pair] = true
        })
      table[layer1.name] = row
    })
    console.table(table)
  }
}

class Layer {
  constructor(name, value) {
    this.name = name
    this.value = value
    this.mask = 2147483647 // all other layers enabled by default
    this.data = new PhysX.PxFilterData(this.value, this.mask, 0, 0)
  }

  update = () => {
    this.data.word1 = this.mask
  }

  details = () => {
    console.log({
      name: this.name,
      value: this.value,
      bValue: this.value.toString(2),
      mask: this.mask,
      bMask: this.mask.toString(2),
    })
  }
}
