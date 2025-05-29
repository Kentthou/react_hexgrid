import './App.css'
import { useEffect, useRef } from 'react'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hexagonsRef = useRef<{ x: number; y: number }[]>([]) // Store hexagons persistently

  // Function to calculate hexagon positions based on canvas size
  const calculateHexagons = (width: number, height: number) => {
    const hexSize = 20 // Reduced from 30 for smaller hexagons
    const hexHeight = Math.sqrt(3) * hexSize * 0.9 // Slightly more compact vertically
    const hexWidth = 2 * hexSize
    const vertDist = hexHeight
    const horizDist = 1.3 * hexSize // Reduced from 1.5 for more compact grid
    const hexagons: { x: number; y: number }[] = []

    for (let y = 0; y < height + hexHeight; y += vertDist) {
      const row = Math.floor(y / vertDist) // Ensure integer row for offset
      for (let x = 0; x < width + hexWidth; x += horizDist) {
        const offsetX = row % 2 === 0 ? 0 : hexSize * 0.65 // Adjusted offset for new hexSize
        hexagons.push({ x: x + offsetX, y })
      }
    }
    return hexagons
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const hexSize = 20 // Reduced from 30 for smaller hexagons

    // Initialize hexagons
    hexagonsRef.current = calculateHexagons(width, height)

    const drawHex = (x: number, y: number, size: number, color: string) => {
      const angle = (Math.PI * 2) / 6
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const px = x + size * Math.cos(angle * i)
        const py = y + size * Math.sin(angle * i)
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.stroke()
    }

    let mouseX = width / 2
    let mouseY = height / 2

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      for (const { x, y } of hexagonsRef.current) {
        const dx = x - mouseX
        const dy = y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) { // Reduced from 150 for smaller visibility circle
          const offset = 10
          const offsetX = dist > 0 ? (dx / dist) * offset : 0 // Prevent division by zero
          const offsetY = dist > 0 ? (dy / dist) * offset : 0 // Prevent division by zero
          const opacity = 1 - dist / 100 // Adjusted for new radius
          drawHex(x + offsetX, y + offsetY, hexSize * 0.6, `rgba(200, 200, 200, ${opacity.toFixed(2)})`) // Changed color
        }
      }
    }

    const loop = () => {
      render()
      requestAnimationFrame(loop)
    }
    loop()

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Resize handler to update both canvas and hexagons
    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      hexagonsRef.current = calculateHexagons(width, height) // Recalculate hexagons
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
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      {/* Navbar: Full-width with padding */}
      <header className="relative z-10 flex justify-between items-center px-8 py-4 w-full">
        <h1 className="text-lg font-semibold">Garry Man</h1>
        <nav className="flex gap-8 text-sm"> {/* Increased gap for spacing */}
          {['Home', 'Projects', 'Resume', 'Contact'].map((text) => (
            <a key={text} href="#" className="nav-link">{text}</a>
          ))}
        </nav>
      </header>
      {/* Hero Section: Centered content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 max-w-screen-lg mx-auto">
        <h2 className="text-5xl font-bold mb-3 animate-shimmer">Garry Man</h2>
        <p className="text-xl text-gray-300 mb-6 hover:scale-105 hover:text-white transition-all duration-300">
          Web Developer
        </p>
        <p className="max-w-md mb-8 text-gray-400 hover:brightness-125 transition duration-300 hover:scale-105">
          I craft clean, efficient websites with a focus on simplicity and performance.
          Let’s build something great.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          {['View Resume', 'Projects', 'Contact Me'].map((label) => (
            <a key={label} href="#" className="btn-fill text-white border border-indigo-500">
              {label}
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App