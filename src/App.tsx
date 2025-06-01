import './App.css';
import { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hexagonsRef = useRef<{ x: number; y: number }[]>([]); // Store hexagons persistently

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const HEX_SIZE = 25;
    const VISIBILITY_RADIUS = 100;
    const OFFSET = 10;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const calculateHexagons = (w: number, h: number) => {
      const hexHeight = Math.sqrt(3) * HEX_SIZE * 0.9;
      const vertDist = hexHeight;
      const horizDist = 1.3 * HEX_SIZE;
      const hexagons: { x: number; y: number }[] = [];
      for (let y = 0; y < h + hexHeight; y += vertDist) {
        const row = Math.floor(y / vertDist);
        const offsetX = row % 2 === 0 ? 0 : HEX_SIZE * 0.65;
        for (let x = 0; x < w + HEX_SIZE * 2; x += horizDist) {
          hexagons.push({ x: x + offsetX, y });
        }
      }
      return hexagons;
    };

    // Draw a single hexagon (stroke only)
    const drawHex = (x: number, y: number, size: number, color: string) => {
      const angle = (Math.PI * 2) / 6;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx[i === 0 ? 'moveTo' : 'lineTo'](
          x + size * Math.cos(angle * i),
          y + size * Math.sin(angle * i)
        );
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Initialize hexagon grid
    hexagonsRef.current = calculateHexagons(width, height);

    let mouseX = width / 2;
    let mouseY = height / 2;

    // Render loop: hexagons near cursor get offset + opacity
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const { x, y } of hexagonsRef.current) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < VISIBILITY_RADIUS) {
          const offsetX = dist > 0 ? (dx / dist) * OFFSET : 0;
          const offsetY = dist > 0 ? (dy / dist) * OFFSET : 0;
          const opacity = (1 - dist / VISIBILITY_RADIUS).toFixed(2);
          // neon cyan stroke instead of gray
          drawHex(
            x + offsetX,
            y + offsetY,
            HEX_SIZE * 0.6,
            `rgba(0, 255, 235, ${opacity})`
          );
        }
      }
    };

    // Continuous loop
    const loop = () => {
      render();
      requestAnimationFrame(loop);
    };
    loop();

    // Mouse + resize handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      hexagonsRef.current = calculateHexagons(width, height);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen neon-bg text-white flex flex-col w-full">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Header / Nav */}
      <header className="relative z-10 flex justify-between items-center px-8 py-4 w-full">
        <h1 className="text-3xl font-extrabold neon-text drop-shadow-neon">
          Synthesizer
        </h1>
        <nav className="flex gap-8 text-lg">
          {['Home', 'Projects', 'Resume', 'Contact'].map((text) => (
            <a
              key={text}
              href="#"
              className="nav-link neon-link px-1 pb-2 text-lg"
            >
              {text}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 max-w-screen-lg mx-auto">
        <h2 className="text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-300 bg-clip-text text-transparent animate-shimmer drop-shadow-neon">
          Synthesizer
        </h2>
        <p className="neon-subtitle mt-3 mb-6 transition-all duration-300">
          Web Developer
        </p>
        <p className="max-w-md mb-8 text-gray-400 hover:brightness-125 transition duration-300 hover:scale-105">
          I craft clean, expressive websites with a focus on simplicity and
          performance. Let’s build something great!
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          {['View Resume', 'Projects', 'Contact Me'].map((label) => (
            <a
              key={label}
              href="#"
              className="neon-btn inline-block font-medium"
            >
              {label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
