import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';

const [open, setOpen] = useState(false);

<AppBar position="fixed">
  <Toolbar>
    <IconButton color="inherit" edge="start" onClick={() => setOpen(true)}>
      <MenuIcon />
    </IconButton>
    <Typography sx={{ flexGrow: 1 }}>メニュー</Typography>
    {/* 右側アイコン */}
    🔔(1) 📩(1) ⚠(1) グループ名 ユーザー名
  </Toolbar>
</AppBar>;
