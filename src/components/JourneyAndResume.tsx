import { Download, ExternalLink, FileText, GraduationCap, MapPin } from 'lucide-react';
import { EDUCATION_DATA, HARSH_PROFILE } from '../data/portfolioData';

interface JourneyAndResumeProps {
  onOpenResume: () => void;
}

export function JourneyAndResume({ onOpenResume }: JourneyAndResumeProps) {
  return (
    <section id="journey" className="section-cv relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1440px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs text-emerald-300">Academic &amp; Engineering Journey</p>
            <h2 className="font-hero mt-2 text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl">
              From Gwalior classrooms to{' '}
              <span className="font-editorial shimmer-text text-4xl font-normal italic sm:text-5xl">
                production
              </span>{' '}
              shipping.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-emerald-300/45 hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              View Resume
            </button>

            <a
              href={HARSH_PROFILE.resumePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-sky-300/45 hover:text-white whitespace-nowrap shrink-0"
            >
              <ExternalLink className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
              Open Tab
            </a>

            <a
              href={HARSH_PROFILE.resumePdfUrl}
              download="Harsh_Bhadoria_Resume.pdf"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-3.5 py-2.5 text-xs font-bold text-slate-950 transition-opacity hover:opacity-95 whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download PDF
            </a>
          </div>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {EDUCATION_DATA.map((item) => (
            <li
              key={item.id}
              className="glass-surface glass-surface-hover sheen-card flex flex-col justify-between rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between gap-2 font-mono text-xs text-sky-300">
                  <span>{item.period}</span>
                  <GraduationCap className="h-4 w-4 text-slate-400" aria-hidden="true" />
                </div>

                <h3 className="font-display mt-4 text-xl font-bold text-white">
                  {item.institution}
                </h3>
                <p className="mt-1 text-sm font-medium text-amber-300/90">{item.degree}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.detail}</p>
              </div>

              <p className="mt-6 flex items-center gap-1.5 border-t border-white/10 pt-4 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {item.location}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
