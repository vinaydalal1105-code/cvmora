import { Link } from 'react-router-dom'

export function Accessibility() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <h1 className="text-3xl font-bold text-[#1c1917] tracking-tight mb-2">
        Accessibility
      </h1>
      <p className="text-[#78716c] text-base mb-10">
        We aim to make Cvmora usable for everyone.
      </p>

      <div className="space-y-8 text-[#44403c] text-base leading-relaxed" style={{ lineHeight: 1.65 }}>
        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">Our commitment</h2>
          <p>
            Cvmora is committed to ensuring our resume builder, templates, and website are accessible to people with disabilities. We follow widely accepted guidelines and work to improve the experience for users of assistive technologies and different input methods.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">What we do</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use semantic HTML and ARIA where needed so screen readers can navigate and understand content</li>
            <li>Provide sufficient color contrast and avoid relying on color alone to convey information</li>
            <li>Support keyboard navigation for main flows (builder, templates, navigation)</li>
            <li>Use clear, consistent labels and focus indicators for interactive elements</li>
            <li>Ensure forms and buttons are labeled and usable with assistive tech</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">Feedback</h2>
          <p>
            If you run into an accessibility barrier or have a suggestion, we want to hear from you. Email us at{' '}
            <a href="mailto:accessibility@cvmora.com" className="text-[#f97316] hover:underline font-medium">
              accessibility@cvmora.com
            </a>
            {' '}or use our <Link to="/contact" className="text-[#f97316] hover:underline font-medium">Contact</Link> page. We’ll do our best to address your feedback and improve the product.
          </p>
        </section>

        <section className="pt-4">
          <p className="text-[#78716c]">
            For other support, see our <Link to="/faq" className="text-[#f97316] hover:underline font-medium">FAQ</Link> and <Link to="/contact" className="text-[#f97316] hover:underline font-medium">Contact</Link> pages.
          </p>
        </section>
      </div>
    </div>
  )
}
