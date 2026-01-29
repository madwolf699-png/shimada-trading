import { useState, forwardRef } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import WarningIcon from '@mui/icons-material/Warning';

type Props = {
  onMenuClick: () => void;
};

const Header = forwardRef<HTMLDivElement, Props>(({ onMenuClick }, ref) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="fixed" color="default" ref={ref}>
      {/* ===== 上段 ===== */}
      <Toolbar sx={{ gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ flexShrink: 0 }}>
          <IconButton edge="start" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* 期間 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Typography variant="body2">期間</Typography>
          <TextField size="small" />
          <Typography>〜</Typography>
          <TextField size="small" />
        </Box>

        {/* カテゴリー */}
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField size="small" select label="カテゴリー" sx={{ minWidth: 140 }}>
            <MenuItem value="all">全て</MenuItem>
            <MenuItem value="order">発注</MenuItem>
            <MenuItem value="stock">在庫</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* 通知・ユーザー */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            ml: 'auto',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'flex-end', sm: 'flex-start' },
          }}
        >
          <Badge badgeContent={1} color="error">
            <NotificationsIcon />
          </Badge>
          <Badge badgeContent={1} color="error">
            <MailIcon />
          </Badge>
          <Badge badgeContent={1} color="error">
            <WarningIcon />
          </Badge>

          <Typography variant="body2">グループ名 ユーザー名</Typography>
        </Box>
      </Toolbar>

      {/* ===== 下段（タブ） ===== */}
      {/*
      {!isMobile && (
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="お知らせ" />
          <Tab label="ユーザー" />
          <Tab label="スケジュール" />
          <Tab label="発注" />
          <Tab label="カタログ" />
          <Tab label="請求" />
          <Tab label="入庫" />
          <Tab label="在庫" />
          <Tab label="出荷" />
          <Tab label="棚卸" />
          <Tab label="マスタ" />
        </Tabs>
      )}
      */}
    </AppBar>
  );
});

export default Header;
