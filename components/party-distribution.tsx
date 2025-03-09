"use client"

import { useEffect, useRef } from "react"
import type { CandidateWithLikes } from "@/lib/supabase"

interface PartyDistributionProps {
  candidates: CandidateWithLikes[]
}

export function PartyDistribution({ candidates }: PartyDistributionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Group candidates by party
    const partyMap = new Map<string, number>()
    candidates.forEach((candidate) => {
      const party = candidate.party || "Independent"
      partyMap.set(party, (partyMap.get(party) || 0) + 1)
    })

    // Convert to array and sort by count
    const partyData = Array.from(partyMap.entries())
      .map(([party, count]) => ({ party, count }))
      .sort((a, b) => b.count - a.count)

    // Define colors
    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"]

    // Draw pie chart
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 40

    let startAngle = 0
    const total = partyData.reduce((sum, item) => sum + item.count, 0)

    // Draw pie slices
    partyData.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = colors[index % colors.length]
      ctx.fill()

      // Draw slice label if it's big enough
      if (sliceAngle > 0.2) {
        const labelAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.7
        const labelX = centerX + Math.cos(labelAngle) * labelRadius
        const labelY = centerY + Math.sin(labelAngle) * labelRadius

        ctx.fillStyle = "#fff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(item.count.toString(), labelX, labelY)
      }

      startAngle = endAngle
    })

    // Draw legend
    const legendX = rect.width - 120
    const legendY = 20
    const legendItemHeight = 20

    partyData.forEach((item, index) => {
      const y = legendY + index * legendItemHeight

      // Draw color box
      ctx.fillStyle = colors[index % colors.length]
      ctx.fillRect(legendX, y, 12, 12)

      // Draw label
      ctx.fillStyle = "#888"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(`${item.party} (${item.count})`, legendX + 20, y + 6)
    })
  }, [candidates])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}

