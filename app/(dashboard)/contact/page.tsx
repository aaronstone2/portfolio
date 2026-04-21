import type { Metadata } from "next"
import { Mail, Phone, Github, MapPin, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in Touch",
  openGraph: {
    title: "Contact | Aaron Stone",
    description: "Get in Touch",
    type: "website",
  },
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "aaron@bubble.graphics",
    href: "mailto:aaron@bubble.graphics",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "857-231-1060",
    href: "tel:+18572311060",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/aaronstone2",
    href: "https://github.com/aaronstone2",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "NYC Metro",
    href: null,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PageHeader path="/contact" />
      <div className="p-4 sm:p-6 md:p-10">
      {/* Content */}
      <section className="mb-8 sm:mb-12 pt-2 md:pt-0">
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
          Currently exploring opportunities in NYC fintech and tech. Open to Solutions Engineer, Presales, PM, TPM, and SWE roles.
        </p>
      </section>

      {/* Contact Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-12">
        {contactInfo.map((item) => {
          const Wrapper = item.href ? "a" : "div"
          const wrapperProps = item.href
            ? {
                href: item.href,
                target: item.href.startsWith("http") ? "_blank" as const : undefined,
                rel: item.href.startsWith("http") ? "noopener noreferrer" : undefined,
              }
            : {}

          return (
            <Wrapper
              key={item.label}
              {...wrapperProps}
              className={`group rounded-xl bg-card p-6 border border-white/10 transition-all duration-300 ${
                item.href ? "hover:scale-[1.08] active:scale-[1.15] cursor-pointer hover:border-white/25" : ""
              }`}
            >
              <div className="inline-flex rounded-lg bg-white/5 p-3 mb-4">
                <item.icon className="h-6 w-6 text-white" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.3))' }} />
              </div>

              <div className="text-sm font-mono text-slate-500 mb-1">
                {item.label}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{item.value}</span>
                {item.href && (
                  <ExternalLink className="h-4 w-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
            </Wrapper>
          )
        })}
      </div>

      {/* Get in Touch Section */}
      <section className="max-w-xl">
        <div className="rounded-xl border border-white/10 bg-card p-5 sm:p-8">
          <h2 className="text-lg font-semibold mb-4 text-white">
            <span style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>//</span> Get in Touch
          </h2>

          <p className="text-slate-400 mb-6">
            The best way to reach me is via email. I typically respond within 24 hours.
          </p>

          <a
            href="mailto:aaron@bubble.graphics"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-black bg-white transition-all duration-300 hover:scale-110 active:scale-[1.2]"
            style={{ boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
          >
            <Mail className="h-4 w-4" />
            Send Email
          </a>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-sm font-mono text-slate-500 mb-3">
              Connect on other platforms:
            </h3>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/in/aaron-stone-2b6994141"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 p-3 transition-all duration-300 hover:scale-110 hover:border-white/25"
              >
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a
                href="https://github.com/aaronstone2"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 p-3 transition-all duration-300 hover:scale-110 hover:border-white/25"
              >
                <Github className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}
