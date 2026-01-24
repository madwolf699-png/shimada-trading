/**
 * NotFound画面コンポーネント
 *
 * ユーザーが存在しない URL にアクセスした場合に表示される画面。
 * 404 メッセージと簡単な説明文を表示する。
 *
 * @component
 * @returns JSX.Element NotFound画面の JSX
 * @example
 * <NotFound />
 */
function NotFound() {
  return (
    <div>
      <h1>404 Not Found</h1>
      <p>お探しのページは存在しません。</p>
    </div>
  );
}
export default NotFound;
