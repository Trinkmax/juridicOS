import { Badge } from "./badge";
import type { Option } from "@/lib/constants";

/** Renders a domain Option (value/label/tone) as a Badge. */
function OptionBadge({
  option,
  dot,
  className,
}: {
  option?: Option | null;
  dot?: boolean;
  className?: string;
}) {
  if (!option) return null;
  return (
    <Badge tone={option.tone} dot={dot} className={className}>
      {option.label}
    </Badge>
  );
}

export { OptionBadge };
