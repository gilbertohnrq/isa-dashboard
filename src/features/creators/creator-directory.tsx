"use client";

import type { ReactElement } from "react";
import { startTransition, useEffect, useDeferredValue, useState } from "react";
import { Link } from "next-view-transitions";
import {
  CalendarDays,
  Clock3,
  Menu,
  Search,
} from "lucide-react";

import { CreatorAvatar } from "@/features/creators/creator-avatar";
import { FilterSelect } from "@/features/creators/filter-select";
import type { CreatorDirectoryItem } from "@/features/creators/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PROJECT_ICONS: Record<string, string> = {
  "PW A.S.": "/game-icons/pwas.png",
  "PW 1.2.6": "/game-icons/pw126.png",
  "PW 126": "/game-icons/pw126.png",
  "PW 1.8.7": "/game-icons/pw187.png",
  "PW 187": "/game-icons/pw187.png",
  MU: "/game-icons/mus21.png",
  "L2 Midnight": "/game-icons/l2m.png",
  L2M: "/game-icons/l2m.png",
  L2: "/game-icons/l2m.png",
};

type GoalKey = "liveHours" | "longVideos" | "shortVideos";

function CameraGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <rect x="4.5" y="7.5" width="10" height="9" rx="2" strokeWidth="2" />
      <path
        d="M14.5 10.2 19 7.8v8.4l-4.5-2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function BagGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path
        d="M7.2 9.2h9.6l-.9 8.6H8.1l-.9-8.6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9.3 9.2V8a2.7 2.7 0 0 1 5.4 0v1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PillGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="9" y="4.5" width="6" height="15" rx="1.8" />
    </svg>
  );
}

function EyeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DiamondGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2 2 9l10 13 10-13-10-7Z" />
    </svg>
  );
}

const goalConfig: Record<
  GoalKey,
  {
    label: string;
    icon: ({ className }: { className?: string }) => ReactElement;
    colorClassName: string;
    currentColorClassName: string;
    suffix?: string;
  }
> = {
  liveHours: {
    label: "Live",
    icon: CameraGlyph,
    colorClassName: "creator-card-progress__icon--ruby",
    currentColorClassName: "creator-card-progress__current--ruby",
    suffix: "h",
  },
  longVideos: {
    label: "Longos",
    icon: BagGlyph,
    colorClassName: "creator-card-progress__icon--lime",
    currentColorClassName: "creator-card-progress__current--lime",
  },
  shortVideos: {
    label: "Curtos",
    icon: PillGlyph,
    colorClassName: "creator-card-progress__icon--rose",
    currentColorClassName: "creator-card-progress__current--rose",
  },
};

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((left, right) =>
    left.localeCompare(right, "pt-BR"),
  );
}

function getProjectIcon(projects: string[]) {
  const project = projects[0];
  return project ? PROJECT_ICONS[project] ?? null : null;
}

function getProgress(realized: number | null | undefined, target: number | null | undefined) {
  if (realized == null || target == null || target <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (realized / target) * 100));
}

function getAverageGoalProgress(item: CreatorDirectoryItem) {
  if (!item.goals) {
    return 0;
  }

  const values = [
    getProgress(item.goals.liveHours?.realized, item.goals.liveHours?.target),
    getProgress(item.goals.longVideos?.delivered, item.goals.longVideos?.target),
    getProgress(item.goals.shortVideos?.delivered, item.goals.shortVideos?.target),
  ].filter((value) => value > 0);

  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function getHeartTone(progress: number) {
  if (progress >= 90) {
    return "creator-card-hearts--green";
  }

  if (progress >= 60) {
    return "creator-card-hearts--amber";
  }

  return "creator-card-hearts--red";
}

function formatCompactMetric(value: number | null | undefined) {
  if (value == null) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

function formatCurrencyStat(value: number | null | undefined) {
  if (value == null) {
    return "-";
  }

  return `R$ ${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)}`;
}

function formatRatio(
  current: number | null | undefined,
  target: number | null | undefined,
  suffix = "",
) {
  const currentValue = current ?? 0;
  const targetValue = target ?? 0;
  const currentLabel = formatCompactMetric(currentValue);
  const targetLabel = formatCompactMetric(targetValue);

  return `${currentLabel}${suffix} / ${targetLabel}${suffix}`;
}

function formatDateChip(date: Date) {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.replace(/ de ([a-zà-ú])/u, (_, letter: string) => ` de ${letter.toUpperCase()}`);
}

function formatTimeChip(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getStatusToneClass(status: string) {
  if (status === "Ativo") {
    return "creator-card-status--positive";
  }

  if (status === "Atenção") {
    return "creator-card-status--warning";
  }

  return "creator-card-status--negative";
}

function CreatorCard({ item }: { item: CreatorDirectoryItem }) {
  const averageGoalProgress = getAverageGoalProgress(item);
  const heartToneClassName = getHeartTone(averageGoalProgress);
  const projectName = item.projects[0] ?? "Sem projeto";
  const projectIcon = getProjectIcon(item.projects);
  const tierLabel = (item.tierNum ?? item.tierLabel.replace(/\D+/g, "")) || "-";

  const financialProgress = {
    real: getProgress(item.receivables?.amountReal?.current, item.receivables?.amountReal?.contract),
    tcc: getProgress(item.receivables?.amountTCC?.current, item.receivables?.amountTCC?.contract),
  };

  return (
    <Link href={`/criadores/${item.id}`} className="creator-card-link group">
      <article className="creator-card-v2">
        <div className="creator-card-v2__glow" />
        <div className="creator-card-v2__topbar">
          <span className="creator-chip creator-chip--tier">
            Tier {tierLabel}
          </span>

          <div className={cn("creator-card-hearts", heartToneClassName)} aria-label={`Avaliação ${item.stars} de 5`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <HeartIcon key={index} active={index < item.stars} />
            ))}
          </div>

          <div className="creator-card-v2__topbar-spacer" />

          <span className={cn("creator-chip creator-chip--status", getStatusToneClass(item.status))}>
            {item.status}
          </span>

          <span className="creator-project-badge" title={projectName}>
            {projectIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={projectIcon} alt={projectName} />
            ) : (
              <span>{projectName.charAt(0)}</span>
            )}
          </span>
        </div>

        <div className="creator-card-v2__body">
          <div className="creator-card-v2__identity">
            <CreatorAvatar
              name={item.name}
              initials={item.initials}
              src={item.avatarUrl}
              className="creator-card-v2__avatar"
              fallbackClassName="text-[13px] font-semibold tracking-[0.08em]"
              viewTransitionName={`avatar-${item.id}`}
            />

            <div className="creator-card-v2__identity-copy">
              <span className="creator-card-v2__name">{item.name}</span>
              <span className="creator-card-v2__id">{item.id}</span>
            </div>
          </div>

          <div className="creator-card-v2__progress-list">
            {(Object.keys(goalConfig) as GoalKey[]).map((goalKey) => {
              const config = goalConfig[goalKey];
              const goal =
                goalKey === "liveHours"
                  ? item.goals?.liveHours
                  : goalKey === "longVideos"
                    ? item.goals?.longVideos
                    : item.goals?.shortVideos;
              const realized =
                goalKey === "liveHours"
                  ? item.goals?.liveHours?.realized
                  : goalKey === "longVideos"
                    ? item.goals?.longVideos?.delivered
                    : item.goals?.shortVideos?.delivered;
              const target = goal?.target;
              const progress = getProgress(realized, target);
              const Icon = config.icon;

              const currentLabel = formatCompactMetric(realized ?? 0);
              const targetLabel = formatCompactMetric(target ?? 0);
              const suffix = config.suffix ?? "";

              return (
                <div key={goalKey} className="creator-card-progress">
                  <span className={cn("creator-card-progress__icon", config.colorClassName)}>
                    <Icon className="size-3" />
                  </span>
                  <div className="creator-card-progress__track">
                    <span className="creator-card-progress__bar" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="creator-card-progress__value">
                    <span className={cn("creator-card-progress__value-current", config.currentColorClassName)}>{currentLabel}{suffix}</span>
                    <span className="creator-card-progress__value-target"> / {targetLabel}{suffix}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="creator-card-v2__finance">
          <div className="creator-finance-item">
            <div className="creator-finance-item__header">
              <span className="creator-finance-item__label">R$</span>
              <span className="creator-finance-item__ratio">
                <span className="creator-finance-item__current creator-finance-item__current--green">{formatCompactMetric(item.receivables?.amountReal?.current)}</span>
                <span className="creator-finance-item__target creator-finance-item__target--green"> / {formatCompactMetric(item.receivables?.amountReal?.contract)}</span>
              </span>
            </div>
            <div className="creator-finance-item__track creator-finance-item__track--green">
              <span className="creator-finance-item__bar creator-finance-item__bar--green" style={{ width: `${financialProgress.real}%` }} />
            </div>
          </div>

          <div className="creator-finance-item">
            <div className="creator-finance-item__header">
              <span className="creator-finance-item__label">TCC</span>
              <span className="creator-finance-item__ratio">
                <span className="creator-finance-item__current creator-finance-item__current--amber">{formatCompactMetric(item.receivables?.amountTCC?.current)}</span>
                <span className="creator-finance-item__target creator-finance-item__target--amber"> / {formatCompactMetric(item.receivables?.amountTCC?.contract)}</span>
              </span>
            </div>
            <div className="creator-finance-item__track creator-finance-item__track--amber">
              <span className="creator-finance-item__bar creator-finance-item__bar--amber" style={{ width: `${financialProgress.tcc}%` }} />
            </div>
          </div>
        </div>

        <div className="creator-card-v2__footer">
          <span className="creator-card-v2__metric">
            <EyeGlyph className="creator-card-v2__metric-icon" />
            {formatCompactMetric(item.monthlyInfo?.clicks)} / {formatCompactMetric(item.monthlyInfo?.convertedClicks)}
          </span>
          <span className="creator-card-v2__metric creator-card-v2__metric--positive">
            <DiamondGlyph className="creator-card-v2__metric-icon" />
            R$ {formatCompactMetric(item.monthlyInfo?.couponUsageReal)}
          </span>
          <span className="creator-card-v2__metric creator-card-v2__metric--muted">
            <DiamondGlyph className="creator-card-v2__metric-icon" />
            {formatCurrencyStat(item.receivables?.cashbackTCC)}
          </span>
          <span className="creator-card-v2__metric creator-card-v2__metric--time">{item.lastActivity}</span>
        </div>
      </article>
    </Link>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("creator-card-hearts__icon", active && "creator-card-hearts__icon--active")}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.24 2 5.09 4.42 2.7 7.5 2.7c1.74 0 3.41.81 4.5 2.08 1.09-1.27 2.76-2.08 4.5-2.08 3.08 0 5.5 2.39 5.5 5.54 0 3.85-3.4 7-8.55 11.77L12 21.35Z" />
    </svg>
  );
}

export function CreatorDirectory({ items }: { items: CreatorDirectoryItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [tier, setTier] = useState("all");
  const [project, setProject] = useState("all");
  const [snapshotNow, setSnapshotNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setSnapshotNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const deferredSearch = useDeferredValue(search);

  const statuses = uniqueValues(items.map((item) => item.status));
  const tiers = uniqueValues(items.map((item) => item.tierLabel));
  const projects = uniqueValues(items.flatMap((item) => item.projects));

  const statusOptions = [{ value: "all", label: "Todos" }, ...statuses.map((value) => ({ value, label: value }))];
  const tierOptions = [{ value: "all", label: "Todos" }, ...tiers.map((value) => ({ value, label: value }))];
  const projectOptions = [{ value: "all", label: "Todos" }, ...projects.map((value) => ({ value, label: value }))];

  const visibleItems = items.filter((item) => {
    const normalizedSearch = deferredSearch.trim().toLocaleLowerCase("pt-BR");
    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      item.nickname.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      item.fullName.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      item.id.toLocaleLowerCase("pt-BR").includes(normalizedSearch);

    const matchesStatus = status === "all" || item.status === status;
    const matchesTier = tier === "all" || item.tierLabel === tier;
    const matchesProject = project === "all" || item.projects.includes(project);

    return matchesSearch && matchesStatus && matchesTier && matchesProject;
  });

  return (
    <section className="creator-directory-page">
      <header className="creator-toolbar" aria-label="Filtros de creators">
        <div className="creator-toolbar__menu" aria-hidden="true">
          <Menu className="size-5" />
        </div>

        <FilterSelect label="Status" value={status} options={statusOptions} onChange={setStatus} />
        <FilterSelect label="Tier" value={tier} options={tierOptions} onChange={setTier} />
        <FilterSelect
          label="Projeto"
          value={project}
          options={projectOptions}
          onChange={setProject}
          gameIcons={PROJECT_ICONS}
        />

        <div className="creator-toolbar__search">
          <Search className="creator-toolbar__search-icon size-4" />
          <Input
            aria-label="Buscar"
            className="creator-toolbar__search-input"
            placeholder="Nome ou The Classic ID"
            value={search}
            onChange={(event) => startTransition(() => setSearch(event.target.value))}
          />
        </div>

        <div className="creator-toolbar__datetime">
          <span className="creator-toolbar__datetime-chip">
            <CalendarDays className="size-3.5" />
            {formatDateChip(snapshotNow)}
          </span>
          <span className="creator-toolbar__datetime-chip creator-toolbar__datetime-chip--compact">
            <Clock3 className="size-3.5" />
            {formatTimeChip(snapshotNow)}
          </span>
        </div>

        <div className="creator-toolbar__brand" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma-assets/logo-game.png" alt="" />
        </div>
      </header>

      {visibleItems.length > 0 ? (
        <div className="creator-grid" role="list" aria-label="Lista de creators">
          {visibleItems.map((item) => (
            <div key={item.id} role="listitem">
              <CreatorCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="creator-empty-state">
          <span className="creator-empty-state__title">Nenhum creator encontrado</span>
          <span className="creator-empty-state__copy">Ajuste os filtros ou limpe a busca para ver mais resultados.</span>
        </div>
      )}
    </section>
  );
}
