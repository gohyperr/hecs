import React, { useEffect, useRef } from 'react'
import { World } from 'hecs'
import { Transform } from 'hecs-plugin-core'
import ThreePlugin, { Shape, Camera } from 'hecs-plugin-three'

export default function App() {
  const ref = useRef()

  useEffect(() => {
    const world = new World({
      plugins: [ThreePlugin],
    })

    world.presentation.setViewport(ref.current)
    world.entities.create('Camera').add(Transform).add(Camera).activate()
    world.entities
      .create('Box')
      .add(Transform, { position: { x: 0, y: 0, z: -2 } })
      .add(Shape, { color: 'red' })
      .activate()

    function update() {
      world.update(1000 / 60)
    }

    world.presentation.setLoop(update)
    return () => {
      world.presentation.setViewport(null)
      world.presentation.setLoop(null)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{ height: '100vh', width: '100vw', background: 'black' }}
    />
  )
}
