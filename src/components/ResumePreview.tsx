import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
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
}

/** A4 dimensions in px for fixed preview (same as cover letter): 595×842 */
const A4_PREVIEW_WIDTH = 595
const A4_PREVIEW_HEIGHT = 842

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
  const effectiveAccent = accentColor ?? DEFAULT_ACCENTS[template]
  const [downloadingDocx, setDownloadingDocx] = useState(false)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Resume - ${displayName(data.contact)}`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      @media print {
        .resume-print-root { width: 210mm !important; min-width: 210mm; height: 297mm !important; min-height: 297mm !important; }
        .resume-print-root .resume-print-inner { min-height: 297mm !important; height: 100% !important; }
        .resume-print-root [class*="-template"] { min-height: 297mm !important; height: 100% !important; }
        .resume-print-root aside { min-height: 100% !important; height: 100% !important; align-self: stretch !important; }
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

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-none flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 border-b border-cvmora-ink/8 bg-white/98">
        <span className="text-[0.8125rem] font-medium text-cvmora-ink/70">Preview</span>
        {showDownloadButtons && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePrint} className="min-h-[44px] px-4 py-2.5 rounded-full bg-[#BFED8D] text-[#1c1917] text-[15px] sm:text-[16px] font-medium border border-[#a8e070] hover:bg-[#b0e87d] active:bg-[#b0e87d] flex items-center">
              PDF
            </button>
            <button type="button" onClick={handleDownloadWord} disabled={downloadingDocx} className="min-h-[44px] px-4 py-2.5 rounded-full border border-[#e7e5e4] text-[#f97316] text-[15px] sm:text-[16px] font-medium hover:bg-[#fff7ed] active:bg-[#fff7ed] disabled:opacity-50 flex items-center">
              {downloadingDocx ? '…' : 'Word'}
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-auto bg-[#e5e7eb] px-3 py-5 flex flex-col items-center">
        <div
          ref={printRef}
          className="resume-print-root shadow-xl bg-white flex-shrink-0 overflow-visible"
          style={{
            width: A4_PREVIEW_WIDTH,
            height: A4_PREVIEW_HEIGHT,
            minWidth: A4_PREVIEW_WIDTH,
            minHeight: A4_PREVIEW_HEIGHT,
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div className="resume-print-inner h-full w-full min-h-[842px]">
            <TemplateComponent data={data} accentColor={effectiveAccent} />
          </div>
        </div>
        <div className="flex justify-center py-3">
          <span className="text-[0.8125rem] text-cvmora-ink/60 font-medium tabular-nums">&lt; 1 / 1 &gt;</span>
        </div>
      </div>
    </div>
  )
})
