import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Briefcase, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const PRIMARY_LINKS = [
  { to: '/', label: 'Jobs', icon: <Briefcase size={20} /> },
  { to: '/alerts', label: 'Alerts', icon: <Bell size={20} /> },
];

export default function BottomNav() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getInitials = (email) => {
    if (!email) return 'U';
    return email[0].toUpperCase();
  };

  const initials = getInitials(currentUser?.email);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-default border-t border-border-default shadow-[0_-1px_3px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] z-50 lg:hidden">

      {PRIMARY_LINKS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors ${
              isActive
                ? 'text-brand-primary'
                : 'text-text-muted hover:text-text-primary'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium leading-tight">{item.label}</span>
        </NavLink>
      ))}

      {/* Profile / Logout */}
      <div
        className="relative"
        tabIndex={-1}
        onBlur={(e) => {
          if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
            setMenuOpen(false);
          }
        }}
      >
        <button
          type="button"
          onFocus={() => setMenuOpen(true)}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors text-text-muted hover:text-text-primary"
          aria-label="Profile menu"
          aria-expanded={menuOpen}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-[9px]">
            {initials}
          </div>
          <span className="text-[10px] font-medium leading-tight">More</span>
        </button>

        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-52 bg-surface-default border border-border-default rounded-xl shadow-lg overflow-hidden outline-none">
            <div className="px-4 py-3 border-b border-border-default">
              <p className="text-sm font-semibold text-text-primary m-0 truncate">{currentUser?.email || 'User'}</p>
            </div>

            <div className="border-t border-border-default py-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-danger-main hover:bg-danger-bg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
