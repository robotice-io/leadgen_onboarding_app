"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Mail, 
  Settings, 
  Users, 
  TrendingUp,
  X,
  ChevronDown,
  Building2
} from "lucide-react";
import { User } from "@/types/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ isOpen, onClose, user }: SidebarProps) {
  const pathname = usePathname();
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-6 py-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/landing_logo.png"
                alt="Robotice"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Robotice
              </span>
            </Link>
          </div>

          {/* Tenant Selector */}
          <div className="relative">
            <button
              onClick={() => setTenantMenuOpen(!tenantMenuOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.company || "My Company"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${tenantMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-all
                            ${isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }
                          `}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 ${
                              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Free Plan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 py-4">
          {/* Mobile Header */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/landing_logo.png"
                alt="Robotice"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Robotice
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation - Same as desktop */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`
                            group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-all
                            ${isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }
                          `}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 ${
                              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
