"use client"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center gap-12 p-6">
      {/* Main Title - Retro Pixel Style */}
      <div className="text-center">
        <h1 className="text-pixel-lg text-white pixel-outline mb-4">HEXFI CLI</h1>
        <p className="font-pixel text-gray-400 text-lg tracking-wider">Retro Arcade Font Showcase</p>
      </div>

      {/* Showcase Sections */}
      <div className="w-full max-w-4xl space-y-12">
        {/* Large Text Example */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-pixel-sm text-cyan-400 mb-6 pixel-glow">Large Display</h2>
          <p className="font-pixel text-white text-3xl md:text-5xl tracking-wider leading-relaxed">PIXEL FONT</p>
        </div>

        {/* Medium Text Example */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-pixel-sm text-lime-400 mb-6 pixel-glow">Medium Display</h2>
          <p className="font-pixel text-white text-2xl md:text-3xl tracking-wider leading-relaxed">ARCADE STYLE</p>
        </div>

        {/* Small Text & Content */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-pixel-sm text-pink-400 mb-6 pixel-glow">Body Text</h2>
          <div className="space-y-4">
            <p className="font-pixel text-gray-300 text-base md:text-lg tracking-wider">
              {">"} Loading retro aesthetic...
            </p>
            <p className="font-pixel text-gray-300 text-base md:text-lg tracking-wider">
              {">"} [████████░░] 80% Complete
            </p>
            <p className="font-pixel text-gray-300 text-base md:text-lg tracking-wider">{">"} SYSTEM READY</p>
          </div>
        </div>

        {/* Color Variations */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-pixel-sm text-white mb-6 pixel-glow">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="font-pixel text-cyan-400 text-xl tracking-wider mb-2 pixel-glow">CYAN</p>
            </div>
            <div>
              <p className="font-pixel text-lime-400 text-xl tracking-wider mb-2 pixel-glow">LIME</p>
            </div>
            <div>
              <p className="font-pixel text-pink-400 text-xl tracking-wider mb-2 pixel-glow">PINK</p>
            </div>
            <div>
              <p className="font-pixel text-orange-400 text-xl tracking-wider mb-2 pixel-glow">ORANGE</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
