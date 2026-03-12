import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useResume } from '../context/ResumeContext'
import { CorporateTemplate } from '../templates/CorporateTemplate'
import { BoldTemplate } from '../templates/BoldTemplate'
import { HeaderBandTemplate } from '../templates/HeaderBandTemplate'
import { VividTemplate } from '../templates/VividTemplate'
import { ModernTemplate } from '../templates/ModernTemplate'
import { MinimalTemplate } from '../templates/MinimalTemplate'
import { ClassicTemplate } from '../templates/ClassicTemplate'
import { TraditionalTemplate } from '../templates/TraditionalTemplate'
import { CleanTemplate } from '../templates/CleanTemplate'
import { SidebarRightTemplate } from '../templates/SidebarRightTemplate'
import { CenteredCleanTemplate } from '../templates/CenteredCleanTemplate'
import { AccentBarTemplate } from '../templates/AccentBarTemplate'
import { VerticalLineTemplate } from '../templates/VerticalLineTemplate'
import { InitialsHeaderTemplate } from '../templates/InitialsHeaderTemplate'
import { DividedTemplate } from '../templates/DividedTemplate'
import { StoryTemplate } from '../templates/StoryTemplate'
import { DecoTemplate } from '../templates/DecoTemplate'
import { ProficiencyTemplate } from '../templates/ProficiencyTemplate'
import { HeaderProfileTemplate } from '../templates/HeaderProfileTemplate'
import { ElegantTemplate } from '../templates/ElegantTemplate'
import { PillarTemplate } from '../templates/PillarTemplate'
import { SpotlightTemplate } from '../templates/SpotlightTemplate'
import { CardTemplate } from '../templates/CardTemplate'
import { SerifTemplate } from '../templates/SerifTemplate'
import { BoldBlockTemplate } from '../templates/BoldBlockTemplate'
import { TimelineTemplate } from '../templates/TimelineTemplate'
import { LuxeTemplate } from '../templates/LuxeTemplate'
import { GradientTemplate } from '../templates/GradientTemplate'
import { NeonTemplate } from '../templates/NeonTemplate'
import { GeometricTemplate } from '../templates/GeometricTemplate'
import { AuraTemplate } from '../templates/AuraTemplate'
import { createResumeDocx } from '../utils/exportDocx'
import { displayName } from '../utils/resume'

/** Default accents – match gallery (DEFAULT_COLOR_INDEX_BY_TEMPLATE) */
const DEFAULT_ACCENTS: Record<string, string> = {
  professional: '#aabcdf',
  balanced: '#eccbc3',
  'header-ats': '#b0e0dd',
  vivid: '#e38779',
}

const templateMap = {
  professional: (props: { data: Parameters<typeof CorporateTemplate>[0]['data']; accentColor?: string }) => (
    <CorporateTemplate {...props} variant="accent" accentColor={props.accentColor ?? DEFAULT_ACCENTS.professional} />
  ),
  balanced: (props: { data: Parameters<typeof BoldTemplate>[0]['data']; accentColor?: string }) => (
    <BoldTemplate {...props} accentColor={props.accentColor ?? DEFAULT_ACCENTS.balanced} />
  ),
  'header-ats': (props: { data: Parameters<typeof HeaderBandTemplate>[0]['data']; accentColor?: string }) => (
    <HeaderBandTemplate {...props} accentColor={props.accentColor ?? DEFAULT_ACCENTS['header-ats']} />
  ),
  vivid: (props: { data: Parameters<typeof VividTemplate>[0]['data']; accentColor?: string }) => (
    <VividTemplate {...props} accentColor={props.accentColor ?? DEFAULT_ACCENTS.vivid} />
  ),
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
  traditional: TraditionalTemplate,
  corporate: CorporateTemplate,
  clean: CleanTemplate,
  'sidebar-right': SidebarRightTemplate,
  'centered-clean': CenteredCleanTemplate,
  'accent-bar': AccentBarTemplate,
  'vertical-line': VerticalLineTemplate,
  'initials-header': InitialsHeaderTemplate,
  divided: DividedTemplate,
  story: StoryTemplate,
  deco: DecoTemplate,
  proficiency: ProficiencyTemplate,
  'header-profile': HeaderProfileTemplate,
  elegant: ElegantTemplate,
  pillar: PillarTemplate,
  spotlight: SpotlightTemplate,
  card: CardTemplate,
  serif: SerifTemplate,
  'bold-block': BoldBlockTemplate,
  timeline: TimelineTemplate,
  luxe: LuxeTemplate,
  gradient: GradientTemplate,
  neon: NeonTemplate,
  geometric: GeometricTemplate,
  aura: AuraTemplate,
}

type PreviewSidebarOverlay = {
  side: 'left' | 'right'
  widthPct: number
  minPx?: number
  color: string
}

function getPreviewSidebarOverlay(templateId: string, accentColor?: string): PreviewSidebarOverlay | null {
  switch (templateId) {
    case 'professional':
      return { side: 'left', widthPct: 28, color: accentColor ?? DEFAULT_ACCENTS.professional }
    case 'vivid':
      return { side: 'left', widthPct: 28, color: accentColor ?? DEFAULT_ACCENTS.vivid }
    case 'sidebar-right':
      return { side: 'right', widthPct: 28, color: accentColor ?? '#1e3a5f' }
    case 'pillar':
      return { side: 'left', widthPct: 5, color: accentColor ?? '#0f766e' }
    case 'vertical-line':
      return { side: 'left', widthPct: 2, color: accentColor ?? '#059669' }
    case 'proficiency':
      return { side: 'left', widthPct: 26, color: (accentColor ?? '#1e40af') + '1f' }
    default:
      return null
  }
}

/** Content is rendered at full A4 print size, then scaled down for preview. */
const A4_RENDER_WIDTH = 794
const A4_RENDER_HEIGHT = 1123

const A4_PREVIEW_BASE_WIDTH = 595
const A4_PREVIEW_BASE_HEIGHT = 842
const PREVIEW_ZOOM = 1.2
const A4_PREVIEW_WIDTH = Math.round(A4_PREVIEW_BASE_WIDTH * PREVIEW_ZOOM)
const A4_PREVIEW_HEIGHT = Math.round(A4_PREVIEW_BASE_HEIGHT * PREVIEW_ZOOM)
const PREVIEW_SCALE = A4_PREVIEW_WIDTH / A4_RENDER_WIDTH

export { templateMap, DEFAULT_ACCENTS, A4_PREVIEW_WIDTH, A4_PREVIEW_HEIGHT }

export type ResumePreviewHandle = {
  print: () => void
  downloadWord: () => Promise<void>
}

export const ResumePreview = forwardRef<ResumePreviewHandle, { showDownloadButtons?: boolean }>(function ResumePreview(
  { showDownloadButtons = true },
  ref
) {
  const { data, template, accentColor } = useResume()
  const printRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const effectiveAccent = accentColor ?? DEFAULT_ACCENTS[template]
  const [downloadingDocx, setDownloadingDocx] = useState(false)
  const [pageCount, setPageCount] = useState(1)
  const [contentHeight, setContentHeight] = useState(A4_RENDER_HEIGHT)
  const [pageOffsets, setPageOffsets] = useState<number[]>([0])

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Resume - ${displayName(data.contact)}`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      @media print {
        .resume-print-page { width: 210mm !important; height: 297mm !important; overflow: hidden !important; page-break-after: always; position: relative; }
        .resume-print-page:last-child { page-break-after: auto; }
        .resume-print-page [class*="-template"] { border-radius: 0 !important; }
        .resume-print-page aside { min-height: 100% !important; height: 100% !important; align-self: stretch !important; }
        .exp-para .exp-desc, .edu-para .edu-desc { list-style: none !important; padding-left: 0 !important; margin-left: 0 !important; }
        .exp-para .exp-desc li, .edu-para .edu-desc li { display: inline !important; margin: 0 !important; padding: 0 !important; }
        .exp-para .exp-desc li + li::before, .edu-para .edu-desc li + li::before { content: ' '; }
      }
    `,
  })

  const handleDownloadWord = async () => {
    setDownloadingDocx(true)
    try {
      const blob = await createResumeDocx(data)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume-${displayName(data.contact).replace(/\s+/g, '-')}.docx`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloadingDocx(false)
    }
  }

  useImperativeHandle(ref, () => ({
    print: handlePrint,
    downloadWord: handleDownloadWord,
  }), [handlePrint])

  const TemplateComponent = templateMap[template]
  const sidebarOverlay = getPreviewSidebarOverlay(template, effectiveAccent)
  const isExpPara = data.experienceFormat === 'paragraph'
  const isEduPara = data.educationFormat === 'paragraph'
  const paraClasses = [isExpPara ? 'exp-para' : '', isEduPara ? 'edu-para' : ''].filter(Boolean).join(' ')
  const hasPara = isExpPara || isEduPara

  useEffect(() => {
    const el = measureRef.current
    if (!el) return

    let rafId = 0
    const update = () => {
      const h = el.scrollHeight
      const containerRect = el.getBoundingClientRect()

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

      const findLastLineIndex = (maxY: number, minY: number): number => {
        for (let i = lineRects.length - 1; i >= 0; i -= 1) {
          const { top, bottom } = lineRects[i]
          if (bottom <= maxY && top > minY) return i
        }
        return -1
      }
      const getLineGap = (maxY: number, minY: number, backtrack = 0): number | null => {
        const idx = findLastLineIndex(maxY, minY)
        if (idx < 0) return null
        const targetIdx = idx - backtrack
        if (targetIdx < 0 || targetIdx >= lineRects.length) return null
        const lineBottom = lineRects[targetIdx].bottom
        const nextLineTop = targetIdx + 1 < lineRects.length ? lineRects[targetIdx + 1].top : lineBottom + 8
        return Math.ceil(lineBottom + (nextLineTop - lineBottom) / 2)
      }

      const sections = Array.from(el.querySelectorAll('section'))
      const sectionTops = sections
        .map((section) => Math.floor((section as HTMLElement).offsetTop))
        .filter((top) => top > 0)
        .sort((a, b) => a - b)

      const headingTops = Array.from(el.querySelectorAll('h2, h3'))
        .map((heading) => Math.floor((heading as HTMLElement).offsetTop))
        .filter((top) => top > 0)
        .sort((a, b) => a - b)

      const blockRanges: Array<{ start: number; end: number }> = []
      const blockParents = el.querySelectorAll('.space-y-4, .space-y-3')
      blockParents.forEach((parent) => {
        Array.from(parent.children).forEach((child) => {
          const node = child as HTMLElement
          const start = Math.floor(node.offsetTop)
          const end = Math.ceil(node.offsetTop + node.offsetHeight)
          if (end > start) blockRanges.push({ start, end })
        })
      })
      el.querySelectorAll('[style*="break-inside"]').forEach((node) => {
        const n = node as HTMLElement
        const start = Math.floor(n.offsetTop)
        const end = Math.ceil(n.offsetTop + n.offsetHeight)
        if (end > start) blockRanges.push({ start, end })
      })
      blockRanges.sort((a, b) => a.start - b.start)

      const offsets: number[] = [0]
      const maxPages = 10
      const SECTION_GUARD = 160
      const HEADING_GUARD = 88
      const PAGE_TOP_PAD = 32
      const LINE_BACKTRACK = 2
      let top = 0

      while (offsets.length < maxPages && top + A4_RENDER_HEIGHT < h - 1) {
        const pageH = offsets.length === 0 ? A4_RENDER_HEIGHT : A4_RENDER_HEIGHT - PAGE_TOP_PAD
        const target = top + pageH
        const safeTarget = Math.max(top + 12, target - 1)
        let breakAt =
          getLineGap(safeTarget, top + 8, LINE_BACKTRACK) ??
          getLineGap(safeTarget, top + 8, 0) ??
          safeTarget

        let blockStart = 0
        for (let i = 0; i < blockRanges.length; i += 1) {
          const block = blockRanges[i]
          if (block.start > top + 16 && block.start < safeTarget && block.end > safeTarget + 2) {
            if (block.start > blockStart) blockStart = block.start
          }
        }
        if (blockStart > 0) {
          breakAt = blockStart
        } else {
          let sectionStart = 0
          for (let i = 0; i < sectionTops.length; i += 1) {
            const st = sectionTops[i]
            if (st > top + 16 && st <= safeTarget && st > safeTarget - SECTION_GUARD) {
              if (st > sectionStart) sectionStart = st
            }
          }
          if (sectionStart > 0) {
            breakAt = sectionStart
          } else {
            let headingStart = 0
            for (let i = 0; i < headingTops.length; i += 1) {
              const ht = headingTops[i]
              if (ht > top + 16 && ht <= safeTarget && ht > safeTarget - HEADING_GUARD) {
                if (ht > headingStart) headingStart = ht
              }
            }
            if (headingStart > 0) breakAt = headingStart
          }
        }

        const snapped =
          getLineGap(Math.min(breakAt, safeTarget), top + 8, LINE_BACKTRACK) ??
          getLineGap(Math.min(breakAt, safeTarget), top + 8, 0)
        if (snapped != null) breakAt = snapped

        const nextTop = Math.max(top + 1, Math.min(Math.ceil(breakAt) + 2, h))
        offsets.push(nextTop)
        top = nextTop
      }

      setContentHeight(h)
      setPageOffsets(offsets)
      setPageCount(offsets.length)
    }

    const schedule = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    schedule()
    const ro = new ResizeObserver(schedule)
    ro.observe(el)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [data, template, accentColor])

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-none flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-[#e7e5e4] bg-white">
        <span className="text-[13px] font-medium text-[#78716c]">Preview</span>
        {showDownloadButtons && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePrint} className="min-h-[36px] px-4 py-1.5 rounded-full bg-[#BFED8D] text-[#1c1917] text-[13px] font-semibold border border-[#a8e070] hover:bg-[#b0e87d] transition-colors">
              PDF
            </button>
            <button type="button" onClick={handleDownloadWord} disabled={downloadingDocx} className="min-h-[36px] px-4 py-1.5 rounded-full border border-[#e7e5e4] text-[#f97316] text-[13px] font-semibold hover:bg-[#fff7ed] disabled:opacity-50 transition-colors">
              {downloadingDocx ? '...' : 'Word'}
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-auto bg-[#f0f0f0] px-3 pt-8 pb-10 flex flex-col items-center relative">
        {hasPara && (
          <style>{`
            .exp-para .exp-desc, .edu-para .edu-desc { list-style: none !important; padding-left: 0 !important; margin-left: 0 !important; }
            .exp-para .exp-desc li, .edu-para .edu-desc li { display: inline !important; margin: 0 !important; padding: 0 !important; }
            .exp-para .exp-desc li + li::before, .edu-para .edu-desc li + li::before { content: ' '; }
            .exp-para .exp-desc.space-y-1 > :not(:first-child), .edu-para .edu-desc.space-y-1 > :not(:first-child) { margin-top: 0 !important; }
          `}</style>
        )}
        {/* Off-screen measure at real print width so page-break math matches PDF */}
        <div
          ref={measureRef}
          className={`resume-measure absolute left-[-9999px] top-0 pointer-events-none ${paraClasses}`}
          style={{ visibility: 'hidden', width: A4_RENDER_WIDTH }}
          aria-hidden
        >
          <div className="w-full">
            <TemplateComponent data={data} accentColor={effectiveAccent} />
          </div>
        </div>
        {/* Multi-page preview with proper page breaks */}
        <div className="resume-preview-pages flex flex-col pt-3 pb-4" style={{ width: A4_PREVIEW_WIDTH, maxWidth: '100%' }}>
          {Array.from({ length: pageCount }, (_, i) => {
            const offset = pageOffsets[i] ?? i * A4_RENDER_HEIGHT
            const nextOffset = pageOffsets[i + 1]
            const end = Math.min(contentHeight, nextOffset ?? (offset + A4_RENDER_HEIGHT))
            const sliceHeight = Math.max(1, Math.min(A4_RENDER_HEIGHT, end - offset))
            return (
            <div key={i}>
              {i > 0 && (
                <div className="w-full flex-shrink-0 bg-transparent" style={{ minHeight: 48 }} aria-hidden />
              )}
              <div
                className="resume-print-root shadow-xl bg-white flex-shrink-0 overflow-hidden rounded-lg relative"
                style={{
                  width: A4_PREVIEW_WIDTH,
                  height: A4_PREVIEW_HEIGHT,
                  minWidth: A4_PREVIEW_WIDTH,
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {sidebarOverlay && (
                  <div
                    aria-hidden
                    className="absolute inset-y-0"
                    style={{
                      backgroundColor: sidebarOverlay.color,
                      width: `${sidebarOverlay.widthPct}%`,
                      minWidth: sidebarOverlay.minPx ? `${sidebarOverlay.minPx}px` : undefined,
                      left: sidebarOverlay.side === 'left' ? 0 : undefined,
                      right: sidebarOverlay.side === 'right' ? 0 : undefined,
                    }}
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: 'top left',
                    width: A4_RENDER_WIDTH,
                  }}
                >
                  {i > 0 && <div style={{ height: 32 }} />}
                  <div style={{ height: i > 0 ? sliceHeight - 32 : sliceHeight, overflow: 'hidden' }}>
                    <div
                      className={`resume-template-fill ${paraClasses}`}
                      style={{
                        width: '100%',
                        minHeight: pageCount > 1 ? pageCount * A4_RENDER_HEIGHT : undefined,
                        transform: offset === 0 ? 'none' : `translate3d(0, ${-offset}px, 0)`,
                        willChange: offset === 0 ? undefined : 'transform',
                      }}
                    >
                      <TemplateComponent data={data} accentColor={effectiveAccent} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
          })}
        </div>
        {/* Print container: one div per page for multi-page PDF */}
        <div ref={printRef} className="hidden print:block" aria-hidden>
          {Array.from({ length: pageCount }, (_, i) => {
            const offset = pageOffsets[i] ?? i * A4_RENDER_HEIGHT
            const nextOffset = pageOffsets[i + 1]
            const end = Math.min(contentHeight, nextOffset ?? (offset + A4_RENDER_HEIGHT))
            const sliceHeight = Math.max(1, Math.min(A4_RENDER_HEIGHT, end - offset))
            const topPad = i > 0 ? 32 : 0
            return (
              <div key={i} className={`resume-print-page ${paraClasses}`} style={{ width: '210mm', height: '297mm', overflow: 'hidden', position: 'relative' }}>
                {sidebarOverlay && (
                  <div
                    aria-hidden
                    className="absolute inset-y-0"
                    style={{
                      backgroundColor: sidebarOverlay.color,
                      width: `${sidebarOverlay.widthPct}%`,
                      left: sidebarOverlay.side === 'left' ? 0 : undefined,
                      right: sidebarOverlay.side === 'right' ? 0 : undefined,
                    }}
                  />
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {topPad > 0 && <div style={{ height: topPad }} />}
                  <div style={{ height: i > 0 ? sliceHeight - topPad : sliceHeight, overflow: 'hidden' }}>
                    <div
                      className={`resume-template-fill ${paraClasses}`}
                      style={{
                        width: '100%',
                        minHeight: pageCount > 1 ? pageCount * A4_RENDER_HEIGHT : undefined,
                        transform: offset === 0 ? 'none' : `translate3d(0, ${-offset}px, 0)`,
                      }}
                    >
                      <TemplateComponent data={data} accentColor={effectiveAccent} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center py-3">
          <span className="text-[0.8125rem] text-cvmora-ink/60 font-medium tabular-nums">
            &lt; 1 / {pageCount} &gt;
          </span>
        </div>
      </div>
    </div>
  )
})
