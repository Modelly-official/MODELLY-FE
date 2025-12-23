'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  {
    label: '홈',
    href: '/home',
    icon: '/icons/nav/home.svg',
    activeIcon: '/icons/nav/home-active.svg',
  },
  {
    label: '탐색',
    href: '/explore',
    icon: '/icons/nav/explore.svg',
    activeIcon: '/icons/nav/explore-active.svg',
  },
  {
    label: '지도',
    href: '/map',
    icon: '/icons/nav/map.svg',
    activeIcon: '/icons/nav/map-active.svg',
  },
  {
    label: '채팅',
    href: '/chat',
    icon: '/icons/nav/chat.svg',
    activeIcon: '/icons/nav/chat-active.svg',
  },
  {
    label: '마이',
    href: '/mypage',
    icon: '/icons/nav/mypage.svg',
    activeIcon: '/icons/nav/mypage-active.svg',
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/home') {
      return pathname === '/home';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-400">
      <div className="flex h-[60px] max-w-[600px] mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-1"
            >
              <div className="relative w-6 h-6">
                <Image
                  src={active ? item.activeIcon : item.icon}
                  alt={item.label}
                  fill
                  className="object-contain"
                />
              </div>
              <span
                className={`text-caption-2 ${
                  active ? 'text-gray-900 font-medium' : 'text-gray-500 font-regular'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

