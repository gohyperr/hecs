import { THREE } from './three'

/**
 * GLTFLoader isn't quite ready for use in node.js
 *
 * 1. load() tries to use XMLHttpRequest which doesn't exist
 *    on node. Instead we just load it ourself using fetch
 *    with is available in browsers, and polyfilled on node.
 *    It is then sent through parse() manually.
 * 2. parse() tries to call atob() on the result which node
 *    does not have. We polyfill this too.
 */

export class Loader {
  constructor() {
    this.loader = new THREE.GLTFLoader()
    this.cache = {}
  }

  async load(path) {
    let promise = this.cache[path]
    if (!promise) {
      promise = this.cache[path] = new Promise(async (resolve, reject) => {
        const response = await fetch(path)
        const buffer = await response.arrayBuffer()
        this.loader.parse(
          buffer,
          null,
          gltf => resolve(gltf.scene),
          error => reject(error)
        )
      })
    }
    const scene = await promise
    return scene.clone()
  }
}
