export const SelectType = {
  name: 'Select',
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
