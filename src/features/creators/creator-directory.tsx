"use client";

import { startTransition, useDeferredValue, useState } from "react";
import Link from "next/link";

import { GlassPanel } from "@/design-system/glass-panel";
import { CreatorAvatar } from "@/features/creators/creator-avatar";
import { FilterSelect } from "@/features/creators/filter-select";
import type { CreatorDirectoryItem } from "@/features/creators/types";
import { cn } from "@/lib/utils";

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((left, right) =>
    left.localeCompare(right, "pt-BR"),
  );
}

export function CreatorDirectory({ items }: { items: CreatorDirectoryItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [tier, setTier] = useState("all");
  const [project, setProject] = useState("all");
  const deferredSearch = useDeferredValue(search);

  const statuses = uniqueValues(items.map((item) => item.status));
  const tiers = uniqueValues(items.map((item) => item.tierLabel));
  const projects = uniqueValues(items.flatMap((item) => item.projects));

  const visibleItems = items.filter((item) => {
    const normalizedSearch = deferredSearch.trim().toLocaleLowerCase("pt-BR");
    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      item.nickname.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      item.fullName.toLocaleLowerCase("pt-BR").includes(normalizedSearch);

    const matchesStatus = status === "all" || item.status === status;
    const matchesTier = tier === "all" || item.tierLabel === tier;
    const matchesProject = project === "all" || item.projects.includes(project);

    return matchesSearch && matchesStatus && matchesTier && matchesProject;
  });

  const activeCount = items.filter((item) => item.statusTone === "positive").length;
  const statusOptions = [{ value: "all", label: "Todos" }, ...statuses.map((value) => ({ value, label: value }))];
  const tierOptions = [{ value: "all", label: "Todos" }, ...tiers.map((value) => ({ value, label: value }))];
  const projectOptions = [{ value: "all", label: "Todos" }, ...projects.map((value) => ({ value, label: value }))];

  return (
    <div className="dashboard-shell">
      <section className="creator-directory-hero">
        <div>
          <span className="creator-directory-hero__eyebrow">Creator Index</span>
          <h1 className="creator-directory-hero__title">Todos os criadores da base</h1>
          <p className="creator-directory-hero__copy">
            Navegue pelo catálogo, filtre por status e tier e abra o dashboard real de cada
            criador.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <GlassPanel className="creator-metric-card p-4">
            <span className="creator-metric-card__label">Total</span>
            <strong className="creator-metric-card__value">{items.length}</strong>
          </GlassPanel>
          <GlassPanel className="creator-metric-card p-4">
            <span className="creator-metric-card__label">Ativos</span>
            <strong className="creator-metric-card__value">{activeCount}</strong>
          </GlassPanel>
          <GlassPanel className="creator-metric-card p-4">
            <span className="creator-metric-card__label">Filtrados</span>
            <strong className="creator-metric-card__value">{visibleItems.length}</strong>
          </GlassPanel>
        </div>
      </section>

      <GlassPanel className="creator-directory-filters p-4">
        <div className="creator-filter-field creator-filter-field--search">
          <label htmlFor="creator-search" className="creator-filter-field__label">
            Buscar
          </label>
          <input
            id="creator-search"
            className="creator-filter-input"
            type="search"
            placeholder="Nome ou nickname"
            value={search}
            onChange={(event) => {
              const nextValue = event.target.value;
              startTransition(() => setSearch(nextValue));
            }}
          />
        </div>

        <FilterSelect
          label="Status"
          value={status}
          options={statusOptions}
          onChange={(nextValue) => {
            startTransition(() => setStatus(nextValue));
          }}
        />

        <FilterSelect
          label="Tier"
          value={tier}
          options={tierOptions}
          onChange={(nextValue) => {
            startTransition(() => setTier(nextValue));
          }}
        />

        <FilterSelect
          label="Projeto"
          value={project}
          options={projectOptions}
          onChange={(nextValue) => {
            startTransition(() => setProject(nextValue));
          }}
        />
      </GlassPanel>

  // Group visible items by project
  const itemsByProject = visibleItems.reduce((acc, item) => {
    const project = item.projects.length > 0 ? item.projects[0] : "Sem Projeto";
    if (!acc[project]) {
      acc[project] = [];
    }
    acc[project].push(item);
    return acc;
  }, {} as Record<string, CreatorDirectoryItem[]>);

  // Sort groups and inner items
  const sortedProjects = Object.keys(itemsByProject).sort((a, b) => a.localeCompare(b, "pt-BR"));
  sortedProjects.forEach((key) => {
    // Sort primarily by Tier (1 -> 2 -> 3)
    itemsByProject[key].sort((a, b) => (a.tierNum ?? 3) - (b.tierNum ?? 3));
  });

  return (
    <div className="dashboard-shell">
      <section className="creator-directory-hero">
        <div>
          <span className="creator-directory-hero__eyebrow">Creator Index</span>
          <h1 className="creator-directory-hero__title">Todos os criadores da base</h1>
          <p className="creator-directory-hero__copy">
            Navegue pelo catálogo, filtre por status e tier e abra o dashboard real de cada
            criador.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <GlassPanel className="creator-metric-card p-4">
            <span className="creator-metric-card__label">Total</span>
            <strong className="creator-metric-card__value">{items.length}</strong>
          </GlassPanel>
          <GlassPanel className="creator-metric-card p-4">
            <span className="creator-metric-card__label">Ativos</span>
            <strong className="creator-metric-card__value">{activeCount}</strong>
          </GlassPanel>
          <GlassPanel className="creator-metric-card p-4">
            <span className="creator-metric-card__label">Filtrados</span>
            <strong className="creator-metric-card__value">{visibleItems.length}</strong>
          </GlassPanel>
        </div>
      </section>

      <GlassPanel className="creator-directory-filters p-4">
        <div className="creator-filter-field creator-filter-field--search">
          <label htmlFor="creator-search" className="creator-filter-field__label">
            Buscar
          </label>
          <input
            id="creator-search"
            className="creator-filter-input"
            type="search"
            placeholder="Nome ou nickname"
            value={search}
            onChange={(event) => {
              const nextValue = event.target.value;
              startTransition(() => setSearch(nextValue));
            }}
          />
        </div>

        <FilterSelect
          label="Status"
          value={status}
          options={statusOptions}
          onChange={(nextValue) => {
            startTransition(() => setStatus(nextValue));
          }}
        />

        <FilterSelect
          label="Tier"
          value={tier}
          options={tierOptions}
          onChange={(nextValue) => {
            startTransition(() => setTier(nextValue));
          }}
        />

        <FilterSelect
          label="Projeto"
          value={project}
          options={projectOptions}
          onChange={(nextValue) => {
            startTransition(() => setProject(nextValue));
          }}
        />
      </GlassPanel>

      <div className="mt-8 space-y-12">
        {sortedProjects.map((projectGroup) => (
          <div key={projectGroup} className="space-y-4">
            <h2 className="text-xl font-semibold tracking-[-0.04em] text-white flex items-center gap-3 border-b border-white/5 pb-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-indigo-500/20 ring-1 ring-indigo-400/30 text-indigo-300 text-sm font-bold">
                {projectGroup.charAt(0)}
              </span>
              {projectGroup}
              <span className="text-sm font-normal text-white/40 ml-2">({itemsByProject[projectGroup].length} criadores)</span>
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {itemsByProject[projectGroup].map((item) => (
                <Link key={item.id} href={`/criadores/${item.id}`} className="group block">
                  <GlassPanel className="creator-card flex flex-col h-full p-5 transition duration-200 group-hover:-translate-y-1 group-hover:border-white/18 group-hover:bg-white/[0.06] group-focus-visible:-translate-y-1 group-focus-visible:border-white/18">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="creator-card__chip bg-white/[0.08] px-2 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider">
                          Tier {item.tierNum}
                        </span>
                        <div className="flex space-x-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={cn("size-3.5", i < (item.stars || 0) ? "text-yellow-400" : "text-white/20")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                            "inline-flex h-[22px] items-center rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
                            item.status === "Ativo" ? "bg-[rgba(80,156,98,0.24)] text-[rgba(218,255,223,0.9)]" :
                            item.status === "Atenção" ? "bg-[#B47413]/30 text-[#FFE0B2]" :
                            "bg-[rgba(171,94,94,0.24)] text-[rgba(255,224,224,0.86)]"
                          )}>
                          {item.status}
                        </span>
                        <div className="flex size-5 items-center justify-center rounded-full bg-indigo-500/30 ring-1 ring-indigo-400/50" title={projectGroup}>
                          <span className="text-[9px] font-bold text-white">{projectGroup.charAt(0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body: Avatar e Nick */}
                    <div className="flex items-center gap-4 mb-5">
                      <CreatorAvatar
                        name={item.name}
                        initials={item.initials}
                        src={item.avatarUrl}
                        className="size-[56px]"
                        fallbackClassName="text-[18px] font-semibold tracking-[0.1em]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[18px] font-semibold tracking-[-0.04em] text-white">
                          {item.name}
                        </p>
                        <p className="truncate text-[13px] text-white/52">@{item.nickname}</p>
                      </div>
                    </div>

                    {/* Metas no Mês */}
                    {item.goals && (
                      <div className="mb-4 rounded-lg bg-black/20 p-3 ring-1 ring-white/5">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Metas no mês</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-[10px] text-white/50 mb-1">Horas Live</p>
                            <p className="text-[13px] font-semibold text-white">{item.goals.liveHours?.realized ?? "-"} / {item.goals.liveHours?.target ?? "-"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/50 mb-1">Vídeo Longo</p>
                            <p className="text-[13px] font-semibold text-white">{item.goals.longVideos?.delivered ?? "-"} / {item.goals.longVideos?.target ?? "-"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/50 mb-1">Vídeo Curto</p>
                            <p className="text-[13px] font-semibold text-white">{item.goals.shortVideos?.delivered ?? "-"} / {item.goals.shortVideos?.target ?? "-"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Informações no mês */}
                    {item.monthlyInfo && (
                      <div className="mb-4 flex gap-4 border-b border-white/5 pb-4">
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-1">Cliques no Site</p>
                          <p className="text-[12px] text-white">
                            <strong className="font-semibold">{item.monthlyInfo.clicks ?? "-"}</strong> / <span className="text-white/60">{item.monthlyInfo.convertedClicks ?? "-"} cap</span>
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-1">Uso do Cupom</p>
                          <p className="text-[12px] font-semibold text-emerald-400">
                            {item.monthlyInfo.couponUsageReal != null ? `R$ ${item.monthlyInfo.couponUsageReal.toLocaleString("pt-BR")}` : "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Recebíveis */}
                    {item.receivables && (
                      <div className="mb-4 grid grid-cols-3 gap-3 border-b border-white/5 pb-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-1">Valor R$</p>
                          <p className="text-[12px] font-semibold text-white">
                            {item.receivables.amountReal?.current != null ? item.receivables.amountReal.current.toLocaleString("pt-BR") : "-"}
                            <span className="text-[9px] text-white/40 font-normal block">/ {item.receivables.amountReal?.contract != null ? item.receivables.amountReal.contract.toLocaleString("pt-BR") : "-"}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-1">Valor TCC</p>
                          <p className="text-[12px] font-semibold text-white">
                            {item.receivables.amountTCC?.current != null ? item.receivables.amountTCC.current.toLocaleString("pt-BR") : "-"}
                            <span className="text-[9px] text-white/40 font-normal block">/ {item.receivables.amountTCC?.contract != null ? item.receivables.amountTCC.contract.toLocaleString("pt-BR") : "-"}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A6C0CA] mb-1">Cashback TCC</p>
                          <p className="text-[12px] font-semibold text-[#A6C0CA]">
                            {item.receivables.cashbackTCC != null ? item.receivables.cashbackTCC.toLocaleString("pt-BR") : "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Spacer to push remaining items down if card grows */}
                    <div className="mt-auto"></div>

                    {/* Última atividade e Notas */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">Última atividade</p>
                          <p className="text-[11px] text-white/60">{item.lastActivity}</p>
                        </div>
                      </div>

                      {item.notes && item.notes.length > 0 && (
                        <div className="rounded-md bg-yellow-500/10 p-3 ring-1 ring-yellow-500/20">
                          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-500/90">Anotações Relevantes</p>
                          <ul className="list-inside list-disc space-y-1 text-[11px] leading-relaxed text-yellow-100/80">
                            {item.notes.map((note, idx) => <li key={idx}>{note}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                  </GlassPanel>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <GlassPanel className="mt-6 p-8 text-center">
          <p className="text-[18px] font-semibold tracking-[-0.04em] text-white">
            Nenhum criador encontrado
          </p>
          <p className="mt-2 text-[14px] text-white/58">
            Ajuste os filtros ou limpe a busca para ver mais resultados.
          </p>
        </GlassPanel>
      ) : null}
    </div>
  );
}
