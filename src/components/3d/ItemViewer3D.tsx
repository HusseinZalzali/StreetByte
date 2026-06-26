'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ItemViewer3DProps {
  imageSrc: string
  primaryColor?: string
  secondaryColor?: string
}

export default function ItemViewer3D({
  imageSrc,
  primaryColor = '#f7342e',
  secondaryColor = '#ffb800',
}: ItemViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0, 4.5)

    function resize() {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ── Parse colors ──────────────────────────────────────────────────────
    const hexToInt = (hex: string) => parseInt(hex.replace('#', ''), 16)
    const p = hexToInt(primaryColor)
    const s = hexToInt(secondaryColor)

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight)

    const orbitLight1 = new THREE.PointLight(p, 5, 12)
    const orbitLight2 = new THREE.PointLight(s, 5, 12)
    scene.add(orbitLight1, orbitLight2)

    // Orbit light helpers (visible glow spheres)
    const glowGeo = new THREE.SphereGeometry(0.08, 8, 8)
    const glow1 = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: p }))
    const glow2 = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: s }))
    scene.add(glow1, glow2)

    // ── Food plane ────────────────────────────────────────────────────────
    let cardGroup: THREE.Group | null = null
    const rotation = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const textureLoader = new THREE.TextureLoader()
    textureLoader.setCrossOrigin('anonymous')

    textureLoader.load(
      imageSrc,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace

        // Keep card in a 1:1 square canvas by fitting width
        const imgAspect = texture.image.width / texture.image.height
        const cardW = 2.2
        const cardH = cardW / imgAspect

        cardGroup = new THREE.Group()

        // Front face (food photo)
        const frontGeo = new THREE.PlaneGeometry(cardW, cardH)
        const frontMat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.25,
          metalness: 0.08,
        })
        const front = new THREE.Mesh(frontGeo, frontMat)
        front.position.z = 0.042
        cardGroup.add(front)

        // Card body (slight depth)
        const bodyGeo = new THREE.BoxGeometry(cardW, cardH, 0.08)
        const edgeMat = new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 0.8 })
        const body = new THREE.Mesh(bodyGeo, [edgeMat, edgeMat, edgeMat, edgeMat, edgeMat, edgeMat])
        cardGroup.add(body)

        // Back face gradient
        const backGeo = new THREE.PlaneGeometry(cardW, cardH)
        const backMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
        const back = new THREE.Mesh(backGeo, backMat)
        back.position.z = -0.042
        back.rotation.y = Math.PI
        cardGroup.add(back)

        // Glow halo behind the card
        const haloGeo = new THREE.PlaneGeometry(cardW * 1.6, cardH * 1.6)
        const haloMat = new THREE.MeshBasicMaterial({
          color: p,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        })
        const halo = new THREE.Mesh(haloGeo, haloMat)
        halo.position.z = -0.15
        cardGroup.add(halo)

        scene.add(cardGroup)
      },
      undefined,
      () => {
        // Fallback if texture fails
        const geo = new THREE.BoxGeometry(2.2, 1.6, 0.08)
        const mat = new THREE.MeshStandardMaterial({ color: 0x333333 })
        cardGroup = new THREE.Group()
        cardGroup.add(new THREE.Mesh(geo, mat))
        scene.add(cardGroup)
      }
    )

    // ── Mouse / touch drag ────────────────────────────────────────────────
    const drag = { active: false, lastX: 0, lastY: 0 }

    const onPointerDown = (e: PointerEvent) => {
      drag.active = true
      drag.lastX = e.clientX
      drag.lastY = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }
    const onPointerUp = () => { drag.active = false }
    const onPointerMove = (e: PointerEvent) => {
      if (!drag.active) return
      const dx = e.clientX - drag.lastX
      const dy = e.clientY - drag.lastY
      rotation.targetY += dx * 0.012
      rotation.targetX = Math.max(-0.55, Math.min(0.55, rotation.targetX + dy * 0.008))
      drag.lastX = e.clientX
      drag.lastY = e.clientY
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointermove', onPointerMove)

    // ── Animation loop ────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let raf: number

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      // Orbiting lights
      const r1 = 3.2
      orbitLight1.position.set(Math.cos(t * 0.7) * r1, Math.sin(t * 0.5) * 1.8, Math.sin(t * 0.7) * r1 * 0.6 + 2.5)
      orbitLight2.position.set(Math.cos(t * 0.7 + Math.PI) * r1, Math.sin(t * 0.5 + Math.PI) * 1.8, Math.sin(t * 0.7 + Math.PI) * r1 * 0.6 + 2.5)
      glow1.position.copy(orbitLight1.position)
      glow2.position.copy(orbitLight2.position)

      if (cardGroup) {
        // Auto-rotate when idle
        if (!drag.active) rotation.targetY += 0.004

        // Smooth lerp
        rotation.x += (rotation.targetX - rotation.x) * 0.09
        rotation.y += (rotation.targetY - rotation.y) * 0.09

        cardGroup.rotation.x = rotation.x
        cardGroup.rotation.y = rotation.y

        // Gentle float
        cardGroup.position.y = Math.sin(t * 0.6) * 0.07
      }

      renderer.render(scene, camera)
    }

    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointermove', onPointerMove)
      renderer.dispose()
    }
  }, [imageSrc, primaryColor, secondaryColor])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
    />
  )
}
