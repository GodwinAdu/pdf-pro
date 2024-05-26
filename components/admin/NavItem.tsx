'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg  px-3 py-5 text-gray-900  transition-all hover:text-gray-900  dark:text-gray-50 dark:hover:text-gray-50',
        {
          'bg-gray-100 dark:bg-gray-800': pathname === href
        }
      )}
    >
      {children}
    </Link>
  );
}