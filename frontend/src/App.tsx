import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Calendar from "./pages/Calendar.tsx";

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
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/about" element={<About />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
