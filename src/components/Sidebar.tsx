import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { 
  Layout, 
  PlusCircle, 
  User, 
  LogOut, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
        isActive 
          ? "bg-gray-100 text-text-primary" 
          : "text-gray-500 hover:bg-gray-50 hover:text-text-primary"
      )}
      onClick={() => setIsOpen(false)}
    >
      <div className={cn(
        "w-2 h-2 rounded-full transition-colors",
        "bg-transparent",
        "group-hover:bg-accent/40"
      )} />
      {label}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transition-transform lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Layout className="text-white h-4 w-4" />
          </div>
          <span className="font-bold text-xl tracking-tight uppercase">DevLog</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem to="/dashboard" icon={Home} label="Overview" />
          <NavItem to="/log/new" icon={PlusCircle} label="New Entry" />
          <NavItem to="/profile" icon={User} label="Profile" />
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="h-8 w-8 rounded-full bg-blue-100 border border-accent/30 flex items-center justify-center text-accent font-bold text-xs">
              {user?.displayName ? user.displayName[0] : 'D'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold truncate">{user?.displayName || 'Developer'}</p>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">{user?.email?.split('@')[0]}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
