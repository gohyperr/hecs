import * as THREE from 'three'

const root = typeof window !== 'undefined' ? window : global

/**
 * We have to do a little bit of setting up for three.
 * When importing OrbitControls it tries to attach it
 * to the global scope.
 * In the browser this is `window` and in node this
 * is `global`.
 * We then export the reference so that we don't rely
 * on globals - because we aren't monsters!
 */

root.THREE = THREE

require('three/examples/js/loaders/GLTFLoader')
require('three/examples/js/controls/OrbitControls')
require('three/examples/js/controls/TransformControls')

export { THREE }
