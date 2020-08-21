export const EntityType = {
  name: 'Entity',
  initial(value) {
    return value || ''
  },
  toJSON(value) {
    return value
  },
  fromJSON(data, value) {
    return data || ''
  },
}
