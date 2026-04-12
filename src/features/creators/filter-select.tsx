"use client";

import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  value: string;
  label: string;
  icon?: string; // image URL for game icons
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  gameIcons?: Record<string, string>;
};

/* ── Status icons change based on selected value ── */
function StatusIcon({ value }: { value: string }) {
  if (value === "Ativo") {
    return (
      <svg className="filter-chip-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    );
  }
  if (value === "Atenção") {
    return (
      <svg className="filter-chip-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    );
  }
  if (value === "Encerrado" || value === "Inativo") {
    return (
      <svg className="filter-chip-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    );
  }
  // "Todos" / default - circle with dots
  return (
    <svg className="filter-chip-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  );
}

/* ── Tier icon - Stitch sliders ── */
function TierIcon() {
  return (
    <svg className="filter-chip-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  );
}

/* ── Projeto icon - TCG logo default, game icon when filtered ── */
function ProjetoIcon({ value, gameIcons }: { value: string; gameIcons?: Record<string, string> }) {
  const gameIcon = gameIcons?.[value];
  if (gameIcon) {
    return (
      <Image
        src={gameIcon}
        alt={value}
        width={24}
        height={24}
        className="filter-chip-game-img"
      />
    );
  }
  // Default: show TCG logo
  return (
    <Image
      src="/figma-assets/logo-game.png"
      alt="The Classic Games"
      width={24}
      height={24}
      className="filter-chip-game-img"
      style={{ padding: "3px", objectFit: "contain" }}
    />
  );
}

function getStatusColorClass(value: string) {
  switch (value) {
    case "Ativo": return "filter-chip-icon--green";
    case "Atenção": return "filter-chip-icon--amber";
    case "Encerrado":
    case "Inativo": return "filter-chip-icon--red";
    default: return "filter-chip-icon--green";
  }
}

export function FilterSelect({ label, value, options, onChange, gameIcons }: FilterSelectProps) {
  const isStatus = label === "Status";
  const isTier = label === "Tier";
  const isProjeto = label === "Projeto";

  const selectedLabel = options.find(o => o.value === value)?.label ?? value;

  let iconColorClass = "filter-chip-icon--green";
  if (isStatus) iconColorClass = getStatusColorClass(selectedLabel);
  if (isTier) iconColorClass = "filter-chip-icon--accent";
  if (isProjeto) {
    const hasGameIcon = gameIcons?.[value];
    iconColorClass = hasGameIcon ? "filter-chip-icon--game" : "filter-chip-icon--muted";
  }

  return (
    <div className="filter-chip">
      <div className={`filter-chip-icon ${iconColorClass}`}>
        {isStatus && <StatusIcon value={selectedLabel} />}
        {isTier && <TierIcon />}
        {isProjeto && <ProjetoIcon value={value} gameIcons={gameIcons} />}
      </div>
      <div className="filter-chip-body">
        <span className="filter-chip-label">{label}</span>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger aria-label={label} className="filter-chip-trigger">
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent className="filter-chip-content">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="filter-chip-option">
                  {isProjeto && (
                    gameIcons?.[option.value] ? (
                      <Image
                        src={gameIcons[option.value]}
                        alt={option.label}
                        width={18}
                        height={18}
                        className="filter-chip-option-icon"
                      />
                    ) : (
                      <Image
                        src="/figma-assets/logo-game.png"
                        alt="TCG"
                        width={18}
                        height={18}
                        className="filter-chip-option-icon"
                        style={{ objectFit: "contain", padding: "2px" }}
                      />
                    )
                  )}
                  {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
