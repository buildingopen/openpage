import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Pencil, Component, Rocket, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/editor', label: 'Editor', icon: Pencil },
  { to: '/components', label: 'Components', icon: Component },
  { to: '/deploy', label: 'Deploy', icon: Rocket },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="h-12 bg-bg-1 border-b border-border-default flex items-center px-4 gap-2 fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2 mr-6 select-none">
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" fill="#22c55e" />
        </svg>
        <span className="font-display font-bold text-base text-text-0 tracking-tight">
          OpenPage
        </span>
      </NavLink>

      {/* Desktop nav */}
      <nav className="hidden md:flex h-full items-stretch gap-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `px-3.5 flex items-center text-[13px] relative transition-colors whitespace-nowrap gap-1.5 ${
                isActive
                  ? 'text-text-0 after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-green after:rounded-t'
                  : 'text-text-2 hover:text-text-1'
              }`
            }
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-bg-4 border border-border-default flex items-center justify-center text-[11px] font-semibold text-text-1 cursor-pointer">
          F
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-text-2 hover:text-text-0"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-12 left-0 right-0 bg-bg-1 border-b border-border-default md:hidden z-50">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-[13px] transition-colors ${
                  isActive ? 'text-green bg-green-glow' : 'text-text-1 hover:bg-bg-2'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
