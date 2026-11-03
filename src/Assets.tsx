import { useState } from 'react'
import { Search } from 'lucide-react'
import { assets } from './data'
import { formatShort } from './lib'
import { AssetStatusBadge, Mono, Panel } from './ui'

export default function Assets() {
  const [currentOnly, setCurrentOnly] = useState(true)
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const rows = assets
    .filter((a) => !currentOnly || a.status === 'Current')
    .filter((a) => !q || [a.name, a.type, a.owner, a.version].some((v) => v.toLowerCase().includes(q)))
  const retiredCount = assets.filter((a) => a.status === 'Retired').length

  return (
    <Panel>
      <div className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-faint" aria-hidden />
          <label htmlFor="asset-search" className="sr-only">
            Search assets
          </label>
          <input
            id="asset-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by asset, type or owner"
            className="w-full rounded-md border border-line bg-surface py-2 pr-3 pl-8 text-sm text-ink placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="text-xs text-muted">
            {rows.length} shown{currentOnly ? `, ${retiredCount} retired hidden` : ''}
          </span>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink select-none">
            <button
              type="button"
              role="switch"
              aria-checked={currentOnly}
              onClick={() => setCurrentOnly((v) => !v)}
              className={`relative h-5 w-9 shrink-0 rounded-full transition ${currentOnly ? 'bg-accent' : 'bg-line'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  currentOnly ? 'translate-x-4' : ''
                }`}
              />
            </button>
            Current only
          </label>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted">No assets match “{query}”.</p>
      ) : (
        <>
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] tracking-wide text-faint uppercase">
                <tr className="border-b border-line">
                  <th className="px-4 py-2 font-semibold">Asset</th>
                  <th className="px-2 py-2 font-semibold">Type</th>
                  <th className="px-2 py-2 font-semibold">Version</th>
                  <th className="px-2 py-2 font-semibold">Owner</th>
                  <th className="px-2 py-2 font-semibold">Last updated</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr
                    key={`${a.name}-${a.version}`}
                    className={`border-b border-line last:border-0 ${a.status === 'Retired' ? 'text-faint' : ''}`}
                  >
                    <td className={`px-4 py-2.5 font-medium ${a.status === 'Retired' ? '' : 'text-ink'}`}>{a.name}</td>
                    <td className="px-2 py-2.5">{a.type}</td>
                    <td className="px-2 py-2.5">
                      <Mono>{a.version}</Mono>
                    </td>
                    <td className="px-2 py-2.5">{a.owner}</td>
                    <td className="px-2 py-2.5">
                      <Mono>{formatShort(a.updated)}</Mono>
                    </td>
                    <td className="px-4 py-2.5">
                      <AssetStatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-line md:hidden">
            {rows.map((a) => (
              <li key={`${a.name}-${a.version}`} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-sm font-medium ${a.status === 'Retired' ? 'text-faint' : 'text-ink'}`}>{a.name}</p>
                  <AssetStatusBadge status={a.status} />
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                  <span>{a.type}</span>
                  <Mono>{a.version}</Mono>
                  <span>{a.owner}</span>
                  <span>
                    Updated <Mono>{formatShort(a.updated)}</Mono>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  )
}
