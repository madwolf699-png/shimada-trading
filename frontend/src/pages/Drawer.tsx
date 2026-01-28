<Drawer
  anchor="left"
  open={open}
  onClose={() => setOpen(false)}
  variant="temporary"
  ModalProps={{
    keepMounted: true, // スマホ最適化
  }}
/>;
