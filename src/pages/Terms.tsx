import { Link } from 'react-router-dom'

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <h1 className="text-3xl font-bold text-[#1c1917] tracking-tight mb-2">
        Terms of Service
      </h1>
      <p className="text-[#78716c] text-base mb-10">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-8 text-[#44403c] text-base leading-relaxed" style={{ lineHeight: 1.65 }}>
        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">1. Acceptance of terms</h2>
          <p>
            By using Cvmora (“the Service”), you agree to these Terms of Service. If you do not agree, please do not use the Service. We may update these terms from time to time; continued use after changes means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">2. Use of the service</h2>
          <p>
            You may use Cvmora to create, edit, and export resumes and cover letters for personal, job-seeking purposes. You must provide accurate information and keep your account secure. You may not use the Service for illegal purposes, to infringe others’ rights, or to abuse or overload our systems.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">3. Your content</h2>
          <p>
            You retain ownership of the content you create (resumes, cover letters, and other data you enter). By using the Service, you grant us a limited license to store, process, and display your content as needed to provide and improve the Service. We do not sell your personal data or resume content to third parties for marketing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">4. Privacy</h2>
          <p>
            Our collection and use of your information is described in our <Link to="/privacy" className="text-[#f97316] hover:underline font-medium">Privacy Policy</Link>. By using the Service, you also agree to that policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">5. Disclaimer</h2>
          <p>
            Cvmora is provided “as is.” We do not guarantee specific job outcomes or that your resume will pass every applicant tracking system. Templates and tools are for guidance; you are responsible for the accuracy and appropriateness of your content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">6. Contact</h2>
          <p>
            For questions about these terms, contact us at <a href="mailto:support@cvmora.com" className="text-[#f97316] hover:underline font-medium">support@cvmora.com</a> or through our <Link to="/contact" className="text-[#f97316] hover:underline font-medium">Contact</Link> page.
          </p>
        </section>
      </div>
    </div>
  )
}
