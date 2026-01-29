import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
const [open, setOpen] = useState(false);

<Drawer
  anchor="left"
  open={open}
  onClose={() => setOpen(false)}
  variant="temporary"
  ModalProps={{
    keepMounted: true, // スマホ最適化
  }}
/>;
