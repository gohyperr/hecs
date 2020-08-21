export class Asset {
  constructor(url) {
    this.name = null
    this.filename = null
    this.url = url || null
  }

  copy(asset) {
    this.name = asset.name
    this.filename = asset.filename
    this.url = asset.url
  }

  toJSON() {
    return {
      name: this.name,
      filename: this.filename,
      url: this.url,
    }
  }

  fromJSON(data) {
    this.name = data.name
    this.filename = data.filename
    this.url = data.url
    return this
  }
}
