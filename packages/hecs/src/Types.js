export const Boolean = {
  name: 'Boolean',
  initial(value) {
    return value || false
  },
  toJSON(value) {
    return value
  },
  fromJSON(data, value) {
    return data || false
  },
}

export const Number = {
  name: 'Number',
  initial(value) {
    return value || 0
  },
  toJSON(value) {
    return value
  },
  fromJSON(data, value) {
    return data || 0
  },
}

export const Text = {
  name: 'Text',
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

export const Ref = {
  name: 'Ref',
  initial(value) {
    return value || null
  },
  toJSON(value) {
    // not serializable
    return null
  },
  fromJSON(data, value) {
    return data || null
  },
}

const _JSON = typeof window === 'undefined' ? global.JSON : window.JSON

export const JSON = {
  name: 'JSON',
  initial(value) {
    if (value) return _JSON.parse(_JSON.stringify(value))
    return null
  },
  toJSON(value) {
    return value && _JSON.stringify(value)
  },
  fromJSON(data, value) {
    return data && _JSON.parse(data)
  },
}
