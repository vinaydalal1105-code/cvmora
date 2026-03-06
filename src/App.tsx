import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import TemplateShowcase from './components/TemplateShowcase'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { AuthCallback } from './pages/AuthCallback'
import { Dashboard } from './pages/Dashboard'
import { ResumeBuilder } from './pages/ResumeBuilder'
import { CoverLetterBuilder } from './pages/CoverLetterBuilder'
import { CoverLetterTemplates } from './pages/CoverLetterTemplates'
import { Templates } from './pages/Templates'
import { TemplatesATS } from './pages/TemplatesATS'
import { Examples } from './pages/Examples'
import { JobBoard } from './pages/JobBoard'
import { InterviewPrep } from './pages/InterviewPrep'
import { SalaryAnalyzer } from './pages/SalaryAnalyzer'
import { Resources } from './pages/Resources'
import { ResourceGuide } from './pages/ResourceGuide'
import { About } from './pages/About'
import { Accessibility } from './pages/Accessibility'
import { Contact } from './pages/Contact'
import { FAQ } from './pages/FAQ'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<><Landing /><TemplateShowcase /></>} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="builder" element={<ResumeBuilder />} />
          <Route path="builder/:id" element={<ResumeBuilder />} />
          <Route path="cover-letter" element={<CoverLetterBuilder />} />
          <Route path="cover-letter/templates" element={<CoverLetterTemplates />} />
          <Route path="cover-letter/:id" element={<CoverLetterBuilder />} />
          <Route path="templates" element={<Templates />} />
          <Route path="templates/ats" element={<TemplatesATS />} />
          <Route path="examples" element={<Examples />} />
          <Route path="jobs" element={<JobBoard />} />
          <Route path="interview" element={<InterviewPrep />} />
          <Route path="salary" element={<SalaryAnalyzer />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/guide/:slug" element={<ResourceGuide />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="accessibility" element={<Accessibility />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="showcase" element={<TemplateShowcase />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
