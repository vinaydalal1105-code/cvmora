import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import { useReactToPrint } from 'react-to-print'
import type { CoverLetterData, CoverLetterTemplateId } from '../types/coverLetter'
import { CoverLetterProfessional, CoverLetterModern, CoverLetterMinimal } from './coverLetterTemplates'

const COVER_LETTER_TEMPLATE_MAP: Record<CoverLetterTemplateId, React.ComponentType<{ data: CoverLetterData }>> = {
  professional: CoverLetterProfessional,
  modern: CoverLetterModern,
  minimal: CoverLetterMinimal,
}

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
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Cover Letter - ${data.job_title || data.title}`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  })

  useImperativeHandle(ref, () => ({ print: onPrint ?? handlePrint }), [onPrint, handlePrint])

  return (
    <div className="flex flex-col h-full min-h-0">
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
      <div className="flex-1 min-h-0 overflow-auto bg-[#e5e7eb] px-3 py-5 flex justify-center items-start">
        <div
          ref={printRef}
          className="shadow-xl bg-white flex-shrink-0 overflow-visible"
          style={{
            width: 595,
            height: 842,
            minWidth: 595,
            minHeight: 842,
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div className="h-full w-full min-h-[842px]">
            <CoverLetterContent data={data} />
          </div>
        </div>
      </div>
    </div>
  )
})
