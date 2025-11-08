type MaterialIconProps = {
  name: string;
  className?: string;
};

const FALLBACK_ICON = "crop_square";

const nameMap: Record<string, string> = {
  fridge: "kitchen",
  bookshelf: "auto_stories",
  plant: "yard",
};

export function MaterialIcon({ name, className }: MaterialIconProps) {
  const resolved = nameMap[name] ?? name ?? FALLBACK_ICON;
  return (
    <span className={`material-symbols-rounded text-2xl ${className ?? ""}`}>
      {resolved}
    </span>
  );
}
