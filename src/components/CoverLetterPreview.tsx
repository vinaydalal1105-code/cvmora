import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'
import type { CoverLetterData, CoverLetterTemplateId } from '../types/coverLetter'
import { CoverLetterProfessional, CoverLetterModern, CoverLetterMinimal } from './coverLetterTemplates'

const COVER_LETTER_TEMPLATE_MAP: Record<CoverLetterTemplateId, React.ComponentType<{ data: CoverLetterData }>> = {
  professional: CoverLetterProfessional,
  modern: CoverLetterModern,
  minimal: CoverLetterMinimal,
}

/** A4 page size in px (same as resume) */
const A4_PAGE_WIDTH = 595
const A4_PAGE_HEIGHT = 842
const PREVIEW_ZOOM = 1.2
const A4_PREVIEW_WIDTH = Math.round(A4_PAGE_WIDTH * PREVIEW_ZOOM)
const A4_PREVIEW_HEIGHT = Math.round(A4_PAGE_HEIGHT * PREVIEW_ZOOM)

function CoverLetterContent({ data }: { data: CoverLetterData }) {
  const Template = COVER_LETTER_TEMPLATE_MAP[data.template_id] ?? CoverLetterProfessional
  return <Template data={data} />
}

export type CoverLetterPreviewHandle = { print: () => void }

export const CoverLetterPreview = forwardRef<CoverLetterPreviewHandle, {
  data: CoverLetterData
  onPrint?: () => void
  showDownloadButtons?: boolean
}>(function CoverLetterPreview({ data, onPrint, showDownloadButtons = true }, ref) {
  const printRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(A4_PAGE_HEIGHT)
  const [pageOffsets, setPageOffsets] = useState<number[]>([0])
  const pageCount = pageOffsets.length

  useEffect(() => {
    const el = measureRef.current
    if (!el) return

    const update = () => {
      const h = el.scrollHeight
      setContentHeight(h)

      const containerRect = el.getBoundingClientRect()

      // Collect line rectangles for all visible text nodes
      const lineMap = new Map<number, number>()
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        },
      })

      while (walker.nextNode()) {
        const node = walker.currentNode as Text
        const range = document.createRange()
        range.selectNodeContents(node)
        const rects = range.getClientRects()
        for (const rect of rects) {
          if (rect.height < 4) continue
          const top = Math.max(0, Math.floor(rect.top - containerRect.top))
          const bottom = Math.max(0, Math.ceil(rect.bottom - containerRect.top))
          const prev = lineMap.get(top)
          if (prev == null || bottom > prev) lineMap.set(top, bottom)
        }
        range.detach?.()
      }

      const lineRects = Array.from(lineMap.entries())
        .map(([top, bottom]) => ({ top, bottom }))
        .sort((a, b) => a.top - b.top)

      const PAGE_H = A4_PAGE_HEIGHT

      // Find next page offset so no line is cut: either start of first line that spans the boundary (move it to next page), or first line start at or after boundary
      const getNextOffset = (pageEndY: number): number => {
        for (const { top, bottom } of lineRects) {
          if (top < pageEndY && bottom > pageEndY) {
            return top
          }
        }
        for (const { top } of lineRects) {
          if (top >= pageEndY) return top
        }
        return pageEndY
      }

      const offsets: number[] = [0]
      const maxPages = 10
      let top = 0

      while (offsets.length < maxPages && top + PAGE_H < h - 1) {
        const pageEndY = top + PAGE_H
        const breakAt = getNextOffset(pageEndY)
        offsets.push(breakAt)
        top = breakAt
      }

      setPageOffsets(offsets)
    }

    update()
    const raf = requestAnimationFrame(update)

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(update)
    })
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [data])

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Cover Letter - ${data.job_title || data.title}`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      @media print {
        .cover-letter-print-page { width: 210mm !important; height: 297mm !important; overflow: hidden !important; page-break-after: always; position: relative; box-sizing: border-box; }
        .cover-letter-print-page:last-child { page-break-after: auto; }
      }
    `,
  })

  useImperativeHandle(ref, () => ({ print: onPrint ?? handlePrint }), [onPrint, handlePrint])

  return (
    <div className="relative flex flex-col h-full min-h-0">
      <div className="flex-none flex items-center justify-between gap-4 px-5 py-4 border-b border-[#e7e5e4] bg-white">
        <span className="text-sm font-semibold text-[#1c1917]">Preview</span>
        {showDownloadButtons && (
          <button
            type="button"
            onClick={onPrint ?? handlePrint}
            className="px-4 py-2 rounded-xl bg-[#f97316] text-white text-sm font-semibold hover:bg-[#ea580c] transition-colors"
          >
            Download PDF
          </button>
        )}
      </div>
      {/* Multi-page preview: same size as resume (A4 at 1.2×). We measure from the first page's content so layout matches. */}
      <div className="flex-1 min-h-0 overflow-auto bg-[#f0f0f0] px-3 py-5 flex flex-col items-center">
        <div className="flex flex-col gap-3">
          {pageOffsets.map((offset, i) => (
            <div
              key={i}
              className="shadow-xl bg-white flex-shrink-0 overflow-hidden rounded-sm"
              style={{
                width: A4_PREVIEW_WIDTH,
                height: A4_PREVIEW_HEIGHT,
                boxSizing: 'border-box',
              }}
            >
              <div
                className="overflow-hidden"
                style={{
                  width: A4_PAGE_WIDTH,
                  height: A4_PAGE_HEIGHT,
                  transform: `scale(${PREVIEW_ZOOM})`,
                  transformOrigin: 'top left',
                }}
              >
                <div
                  ref={i === 0 ? measureRef : undefined}
                  style={{ transform: `translateY(-${offset}px)` }}
                >
                  <CoverLetterContent data={data} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {pageCount > 1 && (
          <p className="text-xs text-[#78716c] mt-2 tabular-nums">
            {pageCount} page{pageCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      {/* Print-only: multiple A4 pages with page-break-after */}
      <div ref={printRef} className="hidden print:block">
        {pageOffsets.map((offset, i) => (
          <div
            key={i}
            className="cover-letter-print-page"
            style={{
              width: A4_PAGE_WIDTH,
              height: A4_PAGE_HEIGHT,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ transform: `translateY(-${offset}px)` }}>
              <CoverLetterContent data={data} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
