export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <h1 className="text-3xl font-bold text-cvmora-ink tracking-tight mb-6">
        Privacy Policy
      </h1>
      <p className="text-cvmora-muted text-base mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-slate max-w-none text-cvmora-ink/85 space-y-4 text-[0.9375rem] leading-relaxed">
        <p>
          Cvmora respects your privacy. This policy describes how we collect, use, and protect your information when you use our resume builder and related services.
        </p>
        <h2 className="text-lg font-semibold text-cvmora-ink mt-8 mb-2">Cookies</h2>
        <p>
          We use cookies to analyze website traffic and improve your experience. You can accept or reject non-essential cookies using the cookie bar when you first visit. Essential cookies are required for the site to function (e.g. authentication).
        </p>
        <h2 className="text-lg font-semibold text-cvmora-ink mt-8 mb-2">Data we collect</h2>
        <p>
          We store the information you provide: account details (email, password hash), resume and cover letter content you create, and usage data necessary to operate the service.
        </p>
        <h2 className="text-lg font-semibold text-cvmora-ink mt-8 mb-2">Contact</h2>
        <p>
          For privacy-related questions, contact us through the support or contact options on this site.
        </p>
      </div>
    </div>
  )
}
