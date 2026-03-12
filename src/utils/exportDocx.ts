import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlignTable,
  AlignmentType,
  BorderStyle,
} from 'docx'
import type { ResumeData } from '../types/resume'
import { displayName } from './resume'

function line(s: string): string[] {
  return s.split('\n').filter(Boolean)
}

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }): boolean {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }): boolean {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

function hexToDocxColor(hex?: string): string {
  if (!hex) return 'AABCDF'
  return hex.replace(/^#/, '').toUpperCase()
}

function isLightColor(hex: string): boolean {
  const h = hex.replace(/^#/, '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum > 0.5
}

const PAGE_W = 11906
const PAGE_H = 16838
const USABLE_W = PAGE_W
const SIDEBAR_W = Math.round(USABLE_W * 0.28)
const MAIN_W = USABLE_W - SIDEBAR_W

const NONE_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const NO_BORDERS = {
  top: NONE_BORDER,
  bottom: NONE_BORDER,
  left: NONE_BORDER,
  right: NONE_BORDER,
}

const SECTION_BORDER = {
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC', space: 4 },
}

type ExportOptions = {
  accentColor?: string
  template?: string
}

const SIDEBAR_TEMPLATES = new Set([
  'corporate', 'professional', 'sidebar-right', 'pillar',
])

function sectionHeading(text: string, isFirst: boolean): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: 'Helvetica' })],
    spacing: { before: isFirst ? 0 : 240, after: 80 },
    border: SECTION_BORDER,
  })
}

function buildMainParagraphs(data: ResumeData): Paragraph[] {
  const showExperience = data.experience.some(hasContent)
  const showEducation = data.education.some(hasEduContent)
  const hasRefs = data.references && data.references.length > 0
  const hasSummary = !!(data.summary?.trim())
  const paragraphs: Paragraph[] = []
  let sectionCount = 0

  if (hasSummary) {
    paragraphs.push(sectionHeading('Profile', sectionCount === 0))
    sectionCount++
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.summary!.trim(), size: 20, font: 'Helvetica' })],
        spacing: { after: 160 },
      })
    )
  }

  if (showExperience) {
    paragraphs.push(sectionHeading('Employment History', sectionCount === 0))
    sectionCount++
    for (const exp of data.experience.filter(hasContent)) {
      const dateRange = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: exp.jobTitle ?? '', bold: true, size: 21, font: 'Helvetica' })],
          spacing: { before: 100, after: 20 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.company ?? ''}${exp.location ? ' · ' + exp.location : ''}`, size: 18, font: 'Helvetica' }),
            new TextRun({ text: `    ${dateRange}`, size: 18, color: '888888', font: 'Helvetica' }),
          ],
          spacing: { after: 50 },
        })
      )
      if (exp.description) {
        for (const bullet of line(exp.description)) {
          const text = bullet.replace(/^[•\-]\s*/, '')
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `•  ${text}`, size: 18, font: 'Helvetica' })],
              spacing: { after: 25 },
              indent: { left: 180 },
            })
          )
        }
      }
    }
  }

  if (showEducation) {
    paragraphs.push(sectionHeading('Education', sectionCount === 0))
    sectionCount++
    for (const edu of data.education.filter(hasEduContent)) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: edu.degree ?? '', bold: true, size: 21, font: 'Helvetica' })],
          spacing: { before: 100, after: 20 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.school ?? ''}${edu.location ? ' · ' + edu.location : ''}`, size: 18, font: 'Helvetica' }),
            new TextRun({ text: `    ${edu.startDate ?? ''} – ${edu.endDate ?? ''}`, size: 18, color: '888888', font: 'Helvetica' }),
          ],
          spacing: { after: 50 },
        })
      )
      if (edu.description) {
        for (const bullet of line(edu.description)) {
          const text = bullet.replace(/^[•\-]\s*/, '')
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `•  ${text}`, size: 18, font: 'Helvetica' })],
              spacing: { after: 25 },
              indent: { left: 180 },
            })
          )
        }
      }
    }
  }

  if (hasRefs && data.references) {
    paragraphs.push(sectionHeading('References', sectionCount === 0))
    sectionCount++
    for (const ref of data.references) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({
            text: [ref.name, ref.affiliation, ref.email, ref.phone].filter(Boolean).join(' · '),
            size: 18,
            font: 'Helvetica',
          })],
          spacing: { after: 50 },
        })
      )
    }
  }

  return paragraphs
}

function buildSidebarLayout(data: ResumeData, sidebarColor: string): Table {
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
  const light = isLightColor(sidebarColor)
  const textColor = light ? '1C1917' : 'FFFFFF'
  const mutedColor = light ? '4B5563' : 'FFFFFFCC'

  const sideRun = (text: string, opts?: { bold?: boolean; size?: number; color?: string }) =>
    new TextRun({ text, color: opts?.color ?? textColor, bold: opts?.bold, size: opts?.size ?? 20, font: 'Helvetica' })

  const sidebarParagraphs: Paragraph[] = [
    new Paragraph({
      children: [sideRun(name || 'Your name', { bold: true, size: 28 })],
      spacing: { after: 40 },
    }),
    ...(jobTarget
      ? [new Paragraph({ children: [sideRun(jobTarget, { size: 18, color: mutedColor })], spacing: { after: 140 } })]
      : []),
    ...(contactItems.length > 0
      ? [
          new Paragraph({
            children: [sideRun('DETAILS', { bold: true, size: 16 })],
            spacing: { before: 60, after: 50 },
          }),
          ...contactItems.map((t) => new Paragraph({ children: [sideRun(t, { size: 18 })], spacing: { after: 35 } })),
        ]
      : []),
    ...(skillsList.length > 0
      ? [
          new Paragraph({
            children: [sideRun('SKILLS', { bold: true, size: 16 })],
            spacing: { before: 140, after: 50 },
          }),
          ...skillsList.map((s) =>
            new Paragraph({ children: [sideRun(`•  ${s}`, { size: 18 })], spacing: { after: 25 } })
          ),
        ]
      : []),
  ]

  const mainParagraphs = buildMainParagraphs(data)

  return new Table({
    columnWidths: [SIDEBAR_W, MAIN_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: SIDEBAR_W, type: WidthType.DXA },
            shading: { fill: hexToDocxColor(sidebarColor) },
            margins: { top: 400, bottom: 400, left: 200, right: 160 },
            children: sidebarParagraphs,
            verticalAlign: VerticalAlignTable.TOP,
            borders: NO_BORDERS,
          }),
          new TableCell({
            width: { size: MAIN_W, type: WidthType.DXA },
            margins: { top: 400, bottom: 400, left: 300, right: 250 },
            children: mainParagraphs,
            verticalAlign: VerticalAlignTable.TOP,
            borders: NO_BORDERS,
          }),
        ],
      }),
    ],
    width: { size: USABLE_W, type: WidthType.DXA },
    borders: {
      top: NONE_BORDER,
      bottom: NONE_BORDER,
      left: NONE_BORDER,
      right: NONE_BORDER,
      insideHorizontal: NONE_BORDER,
      insideVertical: NONE_BORDER,
    },
  })
}

function buildSimpleLayout(data: ResumeData): Paragraph[] {
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

  const children: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: name || 'Your Name', bold: true, size: 36, font: 'Helvetica' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    }),
  ]

  if (jobTarget) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: jobTarget, size: 22, color: '666666', font: 'Helvetica' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
      })
    )
  }

  if (contactItems.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactItems.join('  |  '), size: 20, color: '555555', font: 'Helvetica' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    )
  }

  children.push(...buildMainParagraphs(data))

  if (skillsList.length > 0) {
    children.push(sectionHeading('Skills', false))
    children.push(
      new Paragraph({
        children: [new TextRun({ text: skillsList.join('  ·  '), size: 20, font: 'Helvetica' })],
        spacing: { after: 200 },
      })
    )
  }

  return children
}

export async function createResumeDocx(data: ResumeData, options?: ExportOptions): Promise<Blob> {
  const template = options?.template ?? 'corporate'
  const hasSidebar = SIDEBAR_TEMPLATES.has(template)
  const accentColor = options?.accentColor ?? '#AABCDF'

  let children: (Paragraph | Table)[]
  let pageMargin: { top: number; bottom: number; left: number; right: number }

  if (hasSidebar) {
    children = [buildSidebarLayout(data, accentColor)]
    pageMargin = { top: 0, bottom: 0, left: 0, right: 0 }
  } else {
    children = buildSimpleLayout(data)
    pageMargin = { top: 720, bottom: 720, left: 900, right: 900 }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: pageMargin,
            size: { width: PAGE_W, height: PAGE_H },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBlob(doc)
}
