"use client"

import { Train, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"

interface Station {
  id: string
  name: string
  x: number
  y: number
  lines: string[]
  transfers?: boolean
}

interface Line {
  id: string
  color: string
  stations: string[]
}

const lines: Line[] = [
  { id: "1", color: "#EE352E", stations: ["van-cortlandt", "238st", "215st", "207st", "dyckman", "191st", "181st-1", "168st-1", "157st", "145st-1", "137st", "125st-1", "116st-1", "cathedral", "103st-1", "96st-1", "86st-1", "79st-1", "72st-1", "66st", "59st-col", "50st-1", "times-sq", "34st-penn", "28st-1", "23st-1", "18st-1", "14st-7av", "christopher", "houston", "canal-1", "franklin", "chambers-1", "cortlandt", "rector", "south-ferry"] },
  { id: "2", color: "#EE352E", stations: ["wakefield", "nereid", "233st", "225st", "219st", "gunhill", "burke", "allerton", "pelham", "bronxpark", "e180st", "westfarms", "174st", "freeman", "simpson", "intervale", "prospect-2", "jackson-2", "149st-3av", "138st-3av", "125st-lex", "116st-lex", "110st-lex", "96st-lex", "86st-lex", "72st-1", "times-sq", "34st-penn", "14st-7av", "chambers-1", "fulton", "wallst", "clark"] },
  { id: "4", color: "#00933C", stations: ["woodlawn", "mosholu", "bedford-pk", "kingsbridge", "fordham", "183st", "burnside", "176st", "mt-eden", "170st", "167st", "161st-yankee", "149st-gc", "138st-gc", "125st-lex", "86st-lex", "59st-lex", "gc-42st", "14st-union", "brooklyn-bridge", "fulton", "bowling-green", "borough-hall"] },
  { id: "7", color: "#B933AD", stations: ["flushing", "mets-willets", "junction", "103st-corona", "woodside", "queensboro", "hunters-pt", "vernon", "gc-42st", "5av-bryant", "times-sq", "34st-hudson"] },
  { id: "L", color: "#A7A9AC", stations: ["8av-14st", "14st-6av", "14st-union", "3av-l", "1av", "bedford-l", "lorimer-l", "graham", "grand-l", "montrose", "morgan", "jefferson", "dekalb-l", "myrtle-wyckoff", "halsey-l", "wilson", "bushwick", "broadway-jn", "atlantic-l", "sutter-l", "livonia", "new-lots-l", "east105", "canarsie"] },
  { id: "N", color: "#FCCC0A", stations: ["astoria-ditmars", "astoria-blvd", "30av", "broadway-n", "36av", "queensboro", "lex-59", "5av-59", "57st-7av", "49st", "times-sq", "34st-herald", "28st-bway", "23st-bway", "14st-union", "8st-nyu", "prince", "canal-bway", "city-hall-bway", "cortlandt-bway"] },
  { id: "A", color: "#2850AD", stations: ["inwood-207", "dyckman-a", "190st", "181st-a", "175st-a", "168st-a", "145st-a", "125st-a", "59st-col", "42st-pabt", "34st-penn", "14st-8av", "w4st", "spring-a", "canal-a", "chambers-a", "fulton", "high-st", "jay-st", "hoyt-sch", "lafayette", "clinton-wash-a", "nostrand-a", "utica-a", "broadway-jn-a", "rockaway-blvd", "howard-beach", "jfk"] },
]

// Generate station data from lines
const stationMap = new Map<string, Station>()
const stationPositions: Record<string, {x: number, y: number}> = {}

// Layout stations on a grid-like map
const stationCoords: Record<string, [number, number]> = {
  // 1 line - West side Manhattan (vertical)
  "van-cortlandt": [280, 40], "238st": [280, 80], "215st": [280, 120], "207st": [280, 150],
  "dyckman": [280, 190], "191st": [290, 230], "181st-1": [290, 270], "168st-1": [290, 310],
  "157st": [290, 350], "145st-1": [300, 390], "137st": [300, 420], "125st-1": [310, 460],
  "116st-1": [310, 490], "cathedral": [310, 510], "103st-1": [310, 540], "96st-1": [310, 570],
  "86st-1": [310, 600], "79st-1": [310, 630], "72st-1": [310, 660], "66st": [310, 690],
  "59st-col": [310, 720], "50st-1": [320, 760], "times-sq": [340, 800],
  "34st-penn": [330, 850], "28st-1": [330, 880], "23st-1": [330, 910], "18st-1": [330, 935],
  "14st-7av": [330, 960], "christopher": [330, 990], "houston": [330, 1020],
  "canal-1": [330, 1060], "franklin": [330, 1090], "chambers-1": [330, 1120],
  "cortlandt": [340, 1150], "rector": [340, 1180], "south-ferry": [340, 1210],
  // 2 line - Bronx
  "wakefield": [500, 20], "nereid": [500, 50], "233st": [500, 80], "225st": [500, 110],
  "219st": [500, 140], "gunhill": [500, 170], "burke": [500, 200], "allerton": [500, 230],
  "pelham": [500, 260], "bronxpark": [480, 290], "e180st": [480, 320], "westfarms": [480, 350],
  "174st": [470, 380], "freeman": [460, 410], "simpson": [450, 440], "intervale": [440, 470],
  "prospect-2": [430, 500], "jackson-2": [420, 530], "149st-3av": [410, 560],
  "138st-3av": [400, 590], "125st-lex": [400, 460], "116st-lex": [400, 490],
  "110st-lex": [400, 520], "96st-lex": [400, 570], "86st-lex": [400, 600],
  "clark": [380, 1250],
  // 4 line
  "woodlawn": [430, 20], "mosholu": [430, 60], "bedford-pk": [430, 100], "kingsbridge": [430, 140],
  "fordham": [430, 180], "183st": [430, 220], "burnside": [430, 250], "176st": [430, 280],
  "mt-eden": [430, 310], "170st": [430, 340], "167st": [430, 370], "161st-yankee": [430, 400],
  "149st-gc": [420, 440], "138st-gc": [410, 470],
  "59st-lex": [400, 720], "gc-42st": [380, 800],
  "14st-union": [370, 960], "brooklyn-bridge": [380, 1100],
  "fulton": [360, 1140], "bowling-green": [360, 1190], "borough-hall": [370, 1240],
  "wallst": [360, 1160],
  // 7 line - Queens
  "flushing": [750, 650], "mets-willets": [700, 670], "junction": [650, 690],
  "103st-corona": [620, 710], "woodside": [580, 730], "queensboro": [520, 750],
  "hunters-pt": [470, 780], "vernon": [440, 790], "5av-bryant": [360, 800],
  "34st-hudson": [290, 850],
  // L line
  "8av-14st": [290, 960], "14st-6av": [350, 960], "3av-l": [390, 965],
  "1av": [420, 970], "bedford-l": [460, 975], "lorimer-l": [490, 980],
  "graham": [520, 985], "grand-l": [540, 990], "montrose": [560, 995],
  "morgan": [580, 1000], "jefferson": [600, 1005], "dekalb-l": [620, 1010],
  "myrtle-wyckoff": [640, 1015], "halsey-l": [660, 1020], "wilson": [680, 1025],
  "bushwick": [700, 1030], "broadway-jn": [720, 1035], "atlantic-l": [740, 1040],
  "sutter-l": [760, 1045], "livonia": [780, 1050], "new-lots-l": [800, 1055],
  "east105": [820, 1060], "canarsie": [850, 1065],
  // N line
  "astoria-ditmars": [450, 600], "astoria-blvd": [450, 630], "30av": [450, 660],
  "broadway-n": [450, 690], "36av": [460, 720], "lex-59": [400, 730],
  "5av-59": [360, 730], "57st-7av": [330, 740], "49st": [340, 770],
  "34st-herald": [350, 850], "28st-bway": [350, 880], "23st-bway": [350, 910],
  "8st-nyu": [350, 980], "prince": [350, 1010], "canal-bway": [350, 1050],
  "city-hall-bway": [350, 1080], "cortlandt-bway": [350, 1130],
  // A line
  "inwood-207": [230, 150], "dyckman-a": [230, 190], "190st": [240, 230],
  "181st-a": [240, 270], "175st-a": [250, 300], "168st-a": [250, 310],
  "145st-a": [260, 390], "125st-a": [270, 460],
  "42st-pabt": [300, 800], "14st-8av": [290, 960],
  "w4st": [300, 990], "spring-a": [300, 1020], "canal-a": [300, 1060],
  "chambers-a": [300, 1120], "high-st": [350, 1230],
  "jay-st": [360, 1260], "hoyt-sch": [380, 1280], "lafayette": [400, 1300],
  "clinton-wash-a": [430, 1310], "nostrand-a": [460, 1320], "utica-a": [500, 1330],
  "broadway-jn-a": [540, 1340], "rockaway-blvd": [580, 1380], "howard-beach": [620, 1420],
  "jfk": [680, 1460],
}

// Build station objects
Object.entries(stationCoords).forEach(([id, [x, y]]) => {
  const stationLines = lines.filter(l => l.stations.includes(id)).map(l => l.id)
  stationMap.set(id, {
    id,
    name: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/St\b/g, 'St').replace(/Av\b/g, 'Av'),
    x, y,
    lines: stationLines,
    transfers: stationLines.length > 1,
  })
})

const allStations = Array.from(stationMap.values())

export default function SubwayPage() {
  const [zoom, setZoom] = useState(0.7)
  const [pan, setPan] = useState({ x: 50, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredStation, setHoveredStation] = useState<string | null>(null)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-station]')) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp) }
  }, [handleMouseMove, handleMouseUp])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001)))
  }

  const handleStationClick = (station: Station) => {
    if (selectedStation?.id === station.id) {
      setSelectedStation(null)
    } else {
      setSelectedStation(station)
      // Zoom into station
      setPan({ x: -station.x * zoom + 400, y: -station.y * zoom + 350 })
      setZoom(z => Math.min(3, Math.max(1.5, z + 0.3)))
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-white/10 bg-card/50 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/5 p-2 border border-white/10">
            <Train className="h-5 w-5 text-white" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>NYC Subway Map</h1>
            <p className="text-sm text-slate-500">Interactive Node Graph</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="rounded-lg bg-white/5 p-2 text-slate-400 hover:text-white border border-white/10 transition-all hover:scale-110"><ZoomOut className="h-4 w-4" /></button>
          <span className="min-w-[3rem] text-center text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="rounded-lg bg-white/5 p-2 text-slate-400 hover:text-white border border-white/10 transition-all hover:scale-110"><ZoomIn className="h-4 w-4" /></button>
          <button onClick={() => { setZoom(0.7); setPan({ x: 50, y: 0 }); setSelectedStation(null) }} className="rounded-lg bg-white/5 p-2 text-white border border-white/10 transition-all hover:scale-110"><Maximize2 className="h-4 w-4" /></button>
        </div>
      </header>

      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ background: '#000' }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <svg
          className="absolute inset-0"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', width: 1200, height: 1600 }}
        >
          {/* Lines */}
          {lines.map(line => {
            const pts = line.stations
              .filter(s => stationCoords[s])
              .map(s => stationCoords[s])
            if (pts.length < 2) return null
            const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
            return (
              <path
                key={line.id}
                d={d}
                fill="none"
                stroke={line.color}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.7}
              />
            )
          })}

          {/* Stations */}
          {allStations.map(station => {
            const isHovered = hoveredStation === station.id
            const isSelected = selectedStation?.id === station.id
            const r = station.transfers ? 7 : 5
            const scale = isSelected ? 2.5 : isHovered ? 1.8 : 1

            return (
              <g key={station.id} data-station>
                {/* Glow */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={station.x} cy={station.y}
                    r={r * scale + 8}
                    fill="none"
                    stroke="white"
                    strokeWidth={1}
                    opacity={0.3}
                    style={{ animation: 'stationPulse 1.5s ease-in-out infinite' }}
                  />
                )}
                {/* Station dot */}
                <circle
                  cx={station.x} cy={station.y}
                  r={r * scale}
                  fill={isSelected ? '#fff' : station.transfers ? '#fff' : lines.find(l => l.stations.includes(station.id))?.color || '#fff'}
                  stroke={isHovered || isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isHovered || isSelected ? 2 : 1}
                  style={{ cursor: 'pointer', transition: 'all 0.3s', filter: isHovered || isSelected ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none' }}
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                  onClick={() => handleStationClick(station)}
                />
                {/* Label */}
                {(isHovered || isSelected || zoom > 1.2) && (
                  <text
                    x={station.x + r * scale + 6}
                    y={station.y + 4}
                    className="fill-white text-[9px] font-medium"
                    style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)' }}
                  >
                    {station.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        <style dangerouslySetInnerHTML={{ __html: `@keyframes stationPulse { 0%, 100% { opacity: 0.2; r: 15; } 50% { opacity: 0.5; r: 20; } }` }} />

        {/* Selected station info */}
        {selectedStation && (
          <div className="absolute top-4 right-4 rounded-lg border-2 border-white/15 bg-black/90 backdrop-blur-sm overflow-hidden" style={{ boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
            <div className="px-4 py-2 border-b border-white/10 bg-white/5">
              <span className="text-sm font-semibold text-white" style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>{selectedStation.name}</span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="flex gap-1.5">
                {selectedStation.lines.map(lineId => {
                  const line = lines.find(l => l.id === lineId)
                  return (
                    <div
                      key={lineId}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-[1.3]"
                      style={{ background: line?.color, boxShadow: `0 0 8px ${line?.color}88` }}
                    >
                      {lineId}
                    </div>
                  )
                })}
              </div>
              {selectedStation.transfers && (
                <p className="text-[10px] text-slate-400">Transfer station</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
