import { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemText, Collapse, Typography } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { menuData } from './menuData';
import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect?: () => void;
};

/**
 *
 */
export default function SideMenu({ open, onClose, onSelect }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 280 }}>
        {menuData.map((menu, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={menu.title}>
              {/* 親メニュー */}
              <ListItemButton onClick={() => setOpenIndex(isOpen ? null : index)}>
                <ListItemText primary={menu.title} />
                {menu.children.length > 0 && (isOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              {/* 子メニュー */}
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menu.children.map((child) => (
                    <ListItemButton
                      key={child.title}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        navigate(child.path);
                        onClose();
                      }}
                    >
                      <ListItemText primary={child.title} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>

              {/* 注釈（マスタのみ） */}
              {menu.note && (
                <Typography variant="caption" sx={{ pl: 2, color: 'text.secondary' }}>
                  {menu.note}
                </Typography>
              )}
            </div>
          );
        })}
      </List>
    </Drawer>
  );
}
