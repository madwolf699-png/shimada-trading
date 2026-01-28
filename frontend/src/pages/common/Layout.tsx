import { useState, useRef, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import SideMenu from './SideMenu';

/**
 *
 */
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Header 高さをリアルタイム取得
  useLayoutEffect(() => {
    /**
     *
     */
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeight();

    // resize / 折り返し / Tabs 表示切替に追従
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* ★ Header に ref を渡す */}
      <Header ref={headerRef} onMenuClick={() => setMenuOpen(true)} />

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ★ 可変コンテンツ領域 */}
      <Box
        component="main"
        sx={{
          mt: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
