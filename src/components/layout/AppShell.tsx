'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  Users2,
  FileSearch,
  UserCheck,
  CalendarDays,
  ShieldCheck,
  AlertTriangle,
  Database,
  Activity,
  Award,
  FileCheck2,
  FileSignature,
  BarChart3,
  Network,
  History,
  UserCog,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/lib/auth';
import { ctmsStore } from '@/lib/store';
import { UserRole, AppNotification } from '@/types';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, switchRole, resetDemoData } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateNotifs = () => {
      const state = ctmsStore.getState();
      setNotifications(state.notifications);
      setUnreadCount(state.notifications.filter(n => !n.isRead).length);
    };

    updateNotifs();
    const unsub = ctmsStore.subscribe(updateNotifs);
    return () => unsub();
  }, []);

  const navSections: NavSection[] = [
    {
      title: 'OPERATIONAL COMMAND',
      items: [
        { name: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'CLINICAL PORTFOLIO',
      items: [
        { name: 'Studies Directory', href: '/studies', icon: FolderKanban, badge: '10' },
        { name: 'Research Sites', href: '/sites', icon: Building2, badge: '8 Sites' },
        { name: 'Participants Registry', href: '/participants', icon: Users2, badge: '260+' },
        { name: 'Screening Logs', href: '/screening', icon: FileSearch },
        { name: 'Enrolment Analytics', href: '/enrolment', icon: UserCheck },
        { name: 'Study Visits Matrix', href: '/visits', icon: CalendarDays }
      ]
    },
    {
      title: 'QUALITY & OVERSIGHT',
      items: [
        { name: 'Site Monitoring (CRA)', href: '/monitoring', icon: ShieldCheck },
        { name: 'Protocol Deviations', href: '/deviations', icon: AlertTriangle, badge: '3 Open', badgeColor: 'bg-amber-100 text-amber-800' },
        { name: 'Data Management & Queries', href: '/data-management', icon: Database, badge: '2 Open' }
      ]
    },
    {
      title: 'NPvCC PHARMACOVIGILANCE',
      items: [
        { name: 'Safety Cases (AE/ADR/SAE)', href: '/pharmacovigilance', icon: Activity, badge: 'URGENT 24H', badgeColor: 'bg-rose-600 text-white animate-pulse' }
      ]
    },
    {
      title: 'COMPLIANCE & GOVERNANCE',
      items: [
        { name: 'Regulatory Milestones', href: '/regulatory', icon: Award },
        { name: 'Ethics Committee (IEC)', href: '/ethics', icon: FileCheck2, badge: 'Review Due' },
        { name: 'Informed Consent', href: '/consent', icon: FileSignature }
      ]
    },
    {
      title: 'DATA SCIENCE & STANDARDS',
      items: [
        { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
        { name: 'CDISC & HL7 FHIR Interop', href: '/interoperability', icon: Network },
        { name: 'ALCOA+ Audit Trail', href: '/audit-logs', icon: History, badge: 'SHA-256' }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { name: 'Users & Investigators', href: '/users', icon: UserCog },
        { name: 'System Settings', href: '/settings', icon: Settings }
      ]
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('study') || q.includes('rct') || q.includes('ashwagandha')) {
      router.push(`/studies?search=${encodeURIComponent(searchQuery)}`);
    } else if (q.includes('demo') || q.includes('part') || q.includes('patient')) {
      router.push(`/participants?search=${encodeURIComponent(searchQuery)}`);
    } else if (q.includes('safe') || q.includes('sae') || q.includes('adr')) {
      router.push(`/pharmacovigilance?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/studies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMarkNotifRead = (id: string, url: string) => {
    ctmsStore.markNotificationAsRead(id);
    setNotifMenuOpen(false);
    router.push(url);
  };

  const currentRoleInfo = ROLE_LABELS[role] || ROLE_LABELS.admin;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0b192c] text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 bg-[#081220] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
              <Stethoscope className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">AIIA CTMS</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">Ministry of Ayush · Govt. of India</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Context Banner */}
        <div className="px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-900/40 text-[11px] flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-emerald-300 font-medium truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="truncate">NPvCC National Apex Centre</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">SIH26046</span>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-xs">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-700/80 text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-200' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full font-bold tracking-tight shrink-0 ${
                            item.badgeColor || (isActive ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-800 text-slate-300')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Reset Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#081220] space-y-2">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 font-bold flex items-center justify-center text-xs shrink-0 ring-1 ring-emerald-500/50">
              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentRoleInfo.label}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 px-1">
            <button
              onClick={() => {
                if (confirm('Reset synthetic clinical demo data back to default?')) {
                  resetDemoData();
                  alert('Demo database reset to clean seed state.');
                }
              }}
              className="flex items-center space-x-1 hover:text-emerald-400 transition-colors"
              title="Reset synthetic data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo DB</span>
            </button>
            <Link href="/" className="flex items-center space-x-1 hover:text-slate-200 transition-colors">
              <LogOut className="w-3 h-3" />
              <span>Portal Home</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between shadow-xs z-30 shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72 lg:w-96">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protocols, DEMO participants, safety cases..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition"
              />
            </form>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2.5 lg:space-x-4">
            {/* SIH Demo Mode Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-[11px] font-semibold text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>SIH DEMO MODE</span>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-800 transition font-medium"
                title="Switch active demonstration persona"
              >
                <span className="text-[11px] text-slate-500 hidden xl:inline">Role:</span>
                <span className="font-semibold truncate max-w-[130px] lg:max-w-none">{currentRoleInfo.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 divide-y divide-slate-100">
                  <div className="px-3 py-2 bg-slate-50">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Select Demo Persona
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Switching roles enforces server-side RBAC permissions across all modules.
                    </p>
                  </div>
                  <div className="py-1">
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => {
                      const info = ROLE_LABELS[r];
                      const isSelected = r === role;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex flex-col transition ${
                            isSelected ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{info.label}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal line-clamp-1">{info.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Notifications & Clinical Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Operational Alerts & Triage</h4>
                      <p className="text-[10px] text-slate-500">{unreadCount} unread regulatory/safety items</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                      Live Stream
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-slate-400 text-xs">No active notifications</p>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkNotifRead(notif.id, notif.actionUrl)}
                          className={`p-3 cursor-pointer transition ${
                            notif.isRead ? 'bg-white hover:bg-slate-50 opacity-75' : 'bg-slate-50/80 hover:bg-emerald-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between space-x-2">
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                notif.priority === 'critical'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : notif.priority === 'high'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {notif.category}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(notif.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="font-semibold text-slate-800 mt-1 text-xs">{notif.title}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 text-center">
                    <Link
                      href="/regulatory"
                      onClick={() => setNotifMenuOpen(false)}
                      className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      View all compliance milestones →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
