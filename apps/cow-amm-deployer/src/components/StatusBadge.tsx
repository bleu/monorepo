export function StatusBadge({ disabled }: { disabled: boolean | null }) {
  return (
    <span
      className={`rounded-full px-2 text-base text-white ${disabled ? "bg-destructive" : "bg-success"}`}
    >
      {disabled ? "Paused" : "Active"}
    </span>
  );
}
