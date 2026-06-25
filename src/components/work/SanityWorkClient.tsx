"use client"

import {useMemo, useState} from "react"

type AnyRecord = Record<string, any>

type SanityWorkClientProps = {
  projects?: AnyRecord[]
  categories?: AnyRecord[]
}

function text(value: unknown, fallback = "") {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return fallback
}

function slugValue(value: any) {
  if (!value) return ""
  if (typeof value === "string") return value.trim()
  if (typeof value.current === "string") return value.current.trim()
  return ""
}

function normalize(value: unknown) {
  return text(value).replace(/\s+/g, " ").trim().toLowerCase()
}

function toKey(value: unknown) {
  return normalize(value)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\u0600-\u06ff]+/gi, "-")
    .replace(/^-|-$/g, "")
}

function getCategoryLabel(project: AnyRecord) {
  const category = project?.category || {}

  return (
    text(category?.titleEn) ||
    text(category?.titleFa) ||
    text(project?.type) ||
    "Creative Study"
  )
}

function getCategoryKey(project: AnyRecord) {
  const category = project?.category || {}

  return (
    slugValue(category?.slug) ||
    toKey(category?.titleEn) ||
    toKey(category?.titleFa) ||
    toKey(project?.type) ||
    "uncategorized"
  )
}

function getProjectSlug(project: AnyRecord) {
  return (
    slugValue(project?.slug) ||
    toKey(project?.titleEn) ||
    toKey(project?.titleFa)
  )
}

function getImageUrl(project: AnyRecord) {
  return (
    text(project?.coverImage?.asset?.url) ||
    text(project?.coverImage?.url) ||
    text(project?.gallery?.[0]?.asset?.url) ||
    text(project?.gallery?.[0]?.url) ||
    ""
  )
}

function getTools(project: AnyRecord) {
  if (Array.isArray(project?.tools)) {
    return project.tools.map((item: unknown) => text(item)).filter(Boolean).slice(0, 4)
  }

  if (Array.isArray(project?.deliverables)) {
    return project.deliverables.map((item: unknown) => text(item)).filter(Boolean).slice(0, 4)
  }

  return ["Photoshop", "Illustrator", "InDesign"]
}

function buildFilters(projects: AnyRecord[], categories: AnyRecord[]) {
  const result: {key: string; label: string}[] = [{key: "all", label: "All"}]
  const seen = new Set(["all"])

  categories.forEach((category) => {
    const key =
      slugValue(category?.slug) ||
      toKey(category?.titleEn) ||
      toKey(category?.titleFa)

    const label =
      text(category?.titleEn) ||
      text(category?.titleFa) ||
      key

    if (!key || !label || seen.has(key)) return

    seen.add(key)
    result.push({key, label})
  })

  projects.forEach((project) => {
    const key = getCategoryKey(project)
    const label = getCategoryLabel(project)

    if (!key || !label || seen.has(key)) return

    seen.add(key)
    result.push({key, label})
  })

  return result
}

export default function SanityWorkClient({
  projects = [],
  categories = [],
}: SanityWorkClientProps) {
  const safeProjects = Array.isArray(projects) ? projects : []
  const safeCategories = Array.isArray(categories) ? categories : []

  const filters = useMemo(
    () => buildFilters(safeProjects, safeCategories),
    [safeProjects, safeCategories],
  )

  const [activeFilter, setActiveFilter] = useState("all")
  const [motionKey, setMotionKey] = useState(0)

  const visibleProjects = useMemo(() => {
    if (activeFilter === "all") return safeProjects

    return safeProjects.filter((project) => getCategoryKey(project) === activeFilter)
  }, [activeFilter, safeProjects])

  const selectFilter = (key: string) => {
    if (key === activeFilter) return

    setActiveFilter(key)
    setMotionKey((current) => current + 1)
  }

  return (
    <section className="work-page">
      <div className="work-hero">
        <p className="work-eyebrow">Canvas</p>
        <h1>Visual archive</h1>
        <div className="work-title-line" />
        <p className="work-intro">
          A curated archive of visual experiments, AI artworks, thumbnails, banners, and creative studies.
        </p>
      </div>

      <div className="work-filter-cloud" aria-label="Project filters">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={filter.key === activeFilter ? "work-filter-chip is-active" : "work-filter-chip"}
            onClick={() => selectFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleProjects.length > 0 ? (
        <div key={motionKey} className="work-grid">
          {visibleProjects.map((project, index) => {
            const title = text(project?.titleEn) || text(project?.titleFa) || "Untitled Project"
            const category = getCategoryLabel(project)
            const description =
              text(project?.shortDescriptionEn) ||
              text(project?.shortDescriptionFa) ||
              text(project?.overviewEn) ||
              text(project?.overviewFa) ||
              "A refined visual project crafted with a premium design direction."

            const imageUrl = getImageUrl(project)
            const tools = getTools(project)
            const slug = getProjectSlug(project)
            const href = slug ? `/work/${slug}` : "/work"

            return (
              <a
                key={`${project?._id || slug || title}-${motionKey}-${index}`}
                href={href}
                className="work-card"
                style={{"--work-card-index": index} as React.CSSProperties}
              >
                <div className="work-card-media">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={text(project?.coverImage?.altEn) || text(project?.coverImage?.altFa) || title}
                      loading={index < 3 ? "eager" : "lazy"}
                      draggable={false}
                    />
                  ) : (
                    <div className="work-card-placeholder" aria-hidden="true" />
                  )}
                </div>

                <div className="work-card-body">
                  <p className="work-card-kicker">{category}</p>
                  <h2>{title}</h2>
                  <p className="work-card-type">Case Study</p>
                  <p className="work-card-description">{description}</p>

                  <div className="work-card-tools">
                    {tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      ) : (
        <div className="work-empty">
          <p>No projects are available in this category yet.</p>
        </div>
      )}

      <style jsx global>{`
        .work-cinematic-shell {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          background: #030303;
          color: #f7efe3;
        }

        .work-cinematic-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.95;
        }

        .work-cinematic-vignette {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 12%, transparent 0, rgba(0, 0, 0, 0.18) 38%, rgba(0, 0, 0, 0.78) 100%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.72));
        }

        .work-cinematic-content {
          position: relative;
          z-index: 3;
          min-height: 100svh;
        }

        .work-page {
          width: 100%;
          min-height: 100svh;
          padding: 138px 24px 110px;
        }

        .work-hero {
          width: min(100%, 1080px);
          margin: 0 auto 32px;
          text-align: center;
        }

        .work-eyebrow {
          margin: 0 0 18px;
          color: rgba(245, 239, 230, 0.58);
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.42em;
          text-transform: uppercase;
        }

        .work-hero h1 {
          margin: 0;
          color: rgba(255, 250, 241, 0.98);
          font-size: clamp(76px, 10vw, 146px);
          font-weight: 950;
          line-height: 0.82;
          letter-spacing: -0.09em;
          text-transform: none;
        }

        .work-title-line {
          width: 74px;
          height: 1px;
          margin: 30px auto 28px;
          background: linear-gradient(90deg, transparent, rgba(215, 176, 106, 0.9), transparent);
        }

        .work-intro {
          width: min(100%, 760px);
          margin: 0 auto;
          color: rgba(245, 239, 230, 0.62);
          font-size: 15px;
          font-weight: 650;
          line-height: 1.8;
        }

        .work-filter-cloud {
          width: min(100%, 1040px);
          min-height: 92px;
          margin: 0 auto 48px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          align-content: center;
          gap: 12px 10px;
        }

        .work-filter-chip {
          position: relative;
          height: 38px;
          min-height: 38px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1px solid rgba(215, 176, 106, 0.24);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.034), rgba(255, 255, 255, 0.012));
          color: rgba(245, 239, 230, 0.74);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transform: translate3d(0, 0, 0) scale(1);
          backface-visibility: hidden;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 16px 45px rgba(0, 0, 0, 0.18);
          transition:
            transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 200ms cubic-bezier(0.22, 1, 0.36, 1),
            background 200ms cubic-bezier(0.22, 1, 0.36, 1),
            color 170ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .work-filter-chip::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 236, 198, 0.15), rgba(215, 176, 106, 0.055) 28%, transparent 66%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.008));
          transition: opacity 190ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .work-filter-chip:hover {
          transform: translate3d(0, -1px, 0) scale(1.006);
          border-color: rgba(215, 176, 106, 0.46);
          color: #f7e1ac;
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.2),
            0 0 16px rgba(215, 176, 106, 0.036),
            inset 0 1px 0 rgba(255, 255, 255, 0.058);
        }

        .work-filter-chip:hover::before,
        .work-filter-chip.is-active::before {
          opacity: 1;
        }

        .work-filter-chip.is-active {
          border-color: rgba(215, 176, 106, 0.52);
          color: rgba(255, 238, 204, 0.98);
          background:
            linear-gradient(180deg, rgba(215, 176, 106, 0.17), rgba(215, 176, 106, 0.048));
          box-shadow:
            0 10px 28px rgba(0, 0, 0, 0.22),
            0 0 22px rgba(215, 176, 106, 0.045),
            inset 0 1px 0 rgba(255, 255, 255, 0.075);
        }

        .work-grid {
          width: min(100%, 1180px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          perspective: 1200px;
        }

        .work-card {
          --work-card-index: 0;
          position: relative;
          min-height: 490px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 26px;
          border: 1px solid rgba(215, 176, 106, 0.17);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.014)),
            rgba(9, 9, 10, 0.62);
          color: inherit;
          text-decoration: none;
          isolation: isolate;
          opacity: 0;
          filter: blur(7px);
          transform: translate3d(0, 26px, 0) scale(0.974);
          backface-visibility: hidden;
          animation:
            workCardEnter 720ms cubic-bezier(0.16, 1, 0.3, 1)
            calc(var(--work-card-index) * 72ms)
            both;
          box-shadow:
            0 26px 78px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.052);
          transition:
            transform 460ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 280ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity, filter;
        }

        .work-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0;
          background:
            radial-gradient(circle at 50% 12%, rgba(255, 236, 198, 0.14), rgba(215, 176, 106, 0.052) 24%, transparent 58%);
          transition: opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .work-card:hover {
          transform: translate3d(0, -7px, 0) scale(1.007);
          border-color: rgba(215, 176, 106, 0.38);
          box-shadow:
            0 34px 88px rgba(0, 0, 0, 0.5),
            0 0 38px rgba(215, 176, 106, 0.06),
            0 0 0 1px rgba(215, 176, 106, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }

        .work-card:hover::before {
          opacity: 1;
        }

        .work-card-media {
          position: relative;
          height: 270px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 0%, rgba(215, 176, 106, 0.14), transparent 62%),
            rgba(255, 255, 255, 0.035);
        }

        .work-card-media img,
        .work-card-placeholder {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transform: translate3d(0, 0, 0) scale(1.018);
          filter: saturate(0.98) brightness(0.78) contrast(1.08);
          transition: transform 560ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        .work-card:hover .work-card-media img,
        .work-card:hover .work-card-placeholder {
          transform: translate3d(0, 0, 0) scale(1.05);
        }

        .work-card-placeholder {
          background:
            radial-gradient(circle at 45% 20%, rgba(215, 176, 106, 0.24), transparent 38%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
        }

        .work-card-body {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 22px 22px 24px;
        }

        .work-card-kicker {
          margin: 0 0 11px;
          color: rgba(215, 176, 106, 0.92);
          font-size: 11px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .work-card h2 {
          margin: 0;
          color: rgba(255, 246, 229, 0.96);
          font-size: clamp(25px, 2vw, 34px);
          font-weight: 950;
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .work-card-type {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .work-card-description {
          margin: 17px 0 20px;
          color: rgba(245, 239, 230, 0.68);
          font-size: 14px;
          line-height: 1.72;
        }

        .work-card-tools {
          margin-top: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .work-card-tools span {
          height: 29px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(245, 239, 230, 0.66);
          font-size: 10px;
          font-weight: 780;
          letter-spacing: 0.015em;
        }

        .work-empty {
          width: min(100%, 960px);
          margin: 0 auto;
          min-height: 260px;
          display: grid;
          place-items: center;
          border-radius: 30px;
          border: 1px solid rgba(215, 176, 106, 0.14);
          background: rgba(255, 255, 255, 0.028);
          color: rgba(245, 239, 230, 0.64);
        }

        @keyframes workCardEnter {
          0% {
            opacity: 0;
            filter: blur(7px);
            transform: translate3d(0, 26px, 0) scale(0.974);
          }

          56% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            filter: none;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @media (max-width: 1080px) {
          .work-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            width: min(100%, 820px);
          }
        }

        @media (max-width: 720px) {
          .work-page {
            padding: 116px 18px 80px;
          }

          .work-hero h1 {
            font-size: clamp(58px, 17vw, 86px);
          }

          .work-filter-cloud {
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            min-height: 56px;
            padding-bottom: 10px;
            margin-bottom: 32px;
          }

          .work-filter-chip {
            flex: 0 0 auto;
          }

          .work-grid {
            grid-template-columns: 1fr;
            width: min(100%, 370px);
            gap: 20px;
          }

          .work-card {
            min-height: 470px;
            border-radius: 24px;
          }

          .work-card-media {
            height: 248px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .work-card,
          .work-card-media img,
          .work-filter-chip {
            animation: none !important;
            transition: none !important;
          }

          .work-card {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}