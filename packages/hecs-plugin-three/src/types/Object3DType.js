import * as THREE from 'three'

export const Object3DType = {
  name: 'Object3D',
  initial(value) {
    return value || new THREE.Object3D()
  },
  toJSON(value) {
    return undefined
  },
  fromJSON(data, value) {
    return undefined
  },
}
