interface PriceFreshnessTagProps {
  updatedAt: string | null;
}

export default function PriceFreshnessTag({ updatedAt }: PriceFreshnessTagProps) {
  if (!updatedAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        May be outdated
      </span>
    );
  }

  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);

  if (diffHours < 2) {
    const label = diffMinutes < 1 ? 'Just now' : `Updated ${diffMinutes}m ago`;
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        {label}
      </span>
    );
  }

  if (diffHours < 24) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-yellow-600">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        Updated {diffHours}h ago
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-red-500">
      <span className="h-2 w-2 rounded-full bg-red-400" />
      May be outdated
    </span>
  );
}
