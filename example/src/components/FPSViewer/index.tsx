import React, { useEffect, useState } from 'react'
import './style.css'

export default function FPSViewer() {
  const [fps, setFPS] = useState(0)

  useEffect(() => {
    const run = () => {
      getFPS(1000)
        .then((value) => {
          setFPS(value)
          run()
        })
        .catch(() => {})
    }
    run()
  }, [])

  return (
    <b
      className='fps'
      style={{ color: fps > 45 ? 'green' : fps > 30 ? 'orange' : 'red' }}
    >
      FPS:
      {fps}
    </b>
  )
}

// 获取FPS，单位毫秒
function getFPS(timeout: number) {
  const start = performance.now()
  return new Promise<number>((resolve) => {
    let id
    let count = 0
    const run = () => {
      count++
      id = requestAnimationFrame(run)
      if (performance.now() - start >= timeout) {
        cancelAnimationFrame(id)
        resolve(count / (timeout / 1000))
      }
    }
    run()
  })
}
