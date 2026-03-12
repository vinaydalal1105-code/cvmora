import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ResumeTemplate } from '../data/templates'
import { filledExamples } from '../data/filledExamples'
import { ClassicTemplate } from '../templates/ClassicTemplate'
import { TraditionalTemplate } from '../templates/TraditionalTemplate'
import { ModernTemplate } from '../templates/ModernTemplate'
import { MinimalTemplate } from '../templates/MinimalTemplate'
import { CorporateTemplate } from '../templates/CorporateTemplate'
import { CleanTemplate } from '../templates/CleanTemplate'
import { BoldTemplate } from '../templates/BoldTemplate'
import { VividTemplate } from '../templates/VividTemplate'
import { HeaderBandTemplate } from '../templates/HeaderBandTemplate'
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
import type { ResumeData } from '../types/resume'

export type TemplateCardClickHandler = (template: ResumeTemplate, accentColor?: string, builderQuery?: string) => void

/** Map template list id → template components for filled preview (distinct looks) */
const TEMPLATE_COMPONENT_MAP: Record<string, React.ComponentType<{ data: ResumeData }>> = {
  classic: ClassicTemplate,
  traditional: TraditionalTemplate,
  professional: CorporateTemplate,
  modern: ModernTemplate,
  'simple-ats': CleanTemplate,
  balanced: BoldTemplate,
  'header-ats': HeaderBandTemplate,
  minimal: MinimalTemplate,
  vivid: VividTemplate,
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

/** Use one balanced example for all template previews so fill is consistent (not over/under filled). */
const PREVIEW_EXAMPLE_KEY: keyof typeof filledExamples = 'preview'

/** Which filled example to show in each template's preview (all use same balanced content for even fill). */
const TEMPLATE_EXAMPLE_MAP: Record<string, keyof typeof filledExamples> = {
  classic: PREVIEW_EXAMPLE_KEY,
  traditional: PREVIEW_EXAMPLE_KEY,
  professional: PREVIEW_EXAMPLE_KEY,
  modern: PREVIEW_EXAMPLE_KEY,
  'simple-ats': PREVIEW_EXAMPLE_KEY,
  balanced: PREVIEW_EXAMPLE_KEY,
  'header-ats': PREVIEW_EXAMPLE_KEY,
  minimal: PREVIEW_EXAMPLE_KEY,
  vivid: PREVIEW_EXAMPLE_KEY,
  'sidebar-right': PREVIEW_EXAMPLE_KEY,
  'centered-clean': PREVIEW_EXAMPLE_KEY,
  'accent-bar': PREVIEW_EXAMPLE_KEY,
  'vertical-line': PREVIEW_EXAMPLE_KEY,
  'initials-header': PREVIEW_EXAMPLE_KEY,
  divided: PREVIEW_EXAMPLE_KEY,
  story: PREVIEW_EXAMPLE_KEY,
  deco: PREVIEW_EXAMPLE_KEY,
  proficiency: PREVIEW_EXAMPLE_KEY,
  'header-profile': PREVIEW_EXAMPLE_KEY,
  elegant: PREVIEW_EXAMPLE_KEY,
  pillar: PREVIEW_EXAMPLE_KEY,
  spotlight: PREVIEW_EXAMPLE_KEY,
  card: PREVIEW_EXAMPLE_KEY,
  serif: PREVIEW_EXAMPLE_KEY,
  'bold-block': PREVIEW_EXAMPLE_KEY,
  timeline: PREVIEW_EXAMPLE_KEY,
  luxe: PREVIEW_EXAMPLE_KEY,
  gradient: PREVIEW_EXAMPLE_KEY,
  neon: PREVIEW_EXAMPLE_KEY,
  geometric: PREVIEW_EXAMPLE_KEY,
  aura: PREVIEW_EXAMPLE_KEY,
}


/** Accent colors: soft palette from design – pink, muted blue, tan, grey, teal, coral, dark navy */
const ACCENT_COLORS = ['#eccbc3', '#aabcdf', '#baa989', '#696969', '#b0e0dd', '#e38779', '#1e3a5f'] as const

/** Default color index per template (indices into ACCENT_COLORS). */
const DEFAULT_COLOR_INDEX_BY_TEMPLATE: Record<string, number> = {
  professional: 1,   // muted blue
  vivid: 5,         // coral
  balanced: 0,      // light pink
  'header-ats': 4,  // teal
  modern: 2,        // tan
  'sidebar-right': 1,   // blue
  'centered-clean': 2,  // tan
  'accent-bar': 4,      // teal
  'vertical-line': 0,   // pink
  'initials-header': 1, // blue
  divided: 3,           // grey
  story: 1,             // blue
  deco: 1,              // blue
  proficiency: 1,       // blue
  'header-profile': 4,  // teal
  elegant: 1,           // blue
  pillar: 4,            // teal
  spotlight: 0,         // pink
  card: 1,              // blue
  serif: 1,             // blue
  'bold-block': 3,      // grey/dark
  timeline: 4,          // teal
  luxe: 2,              // tan/amber
}

/** Full resume render size (logical pixels) */
const PREVIEW_WIDTH = 794
const PREVIEW_HEIGHT = 1123

/** A4 aspect ratio = 210/297. Preview area has fixed height; paper fits inside with padding. */
const PREVIEW_AREA_HEIGHT = 520
const PREVIEW_AREA_PADDING = 12
const PREVIEW_PAPER_HEIGHT = PREVIEW_AREA_HEIGHT - PREVIEW_AREA_PADDING * 2
const HERO_SCALE = PREVIEW_AREA_HEIGHT / PREVIEW_PAPER_HEIGHT
const PREVIEW_PAPER_WIDTH = Math.round((PREVIEW_PAPER_HEIGHT * 210) / 297)
const FIRST_PAGE_GUARD = {
  section: 120,
  heading: 56,
}

/** Renders the resume content scaled to fit inside the fixed-size white "paper" (A4 ratio). */
function FilledTemplatePreview({
  template,
  accentColor,
  plainPaper,
  previewData,
}: {
  template: ResumeTemplate
  accentColor?: string
  /** When true, no shadow or border (e.g. for hero preview). */
  plainPaper?: boolean
  /** Optional resume data override for live previews. */
  previewData?: ResumeData
}) {
  const Component = TEMPLATE_COMPONENT_MAP[template.id] ?? ClassicTemplate
  const exampleKey = TEMPLATE_EXAMPLE_MAP[template.id] ?? 'accountant'
  const data = previewData ?? filledExamples[exampleKey]
  const measureRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(PREVIEW_HEIGHT)
  const [pageOffsets, setPageOffsets] = useState<number[]>([0])
  const offset = pageOffsets[0] ?? 0
  const nextOffset = pageOffsets[1]

  const paperShadow = plainPaper
    ? 'none'
    : '0 2px 4px rgba(0,0,0,0.05), 0 6px 12px rgba(0,0,0,0.07), 0 12px 24px rgba(0,0,0,0.06)'
  if (!data) {
    return (
      <div
        className="rounded-sm flex justify-center"
        style={{
          width: PREVIEW_PAPER_WIDTH,
          height: PREVIEW_PAPER_HEIGHT,
          transform: 'rotateX(2deg) rotateY(-1deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="rounded-sm w-full h-full flex items-center justify-center overflow-visible bg-white"
          style={{ boxShadow: paperShadow }}
        >
          <div className="overflow-hidden rounded-sm w-full h-full flex items-center justify-center">
            <TemplatePreview template={template} />
          </div>
        </div>
      </div>
    )
  }

  const scale = Math.min(PREVIEW_PAPER_WIDTH / PREVIEW_WIDTH, PREVIEW_PAPER_HEIGHT / PREVIEW_HEIGHT)
  const end = Math.min(contentHeight, nextOffset ?? (offset + PREVIEW_HEIGHT))
  const bleedGuard = nextOffset != null ? Math.ceil(2 / scale) : 0
  const sliceHeight = Math.max(1, Math.min(PREVIEW_HEIGHT, end - offset - bleedGuard))

  const previewContent =
    template.id === 'professional' ? (
      <CorporateTemplate data={data} variant="accent" accentColor={accentColor} />
    ) : template.id === 'vivid' ? (
      <VividTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'balanced' ? (
      <BoldTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'header-ats' ? (
      <HeaderBandTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'modern' ? (
      <ModernTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'sidebar-right' ? (
      <SidebarRightTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'centered-clean' ? (
      <CenteredCleanTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'accent-bar' ? (
      <AccentBarTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'vertical-line' ? (
      <VerticalLineTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'initials-header' ? (
      <InitialsHeaderTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'divided' ? (
      <DividedTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'story' ? (
      <StoryTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'deco' ? (
      <DecoTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'proficiency' ? (
      <ProficiencyTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'header-profile' ? (
      <HeaderProfileTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'elegant' ? (
      <ElegantTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'pillar' ? (
      <PillarTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'spotlight' ? (
      <SpotlightTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'card' ? (
      <CardTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'serif' ? (
      <SerifTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'bold-block' ? (
      <BoldBlockTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'timeline' ? (
      <TimelineTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'luxe' ? (
      <LuxeTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'gradient' ? (
      <GradientTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'neon' ? (
      <NeonTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'geometric' ? (
      <GeometricTemplate data={data} accentColor={accentColor} />
    ) : template.id === 'aura' ? (
      <AuraTemplate data={data} accentColor={accentColor} />
    ) : (
      <Component data={data} />
    )

  useEffect(() => {
    if (!previewData) {
      setContentHeight(PREVIEW_HEIGHT)
      setPageOffsets([0])
      return
    }
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
      const getLineGap = (maxY: number, minY: number): number | null => {
        const idx = findLastLineIndex(maxY, minY)
        if (idx < 0) return null
        const lineBottom = lineRects[idx].bottom
        const nextLineTop = idx + 1 < lineRects.length ? lineRects[idx + 1].top : lineBottom + 8
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
      const entryNodes = new Set<HTMLElement>()
      el.querySelectorAll('.exp-desc, .edu-desc').forEach((list) => {
        const entry = (list as HTMLElement).parentElement
        if (entry) entryNodes.add(entry)
      })
      entryNodes.forEach((node) => {
        const start = Math.floor(node.offsetTop)
        const end = Math.ceil(node.offsetTop + node.offsetHeight)
        if (end > start) blockRanges.push({ start, end })
      })
      blockRanges.sort((a, b) => a.start - b.start)

      const offsets: number[] = [0]
      const maxPages = 10
      const SECTION_GUARD = FIRST_PAGE_GUARD.section
      const HEADING_GUARD = FIRST_PAGE_GUARD.heading
      const PAGE_TOP_PAD = 32
      let top = 0

      while (offsets.length < maxPages && top + PREVIEW_HEIGHT < h - 1) {
        const pageH = offsets.length === 0 ? PREVIEW_HEIGHT : PREVIEW_HEIGHT - PAGE_TOP_PAD
        const target = top + pageH
        let breakAt = getLineGap(target - 1, top + 8) ?? target

        let blockStart = 0
        for (let i = 0; i < blockRanges.length; i += 1) {
          const block = blockRanges[i]
          if (block.start > top + 16 && block.start < target && block.end > target + 2) {
            if (block.start > blockStart) blockStart = block.start
          }
        }
        if (blockStart > 0) {
          breakAt = blockStart
        } else {
          let sectionStart = 0
          for (let i = 0; i < sectionTops.length; i += 1) {
            const st = sectionTops[i]
            if (st > top + 16 && st <= target && st > target - SECTION_GUARD) {
              if (st > sectionStart) sectionStart = st
            }
          }
          if (sectionStart > 0) {
            breakAt = sectionStart
          } else {
            let headingStart = 0
            for (let i = 0; i < headingTops.length; i += 1) {
              const ht = headingTops[i]
              if (ht > top + 16 && ht <= target && ht > target - HEADING_GUARD) {
                if (ht > headingStart) headingStart = ht
              }
            }
            if (headingStart > 0) breakAt = headingStart
          }
        }

        const snapped = getLineGap(Math.min(breakAt, target), top + 8)
        if (snapped != null) breakAt = snapped

        const nextTop = Math.max(top + 1, Math.min(Math.ceil(breakAt) + 2, h))
        offsets.push(nextTop)
        top = nextTop
      }

      setContentHeight(h)
      setPageOffsets(offsets)
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
  }, [previewData, template.id, accentColor])

  // Paper background: for templates with a vertical color bar, draw bar on paper so it extends full card height (top to bottom)
  const defaultSidebarColor =
    template.id === 'professional'
      ? '#002244'
      : template.id === 'vivid'
        ? '#f59e0b'
        : template.id === 'sidebar-right'
          ? '#1e3a5f'
          : template.id === 'pillar'
            ? '#0f766e'
            : template.id === 'vertical-line'
              ? '#059669'
              : template.id === 'proficiency'
                ? '#1e40af'
                : null
  const sidebarColor = accentColor ?? defaultSidebarColor
  let paperBg: string | undefined
  if (template.id === 'traditional') {
    paperBg = '#ffffff' // Explicitly set to white for traditional
  } else if (template.id === 'sidebar-right') {
    paperBg = '#ffffff'
  } else if (template.id === 'pillar') {
    paperBg = `linear-gradient(to right, ${sidebarColor} 0%, ${sidebarColor} 5%, #ffffff 5%, #ffffff 100%)`
  } else if (template.id === 'vertical-line') {
    paperBg = `linear-gradient(to right, ${sidebarColor} 0%, ${sidebarColor} 2%, #ffffff 2%, #ffffff 100%)`
  } else if (template.id === 'proficiency') {
    paperBg = '#ffffff'
  } else if (defaultSidebarColor != null) {
    const sidebarPct = 28
    paperBg = `linear-gradient(to right, ${sidebarColor} 0%, ${sidebarColor} ${sidebarPct}%, #ffffff ${sidebarPct}%, #ffffff 100%)`
  }
  const sidebarSide: 'left' | 'right' | null =
    template.id === 'sidebar-right'
      ? 'right'
      : (
          template.id === 'professional' ||
          template.id === 'vivid' ||
          template.id === 'pillar' ||
          template.id === 'vertical-line' ||
          template.id === 'proficiency'
        )
        ? 'left'
        : null
  const isSidebarTemplate = sidebarSide !== null
  
  // Debug: Force traditional to not be a sidebar template
  const finalIsSidebarTemplate = template.id === 'traditional' ? false : isSidebarTemplate

  const sidebarWidthPct =
    template.id === 'pillar'
      ? 5
      : template.id === 'vertical-line'
        ? 2
        : template.id === 'proficiency'
          ? 26
          : template.id === 'sidebar-right'
            ? 28
            : 28
  const edgeOverlayOnTop = template.id === 'vertical-line' || template.id === 'pillar'
  const useOuterSidebarOverlay = finalIsSidebarTemplate && template.id !== 'proficiency'
  const paperBackground = useOuterSidebarOverlay
    ? (
        sidebarSide === 'right'
          ? `linear-gradient(to right, #ffffff 0%, #ffffff ${100 - sidebarWidthPct}%, transparent ${100 - sidebarWidthPct}%, transparent 100%)`
          : `linear-gradient(to right, transparent 0%, transparent ${sidebarWidthPct}%, #ffffff ${sidebarWidthPct}%, #ffffff 100%)`
      )
    : (paperBg ?? '#ffffff')

  return (
    <div
      className="rounded-sm flex justify-center relative"
      style={{
        width: PREVIEW_PAPER_WIDTH,
        height: PREVIEW_PAPER_HEIGHT,
        transform: 'rotateX(2deg) rotateY(-1deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Full-height sidebar bar on the card (outer wrapper) so it always runs top-to-bottom */}
      {useOuterSidebarOverlay && sidebarColor && (
        <div
          aria-hidden
          className={`absolute top-0 bottom-0 pointer-events-none ${sidebarSide === 'right' ? 'right-0 rounded-r-sm' : 'left-0 rounded-l-sm'}`}
          style={{
            width: `${sidebarWidthPct}%`,
            background:
              template.id === 'proficiency'
                ? (sidebarColor || '') + '1f'
                : sidebarColor,
            zIndex: edgeOverlayOnTop ? 2 : 0,
          }}
        />
      )}
      {previewData && (
        <div
          ref={measureRef}
          className="resume-measure absolute left-[-9999px] top-0 pointer-events-none"
          style={{ visibility: 'hidden', width: PREVIEW_WIDTH }}
          aria-hidden
        >
          <div className="w-full">
            {previewContent}
          </div>
        </div>
      )}
      {/* Paper + content on top; for sidebar templates left strip is transparent so full-height bar (z-0) shows through */}
      <div
        className={`rounded-sm w-full h-full flex justify-center overflow-visible relative ${finalIsSidebarTemplate ? 'template-card-paper' : ''}`}
        style={{
          position: 'relative',
          background: paperBackground,
          boxShadow: paperShadow,
          isolation: 'isolate',
          zIndex: 1,
          ...(plainPaper ? { border: 'none' } : {}),
        }}
      >
        <div className="overflow-hidden rounded-sm w-full h-full relative flex justify-center">
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: 'top center',
              width: PREVIEW_WIDTH,
              height: PREVIEW_HEIGHT,
              minHeight: PREVIEW_HEIGHT,
            }}
            className={`resume-print-inner w-full relative ${finalIsSidebarTemplate ? 'bg-transparent flex flex-col' : 'bg-white'}`}
          >
            <div
              className="resume-template-fill relative z-10"
              style={{
                height: '100%',
                minHeight: '100%',
                flex: '1 1 0',
                transform: offset === 0 ? 'none' : `translate3d(0, ${-offset}px, 0)`,
                willChange: offset === 0 ? undefined : 'transform',
              }}
            >
              <div 
                style={{ 
                  height: previewData ? PREVIEW_HEIGHT : '100%', 
                  maxHeight: PREVIEW_HEIGHT,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {previewContent}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-0 right-0 bottom-0"
                  style={{
                    height: Math.ceil(40 / scale),
                    background: 'linear-gradient(to bottom, transparent, white)',
                    zIndex: 20,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Shared: preview doc - centered, subtle border */
const previewDocClass = 'w-full max-w-[280px] h-full min-h-0 rounded-md bg-white shadow-sm border border-[#d2d2d7]/70 overflow-hidden text-left flex flex-col'

/* Classic: grey from very top (root bg grey), no white strip */
function PreviewClassic() {
  return (
    <div className="w-full max-w-[280px] h-full min-h-0 rounded-md bg-[#f5f5f7] shadow-sm border border-[#d2d2d7]/70 overflow-hidden text-left flex flex-col">
      <div className="px-3 pt-3 pb-2 border-b border-[#e5e7eb] text-center">
        <p className="font-semibold text-[#1d1d1f] text-[11px] tracking-tight">Christopher Carter</p>
        <p className="text-[#6e6e73] text-[9px] mt-0.5">Accountant</p>
        <p className="text-[#6e6e73] text-[6px] mt-1">Address · Phone · Email</p>
      </div>
      {['PROFILE', 'EDUCATION', 'EXPERIENCE', 'SKILLS'].map((sec) => (
        <div key={sec} className="px-3 pt-2 pb-1.5 border-t border-[#f0f0f0] bg-white">
          <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[7px] mb-1">{sec}</p>
          <div className="h-px bg-[#e5e7eb] w-full mb-1" />
          <div className="h-0.5 bg-[#d2d2d7]/60 rounded w-full mb-0.5" />
          <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-[90%]" />
        </div>
      ))}
    </div>
  )
}

/* Prime ATS / Two-column: sidebar + main content */
function PreviewPrimeAts() {
  return (
    <div className={`${previewDocClass} max-w-[280px] flex flex-row`}>
      <div className="w-1/3 bg-[#f5f5f7] px-2 pt-2.5 pb-3 shrink-0 border-r border-[#e5e7eb]">
        <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[5px] mb-1.5">DETAILS</p>
        <div className="h-0.5 bg-[#d2d2d7]/60 rounded w-full mb-1" />
        <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full mb-2" />
        <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[5px] mb-1">SKILLS</p>
        <div className="space-y-0.5">
          <div className="h-1 w-full bg-[#d2d2d7]/50 rounded-sm" />
          <div className="h-1 w-4/5 bg-[#d2d2d7]/40 rounded-sm" />
          <div className="h-1 w-full bg-[#d2d2d7]/40 rounded-sm" />
        </div>
      </div>
      <div className="flex-1 px-2 pt-2.5 pb-3 min-w-0 relative">
        <div className="absolute top-2.5 right-1.5 w-6 h-6 rounded-full bg-[#d2d2d7] border-2 border-white shadow-sm" title="Photo" />
        <p className="font-bold text-[#1d1d1f] uppercase tracking-tight text-[9px] leading-tight">Herman Walton</p>
        <p className="text-[#6e6e73] text-[7px] mb-1">Financial Analyst</p>
        <p className="text-[#6e6e73] text-[5px]">Address · Phone · Email</p>
        {['SUMMARY', 'EXPERIENCE', 'EDUCATION'].map((sec) => (
          <div key={sec} className="mt-2">
            <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[6px] mb-0.5 border-b border-[#e5e7eb] pb-0.5">{sec}</p>
            <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full mt-0.5" />
            {sec === 'EXPERIENCE' && (
              <p className="text-[6px] text-[#1d1d1f]/80 mt-0.5">Financial Analyst, GEO Corp. <span className="float-right text-[#6e6e73]">Jan 2012 – Present</span></p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Professional: name, accent bar, job-winning layout */
function _PreviewProfessional() {
  return (
    <div className={`${previewDocClass} max-w-[280px]`}>
      <div className="px-3 pt-2.5 pb-2 border-b border-[#e5e7eb]">
        <p className="font-semibold text-[#1d1d1f] text-[11px] tracking-tight">Sarah Chen</p>
        <p className="text-[#6e6e73] text-[9px] mt-0.5">Marketing Manager</p>
        <div className="h-0.5 w-10 bg-[#f97316] rounded-full mt-2" />
        <p className="text-[#6e6e73] text-[6px] mt-1.5">Email · Phone · LinkedIn</p>
      </div>
      {['PROFILE', 'EXPERIENCE', 'EDUCATION', 'SKILLS'].map((sec) => (
        <div key={sec} className="px-3 pt-2 pb-1.5 border-t border-[#f0f0f0]">
          <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[7px] mb-1">{sec}</p>
          <div className="h-px bg-[#e5e7eb] w-full mb-1" />
          <div className="h-0.5 bg-[#d2d2d7]/60 rounded w-full mb-0.5" />
          <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-[90%]" />
        </div>
      ))}
    </div>
  )
}

function PreviewSingle() {
  return <PreviewClassic />
}

/* Two-column with sidebar (Corporate, Clear, etc.) */
function PreviewTwoColumn() {
  return <PreviewPrimeAts />
}

/* Header ATS: greenish-gray header band */
function PreviewHeaderAts() {
  return (
    <div className={`${previewDocClass} max-w-[280px]`}>
      <div className="h-9 bg-[#8a9a8a] flex items-center justify-center px-2">
        <p className="font-bold text-white text-[9px]">Kane Jones</p>
        <p className="text-white/90 text-[6px] ml-2">Bookkeeper</p>
      </div>
      <div className="px-2 pt-3 pb-2">
        {['CAREER EXPERIENCE', 'EDUCATION'].map((sec) => (
          <div key={sec} className="mb-2">
            <p className="font-semibold text-[#5a6a5a] uppercase tracking-wider text-[6px] mb-0.5">{sec}</p>
            <div className="h-0.5 bg-[#d2d2d7]/50 rounded w-full mb-0.5" />
            <div className="h-0.5 bg-[#d2d2d7]/30 rounded w-4/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* Professional with green sidebar (resume.io style) */
function PreviewProfessionalGreen() {
  return (
    <div className={`${previewDocClass} max-w-[280px] flex flex-row`}>
      <div className="w-[28%] bg-[#2d5a3a] px-2 pt-2.5 pb-3 shrink-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-white/20 mb-2" />
        <p className="font-semibold text-white text-[7px] text-center leading-tight">Sophie Walton</p>
        <p className="text-[#1d1d1f] uppercase text-[5px] mt-1.5 text-white/90">Details</p>
        <div className="h-0.5 bg-white/30 rounded w-full my-0.5" />
        <p className="text-[#1d1d1f] uppercase text-[5px] text-white/90">Skills</p>
        <div className="space-y-0.5 mt-0.5 w-full">
          {[1, 0.8, 0.6].map((w, i) => (
            <div key={i} className="h-0.5 bg-white/25 rounded" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
      <div className="flex-1 px-2 pt-2 pb-2 min-w-0">
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] mb-1">Profile</p>
        <div className="h-0.5 bg-[#e5e7eb] rounded w-full mb-1" />
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] mb-1">Employment History</p>
        <div className="h-0.5 bg-[#d2d2d7]/50 rounded w-full mb-0.5" />
        <div className="h-0.5 bg-[#d2d2d7]/30 rounded w-[90%]" />
      </div>
    </div>
  )
}

/* Clear: light green banner + two column */
function _PreviewClear() {
  return (
    <div className={`${previewDocClass} max-w-[280px]`}>
      <div className="h-10 bg-[#a8d5b8] flex items-center px-2 gap-2">
        <div className="w-7 h-7 rounded-full bg-white/80 shrink-0" />
        <div>
          <p className="font-bold text-[#1d1d1f] text-[9px]">Patricia Giordano</p>
          <p className="text-[#1d1d1f]/80 text-[6px]">Receptionist</p>
        </div>
      </div>
      <div className="flex flex-row flex-1 min-h-0">
        <div className="w-1/3 border-r border-[#e5e7eb] px-1.5 pt-2.5 pb-2">
          <p className="font-semibold text-[#1d1d1f] text-[5px] uppercase mb-1">Skills</p>
          {[0.9, 0.7, 0.8].map((w, i) => (
            <div key={i} className="flex items-center gap-1 mb-0.5">
              <div className="h-0.5 flex-1 bg-[#e5e7eb] rounded overflow-hidden">
                <div className="h-full bg-[#2d5a3a]/60 rounded" style={{ width: `${w * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 px-1.5 pt-2.5 pb-2 min-w-0">
          <p className="font-semibold text-[#1d1d1f] text-[5px] uppercase mb-0.5">Profile</p>
          <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full mb-1" />
          <p className="font-semibold text-[#1d1d1f] text-[5px] uppercase mb-0.5">Employment History</p>
          <div className="h-0.5 bg-[#d2d2d7]/30 rounded w-full" />
        </div>
      </div>
    </div>
  )
}

/* Balanced: dark blue right sidebar */
function PreviewBalanced() {
  return (
    <div className={`${previewDocClass} max-w-[280px] flex flex-row`}>
      <div className="flex-1 px-2 pt-2.5 pb-3 min-w-0">
        <p className="font-semibold text-[#1d1d1f] text-[9px]">Gregory Walls</p>
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] mb-1 border-b border-[#e5e7eb] pb-0.5">Profile</p>
        <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full mb-1" />
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] mb-0.5 border-b border-[#e5e7eb] pb-0.5">Employment History</p>
        <div className="h-0.5 bg-[#d2d2d7]/30 rounded w-[95%]" />
      </div>
      <div className="w-1/4 bg-[#1e3a5f] px-1.5 pt-2.5 pb-2 shrink-0">
        <div className="w-6 h-6 rounded-full bg-white/20 mb-1" />
        <p className="text-white uppercase text-[5px] font-semibold">Details</p>
        <div className="h-0.5 bg-white/20 rounded w-full my-0.5" />
        <p className="text-white uppercase text-[5px] font-semibold">Skills</p>
        <div className="space-y-0.5 mt-0.5">
          <div className="h-0.5 bg-white/15 rounded w-full" />
          <div className="h-0.5 bg-white/15 rounded w-4/5" />
        </div>
      </div>
    </div>
  )
}

/* Essential: light gray sidebar + skill bars */
function _PreviewEssential() {
  return (
    <div className={`${previewDocClass} max-w-[280px] flex flex-row`}>
      <div className="flex-1 px-2 pt-2.5 pb-3 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-6 h-6 rounded-sm bg-[#d2d2d7]/50" />
          <div>
            <p className="font-bold text-[#1d1d1f] text-[8px]">Matthew Jones</p>
            <p className="text-[#6e6e73] text-[6px]">Financial Analyst</p>
          </div>
        </div>
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] border-b border-[#e5e7eb] pb-0.5">Profile</p>
        <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full mt-0.5 mb-1" />
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] border-b border-[#e5e7eb] pb-0.5">Employment History</p>
        <div className="h-0.5 bg-[#d2d2d7]/30 rounded w-[90%] mt-0.5" />
      </div>
      <div className="w-1/3 bg-[#f0f0f2] px-1.5 pt-2.5 pb-2 shrink-0 border-l border-[#e5e7eb]">
        <p className="text-[#1d1d1f] uppercase text-[5px] font-semibold mb-1">Details</p>
        <p className="text-[#1d1d1f] uppercase text-[5px] font-semibold mb-1">Skills</p>
        <div className="space-y-0.5">
          {[0.8, 1, 0.6].map((w, i) => (
            <div key={i} className="h-1 bg-[#f97316]/20 rounded overflow-hidden">
              <div className="h-full bg-[#f97316]/50 rounded" style={{ width: `${w * 100}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Simple ATS: blue headings */
function PreviewSimpleAts() {
  return (
    <div className={`${previewDocClass} max-w-[280px]`}>
      <div className="px-3 pt-2.5 pb-2 border-b border-[#e5e7eb]">
        <p className="font-bold text-[#f97316] text-[10px]">Taylor Greene</p>
        <p className="text-[#6e6e73] text-[7px] mt-0.5">Chief Technology Officer</p>
        <p className="text-[#6e6e73] text-[5px] mt-1">email · phone · location</p>
      </div>
      {['Professional Experience', 'Education', 'Areas of Expertise'].map((sec) => (
        <div key={sec} className="px-3 pt-2 pb-1.5 border-t border-[#f0f0f0]">
          <p className="font-semibold text-[#f97316] text-[6px] mb-0.5">{sec}</p>
          <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full" />
        </div>
      ))}
    </div>
  )
}

/* Minimalist: numbered sections */
function PreviewMinimalist() {
  return (
    <div className={`${previewDocClass} max-w-[280px]`}>
      <div className="px-3 pt-2.5 pb-2 border-b border-[#e5e7eb]">
        <p className="font-bold text-[#1d1d1f] text-[8px] leading-tight">Hello! My name is Kathryn Brown, I am a teacher and this is my resume</p>
        <p className="text-[#6e6e73] text-[5px] mt-1">address · phone · email</p>
      </div>
      {['01 PROFILE', '03 EXPERIENCE', '02 EDUCATION'].map((sec) => (
        <div key={sec} className="px-3 pt-2 pb-1.5 border-t border-[#f0f0f0]">
          <p className="font-bold text-[#1d1d1f] uppercase text-[6px] mb-0.5">{sec}</p>
          <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-[85%]" />
        </div>
      ))}
    </div>
  )
}

/* Vivid: yellow header */
function PreviewVivid() {
  return (
    <div className={`${previewDocClass} max-w-[280px]`}>
      <div className="h-10 bg-[#f5d128] flex items-center px-2 gap-2">
        <div className="w-7 h-7 rounded-full bg-white/90 border border-[#e5e7eb]" />
        <div>
          <p className="font-bold text-[#1d1d1f] text-[9px] uppercase">Sebastian Wilder</p>
          <p className="text-[#1d1d1f]/80 text-[6px]">Student</p>
        </div>
      </div>
      <div className="px-2 pt-3 pb-2">
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] mb-0.5">Profile</p>
        <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full mb-1" />
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] mb-0.5">Education</p>
        <div className="h-0.5 bg-[#d2d2d7]/30 rounded w-4/5" />
      </div>
    </div>
  )
}

/* Clean: two-column, left INFO/Skills with bars */
function _PreviewClean() {
  return (
    <div className={`${previewDocClass} max-w-[280px] flex flex-row`}>
      <div className="w-1/3 border-r border-[#e5e7eb] px-1.5 pt-2 pb-2 shrink-0">
        <p className="font-bold text-[#1d1d1f] text-[8px]">Arthur Sherman</p>
        <p className="text-[#6e6e73] text-[5px] mt-0.5">Assembler</p>
        <p className="text-[#1d1d1f] uppercase text-[5px] font-semibold mt-2">Info</p>
        <p className="text-[#1d1d1f] uppercase text-[5px] font-semibold mt-1">Skills</p>
        <div className="space-y-0.5 mt-0.5">
          {[0.8, 0.6, 0.9].map((w, i) => (
            <div key={i} className="h-0.5 bg-[#d2d2d7]/50 rounded overflow-hidden">
              <div className="h-full bg-[#1d1d1f] rounded" style={{ width: `${w * 100}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 px-2 pt-2 pb-2 min-w-0">
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] mb-0.5">Profile</p>
        <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full mb-1" />
        <p className="font-semibold text-[#1d1d1f] uppercase text-[6px] mb-0.5">Employment History</p>
        <div className="h-0.5 bg-[#d2d2d7]/30 rounded w-[90%]" />
      </div>
    </div>
  )
}

/* Corporate: two-column with photo on top */
function _PreviewCorporate() {
  return (
    <div className={`${previewDocClass} max-w-[280px]`}>
      <div className="px-3 pt-2.5 pb-2 border-b border-[#e5e7eb] text-center">
        <div className="w-8 h-8 rounded-full bg-[#d2d2d7]/50 mx-auto mb-1" />
        <p className="font-bold text-[#1d1d1f] text-[9px]">Charlotte Warren</p>
        <p className="text-[#6e6e73] text-[5px]">Recruitment Officer · San Francisco</p>
      </div>
      <div className="flex flex-row flex-1 min-h-0">
        <div className="w-1/3 border-r border-[#e5e7eb] px-1.5 pt-2.5 pb-2">
          <p className="font-semibold text-[#1d1d1f] uppercase text-[5px]">Details</p>
          <p className="font-semibold text-[#1d1d1f] uppercase text-[5px] mt-1">Skills</p>
          <p className="font-semibold text-[#1d1d1f] uppercase text-[5px] mt-1">Languages</p>
        </div>
        <div className="flex-1 px-1.5 pt-2.5 pb-2 min-w-0">
          <p className="font-semibold text-[#1d1d1f] uppercase text-[5px]">Profile</p>
          <p className="font-semibold text-[#1d1d1f] uppercase text-[5px] mt-1">Work Experience</p>
          <div className="h-0.5 bg-[#d2d2d7]/40 rounded w-full mt-0.5" />
          <p className="font-semibold text-[#1d1d1f] uppercase text-[5px] mt-1">Education</p>
        </div>
      </div>
    </div>
  )
}

function TemplatePreview({ template }: { template: ResumeTemplate }) {
  const { id, previewStyle } = template
  if (id === 'classic') return <PreviewClassic />
  if (id === 'professional') return <PreviewProfessionalGreen />
  if (id === 'modern') return <PreviewVivid />
  if (id === 'simple-ats') return <PreviewSimpleAts />
  if (id === 'balanced') return <PreviewBalanced />
  if (id === 'header-ats') return <PreviewHeaderAts />
  if (id === 'minimal') return <PreviewMinimalist />
  if (id === 'vivid') return <PreviewVivid />
  switch (previewStyle) {
    case 'twoColumn':
      return <PreviewTwoColumn />
    case 'header':
      return <PreviewHeaderAts />
    default:
      return <PreviewSingle />
  }
}

interface TemplateCardProps {
  template: ResumeTemplate
  variant: 'default' | 'ats' | 'hero'
  onSelectTemplate?: TemplateCardClickHandler
  previewData?: ResumeData
}

/** Templates that have a colored element (sidebar, header bar, accent) show color dots; dots change that color. */
const TEMPLATES_WITH_COLOR_OPTIONS = new Set([
  'professional', 'vivid', 'balanced', 'header-ats', 'modern',
  'sidebar-right', 'centered-clean', 'accent-bar',
  'vertical-line', 'initials-header', 'divided',
  'story', 'deco', 'proficiency', 'header-profile', 'elegant', 'pillar', 'spotlight', 'card', 'serif', 'bold-block', 'timeline', 'luxe',
  'gradient', 'neon', 'geometric', 'aura',
])

function getDefaultColorIndex(templateId: string): number {
  const i = DEFAULT_COLOR_INDEX_BY_TEMPLATE[templateId]
  return i !== undefined ? Math.min(i, ACCENT_COLORS.length - 1) : 0
}

export function TemplateCard({ template, variant, onSelectTemplate, previewData }: TemplateCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(() => getDefaultColorIndex(template.id))
  const [hoveredColorIndex, setHoveredColorIndex] = useState<number | null>(null)
  const hasColorDots = TEMPLATES_WITH_COLOR_OPTIONS.has(template.id)
  const previewColorIndex = hoveredColorIndex ?? selectedColorIndex
  const accentColor = hasColorDots ? ACCENT_COLORS[previewColorIndex] : undefined
  const selectedColorIndexRef = useRef(selectedColorIndex)
  const hoveredColorIndexRef = useRef<number | null>(null)
  const lastInteractedColorIndexRef = useRef<number>(selectedColorIndex)
  useEffect(() => {
    selectedColorIndexRef.current = selectedColorIndex
  }, [selectedColorIndex])
  useEffect(() => {
    hoveredColorIndexRef.current = hoveredColorIndex
  }, [hoveredColorIndex])

  if (variant === 'hero') {
    const heroRef = useRef<HTMLDivElement>(null)
    const [heroScale, setHeroScale] = useState(1)
    useEffect(() => {
      const el = heroRef.current
      if (!el) return
      const ro = new ResizeObserver(([entry]) => {
        setHeroScale(entry.contentRect.width / PREVIEW_PAPER_WIDTH)
      })
      ro.observe(el)
      return () => ro.disconnect()
    }, [])

    return (
      <div
        ref={heroRef}
        className="w-full overflow-hidden"
        style={{ aspectRatio: '210/297' }}
      >
        <div
          className="origin-top-left"
          style={{
            transform: `scale(${heroScale})`,
            transformOrigin: 'top left',
          }}
        >
          <FilledTemplatePreview template={template} accentColor={accentColor} plainPaper previewData={previewData} />
        </div>
      </div>
    )
  }

  const cardContent = (
    <div className="flex flex-col h-full">
      {/* Document preview - shorter aspect so preview isn’t too long */}
      <div
        className="shrink-0 w-full flex items-center justify-center overflow-hidden rounded-t-2xl bg-[#f8f9fa]"
        style={{
          height: PREVIEW_AREA_HEIGHT,
          padding: PREVIEW_AREA_PADDING,
          perspective: '1200px',
        }}
      >
        <div style={{ transformStyle: 'preserve-3d' }}>
          <FilledTemplatePreview template={template} accentColor={accentColor} previewData={previewData} />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 px-4 pb-4 flex-1 min-h-0 bg-white rounded-b-2xl border-t border-[#e5e7eb]/80">
        <h2 className="font-bold text-[#1d1d1f] text-[1rem] leading-tight">{template.name}</h2>
        <p className="text-[0.8125rem] text-[#6e6e73] leading-snug line-clamp-2">{template.desc}</p>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {hasColorDots && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {ACCENT_COLORS.map((c, i) => (
                <button
                key={c}
                  type="button"
                  aria-label={`Select color ${i + 1}`}
                  onMouseEnter={() => {
                    lastInteractedColorIndexRef.current = i
                    hoveredColorIndexRef.current = i
                    setHoveredColorIndex(i)
                    selectedColorIndexRef.current = i
                    setSelectedColorIndex(i)
                  }}
                  onMouseLeave={() => {
                    hoveredColorIndexRef.current = null
                    setHoveredColorIndex(null)
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    lastInteractedColorIndexRef.current = i
                    selectedColorIndexRef.current = i
                    setSelectedColorIndex(i)
                    const hex = ACCENT_COLORS[i]
                    if (hex && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
                      try {
                        sessionStorage.setItem('cvmora_builder_accent', hex)
                      } catch (_) {}
                    }
                  }}
                  className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${
                    i === selectedColorIndex ? 'border-[#1d1d1f] ring-2 ring-[#1d1d1f]/25' : 'border-[#e5e7eb]'
                  }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          )}
          {!hasColorDots && <span className="text-[0.7rem] text-[#9ca3af]">Monochrome</span>}
          {(template.pdf || template.docx) && (
            <span className="text-[0.7rem] text-[#9ca3af]">
              {template.pdf && 'PDF'}
              {template.pdf && template.docx && ' · '}
              {template.docx && 'DOCX'}
            </span>
          )}
          {template.goldStandard && (
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold uppercase tracking-wide">
              Gold Standard
            </span>
          )}
          {template.tag && !template.goldStandard && (
            <span className="px-2 py-0.5 rounded bg-[#fff7ed] text-[#f97316] text-[10px] font-semibold uppercase tracking-wide">
              {template.tag}
            </span>
          )}
          {variant === 'default' && template.users && (
            <span className="text-[0.75rem] text-[#9ca3af]">{template.users}</span>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-[#f97316] group-hover:gap-2.5 transition-all duration-200 mt-auto pt-2">
          Use this template
          <span aria-hidden>→</span>
        </span>
      </div>
    </div>
  )

  const className =
    'group block overflow-hidden rounded-2xl cursor-pointer h-full flex flex-col transition-all duration-200 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/50'
  const cardStyle = { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }

  const selectedAccent = hasColorDots ? ACCENT_COLORS[selectedColorIndex] : undefined
  const builderQuery = selectedAccent
    ? `?template=${encodeURIComponent(template.id)}&accent=${encodeURIComponent(selectedAccent)}`
    : `?template=${encodeURIComponent(template.id)}`

  if (onSelectTemplate) {
    return (
      <button
        type="button"
        className={`${className} text-left w-full`}
        style={cardStyle}
        onClick={() => {
          const idx = hasColorDots
            ? (hoveredColorIndexRef.current ?? lastInteractedColorIndexRef.current)
            : selectedColorIndexRef.current
          const accent = hasColorDots ? ACCENT_COLORS[idx] : undefined
          const query = accent
            ? `?template=${encodeURIComponent(template.id)}&accent=${encodeURIComponent(accent)}`
            : `?template=${encodeURIComponent(template.id)}`
          onSelectTemplate(template, accent, query)
        }}
      >
        {cardContent}
      </button>
    )
  }

  return (
    <Link to={`/builder${builderQuery}`} className={className} style={cardStyle}>
      {cardContent}
    </Link>
  )
}
