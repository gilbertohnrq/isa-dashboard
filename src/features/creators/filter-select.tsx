"use client";

import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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

function StatusIcon({ value }: { value: string }) {
  if (value === "Ativo") {
    return (
      <svg className="filter-chip-icon-svg" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="7" />
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

function TierIcon() {
  return (
    <svg className="filter-chip-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="m12 3.8 2.2 4.45 4.92.71-3.56 3.47.84 4.9L12 15l-4.4 2.33.84-4.9-3.56-3.47 4.92-.71L12 3.8Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} />
    </svg>
  );
}

function ProjectIconGlyph() {
  return (
    <svg className="filter-chip-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M7 10h10a4 4 0 0 1 0 8h-1.5l-1.8-2H10.3l-1.8 2H7a4 4 0 0 1 0-8Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} />
      <path d="M8.75 13.5h2.5M10 12.25v2.5M15.9 13.2h.01M18 15.2h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} />
    </svg>
  );
}

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
  return <ProjectIconGlyph />;
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
    <div className={`filter-chip ${isStatus ? "filter-chip--status" : ""} ${isTier ? "filter-chip--tier" : ""} ${isProjeto ? "filter-chip--project" : ""}`}>
      <div className={`filter-chip-icon ${iconColorClass}`}>
        {isStatus && <StatusIcon value={selectedLabel} />}
        {isTier && <TierIcon />}
        {isProjeto && <ProjetoIcon value={value} gameIcons={gameIcons} />}
      </div>
      <div className="filter-chip-body">
        <span className="filter-chip-label">{label}</span>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger aria-label={label} className="filter-chip-trigger">
            <span className="filter-chip-trigger__value">{selectedLabel}</span>
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
