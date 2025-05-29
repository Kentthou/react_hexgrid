import './App.css'
import { useEffect, useRef } from 'react'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hexagonsRef = useRef<{ x: number; y: number }[]>([]) // Store hexagons persistently

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Define constants to avoid repetition (DRY)
    const HEX_SIZE = 20
    const VISIBILITY_RADIUS = 100
    const OFFSET = 10

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Calculate hexagon grid positions
    const calculateHexagons = (width: number, height: number) => {
      const hexHeight = Math.sqrt(3) * HEX_SIZE * 0.9
      const vertDist = hexHeight
      const horizDist = 1.3 * HEX_SIZE
      const hexagons: { x: number; y: number }[] = []
      for (let y = 0; y < height + hexHeight; y += vertDist) {
        const row = Math.floor(y / vertDist)
        const offsetX = row % 2 === 0 ? 0 : HEX_SIZE * 0.65
        for (let x = 0; x < width + HEX_SIZE * 2; x += horizDist) {
          hexagons.push({ x: x + offsetX, y })
        }
      }
      return hexagons
    }

    // Draw a single hexagon
    const drawHex = (x: number, y: number, size: number, color: string) => {
      const angle = (Math.PI * 2) / 6
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        ctx[i === 0 ? 'moveTo' : 'lineTo'](
          x + size * Math.cos(angle * i),
          y + size * Math.sin(angle * i)
        )
      }
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Initialize hexagons
    hexagonsRef.current = calculateHexagons(width, height)

    let mouseX = width / 2
    let mouseY = height / 2

    // Render hexagons near mouse with offset and opacity
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      for (const { x, y } of hexagonsRef.current) {
        const dx = x - mouseX
        const dy = y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < VISIBILITY_RADIUS) {
          const offsetX = dist > 0 ? (dx / dist) * OFFSET : 0
          const offsetY = dist > 0 ? (dy / dist) * OFFSET : 0
          const opacity = (1 - dist / VISIBILITY_RADIUS).toFixed(2)
          drawHex(x + offsetX, y + offsetY, HEX_SIZE * 0.6, `rgba(200, 200, 200, ${opacity})`)
        }
      }
    }

    // Animation loop
    const loop = () => {
      render()
      requestAnimationFrame(loop)
    }
    loop()

    // Event handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      hexagonsRef.current = calculateHexagons(width, height)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white flex flex-col w-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      <header className="relative z-10 flex justify-between items-center px-8 py-4 w-full">
        <h1 className="text-lg font-semibold">Garry Man</h1>
        <nav className="flex gap-8 text-sm">
          {['Home', 'Projects', 'Resume', 'Contact'].map((text) => (
            <a key={text} href="#" className="nav-link">{text}</a>
          ))}
        </nav>
      </header>
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 max-w-screen-lg mx-auto">
        <h2 className="text-5xl font-bold mb-3 animate-shimmer">Garry Man</h2>
        <p className="text-xl text-gray-300 mb-6 hover:scale-105 hover:text-white transition-all duration-300">
          Web Developer
        </p>
        <p className="max-w-md mb-8 text-gray-400 hover:brightness-125 transition duration-300 hover:scale-105">
          I craft clean, efficient websites with a focus on simplicity and performance. Let’s build something great.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          {['View Resume', 'Projects', 'Contact Me'].map((label) => (
            <a key={label} href="#" className="btn-fill text-white border border-green-500">{label}</a>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App