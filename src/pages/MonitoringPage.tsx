import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Server,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { MONITORING_METRICS, INITIAL_HEALTH_PROBES } from '../data/demoData';

export const MonitoringPage: React.FC = () => {
  const { theme } = useApp();
  const [selectedService, setSelectedService] = useState('checkout-service');
  const [timeRange, setTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const services = [
    { id: 'checkout-service', name: 'checkout-api.production', url: 'https://checkout-api.reposage.dev', status: 200 },
    { id: 'payment-gateway', name: 'payment-gateway.production', url: 'https://gateway.reposage.dev', status: 200 },
    { id: 'auth-proxy', name: 'auth-proxy.production', url: 'https://auth.reposage.dev', status: 200 }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
  };

  const gridColor = theme === 'dark' ? '#262626' : '#f0f0f0';
  const axisColor = theme === 'dark' ? '#737373' : '#a3a3a3';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Live Website & Service Observability
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Synthetic multi-region health probes, response percentiles (P50/P90/P99), error budgets, and container telemetry.
          </p>
        </div>

        {/* Service Picker & Time Range */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono font-medium focus:outline-hidden"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs">
            {['15m', '1h', '6h', '24h'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-1 rounded font-mono text-[11px] transition-colors ${
                  timeRange === r
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-neutral-600 dark:text-neutral-300"
            title="Refresh metrics stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Simulator Notice */}
      <div className="p-3 bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Simulated Telemetry:</strong> Metrics stream synthetic data for demonstration. Connect Prometheus, Datadog, or OpenTelemetry collector for live production telemetry.
          </span>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Availability</span>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
            99.98%
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">30d target: 99.95%</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Latency (P50 / P99)</span>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-0.5">
            41ms <span className="text-xs font-normal text-neutral-400">/ 125ms</span>
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Within SLA budget</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">HTTP Error Rate</span>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
            0.02%
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Threshold: 1.0%</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Throughput</span>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-0.5">
            475 RPS
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Peak: 520 RPS</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Pod Utilization</span>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-0.5">
            40% <span className="text-xs font-normal text-neutral-400">CPU / 415MB</span>
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">12 healthy replicas</span>
        </div>
      </div>

      {/* 2x2 Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Latency Percentiles (P50, P90, P99) */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
                Response Time Percentiles (ms)
              </h3>
              <p className="text-[11px] text-neutral-400">P50 median, P90, and P99 latency curve</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-600">Nominal</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONITORING_METRICS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="time" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} domain={[0, 160]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#171717' : '#ffffff',
                    borderColor: theme === 'dark' ? '#262626' : '#e5e5e5',
                    fontSize: '11px',
                    borderRadius: '8px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="latencyP50" name="P50" stroke="#2563eb" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="latencyP90" name="P90" stroke="#d97706" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="latencyP99" name="P99" stroke="#e11d48" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Request Throughput & Error Rate */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
                Request Throughput (RPS)
              </h3>
              <p className="text-[11px] text-neutral-400">Ingress volume served across cluster</p>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">475 rps</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONITORING_METRICS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="time" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#171717' : '#ffffff',
                    borderColor: theme === 'dark' ? '#262626' : '#e5e5e5',
                    fontSize: '11px',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="throughputRps" name="Requests/sec" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.12} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Error Rate (%) */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
                HTTP 5xx Error Rate (%)
              </h3>
              <p className="text-[11px] text-neutral-400">Canary rollback trigger threshold: 1.0%</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-600">0.02%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONITORING_METRICS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="time" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} domain={[0, 0.1]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#171717' : '#ffffff',
                    borderColor: theme === 'dark' ? '#262626' : '#e5e5e5',
                    fontSize: '11px',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="errorRate" name="Error Rate %" stroke="#16a34a" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: CPU & Memory Utilization */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
                Resource Utilization
              </h3>
              <p className="text-[11px] text-neutral-400">Pod container CPU percentage vs RAM allocation</p>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">40% / 415MB</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONITORING_METRICS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="time" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#171717' : '#ffffff',
                    borderColor: theme === 'dark' ? '#262626' : '#e5e5e5',
                    fontSize: '11px',
                    borderRadius: '8px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="cpuPercent" name="CPU %" stroke="#d97706" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="memoryMb" name="Memory (MB)" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Synthetic Health Probe Checks Table */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
          Recent Multi-Region Synthetic Probes
        </h2>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Timestamp</th>
                  <th className="py-2.5 px-4 font-medium">Monitored Service</th>
                  <th className="py-2.5 px-4 font-medium">Probe Region</th>
                  <th className="py-2.5 px-4 font-medium">HTTP Status</th>
                  <th className="py-2.5 px-4 font-medium">Response Latency</th>
                  <th className="py-2.5 px-4 font-medium text-right">Health State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-[11px]">
                {INITIAL_HEALTH_PROBES.map((probe) => (
                  <tr key={probe.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-2.5 px-4 text-neutral-500 font-sans">{probe.timestamp}</td>
                    <td className="py-2.5 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">
                      {probe.service}
                    </td>
                    <td className="py-2.5 px-4 text-neutral-500">{probe.region}</td>
                    <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {probe.httpStatus} OK
                    </td>
                    <td className="py-2.5 px-4 tabular-nums text-neutral-700 dark:text-neutral-300">
                      {probe.latencyMs}ms
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-emerald-600 dark:text-emerald-400 font-sans text-xs">
                        Nominal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
