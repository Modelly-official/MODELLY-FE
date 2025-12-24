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
    href: '/',
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
    label: '마이페이지',
    href: '/mypage',
    icon: '/icons/nav/mypage.svg',
    activeIcon: '/icons/nav/mypage-active.svg',
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  // post 상세 페이지에서는 BottomNav 숨김 (PostActions 사용)
  if (pathname.startsWith('/post/')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 border-t border-gray-200 bg-white pt-2 sm:w-[375px]">
      <div className="flex">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <div className="relative h-6 w-6">
                <Image src={active ? item.activeIcon : item.icon} alt={item.label} fill className="object-contain" />
              </div>
              <span className={`text-caption-1-medium ${active ? 'text-gray-900' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
