import { Asset } from '../Asset'

export const AssetType = {
  name: 'Asset',
  initial(value) {
    const a = new Asset()
    if (value) a.copy(value)
    return value
  },
  toJSON(value) {
    return value.toJSON()
  },
  fromJSON(data, value) {
    return value.fromJSON(data)
  },
}
