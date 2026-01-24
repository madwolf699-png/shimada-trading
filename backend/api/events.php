<?php
/**
 * カレンダー表示用イベント一覧取得 API
 *
 * フロントエンドから送信された JSON リクエストを受け取り、
 * イベント情報の配列を JSON 形式で返却する。
 *
 * 現在はモックデータを返却しているが、
 * 将来的にはリクエスト内容（status / kind 等）に応じて
 * DB や外部 API から取得・フィルタリングする想定。
 *
 * 対応メソッド:
 * - POST    : イベント一覧取得
 * - OPTIONS : CORS プリフライト対応
 *
 * レスポンス形式:
 * {
 *   count: number,
 *   events: Event[]
 * }
 *
 * Event:
 * - id     : string
 * - title  : string
 * - start  : string (ISO8601)
 * - end    : string (ISO8601)
 * - status : string
 * - kind   : string
 *
 * @package Api
 * @author  Your Name
 */

/**
 * CORS 設定
 *
 * ローカル開発環境（Vite）からのアクセスを許可する。
 */
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

/**
 * OPTIONS メソッド（プリフライトリクエスト）対応
 *
 * 実処理は行わず、204 No Content を返却する。
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * リクエストボディ(JSON)を取得
 *
 * @var string $raw 生のリクエストボディ
 */
$raw = file_get_contents('php://input');

/**
 * JSON を連想配列へデコード
 *
 * @var array<string, mixed>|null $data
 */
$data = json_decode($raw, true);

/**
 * JSON が不正な場合は 400 Bad Request を返却
 */
if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

/**
 * イベント一覧（モックデータ）
 *
 * @var array<int, array{
 *   id: string,
 *   title: string,
 *   start: string,
 *   end: string,
 *   status: string,
 *   kind: string
 * }>
 */
$result = [
    [
      'id' => '1',
      'title' => '橋本店未入荷',
      'start' => '2026-02-01T10:00:00',
      'end' => '2026-02-01T11:00:00',
      'status' => 'error',
      'kind' => 'all',
    ],
    [
      'id' => '2',
      'title' => '超過・数量エラー',
      'start' => '2026-02-02T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'error',
      'kind' => 'shipper',
    ],
    [
      'id' => '3',
      'title' => '想定在庫入の介入必須',
      'start' => '2026-02-02T13:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'warning',
      'kind' => 'warehouse',
    ],
    [
      'id' => '4',
      'title' => '使用想定在庫逼迫',
      'start' => '2026-02-02T14:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'wait',
      'kind' => 'partner',
    ],
    [
      'id' => '5',
      'title' => '予定→想定在庫余裕確定',
      'start' => '2026-02-02T15:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'info',
      'kind' => 'all',
    ],
    [
      'id' => '6',
      'title' => '予定・下書き',
      'start' => '2026-02-02T16:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => '',
      'kind' => 'shipper',
    ],
    [
      'id' => '7',
      'title' => 'フェス出荷完了',
      'start' => '2026-02-03T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'done',
      'kind' => 'warehouse',
    ],
    [
      'id' => '8',
      'title' => '沖縄出荷アイテム不足 他2件',
      'start' => '2026-02-04T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'warning',
      'kind' => 'partner',
    ],
    [
      'id' => '9',
      'title' => '町田店出荷（返却予定あり）',
      'start' => '2026-02-05T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'wait',
      'kind' => 'all',
    ],
    [
      'id' => '10',
      'title' => '相模原店入庫',
      'start' => '2026-02-06T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'info',
      'kind' => 'shipper',
    ],
    [
      'id' => '11',
      'title' => '相模原店出庫',
      'start' => '2026-02-09T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'info',
      'kind' => 'warehouse',
    ],
    [
      'id' => '12',
      'title' => 'フェス入庫',
      'start' => '2026-02-09T13:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => '',
      'kind' => 'partner',
    ],
    [
      'id' => '13',
      'title' => '八王子店出荷承認待ち',
      'start' => '2026-02-12T13:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => '',
      'kind' => 'all',
    ],
    [
      'id' => '14',
      'title' => '町田店入庫',
      'start' => '2026-02-13T13:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => '',
      'kind' => 'shipper',
    ],
    [
      'id' => '15',
      'title' => 'フェス出荷完了',
      'start' => '2026-02-14T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'done',
      'kind' => 'warehouse',
    ],
    [
      'id' => '16',
      'title' => 'フェス出荷完了',
      'start' => '2026-02-15T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'done',
      'kind' => 'partner',
    ],
    [
      'id' => '17',
      'title' => 'フェス出荷完了',
      'start' => '2026-02-16T12:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => 'done',
      'kind' => 'all',
    ],
    [
      'id' => '18',
      'title' => 'フェス入庫',
      'start' => '2026-02-17T13:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => '',
      'kind' => 'shipper',
    ],
    [
      'id' => '19',
      'title' => '制作会社→POP',
      'start' => '2026-02-18T13:00:00',
      'end' => '2026-02-02T13:00:00',
      'status' => '',
      'kind' => 'warehouse',
    ],
    [
      'id' => '20',
      'title' => '札幌支店へ入荷',
      'start' => '2026-02-24T13:00:00',
      'end' => '2026-02-24T13:00:00',
      'status' => 'deon',
      'kind' => 'warehouse',
    ],
  ];

/**
 * JSON レスポンスを返却
 *
 * count  : イベント件数
 * events : イベント一覧
 */
header('Content-Type: application/json');
echo json_encode([
    'count' => count($result),
    'events' => $result,
], JSON_UNESCAPED_UNICODE);

?>
