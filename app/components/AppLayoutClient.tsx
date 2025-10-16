'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Our Programs', href: '/programs' },
  { name: 'Events', href: '/events' },
  { name: 'Get Involved', href: '/get-involved' },
];

// Routes where we HIDE the layout
const hiddenLayoutRoutes = ['/login', '/signup', '/admin'];

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // check if the current route should hide header/footer
  const shouldHideLayout = hiddenLayoutRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideLayout && <Header navigationItems={navigationItems} />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer navigationItems={navigationItems} />}
    </>
  );
}
