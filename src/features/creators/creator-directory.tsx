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

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {visibleItems.map((item) => (
          <Link key={item.id} href={`/criadores/${item.id}`} className="group block">
            <GlassPanel className="creator-card h-full p-5 transition duration-200 group-hover:-translate-y-1 group-hover:border-white/18 group-hover:bg-white/[0.06] group-focus-visible:-translate-y-1 group-focus-visible:border-white/18">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CreatorAvatar
                    name={item.name}
                    initials={item.initials}
                    src={item.avatarUrl}
                    className="size-[68px]"
                    fallbackClassName="text-[22px] font-semibold tracking-[0.1em]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[18px] font-semibold tracking-[-0.04em] text-white">
                      {item.name}
                    </p>
                    <p className="truncate text-[13px] text-white/52">@{item.nickname}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex h-[30px] items-center rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.16em]",
                    item.statusTone === "positive"
                      ? "bg-[rgba(80,156,98,0.24)] text-[rgba(218,255,223,0.9)]"
                      : "bg-[rgba(171,94,94,0.24)] text-[rgba(255,224,224,0.86)]",
                  )}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <span className="dashboard-text-label">Conteúdo</span>
                  <p className="mt-1 text-[14px] leading-6 text-white/72">{item.content}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.projects.length > 0 ? (
                    item.projects.map((entry) => (
                      <span key={entry} className="creator-card__pill">
                        {entry}
                      </span>
                    ))
                  ) : (
                    <span className="creator-card__pill">Sem projeto</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="creator-card__chip creator-card__chip--tier">{item.tierLabel}</span>
                  {item.platforms.length > 0 ? (
                    item.platforms.map((entry) => (
                      <span key={entry} className="creator-card__chip">
                        {entry}
                      </span>
                    ))
                  ) : (
                    <span className="creator-card__chip">Sem plataforma</span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/8 pt-4">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    Valor base
                  </p>
                  <p className="text-[18px] font-semibold tracking-[-0.05em] text-white">
                    {item.amountLabel}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    Desde
                  </p>
                  <p className="text-[14px] text-white/68">{item.sinceLabel}</p>
                </div>
              </div>
            </GlassPanel>
          </Link>
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
