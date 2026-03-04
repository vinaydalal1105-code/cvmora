import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'
import type { CoverLetterData } from '../types/coverLetter'

export async function createCoverLetterDocx(data: CoverLetterData): Promise<Blob> {
  const lines: Paragraph[] = []
  // Contact block (centered)
  if (data.full_name) {
    lines.push(new Paragraph({ text: data.full_name, alignment: AlignmentType.CENTER, spacing: { after: 100 } }))
  }
  if (data.job_title) {
    lines.push(new Paragraph({ text: data.job_title, alignment: AlignmentType.CENTER, spacing: { after: 100 } }))
  }
  if (data.address) {
    lines.push(new Paragraph({ text: data.address, alignment: AlignmentType.CENTER, spacing: { after: 100 } }))
  }
  if (data.phone || data.email) {
    lines.push(
      new Paragraph({
        text: [data.phone, data.email].filter(Boolean).join(' · '),
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    )
  }
  // Employer / letter context
  if (data.hiring_manager) {
    lines.push(new Paragraph({ text: data.hiring_manager, spacing: { after: 100 } }))
  }
  if (data.company) {
    lines.push(new Paragraph({ text: data.company, spacing: { after: 100 } }))
  }
  if (data.job_title) {
    lines.push(
      new Paragraph({
        children: [new TextRun({ text: `Re: ${data.job_title}` })],
        spacing: { after: 400 },
      })
    )
  }
  const bodyParagraphs = data.body.split(/\n\n+/).filter(Boolean)
  for (const p of bodyParagraphs.length ? bodyParagraphs : [data.body || '']) {
    lines.push(new Paragraph({ text: p.replace(/\n/g, ' '), spacing: { after: 200 } }))
  }
  const doc = new Document({
    sections: [{ properties: {}, children: lines }],
  })
  return Packer.toBlob(doc)
}
