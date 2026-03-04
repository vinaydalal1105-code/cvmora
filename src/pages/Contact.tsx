import { Link } from 'react-router-dom'

export function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <h1 className="text-3xl font-bold text-[#1c1917] tracking-tight mb-2">
        Contact Us
      </h1>
      <p className="text-[#78716c] text-base mb-10">
        Get in touch with questions, feedback, or support.
      </p>

      <div className="space-y-8 text-[#44403c] text-base leading-relaxed" style={{ lineHeight: 1.65 }}>
        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">General inquiries</h2>
          <p>
            For general questions about Cvmora, resume building, or your account, email us at{' '}
            <a href="mailto:support@cvmora.com" className="text-[#f97316] hover:underline font-medium">
              support@cvmora.com
            </a>
            . We aim to respond within 1–2 business days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">Technical support</h2>
          <p>
            If you have trouble with the builder, downloads, or your dashboard, contact{' '}
            <a href="mailto:help@cvmora.com" className="text-[#f97316] hover:underline font-medium">
              help@cvmora.com
            </a>
            . Please include your browser and device so we can help faster.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">Privacy and legal</h2>
          <p>
            For privacy requests, data questions, or legal matters, email{' '}
            <a href="mailto:privacy@cvmora.com" className="text-[#f97316] hover:underline font-medium">
              privacy@cvmora.com
            </a>
            . See our <Link to="/privacy" className="text-[#f97316] hover:underline font-medium">Privacy Policy</Link> for more.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">Follow us</h2>
          <p className="mb-3">Stay updated with tips and product news:</p>
          <ul className="space-y-1">
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline font-medium">X (Twitter)</a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline font-medium">LinkedIn</a>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline font-medium">GitHub</a>
            </li>
          </ul>
        </section>

        <section className="pt-4">
          <p className="text-[#78716c]">
            Many answers are in our <Link to="/faq" className="text-[#f97316] hover:underline font-medium">FAQ</Link> and <Link to="/resources" className="text-[#f97316] hover:underline font-medium">Resources</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
