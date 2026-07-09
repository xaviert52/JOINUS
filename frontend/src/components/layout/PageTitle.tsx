'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTitle() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname === '/') {
      document.title = 'JOINUS!';
    } else {
      let section = pathname.split('/')[1] || '';
      if (pathname.includes('/docs/apy')) {
        section = 'APY Docs';
      } else if (pathname.includes('/docs/whitepaper')) {
        section = 'Whitepaper';
      } else if (section === 'docs') {
        section = 'Documentation';
      } else {
        section = section.charAt(0).toUpperCase() + section.slice(1);
      }
      document.title = `${section} | JOINUS!`;
    }
  }, [pathname]);

  return null;
}
