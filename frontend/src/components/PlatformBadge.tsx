const PLATFORM_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  taobao: { label: 'Taobao', bg: 'bg-orange-500', text: 'text-white' },
  jd: { label: 'JD.com', bg: 'bg-red-600', text: 'text-white' },
  '1688': { label: '1688', bg: 'bg-amber-500', text: 'text-white' },
  pinduoduo: { label: 'Pinduoduo', bg: 'bg-green-600', text: 'text-white' },
};

interface PlatformBadgeProps {
  platform: string;
  size?: 'sm' | 'md';
}

export default function PlatformBadge({ platform, size = 'sm' }: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform.toLowerCase()] ?? {
    label: platform,
    bg: 'bg-gray-500',
    text: 'text-white',
  };

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span
      className={`${config.bg} ${config.text} ${sizeClasses} rounded-full font-medium inline-flex items-center whitespace-nowrap`}
    >
      {config.label}
    </span>
  );
}
