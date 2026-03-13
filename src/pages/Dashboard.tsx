import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import { ResumeThumbnail } from '../components/ResumeThumbnail'
import { createResumeDocx } from '../utils/exportDocx'
import type { ResumeData } from '../types/resume'

interface ResumeMeta {
  id: number
  title: string
  template_id: string
  created_at: string
  updated_at: string
}

interface CoverLetterMeta {
  id: number
  title: string
  job_title: string
  company: string
  template_id: string
  created_at: string
  updated_at: string
}

function SectionHeader({ title, count, actionLink, actionLabel }: { title: string; count?: number; actionLink?: string; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-[#1c1917] tracking-tight">{title}</h2>
        {count !== undefined && (
          <span className="px-2.5 py-0.5 rounded-full bg-[#f5f5f4] text-[#78716c] text-[13px] font-bold">
            {count}
          </span>
        )}
      </div>
      {actionLink && actionLabel && (
        <Link
          to={actionLink}
          className="text-sm font-bold text-[#f97316] hover:text-[#ea580c] transition-colors flex items-center gap-1 group"
        >
          {actionLabel}
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}
    </div>
  )
}

function ResumeCard({ resume, onDeleteClick, isPro }: { resume: ResumeMeta; onDeleteClick?: (resume: ResumeMeta) => void; isPro: boolean }) {
  const [downloadingWord, setDownloadingWord] = useState(false)

  const handleDownloadWord = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDownloadingWord(true)
    try {
      const row = await api<{ data: ResumeData; template_id: string }>(`/resumes/${resume.id}`)
      const blob = await createResumeDocx(row.data)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const name = (row.data?.contact?.fullName || row.data?.contact?.email || resume.title || 'resume').replace(/\s+/g, '-')
      a.download = `resume-${name}.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloadingWord(false)
    }
  }

  return (
    <div className="group bg-white rounded-2xl border border-[#e7e5e4] p-5 hover:border-[#f97316]/30 hover:shadow-lg hover:shadow-[#f97316]/5 transition-all duration-300">
      <div className="flex gap-5">
        <div className="shrink-0">
          <ResumeThumbnail resumeId={resume.id} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col pt-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/builder/${resume.id}`}
                className="text-lg font-bold text-[#1c1917] hover:text-[#f97316] transition-colors truncate block"
              >
                {resume.title}
              </Link>
              <p className="text-[13px] text-[#78716c] font-medium mt-0.5">
                {resume.template_id.charAt(0).toUpperCase() + resume.template_id.slice(1)} Template • Updated {new Date(resume.updated_at).toLocaleDateString()}
              </p>
            </div>
            {onDeleteClick && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteClick(resume); }}
                className="p-2 rounded-full text-[#a8a29e] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                title="Delete resume"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-auto pt-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPro ? (
                <>
                  <Link
                    to={`/builder/${resume.id}?download=pdf`}
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-[#BFED8D] text-[#1c1917] text-[13px] font-bold border border-[#a8e070] hover:bg-[#b0e87d] transition-colors"
                  >
                    PDF
                  </Link>
                  <button
                    onClick={handleDownloadWord}
                    disabled={downloadingWord}
                    className="inline-flex items-center px-4 py-2 rounded-xl border border-[#e7e5e4] text-[#44403c] text-[13px] font-bold hover:bg-[#fafaf9] transition-colors disabled:opacity-50"
                  >
                    {downloadingWord ? '...' : 'DOCX'}
                  </button>
                </>
              ) : (
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-[#fef3c7] text-[#92400e] text-[13px] font-bold border border-[#fde68a] hover:bg-[#fde68a] transition-colors"
                >
                  Upgrade to Download
                </Link>
              )}
            </div>
            <Link
              to={`/builder/${resume.id}`}
              className="text-sm font-bold text-[#f97316] hover:underline"
            >
              Edit Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Helper: format a remaining-time string from a unix timestamp */
function formatRemainingTime(periodEndUnix: number): string {
  const now = Date.now()
  const endMs = periodEndUnix * 1000
  const diff = endMs - now
  if (diff <= 0) return 'Expired'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 30) {
    const months = Math.floor(days / 30)
    return `${months} month${months > 1 ? 's' : ''}`
  }
  if (days === 0) return 'Less than a day'
  return `${days} day${days > 1 ? 's' : ''}`
}

export function Dashboard() {
  const { user, isAuthenticated, updateProfile, deleteAccount, refreshUser, logout } = useAuth()
  const isPro = user?.subscription_status === 'active'
  const isCancelled = isPro && user?.cancel_at_period_end === true
  const [editingName, setEditingName] = useState(false)
  const [manageLoading, setManageLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  const [resumes, setResumes] = useState<ResumeMeta[]>([])
  const [coverLetters, setCoverLetters] = useState<CoverLetterMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resumeToDelete, setResumeToDelete] = useState<ResumeMeta | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return
    setError('')
    Promise.all([
      api<ResumeMeta[]>('/resumes').catch((err) => {
        console.error('Failed to load resumes:', err)
        setError("Couldn't load your resumes. Try signing in again.")
        return []
      }),
      api<CoverLetterMeta[]>('/cover-letters').catch(() => []),
    ])
      .then(([r, c]) => {
        setResumes(r)
        setCoverLetters(c)
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleEditName = async () => {
    const newName = window.prompt('Display name', user?.name ?? '')
    if (newName === null) return
    const trimmed = newName.trim()
    if (!trimmed) return
    setEditingName(true)
    try {
      await updateProfile({ name: trimmed })
    } finally {
      setEditingName(false)
    }
  }

  const handleManage = async () => {
    setManageLoading(true)
    try {
      const res = await api<{ url: string }>('/stripe/customer-portal', { method: 'POST' })
      if (res?.url) window.location.href = res.url
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not open billing portal.')
    } finally {
      setManageLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setCancelLoading(true)
    try {
      await api<{ success: boolean; periodEnd: number; cancelAtPeriodEnd: boolean }>('/stripe/cancel-subscription', { method: 'POST' })
      await refreshUser()
      setShowCancelConfirm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel subscription.')
    } finally {
      setCancelLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      await deleteAccount()
      navigate('/')
    } catch (err) {
      alert('Failed to delete account.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (!isAuthenticated) return null

  const periodEndDate = user?.subscription_period_end
    ? new Date(user.subscription_period_end * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white rounded-3xl border border-[#e7e5e4] p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#f97316]/5 rounded-full -mr-8 -mt-8" />
                
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#fb923c] flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-[#f97316]/20 mb-4">
                    {user?.name?.[0].toUpperCase() || user?.email?.[0].toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-[#1c1917] truncate max-w-full">{user?.name}</h2>
                  <p className="text-[14px] text-[#78716c] truncate max-w-full mb-4">{user?.email}</p>
                  
                  <button
                    onClick={handleEditName}
                    disabled={editingName}
                    className="text-[13px] font-bold text-[#f97316] hover:underline mb-6"
                  >
                    {editingName ? 'Updating...' : 'Edit Profile Name'}
                  </button>
                </div>

                {/* Membership Section */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-[#e7e5e4]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-bold text-[#a8a29e] uppercase tracking-wider">Membership</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        isCancelled
                          ? 'bg-[#fef3c7] text-[#92400e]'
                          : isPro
                            ? 'bg-[#BFED8D] text-[#1c1917]'
                            : 'bg-[#e7e5e4] text-[#78716c]'
                      }`}>
                        {isCancelled ? 'Cancelling' : isPro ? 'Pro' : 'Free'}
                      </span>
                    </div>

                    <p className="text-[15px] font-bold text-[#1c1917]">
                      {isPro ? 'CVMora Pro' : 'Free Basic Plan'}
                    </p>

                    {/* Next Payment / Access End */}
                    {isPro && periodEndDate && (
                      <div className="mt-2 space-y-1.5">
                        {isCancelled ? (
                          <div className="flex items-center gap-2 text-[13px] text-[#92400e] font-medium">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Pro access until {periodEndDate}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[13px] text-[#78716c] font-medium">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Next payment: {periodEndDate}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cancelled Banner with remaining time */}
                    {isCancelled && user?.subscription_period_end && (
                      <div className="mt-3 p-3 rounded-xl bg-[#fffbeb] border border-[#fde68a]">
                        <p className="text-[12px] font-bold text-[#92400e] mb-0.5">Membership cancelled</p>
                        <p className="text-[12px] text-[#b45309] leading-relaxed">
                          You can still use all Pro features for <strong>{formatRemainingTime(user.subscription_period_end)}</strong>. After {periodEndDate}, you'll be moved to the Free plan.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      {isPro ? (
                        <>
                          <button
                            onClick={handleManage}
                            disabled={manageLoading}
                            className="w-full py-2.5 rounded-xl bg-white border border-[#e7e5e4] text-[13px] font-bold text-[#44403c] hover:bg-[#fafaf9] transition-colors"
                          >
                            {manageLoading ? 'Opening...' : 'Manage Billing'}
                          </button>
                          {!isCancelled && (
                            <button
                              onClick={() => setShowCancelConfirm(true)}
                              className="w-full py-2 rounded-xl text-[12px] font-bold text-[#a8a29e] hover:text-red-500 hover:bg-red-50/50 transition-colors"
                            >
                              Cancel Membership
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => navigate('/pricing')}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white text-[13px] font-bold hover:shadow-md hover:shadow-[#f97316]/20 transition-all"
                        >
                          Upgrade to Pro
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="w-full py-2.5 text-[14px] font-bold text-[#78716c] hover:text-[#1c1917] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50/50 rounded-2xl border border-red-100 p-5">
                <h3 className="text-[13px] font-bold text-red-700 mb-1">Danger Zone</h3>
                <p className="text-[12px] text-red-600/70 mb-3 leading-tight">Delete your account and all associated data permanently.</p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2 rounded-xl bg-white border border-red-200 text-[12px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            
            {/* Resumes Section */}
            <section className="mb-12">
              <SectionHeader
                title="My Resumes"
                count={resumes.length}
                actionLink="/builder"
                actionLabel="Create New"
              />
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-48 bg-[#f5f5f4] rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-[#e7e5e4] rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-[#fff7ed] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#1c1917] mb-2">No resumes yet</h3>
                  <p className="text-[#a8a29e] max-w-xs mx-auto mb-6">Create your first professional resume today with our job-winning templates.</p>
                  <Link to="/builder" className="inline-flex px-6 py-2.5 rounded-full bg-[#f97316] text-white font-bold hover:bg-[#ea580c] transition-all shadow-md shadow-[#f97316]/20">
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {resumes.map((r) => (
                    <ResumeCard
                      key={r.id}
                      resume={r}
                      isPro={isPro}
                      onDeleteClick={() => setResumeToDelete(r)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Cover Letters Section */}
            <section className="mb-12">
              <SectionHeader
                title="Cover Letters"
                count={coverLetters.length}
                actionLink="/cover-letter"
                actionLabel="Write New"
              />
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-[#f5f5f4] rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : coverLetters.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-[#e7e5e4] rounded-3xl p-10 text-center">
                  <h3 className="text-base font-bold text-[#1c1917] mb-1">No cover letters yet</h3>
                  <p className="text-[14px] text-[#a8a29e] mb-4">Pair your resume with a powerful cover letter.</p>
                  <Link to="/cover-letter" className="text-sm font-bold text-[#f97316] hover:underline">
                    Create your first cover letter →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {coverLetters.map((c) => (
                    <Link
                      key={c.id}
                      to={`/cover-letter/${c.id}`}
                      className="group bg-white rounded-2xl border border-[#e7e5e4] p-5 flex items-center justify-between hover:border-[#f97316]/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#f5f5f4] flex items-center justify-center text-[#78716c] group-hover:bg-[#fff7ed] group-hover:text-[#f97316] transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1c1917]">{c.title}</h4>
                          <p className="text-[13px] text-[#a8a29e] font-medium">
                            {c.job_title && c.company ? `${c.job_title} at ${c.company}` : 'Draft Cover Letter'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[12px] font-bold text-[#a8a29e]">
                          {new Date(c.updated_at).toLocaleDateString()}
                        </span>
                        <svg className="w-5 h-5 text-[#a8a29e] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

          </main>
        </div>
      </div>

      {/* Delete Resume Confirmation Modal */}
      {resumeToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setResumeToDelete(null)}>
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl relative animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1c1917] text-center mb-2">Delete Resume?</h2>
            <p className="text-[#78716c] text-center mb-8 leading-relaxed">
              "<strong>{resumeToDelete.title}</strong>" will be permanently removed. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setResumeToDelete(null)}
                className="py-3.5 rounded-2xl bg-[#f5f5f4] text-[#44403c] font-bold text-sm hover:bg-[#e7e5e4] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = resumeToDelete.id;
                  try {
                    await api(`/resumes/${id}`, { method: 'DELETE' });
                    setResumes(prev => prev.filter(r => r.id !== id));
                    setResumeToDelete(null);
                  } catch (err) {
                    alert('Failed to delete resume.');
                  }
                }}
                className="py-3.5 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Membership Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !cancelLoading && setShowCancelConfirm(false)}>
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-[#fff7ed] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1c1917] text-center mb-2">Cancel Membership?</h2>
            <p className="text-[#78716c] text-center mb-3 leading-relaxed">
              Your Pro features will remain active until the end of your current billing period{periodEndDate ? ` (${periodEndDate})` : ''}.
            </p>
            <div className="bg-[#f5f5f4] rounded-xl p-4 mb-6">
              <p className="text-[13px] text-[#44403c] font-medium leading-relaxed">
                After cancellation, you'll lose access to:
              </p>
              <ul className="mt-2 space-y-1.5">
                <li className="flex items-center gap-2 text-[13px] text-[#78716c]">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  PDF & DOCX resume downloads
                </li>
                <li className="flex items-center gap-2 text-[13px] text-[#78716c]">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Premium resume templates
                </li>
                <li className="flex items-center gap-2 text-[13px] text-[#78716c]">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  AI-powered resume assistance
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancelLoading}
                className="py-3.5 rounded-2xl bg-[#f5f5f4] text-[#44403c] font-bold text-sm hover:bg-[#e7e5e4] transition-colors"
              >
                Keep Pro
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="py-3.5 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-60"
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !deleteLoading && setShowDeleteConfirm(false)}>
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1c1917] text-center mb-2">Delete Your Account?</h2>
            <p className="text-[#78716c] text-center mb-6 leading-relaxed">
              This will <strong>permanently delete</strong> your account and all associated data including resumes, cover letters, and any active subscription. This action <strong>cannot be undone</strong>.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="py-3.5 rounded-2xl bg-[#f5f5f4] text-[#44403c] font-bold text-sm hover:bg-[#e7e5e4] transition-colors"
              >
                Keep Account
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="py-3.5 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
