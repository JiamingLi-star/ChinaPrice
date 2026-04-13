'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const PLATFORM_COLORS: Record<string, string> = {
  taobao: '#f97316',
  jd: '#dc2626',
  '1688': '#f59e0b',
  pinduoduo: '#16a34a',
};

const PLATFORM_LABELS: Record<string, string> = {
  taobao: 'Taobao',
  jd: 'JD.com',
  '1688': '1688',
  pinduoduo: 'Pinduoduo',
};

interface PriceHistoryChartProps {
  currentPrice: number;
  platform: string;
}

function generateMockData(currentPrice: number, platform: string) {
  const platforms = [platform.toLowerCase()];
  const allPlatforms = Object.keys(PLATFORM_COLORS);
  for (const p of allPlatforms) {
    if (!platforms.includes(p) && platforms.length < 3) {
      platforms.push(p);
    }
  }

  const days = 30;
  const data: Record<string, string | number>[] = [];
  const now = new Date();

  const basePrices: Record<string, number> = {};
  platforms.forEach((p, i) => {
    basePrices[p] = currentPrice * (1 + i * 0.08);
  });

  for (let d = days; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const label = `${date.getMonth() + 1}/${date.getDate()}`;

    const entry: Record<string, string | number> = { date: label };
    platforms.forEach((p) => {
      const drift = (Math.random() - 0.5) * currentPrice * 0.12;
      const trend = d > 15 ? currentPrice * 0.05 : 0;
      entry[p] = Math.max(1, Math.round((basePrices[p] + drift + trend) * 100) / 100);
    });

    data.push(entry);
  }

  // Ensure the last day matches the actual current price for the primary platform
  data[data.length - 1][platform.toLowerCase()] = currentPrice;

  return { data, platforms };
}

export default function PriceHistoryChart({ currentPrice, platform }: PriceHistoryChartProps) {
  const { data, platforms } = useMemo(
    () => generateMockData(currentPrice, platform),
    [currentPrice, platform],
  );

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Price History (30 Days)</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(v: number) => `¥${v}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                fontSize: '13px',
              }}
              formatter={(value: number, name: string) => [
                `¥${value.toLocaleString()}`,
                PLATFORM_LABELS[name] ?? name,
              ]}
            />
            <Legend
              formatter={(value: string) => PLATFORM_LABELS[value] ?? value}
              wrapperStyle={{ fontSize: '12px' }}
            />
            {platforms.map((p) => (
              <Line
                key={p}
                type="monotone"
                dataKey={p}
                stroke={PLATFORM_COLORS[p] ?? '#6b7280'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
