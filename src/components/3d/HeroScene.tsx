'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type ShapeEntry = {
  mesh: THREE.Mesh
  rotX: number
  rotY: number
  rotZ: number
  floatOffset: number
  floatSpeed: number
  baseY: number
}

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0d0400)
    renderer.shadowMap.enabled = true

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0d0400, 0.04)

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 0, 6)

    function resize() {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.25))

    const pl1 = new THREE.PointLight(0xf7342e, 4, 22)
    pl1.position.set(4, 4, 4)
    scene.add(pl1)

    const pl2 = new THREE.PointLight(0xffb800, 3, 18)
    pl2.position.set(-4, -2, 2)
    scene.add(pl2)

    const pl3 = new THREE.PointLight(0xff6600, 2, 14)
    pl3.position.set(0, 6, -2)
    scene.add(pl3)

    // ── Materials ─────────────────────────────────────────────────────────
    const mat = (color: number, emissiveIntensity = 0.45) =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity,
        roughness: 0.2,
        metalness: 0.65,
      })

    // ── Shape factory ─────────────────────────────────────────────────────
    const shapes: ShapeEntry[] = []

    function addShape(geo: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, scale: number, speeds: [number, number, number]) {
      const mesh = new THREE.Mesh(geo, material)
      mesh.position.set(x, y, z)
      mesh.scale.setScalar(scale)
      scene.add(mesh)
      shapes.push({
        mesh,
        rotX: speeds[0],
        rotY: speeds[1],
        rotZ: speeds[2],
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.7 + Math.random() * 0.9,
        baseY: y,
      })
    }

    const torus = (scale = 1) => new THREE.TorusGeometry(0.6, 0.22, 16, 64).scale(scale, scale, scale)
    const sphere = (scale = 1) => new THREE.SphereGeometry(0.5, 32, 32).scale(scale, scale, scale)
    const box = (scale = 1) => new THREE.BoxGeometry(0.7, 0.7, 0.7).scale(scale, scale, scale)

    // Red shapes
    addShape(torus(1.1), mat(0xf7342e), -3, 1.5, -1, 1, [0.4, 0, 0.2])
    addShape(torus(0.75), mat(0xff4422), 3.5, -1, -2, 1, [0.5, 0, 0.15])
    addShape(sphere(0.9), mat(0xf7342e, 0.4), 2.5, 2, 0, 1, [0, 0.3, 0])
    addShape(sphere(0.65), mat(0xcc2222, 0.35), -3.5, -1.5, -1, 1, [0, 0.25, 0])
    // Yellow / amber shapes
    addShape(torus(0.85), mat(0xffb800), 0.5, -2.2, -1.5, 1, [0.3, 0, 0.25])
    addShape(sphere(0.7), mat(0xffcc00, 0.4), -1.5, 2.5, -2, 1, [0, 0.28, 0])
    addShape(box(0.9), mat(0xff9900, 0.35), 4.5, 1, -3, 1, [0.25, 0.35, 0])
    addShape(box(0.65), mat(0xffb800, 0.35), -4, 2.5, -3, 1, [0.2, 0.3, 0.1])
    // Centre accent
    addShape(torus(1.3), mat(0xff6600, 0.4), 0, 0.5, 1, 1, [0.2, 0, 0.1])

    // ── Star particles ────────────────────────────────────────────────────
    const starCount = 200
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 24
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 16
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starPoints = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffb800, size: 0.055, transparent: true, opacity: 0.65, sizeAttenuation: true })
    )
    scene.add(starPoints)

    // ── Mouse parallax ────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const camTarget = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2.4
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 1.6
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation loop ────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let raf: number

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      shapes.forEach((s) => {
        s.mesh.rotation.x += s.rotX * 0.016
        s.mesh.rotation.y += s.rotY * 0.016
        s.mesh.rotation.z += s.rotZ * 0.016
        s.mesh.position.y = s.baseY + Math.sin(t * s.floatSpeed + s.floatOffset) * 0.35
      })

      starPoints.rotation.y = t * 0.012

      camTarget.x += (mouse.x - camTarget.x) * 0.04
      camTarget.y += (mouse.y - camTarget.y) * 0.04
      camera.position.x = camTarget.x
      camera.position.y = camTarget.y
      camera.position.z = 6 + Math.sin(t * 0.22) * 0.3
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
      shapes.forEach((s) => {
        s.mesh.geometry.dispose()
        ;(s.mesh.material as THREE.Material).dispose()
      })
      starGeo.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  )
}
