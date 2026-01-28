import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Login from './pages/Login.tsx';
import Schedule from './pages/Schedule.tsx';
import Master from './pages/Master.tsx';
import Layout from './pages/common/Layout.tsx';
/**
 * アプリケーション全体のルーティングを定義する
 * ルートコンポーネント。
 *
 * React Router v6 を使用し、
 * 各 URL パスに対応する画面コンポーネントを切り替える。
 *
 * ルーティング定義:
 * - `/`      : Home 画面
 * - `/home`  : `/` へリダイレクト
 * - `/about` : About 画面
 * - `*`      : NotFound（404）画面
 *
 * @returns JSX.Element ルーティングを含む React 要素
 */
export default function App() {
  return (
    <Routes>
      {/* ヘッダ・メニューなし */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />

      {/* ★ Master系だけ共通レイアウトを使用 */}
      <Route element={<Layout />}>
        <Route path="/master" element={<Master />} />
        <Route path="/schedule" element={<Schedule />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
