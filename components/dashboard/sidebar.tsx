"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FileText,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Orders",
    icon: ShoppingBag,
    href: "/dashboard/orders",
    badge: 4,
  },
  {
    name: "Inventory",
    icon: Package,
    href: "/dashboard/inventory",
  },
  {
    name: "Prescriptions",
    icon: FileText,
    href: "/dashboard/prescriptions",
    badge: 2,
  },
  {
    name: "Customers",
    icon: Users,
    href: "/dashboard/customers",
  },
  {
    name: "Payments",
    icon: CreditCard,
    href: "/dashboard/payments",
  },
  {
    name: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/account");
  };

  const formatRole = (role: string | undefined) => {
    if (!role) return "Staff";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Logo and collapse button */}
      <div className="h-16 flex items-center justify-between px-4">
        <div
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}
        >
          <h1 className="text-xl font-light">Long Chau</h1>
          <span className="text-xs uppercase tracking-wider text-gray-500">
            PMS
          </span>
        </div>

        <button
          ref={buttonRef}
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all",
            collapsed ? "ml-auto" : ""
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-full relative group transition-all",
                  isActive
                    ? "text-white bg-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  collapsed ? "justify-center" : ""
                )}
                title={collapsed ? item.name : undefined}
              >
                <div className="relative">
                  <item.icon
                    size={collapsed ? 20 : 18}
                    className="flex-shrink-0"
                  />

                  {/* Badge for notifications */}
                  {item.badge && (
                    <div
                      className={cn(
                        "absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full",
                        !collapsed && "scale-90"
                      )}
                    >
                      {item.badge}
                    </div>
                  )}
                </div>

                <span
                  className={cn(
                    "ml-3 text-sm transition-all duration-300",
                    collapsed
                      ? "opacity-0 absolute w-0 overflow-hidden"
                      : "opacity-100 relative w-auto"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Back to Store */}
      <div className="p-3 border-t border-gray-100">
        {!collapsed && (
          <div className="flex items-center px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {formatRole(profile?.role)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Link
            href="/"
            className={cn(
              "flex items-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full transition-all",
              collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
            )}
            title={collapsed ? "Back to Store" : undefined}
          >
            <Store size={collapsed ? 20 : 18} className="flex-shrink-0" />
            <span
              className={cn(
                "ml-3 text-sm transition-all duration-300",
                collapsed
                  ? "opacity-0 absolute w-0 overflow-hidden"
                  : "opacity-100 relative w-auto"
              )}
            >
              Back to Store
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
