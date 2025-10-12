import { useState } from 'react';
import { LayoutDashboard, Archive, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigateToMembers: () => void;
  onNavigateToArchive: () => void;
}

export const Sidebar = ({ currentView, onNavigateToMembers, onNavigateToArchive }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'members',
      label: 'Members',
      icon: LayoutDashboard,
      onClick: onNavigateToMembers,
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      onClick: onNavigateToArchive,
    },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } flex flex-col shadow-xl`}
    >
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            VM System
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                  : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
