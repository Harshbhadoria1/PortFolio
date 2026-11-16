import { ArrowRight, Download, ExternalLink, Github, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { EDUCATION_DATA, HARSH_PROFILE, type ProjectItem } from '../data/portfolioData';
import { isSafeExternalUrl } from '../utils/portfolioLogic';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.16 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0A0F1E] p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-emerald-300">
                  {project.timeframe} · {project.teamLabel}
                </p>
                <h3 id="project-modal-title" className="font-hero mt-1 text-2xl font-bold text-white sm:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-slate-300">{project.subtitle}</p>
              </div>
              <button
                type="button"
                aria-label="Close project details"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/15 cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6">
              <h4 className="font-mono text-xs text-slate-400">Architecture Pipeline</h4>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-200">
                {project.architectureFlow.map((node, i) => (
                  <span key={node} className="inline-flex items-center gap-2">
                    <span className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-1.5">
                      {node}
                    </span>
                    {i < project.architectureFlow.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-mono text-xs text-slate-400">Key Engineering Highlights</h4>
              <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-slate-200">
                {project.highlights.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              {project.liveUrl && isSafeExternalUrl(project.liveUrl) && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-opacity hover:opacity-95"
                >
                  See Live Demo
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
              {isSafeExternalUrl(project.repoUrl) && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  GitHub Profile
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResumePreviewModal({ open, onClose }: ResumeModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md sm:p-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0A0F1E] p-4 shadow-2xl sm:p-6"
          >
            {/* Modal Action Bar: View / Open in New Tab / Download PDF */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 id="resume-modal-title" className="font-hero text-xl font-bold text-white">
                  {HARSH_PROFILE.name} — Resume
                </h3>
                <p className="text-xs text-slate-400">
                  LaTeX-Format Clean Edition · Python Data Science, GenAI &amp; Full Stack MERN
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={HARSH_PROFILE.resumePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-emerald-300/45 hover:bg-white/10 whitespace-nowrap"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                  Open in New Tab
                </a>

                <a
                  href={HARSH_PROFILE.resumePdfUrl}
                  download="Harsh_Bhadoria_Resume.pdf"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition-opacity hover:opacity-95 whitespace-nowrap"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download Resume
                </a>

                <button
                  type="button"
                  aria-label="Close resume preview"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Clean Printable LaTeX-Style Document Preview */}
            <div className="mt-4 overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-inner sm:p-9 font-serif text-[13px] leading-relaxed">
              <div className="text-center">
                <h4 className="text-3xl font-bold tracking-tight text-black">
                  {HARSH_PROFILE.name}
                </h4>
                <p className="mt-0.5 text-sm text-neutral-800">
                  Python Data Science, GenAI &amp; Full Stack Developer
                </p>
                <p className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-neutral-800">
                  <span>Gwalior, M.P.</span>
                  <span>|</span>
                  <span>{HARSH_PROFILE.phone}</span>
                  <span>|</span>
                  <a href={`mailto:${HARSH_PROFILE.email}`} className="underline">
                    {HARSH_PROFILE.email}
                  </a>
                  <span>|</span>
                  <a
                    href={HARSH_PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    LinkedIn
                  </a>
                  <span>|</span>
                  <a
                    href={HARSH_PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    GitHub
                  </a>
                </p>
              </div>

              {/* Summary */}
              <div className="mt-4">
                <h5 className="border-b border-black pb-0.5 text-sm font-bold text-black">
                  Professional Summary
                </h5>
                <p className="mt-1.5 text-justify text-neutral-900">
                  {HARSH_PROFILE.heroBios.serious} Proficient in Python (Pandas, NumPy, Scikit-learn,
                  Matplotlib, Seaborn, FastAPI, Streamlit), Generative AI workflows, C++ DSA, React.js,
                  Node.js, PostgreSQL, MySQL, MongoDB, and Docker.
                </p>
              </div>

              {/* Education */}
              <div className="mt-4">
                <h5 className="border-b border-black pb-0.5 text-sm font-bold text-black">
                  Education
                </h5>
                <div className="mt-1.5 space-y-1.5">
                  {EDUCATION_DATA.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 font-bold text-black">
                        <span>{edu.institution}</span>
                        <span>{edu.period}</span>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 italic text-neutral-800">
                        <span>{edu.degree}</span>
                        <span>{edu.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="mt-4">
                <h5 className="border-b border-black pb-0.5 text-sm font-bold text-black">
                  Technical Skills
                </h5>
                <ul className="mt-1.5 space-y-1 text-neutral-900">
                  <li>
                    <strong className="text-black">Programming &amp; DSA:</strong> Python, C++,
                    JavaScript (ES2024), SQL, HTML5, CSS3, Data Structures &amp; Algorithms.
                  </li>
                  <li>
                    <strong className="text-black">Data Science, ML &amp; GenAI:</strong> Generative AI
                    (LLM Workflows, RAG), Machine Learning, Scikit-learn, Deep Learning Basics, Pandas,
                    NumPy, Matplotlib, Seaborn, SciPy, Plotly.
                  </li>
                  <li>
                    <strong className="text-black">Frameworks &amp; Web Stack:</strong> React.js, Node.js,
                    Express.js, FastAPI, Flask, Streamlit, Tailwind CSS, RESTful APIs.
                  </li>
                  <li>
                    <strong className="text-black">Databases &amp; DevOps:</strong> MySQL, PostgreSQL,
                    MongoDB, Docker, Git, GitHub, Vercel.
                  </li>
                </ul>
              </div>

              {/* Projects */}
              <div className="mt-4">
                <h5 className="border-b border-black pb-0.5 text-sm font-bold text-black">
                  Projects
                </h5>
                <div className="mt-1.5 space-y-2.5">
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span>
                        <strong className="text-black">AgriNext</strong> |{' '}
                        <em className="text-neutral-800">Multilingual Agriculture E-Commerce Platform</em>
                      </span>
                      <span className="text-xs">
                        <a
                          href="https://agrinext-frontend.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Live Demo
                        </a>{' '}
                        |{' '}
                        <a
                          href={HARSH_PROFILE.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          GitHub
                        </a>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between text-xs italic text-neutral-700">
                      <span>React.js, Node.js, Express.js, MongoDB, Multilingual UI</span>
                      <span>10 Mar 2025 – 16 Mar 2025 · Team of 4</span>
                    </div>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-neutral-900">
                      <li>Architected an end-to-end MERN agriculture commerce platform with seller and admin management console.</li>
                      <li>Implemented multilingual UI accessibility and real-time product &amp; stock inventory tracking.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span>
                        <strong className="text-black">JeevanMarg</strong> |{' '}
                        <em className="text-neutral-800">Real-Time Emergency Shelter Locator &amp; Bed Manager</em>
                      </span>
                      <span className="text-xs">
                        <a
                          href={HARSH_PROFILE.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          GitHub
                        </a>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between text-xs italic text-neutral-700">
                      <span>React.js, Node.js, Express.js, MongoDB, Admin Console</span>
                      <span>17 Apr 2025 – 21 Apr 2025 · Solo Build</span>
                    </div>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-neutral-900">
                      <li>Built nearest emergency shelter routing with live bed availability tracking and operational admin console.</li>
                      <li>Added multilingual UI support so critical shelter guidance stays accessible under crisis load.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span>
                        <strong className="text-black">Weather-fm</strong> |{' '}
                        <em className="text-neutral-800">Weather-Reactive Music Discovery Engine</em>
                      </span>
                      <span className="text-xs">
                        <a
                          href="https://wheather-fm.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Live Demo
                        </a>{' '}
                        |{' '}
                        <a
                          href={HARSH_PROFILE.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          GitHub
                        </a>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between text-xs italic text-neutral-700">
                      <span>React.js, Weather API, Spotify Links, JavaScript, Responsive CSS</span>
                      <span>24 Oct 2024 – 28 Oct 2024 · Solo Build</span>
                    </div>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-neutral-900">
                      <li>Mapped real-time city weather conditions to curated music recommendations with direct Spotify deep links.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
