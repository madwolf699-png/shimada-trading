// menuData.ts
export const menuData = [
  {
    title: 'お知らせ',
    children: [
      { title: '一覧', path: '/notice/list' },
      { title: '登録', path: '/notice/create' },
    ],
  },
  {
    title: 'スケジュール',
    children: [{ title: '一覧', path: '/schedule' }],
  },
  {
    title: '発注',
    children: [
      { title: '個別発注', path: '/order/single' },
      { title: '一括発注', path: '/order/bulk' },
      { title: '発注照会', path: '/order/search' },
    ],
  },
  {
    title: 'カタログ',
    children: [
      { title: '一覧', path: '/catalog' },
      { title: '登録', path: '/catalog/create' },
    ],
  },
  {
    title: '請求',
    children: [
      { title: '一覧', path: '/invoice' },
      { title: '新規作成', path: '/invoice/create' },
      { title: '編集', path: '/invoice/edit' },
      { title: 'データ出力', path: '/invoice/export' },
    ],
  },
  {
    title: '入庫',
    children: [
      { title: '一覧', path: '/arrival' },
      { title: '登録', path: '/arrival/create' },
    ],
  },
  {
    title: '在庫・棚卸',
    children: [
      { title: '在庫一覧', path: '/stock' },
      { title: '廃棄一覧', path: '/discard' },
      { title: '棚卸依頼', path: '/inventory/request' },
      { title: '棚卸一覧', path: '/inventory' },
    ],
  },
  {
    title: '出荷',
    children: [{ title: '一覧', path: '/shipping' }],
  },
  {
    title: 'マスタ',
    note: '※1-17 マスタ管理画面ーメニューを参照',
    children: [],
  },
];
