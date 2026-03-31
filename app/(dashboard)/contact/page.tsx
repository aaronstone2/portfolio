import { Mail, Phone, Github, MapPin, ExternalLink } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "aaron@bubble.graphics",
    href: "mailto:aaron@bubble.graphics",
    color: "blue" as const,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "857-231-1060",
    href: "tel:857-231-1060",
    color: "purple" as const,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/aaronstone2",
    href: "https://github.com/aaronstone2",
    color: "cyan" as const,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "New York City",
    href: null,
    color: "blue" as const,
  },
]

const colorClasses = {
  blue: {
    border: "neon-border-blue",
    text: "neon-text-blue",
    bg: "bg-primary/10",
    icon: "text-primary",
  },
  purple: {
    border: "neon-border-purple",
    text: "neon-text-purple",
    bg: "bg-secondary/10",
    icon: "text-secondary",
  },
  cyan: {
    border: "neon-border-cyan",
    text: "neon-text-cyan",
    bg: "bg-accent/10",
    icon: "text-accent",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <section className="mb-12 pt-12 md:pt-0">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-mono text-muted-foreground">
            Let&apos;s Connect
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          <span className="neon-text-cyan">Contact</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl">
          I&apos;m currently exploring opportunities in NYC fintech and tech sectors.
          Feel free to reach out for collaborations, opportunities, or just to
          say hello.
        </p>
      </section>

      {/* Contact Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {contactInfo.map((item) => {
          const colors = colorClasses[item.color]
          const Wrapper = item.href ? "a" : "div"
          const wrapperProps = item.href
            ? {
                href: item.href,
                target: item.href.startsWith("http") ? "_blank" : undefined,
                rel: item.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined,
              }
            : {}

          return (
            <Wrapper
              key={item.label}
              {...wrapperProps}
              className={`group rounded-xl bg-card p-6 transition-all duration-300 ${
                item.href ? "hover:scale-[1.02] cursor-pointer" : ""
              } ${colors.border}`}
            >
              <div
                className={`inline-flex rounded-lg ${colors.bg} p-3 mb-4`}
              >
                <item.icon className={`h-6 w-6 ${colors.icon}`} />
              </div>

              <div className="text-sm font-mono text-muted-foreground mb-1">
                {item.label}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">{item.value}</span>
                {item.href && (
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
            </Wrapper>
          )
        })}
      </div>

      {/* Get in Touch Section */}
      <section className="max-w-xl">
        <div className="rounded-xl border border-border bg-card p-8">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            <span className="neon-text-purple">//</span> Get in Touch
          </h2>

          <p className="text-muted-foreground mb-6">
            The best way to reach me is via email. I typically respond within
            24-48 hours.
          </p>

          <a
            href="mailto:aaron@bubble.graphics"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-105 neon-glow-blue"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </a>

          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-mono text-muted-foreground mb-3">
              Connect on other platforms:
            </h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/aaronstone2"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-card border border-border p-3 transition-colors hover:bg-muted hover:border-primary/30"
              >
                <Github className="h-5 w-5 text-foreground" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="mt-12 text-center">
        <p className="text-sm text-muted-foreground font-mono">
          <span className="neon-text-cyan">{">"}</span> Built with Next.js,
          Tailwind CSS, and a lot of{" "}
          <span className="neon-text-purple">caffeine</span>{" "}
          <span className="neon-text-cyan">{"<"}</span>
        </p>
      </section>
    </div>
  )
}
