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
  const [collapsedProjects, setCollapsedProjects] = useState<Record<string, boolean>>({});
  const deferredSearch = useDeferredValue(search);

  const toggleProject = (project: string) => {
    setCollapsedProjects(prev => ({
      ...prev,
      [project]: !prev[project]
    }));
  };

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
  const PROJECT_ORDER = ["PW A.S.", "PW 1.2.6", "PW 126", "PW 1.8.7", "PW 187", "MU", "L2 Midnight", "L2", "L2M"];
  const PROJECT_ICONS: Record<string, string> = {
    "PW A.S.": "/game-icons/pwas.png",
    "PW 1.2.6": "/game-icons/pw126.png",
    "PW 126": "/game-icons/pw126.png",
    "PW 1.8.7": "/game-icons/pw187.png",
    "PW 187": "/game-icons/pw187.png",
    "MU": "/game-icons/mus21.png",
    "L2 Midnight": "/game-icons/l2m.png",
    "L2M": "/game-icons/l2m.png",
    "L2": "/game-icons/l2m.png",
  };
  
  const sortedProjects = Object.keys(itemsByProject).sort((a, b) => {
    const indexA = PROJECT_ORDER.indexOf(a);
    const indexB = PROJECT_ORDER.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    return a.localeCompare(b, "pt-BR");
  });
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
        {sortedProjects.map((projectGroup) => {
          const isCollapsed = collapsedProjects[projectGroup];
          return (
          <div key={projectGroup} className="space-y-4">
            <button 
              type="button"
              onClick={() => toggleProject(projectGroup)}
              className="w-full group flex items-center justify-between border-b border-white/5 pb-2 text-left"
            >
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-white flex items-center gap-3">
                <div className="flex size-8 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/10 shrink-0 bg-black/20">
                  {PROJECT_ICONS[projectGroup] ? (
                    <img src={PROJECT_ICONS[projectGroup]} alt={projectGroup} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/40 text-sm font-bold">{projectGroup.charAt(0)}</span>
                  )}
                </div>
                {projectGroup}
                <span className="text-sm font-normal text-white/40 ml-2">({itemsByProject[projectGroup].length} criadores)</span>
              </h2>
              <span className={cn("inline-flex items-center justify-center rounded-full bg-white/5 p-1 text-white/40 transition-transform duration-200 group-hover:bg-white/10 group-hover:text-white/80", isCollapsed ? "" : "rotate-180")}>
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {!isCollapsed && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {itemsByProject[projectGroup].map((item) => (
                <Link key={item.id} href={`/criadores/${item.id}`} className="group block">
                  <GlassPanel className="creator-card flex flex-col h-full p-4 !rounded-[16px] transition duration-200 group-hover:-translate-y-1 group-hover:border-white/18 group-hover:bg-white/[0.06] group-focus-visible:-translate-y-1 group-focus-visible:border-white/18">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/8 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="creator-card__chip bg-white/[0.08] px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                          Tier {item.tierNum}
                        </span>
                        <div className="flex space-x-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={cn("size-3", i < (item.stars || 0) ? "text-yellow-400" : "text-white/20")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                            "inline-flex h-[18px] items-center rounded-full px-2 text-[9px] font-semibold uppercase tracking-[0.16em]",
                            item.status === "Ativo" ? "bg-[rgba(80,156,98,0.24)] text-[rgba(218,255,223,0.9)]" :
                            item.status === "Atenção" ? "bg-[#B47413]/30 text-[#FFE0B2]" :
                            "bg-[rgba(171,94,94,0.24)] text-[rgba(255,224,224,0.86)]"
                          )}>
                          {item.status}
                        </span>
                        <div className="flex size-6 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/20 bg-black/40 shrink-0" title={projectGroup}>
                          {PROJECT_ICONS[projectGroup] ? (
                            <img src={PROJECT_ICONS[projectGroup]} alt={projectGroup} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-white/70">{projectGroup.charAt(0)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Body: Avatar e Metas na mesma linha */}
                    <div className="flex items-center gap-4 mb-3 rounded bg-white/[0.015] p-2 ring-1 ring-white/5">
                      {/* Left: Identity */}
                      <div className="flex flex-col items-center justify-center w-[72px] shrink-0">
                        <CreatorAvatar
                          name={item.name}
                          initials={item.initials}
                          src={item.avatarUrl}
                          className="size-[48px] mb-1.5 ring-1 ring-white/10"
                          fallbackClassName="text-[16px] font-semibold tracking-[0.1em]"
                        />
                        <p className="w-full truncate text-[11px] font-semibold tracking-[-0.04em] text-white text-center leading-tight">
                          {item.name}
                        </p>
                        <p className="w-full truncate text-[9px] text-white/52 text-center">@{item.nickname}</p>
                      </div>

                      {/* Right: Goals Bars */}
                      {item.goals ? (
                        <div className="flex-1 flex flex-col justify-center gap-2.5">
                          
                          <div className="flex items-center gap-2">
                            <div title="Horas de Live" className="shrink-0">
                               <svg className="size-3.5 text-red-400 cursor-help" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                               <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((item.goals.liveHours?.realized ?? 0) / (item.goals.liveHours?.target || 1)) * 100)}%` }}></div>
                               </div>
                               <span className="shrink-0 text-[10px] font-semibold text-white leading-none min-w-[34px] text-right">
                                 {item.goals.liveHours?.realized ?? 0}<span className="text-white/40 font-normal">/{item.goals.liveHours?.target || 0}h</span>
                               </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div title="Vídeos Longos" className="shrink-0">
                               <svg className="size-3.5 text-blue-400 cursor-help" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-3.5V17H5V7h2v3.5l5-3.5v10zm7 0h-2V7h2v10z"/></svg>
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                               <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((item.goals.longVideos?.delivered ?? 0) / (item.goals.longVideos?.target || 1)) * 100)}%` }}></div>
                               </div>
                               <span className="shrink-0 text-[10px] font-semibold text-white leading-none min-w-[34px] text-right">
                                 {item.goals.longVideos?.delivered ?? 0}<span className="text-white/40 font-normal">/{item.goals.longVideos?.target || 0}</span>
                               </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div title="Vídeos Curtos" className="shrink-0">
                               <svg className="size-3.5 text-purple-400 cursor-help" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                               <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((item.goals.shortVideos?.delivered ?? 0) / (item.goals.shortVideos?.target || 1)) * 100)}%` }}></div>
                               </div>
                               <span className="shrink-0 text-[10px] font-semibold text-white leading-none min-w-[34px] text-right">
                                 {item.goals.shortVideos?.delivered ?? 0}<span className="text-white/40 font-normal">/{item.goals.shortVideos?.target || 0}</span>
                               </span>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-[10px] text-white/20">Sem metas</div>
                      )}
                    </div>

                    {/* Data Rows */}
                    <div className="flex flex-col gap-2.5">

                      {/* Financial Row */}
                      {item.receivables && (
                      <div className="flex gap-2">
                        <div className="flex-1 rounded bg-white/[0.02] p-2.5 ring-1 ring-white/5 flex flex-col justify-center">
                            <span className="text-[9px] text-white/40 uppercase font-medium tracking-wider mb-1">R$ base</span>
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-[13px] font-bold text-emerald-400 leading-none">
                                {item.receivables?.amountReal?.current != null ? item.receivables.amountReal.current.toLocaleString("pt-BR") : "-"}
                              </span>
                              <span className="text-[9px] text-emerald-400/50 font-normal">/ {item.receivables?.amountReal?.contract != null ? item.receivables.amountReal.contract.toLocaleString("pt-BR") : "-"}</span>
                            </div>
                            <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((item.receivables?.amountReal?.current ?? 0) / (item.receivables?.amountReal?.contract || 1)) * 100)}%` }}></div>
                            </div>
                        </div>
                        <div className="flex-1 rounded bg-white/[0.02] p-2.5 ring-1 ring-white/5 flex flex-col justify-center">
                            <span className="text-[9px] text-white/40 uppercase font-medium tracking-wider mb-1">TCC</span>
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-[13px] font-bold text-amber-400 leading-none">
                                {item.receivables?.amountTCC?.current != null ? item.receivables.amountTCC.current.toLocaleString("pt-BR") : "-"}
                              </span>
                              <span className="text-[9px] text-amber-400/50 font-normal">/ {item.receivables?.amountTCC?.contract != null ? item.receivables.amountTCC.contract.toLocaleString("pt-BR") : "-"}</span>
                            </div>
                            <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                             <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((item.receivables?.amountTCC?.current ?? 0) / (item.receivables?.amountTCC?.contract || 1)) * 100)}%` }}></div>
                            </div>
                        </div>
                      </div>
                      )}
                      
                      {/* Sub-metrics (Clicks, Coupon, Cashback) & Footer */}
                      <div className="flex items-center justify-between mt-1 px-1">
                        <div className="flex items-center gap-3">
                          <div title="Cliques / Cap" className="flex items-center gap-1.5">
                            <svg className="size-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            <span className="text-[11px] font-medium text-white/80">{item.monthlyInfo?.clicks ?? "-"} <span className="text-white/30 font-normal">/ {item.monthlyInfo?.convertedClicks ?? "cap"}</span></span>
                          </div>
                          <div title="Uso do Cupom (R$)" className="flex items-center gap-1.5">
                            <svg className="size-3.5 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                            <span className="text-[11px] font-medium text-emerald-400">{item.monthlyInfo?.couponUsageReal != null ? `R$ ${item.monthlyInfo.couponUsageReal.toLocaleString("pt-BR")}` : "-"}</span>
                          </div>
                          <div title="Cashback TCC" className="flex items-center gap-1.5">
                            <svg className="size-3.5 text-[#A6C0CA]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-[11px] font-medium text-[#A6C0CA]">{item.receivables?.cashbackTCC != null ? item.receivables.cashbackTCC.toLocaleString("pt-BR") : "-"}</span>
                          </div>
                        </div>
                        <div className="text-[9px] text-white/30 truncate max-w-[80px] text-right" title={`Última atividade: ${item.lastActivity}`}>
                            {item.lastActivity}
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                </Link>
              ))}
            </div>
            )}
          </div>
        );
      })}
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
