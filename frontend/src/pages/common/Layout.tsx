import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import SideMenu from './SideMenu';

const HEADER_HEIGHT_PC = 100; // MUI AppBar default
const HEADER_HEIGHT_MOBILE = 200; // MUI AppBar default

/**
 *
 */

/**
 *
 */
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <Header onMenuClick={() => setMenuOpen(true)} />

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ★ 可変コンテンツ領域 */}
      <Box
        sx={{
          mt: !isMobile ? `${HEADER_HEIGHT_PC}px` : `${HEADER_HEIGHT_MOBILE}px`,
          height: !isMobile
            ? `calc(100vh - ${HEADER_HEIGHT_PC}px)`
            : `calc(100vh - ${HEADER_HEIGHT_MOBILE}px)`,
          overflow: 'auto', // ← スクロールはここだけ
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
