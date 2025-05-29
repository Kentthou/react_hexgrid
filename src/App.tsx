import './App.css'
import { useEffect, useRef } from 'react'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const hexSize = 50

    const drawHex = (x: number, y: number, size: number, color: string) => {
      const angle = (Math.PI * 2) / 6
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const px = x + size * Math.cos(angle * i)
        const py = y + size * Math.sin(angle * i)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.stroke()
    }

    const render = (mx: number, my: number) => {
      ctx.clearRect(0, 0, width, height)
      for (let x = 0; x < width + hexSize; x += hexSize * 1.5) {
        for (let y = 0; y < height + hexSize; y += hexSize * Math.sqrt(3)) {
          const dx = x - mx
          const dy = y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const offset = Math.min(dist / 300, 1)
          drawHex(x + offset * 10, y + offset * 10, hexSize * 0.4, `rgba(255,255,255,${1 - offset})`)
        }
      }
    }

    let mouseX = width / 2
    let mouseY = height / 2

    const loop = () => {
      render(mouseX, mouseY)
      requestAnimationFrame(loop)
    }

    loop()

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" />

      {/* Navbar */}
      <header className="relative z-10 flex justify-between items-center px-4 sm:px-8 py-4 max-w-screen-lg mx-auto">
        <h1 className="text-lg font-semibold">Garry Man</h1>
        <nav className="flex gap-6 text-sm">
          <a href="#" className="hover:text-indigo-400 transition">Home</a>
          <a href="#" className="hover:text-indigo-400 transition">Projects</a>
          <a href="#" className="hover:text-indigo-400 transition">Resume</a>
          <a href="#" className="hover:text-indigo-400 transition">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 max-w-screen-lg mx-auto">
        <h2 className="text-5xl font-bold mb-3 animate-slide-down">Garry Man</h2>
        <p className="text-xl text-gray-300 mb-6">Web Developer</p>

        <p className="max-w-md mb-8 text-gray-400">
          I craft clean, efficient websites with a focus on simplicity and performance.
          Let’s build something great.
        </p>

        <div className="flex gap-4">
          <a href="#" className="btn-fill text-white border border-indigo-500">
            View Resume
          </a>
          <a href="#" className="btn-outline text-indigo-300 border border-indigo-500">
            Contact Me
          </a>
        </div>
      </main>
    </div>
  )
}

export default App
