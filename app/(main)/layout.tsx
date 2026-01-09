'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { configService } from '@/lib/services/configuration';
import { useState, useEffect } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('navCollapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('navCollapsed', JSON.stringify(newState));
  };

  return (
    <div className="flex h-screen">
      <nav className={`${isCollapsed ? 'w-20' : 'w-56'} bg-coffee-bean text-ghost-white p-4 transition-all duration-300`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
          {!isCollapsed && (
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="Unseen Archive Logo"
                width={50}
                height={50}
                priority
                className="rounded cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          )}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="p-2 hover:bg-vivid-royal rounded transition-colors"
              aria-label="Collapse navigation"
            >
              <i className="pi pi-angle-left text-lg"></i>
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="p-2 hover:bg-vivid-royal rounded transition-colors"
              aria-label="Expand navigation"
            >
              <i className="pi pi-angle-right text-lg"></i>
            </button>
          )}
        </div>
        <ul className="space-y-2 flex flex-col h-[calc(100vh-13rem)]">
          <li>
            <Link href="/list" className={`flex items-center gap-3 py-2 px-4 rounded transition-colors hover:bg-vivid-royal ${pathname === '/list' ? 'bg-vivid-royal' : ''}`}>
              <i className="pi pi-list text-lg"></i>
              {!isCollapsed && <span>List</span>}
            </Link>
          </li>
          <li>
            <Link href="/add" className={`flex items-center gap-3 py-2 px-4 rounded transition-colors hover:bg-vivid-royal ${pathname === '/add' ? 'bg-vivid-royal' : ''}`}>
              <i className="pi pi-plus text-lg"></i>
              {!isCollapsed && <span>Add new item</span>}
            </Link>
          </li>
          <li>
            <Link href="/help" className={`flex items-center gap-3 py-2 px-4 rounded transition-colors hover:bg-vivid-royal ${pathname === '/help' ? 'bg-vivid-royal' : ''}`}>
              <i className="pi pi-question-circle text-lg"></i>
              {!isCollapsed && <span>Help</span>}
            </Link>
          </li>
          <li className="mt-auto">
            <Link href="/settings" className={`flex items-center gap-3 py-2 px-4 rounded transition-colors hover:bg-vivid-royal ${pathname === '/settings' ? 'bg-vivid-royal' : ''}`}>
              <i className="pi pi-cog text-lg"></i>
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </li>
          {configService.isDevEnvironment() && (
            <li>
              <Link href="/test-design" className={`flex items-center gap-3 py-2 px-4 rounded transition-colors hover:bg-vivid-royal ${pathname === '/test-design' ? 'bg-vivid-royal' : ''}`}>
                <i className="pi pi-palette text-lg"></i>
                {!isCollapsed && <span>Test design</span>}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <main className="flex-1 bg-ghost-white overflow-auto">
        {children}
      </main>
    </div>
  );
}