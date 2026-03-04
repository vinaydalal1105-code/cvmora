import type { CoverLetterData } from '../../types/coverLetter'

/** Shared: employer block - always show structure so template format is visible */
function EmployerBlock({ data }: { data: CoverLetterData }) {
  const hasEmployer = data.company || data.hiring_manager || data.job_title
  return (
    <div className="mb-4 space-y-1 min-h-[3.5rem]">
      {data.hiring_manager ? <p className="text-[#44403c]">{data.hiring_manager}</p> : hasEmployer ? null : <p className="text-[#d6d3d1] text-[0.9em]">Hiring Manager</p>}
      {data.company ? <p className="text-[#44403c]">{data.company}</p> : hasEmployer ? null : <p className="text-[#d6d3d1] text-[0.9em]">Company Name</p>}
      {data.job_title ? <p className="text-[#78716c] text-[0.9em]">Re: {data.job_title}</p> : hasEmployer ? null : <p className="text-[#d6d3d1] text-[0.9em]">Re: Position</p>}
    </div>
  )
}

function Body({ body }: { body: string }) {
  return (
    <div className={`flex-1 min-h-[280px] prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed ${body ? 'text-[#333]' : 'text-[#a8a29e]'}`}>
      {body || 'Your cover letter content goes here.'}
    </div>
  )
}

/** Professional: centered header, horizontal rule, classic formal look. Structure always visible. */
export function CoverLetterProfessional({ data }: { data: CoverLetterData }) {
  const hasContact = data.full_name || data.job_title || data.address || data.phone || data.email
  return (
    <div className="bg-white text-[#1c1c1c] p-10 min-h-[842px] w-full font-sans text-sm flex flex-col border border-[#f5f5f4]">
      <div className="text-center mb-4 min-h-[4rem] flex flex-col justify-center">
        {data.full_name ? <p className="font-medium text-[#1c1917]">{data.full_name}</p> : <p className="text-[#a8a29e] font-medium">Your name</p>}
        {data.job_title ? <p className="text-[#44403c] text-[0.9em] mt-0.5">{data.job_title}</p> : <p className="text-[#d6d3d1] text-[0.9em] mt-0.5">Your title</p>}
        {data.address ? <p className="text-[#78716c] text-[0.9em] mt-0.5">{data.address}</p> : <p className="text-[#d6d3d1] text-[0.9em] mt-0.5">Address</p>}
        {data.phone || data.email ? (
          <p className="text-[#78716c] text-[0.9em] mt-0.5">
            {[data.phone, data.email].filter(Boolean).join(' · ')}
          </p>
        ) : <p className="text-[#a8a29e] text-[0.9em] mt-0.5">your@email.com</p>}
      </div>
      <div className="h-[2px] bg-[#e7e5e4] mb-4" aria-hidden />
      <EmployerBlock data={data} />
      <Body body={data.body} />
      <div className="flex justify-center gap-2 mt-8 pt-6 text-xs text-[#78716c]" aria-hidden>
        <span>&lt;</span><span>1/1</span><span>&gt;</span>
      </div>
    </div>
  )
}

/** Modern: left-aligned, accent bar, clean sans. Structure always visible. */
export function CoverLetterModern({ data }: { data: CoverLetterData }) {
  const hasContact = data.full_name || data.job_title || data.address || data.phone || data.email
  return (
    <div className="bg-white text-[#1c1c1c] min-h-[842px] w-full font-sans text-sm flex border border-[#f5f5f4]">
      <div className="w-2 shrink-0 bg-[#f97316]" aria-hidden />
      <div className="flex-1 p-10 flex flex-col min-w-0">
        <div className="text-left mb-4 min-h-[4rem]">
          {data.full_name ? <p className="font-semibold text-[#1c1917] text-base">{data.full_name}</p> : <p className="text-[#a8a29e] font-medium">Your name</p>}
          {data.job_title ? <p className="text-[#64748b] text-[0.9em] mt-0.5">{data.job_title}</p> : <p className="text-[#d6d3d1] text-[0.9em] mt-0.5">Your title</p>}
          {(data.address || data.phone || data.email) ? (
            <p className="text-[#64748b] text-[0.9em] mt-1">
              {[data.address, data.phone, data.email].filter(Boolean).join(' · ')}
            </p>
          ) : <p className="text-[#a8a29e] text-[0.9em] mt-0.5">your@email.com</p>}
        </div>
        <div className="h-[2px] bg-[#e2e8f0] mb-4 w-20" aria-hidden />
        <EmployerBlock data={data} />
        <Body body={data.body} />
        <div className="flex gap-2 mt-8 pt-6 text-xs text-[#94a3b8]" aria-hidden>
          <span>1/1</span>
        </div>
      </div>
    </div>
  )
}

/** Minimal: lots of whitespace, subtle typography. Structure always visible. */
export function CoverLetterMinimal({ data }: { data: CoverLetterData }) {
  const hasContact = data.full_name || data.job_title || data.address || data.phone || data.email
  return (
    <div className="bg-white text-[#1c1c1c] p-12 min-h-[842px] w-full font-sans text-sm flex flex-col max-w-[600px] mx-auto border border-[#f5f5f4]">
      <div className="text-left mb-8 min-h-[4rem]">
        {data.full_name ? <p className="font-medium text-[#0f172a] tracking-tight">{data.full_name}</p> : <p className="text-[#a8a29e] font-medium">Your name</p>}
        {data.job_title ? <p className="text-[#64748b] text-[0.85em] mt-1">{data.job_title}</p> : <p className="text-[#d6d3d1] text-[0.85em] mt-1">Your title</p>}
        {(data.address || data.phone || data.email) ? (
          <p className="text-[#94a3b8] text-[0.85em] mt-1">
            {[data.address, data.phone, data.email].filter(Boolean).join('  ·  ')}
          </p>
        ) : <p className="text-[#a8a29e] text-[0.85em] mt-0.5">your@email.com</p>}
      </div>
      <EmployerBlock data={data} />
      <div className="border-t-2 border-[#f1f5f9] pt-6 mt-2 flex-1 flex flex-col min-h-0">
        <Body body={data.body} />
      </div>
      <div className="mt-auto pt-10 text-[11px] text-[#cbd5e1]" aria-hidden>1/1</div>
    </div>
  )
}
