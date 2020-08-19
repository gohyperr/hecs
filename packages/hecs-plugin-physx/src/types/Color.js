export const Color = {
  name: 'Color',
  initial(value) {
    return value || '#ffffff'
  },
  toJSON(value) {
    return value
  },
  fromJSON(data, value) {
    return data || '#ffffff'
  },
}
