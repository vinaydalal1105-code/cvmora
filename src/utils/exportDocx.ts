import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  TableBorders,
  WidthType,
  TableLayoutType,
  VerticalAlignTable,
} from 'docx'
import type { ResumeData } from '../types/resume'
import { displayName } from './resume'

/** Professional template sidebar color (muted blue) – hex without # for docx */
const SIDEBAR_FILL = 'AABCDF'

function line(s: string): string[] {
  return s.split('\n').filter(Boolean)
}

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }): boolean {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }): boolean {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export async function createResumeDocx(data: ResumeData): Promise<Blob> {
  const contact = data.contact
  const name = displayName(contact)
  const jobTarget = data.jobTarget?.trim() ?? ''
  const contactItems = [
    contact.email,
    contact.phone,
    contact.address?.trim(),
    contact.location,
    contact.website,
    contact.linkedin,
  ].filter(Boolean) as string[]
  const skillsList = data.skills.filter(Boolean)
  const showExperience = data.experience.some(hasContent)
  const showEducation = data.education.some(hasEduContent)
  const hasRefs = data.references && data.references.length > 0
  const hasSummary = !!(data.summary?.trim())

  const whiteRun = (text: string, opts?: { bold?: boolean; size?: number }) =>
    new TextRun({ text, color: 'FFFFFF', bold: opts?.bold, size: opts?.size ?? 24 })
  const whiteSmall = (text: string) => new TextRun({ text, color: 'FFFFFF', size: 22 })

  const sidebarParagraphs: Paragraph[] = [
    new Paragraph({
      children: [whiteRun(name || 'Your name', { bold: true })],
      spacing: { after: 120 },
    }),
    ...(jobTarget
      ? [
          new Paragraph({
            children: [whiteSmall(jobTarget.toUpperCase())],
            spacing: { after: 200 },
          }),
        ]
      : [new Paragraph({ children: [whiteSmall('Job title')], spacing: { after: 200 } })]),
    ...(contactItems.length > 0
      ? [
          new Paragraph({
            children: [whiteRun('DETAILS', { bold: true })],
            spacing: { before: 100, after: 80 },
          }),
          ...contactItems.map((t) => new Paragraph({ children: [whiteSmall(t)], spacing: { after: 60 } })),
        ]
      : []),
    ...(skillsList.length > 0
      ? [
          new Paragraph({
            children: [whiteRun('SKILLS', { bold: true })],
            spacing: { before: contactItems.length > 0 ? 200 : 100, after: 80 },
          }),
          new Paragraph({ children: [whiteSmall(skillsList.join(' · '))], spacing: { after: 100 } }),
        ]
      : []),
  ]

  const mainParagraphs: Paragraph[] = []

  if (hasSummary) {
    mainParagraphs.push(
      new Paragraph({
        text: 'Profile',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 0, after: 100 },
      }),
      new Paragraph({
        text: data.summary!.trim(),
        spacing: { after: 280 },
      })
    )
  }

  if (showExperience) {
    mainParagraphs.push(
      new Paragraph({
        text: 'Employment History',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: mainParagraphs.length > 0 ? 200 : 0, after: 100 },
      })
    )
    for (const exp of data.experience.filter(hasContent)) {
      const dateRange = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`
      mainParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.jobTitle ?? '', bold: true }),
            new TextRun({ text: `  ${dateRange}`, size: 22 }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: `${exp.company ?? ''}${exp.location ? ' · ' + exp.location : ''}`,
          spacing: { after: 80 },
        })
      )
      if (exp.description) {
        for (const bullet of line(exp.description)) {
          const text = bullet.replace(/^[•\-]\s*/, '')
          mainParagraphs.push(new Paragraph({ text: `• ${text}`, spacing: { after: 40 } }))
        }
        mainParagraphs.push(new Paragraph({ text: '', spacing: { after: 80 } }))
      }
    }
  }

  if (showEducation) {
    mainParagraphs.push(
      new Paragraph({
        text: 'Education',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: mainParagraphs.length > 0 ? 200 : 0, after: 100 },
      })
    )
    for (const edu of data.education.filter(hasEduContent)) {
      mainParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree ?? '', bold: true }),
            new TextRun({ text: `  ${edu.startDate ?? ''} – ${edu.endDate ?? ''}`, size: 22 }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          text: `${edu.school ?? ''}${edu.location ? ' · ' + edu.location : ''}`,
          spacing: { after: 60 },
        })
      )
      if (edu.description) {
        mainParagraphs.push(new Paragraph({ text: edu.description, spacing: { after: 80 } }))
      }
    }
  }

  if (hasRefs && data.references) {
    mainParagraphs.push(
      new Paragraph({
        text: 'References',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: mainParagraphs.length > 0 ? 200 : 0, after: 100 },
      })
    )
    for (const ref of data.references) {
      mainParagraphs.push(
        new Paragraph({
          text: [ref.name, ref.affiliation, ref.email, ref.phone].filter(Boolean).join(' · '),
          spacing: { after: 60 },
        })
      )
    }
  }

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            shading: { fill: SIDEBAR_FILL },
            margins: { top: 200, bottom: 200, left: 200, right: 150 },
            children: sidebarParagraphs,
            verticalAlign: VerticalAlignTable.TOP,
          }),
          new TableCell({
            width: { size: 72, type: WidthType.PERCENTAGE },
            margins: { top: 200, bottom: 200, left: 300, right: 200 },
            children: mainParagraphs,
            verticalAlign: VerticalAlignTable.TOP,
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: TableBorders.NONE,
  })

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [table],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  return blob
}
