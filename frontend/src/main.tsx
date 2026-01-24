import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

/**
 * アプリケーションのエントリーポイント。
 *
 * ReactDOM.createRoot を使用して React アプリを初期化し、
 * BrowserRouter を利用したルーティングを有効化した上で
 * App コンポーネントを DOM にマウントする。
 *
 * このファイル自体は React コンポーネントを定義しない。
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
