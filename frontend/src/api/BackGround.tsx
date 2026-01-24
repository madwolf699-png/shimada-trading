/**
 * バックグラウンドで外部 API を呼び出す共通関数。
 *
 * 指定された API 名をもとに `/api/{apiName}.php` へ POST リクエストを送信し、
 * JSON レスポンスをそのまま返却する。
 *
 * リクエストおよびレスポンスの型はジェネリクスで指定する。
 *
 * @template TRequest  リクエストボディの型
 * @template TResponse レスポンスデータの型
 *
 * @param {string} apiName 呼び出す API 名（URL の一部として使用）
 * @param {TRequest} payload API に送信するリクエストデータ
 *
 * @returns {Promise<TResponse>} API から返却されるレスポンスデータ
 *
 * @throws {Error} HTTP ステータスが正常（2xx）でない場合
 *
 * @example
 * ```ts
 * const events = await backGroundApi<
 *   { from: string; to: string },
 *   CalendarEvent[]
 * >("getEvents", { from: "2026-02-01", to: "2026-02-28" });
 * ```
 */
export async function backGroundApi<TRequest, TResponse>(
  apiName: string,
  payload: TRequest
): Promise<TResponse> {
  //const res = await fetch(`http://localhost:8080/api/${apiName}`, {
  const res = await fetch(`/api/${apiName}.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  console.log(res);
  return res.json() as Promise<TResponse>;
  /*
  const allEvents = [
    {
      id: '1',
      title: '橋本店未入荷',
      start: `2026-02-01T10:00:00`,
      end: `2026-02-01T11:00:00`,
      status: 'error',
      kind: 'all',
    },
    {
      id: '2',
      title: '超過・数量エラー',
      start: `2026-02-02T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'error',
      kind: 'shipper',
    },
    {
      id: '3',
      title: '想定在庫入の介入必須',
      start: `2026-02-02T13:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'warning',
      kind: 'warehouse',
    },
    {
      id: '4',
      title: '使用想定在庫逼迫',
      start: `2026-02-02T14:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'wait',
      kind: 'partner',
    },
    {
      id: '5',
      title: '予定→想定在庫余裕確定',
      start: `2026-02-02T15:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'info',
      kind: 'all',
    },
    {
      id: '6',
      title: '予定・下書き',
      start: `2026-02-02T16:00:00`,
      end: `2026-02-02T13:00:00`,
      status: '',
      kind: 'shipper',
    },
    {
      id: '7',
      title: 'フェス出荷完了',
      start: `2026-02-03T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'done',
      kind: 'warehouse',
    },
    {
      id: '8',
      title: '沖縄出荷アイテム不足 他2件',
      start: `2026-02-04T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'warning',
      kind: 'partner',
    },
    {
      id: '9',
      title: '町田店出荷（返却予定あり）',
      start: `2026-02-05T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'wait',
      kind: 'all',
    },
    {
      id: '10',
      title: '相模原店入庫',
      start: `2026-02-06T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'info',
      kind: 'shipper',
    },
    {
      id: '11',
      title: '相模原店出庫',
      start: `2026-02-09T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'info',
      kind: 'warehouse',
    },
    {
      id: '12',
      title: 'フェス入庫',
      start: `2026-02-09T13:00:00`,
      end: `2026-02-02T13:00:00`,
      status: '',
      kind: 'partner',
    },
    {
      id: '13',
      title: '八王子店出荷承認待ち',
      start: `2026-02-12T13:00:00`,
      end: `2026-02-02T13:00:00`,
      status: '',
      kind: 'all',
    },
    {
      id: '14',
      title: '町田店入庫',
      start: `2026-02-13T13:00:00`,
      end: `2026-02-02T13:00:00`,
      status: '',
      kind: 'shipper',
    },
    {
      id: '15',
      title: 'フェス出荷完了',
      start: `2026-02-14T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'done',
      kind: 'warehouse',
    },
    {
      id: '16',
      title: 'フェス出荷完了',
      start: `2026-02-15T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'done',
      kind: 'partner',
    },
    {
      id: '17',
      title: 'フェス出荷完了',
      start: `2026-02-16T12:00:00`,
      end: `2026-02-02T13:00:00`,
      status: 'done',
      kind: 'all',
    },
    {
      id: '18',
      title: 'フェス入庫',
      start: `2026-02-17T13:00:00`,
      end: `2026-02-02T13:00:00`,
      status: '',
      kind: 'shipper',
    },
    {
      id: '19',
      title: '制作会社→POP',
      start: `2026-02-18T13:00:00`,
      end: `2026-02-02T13:00:00`,
      status: '',
      kind: 'warehouse',
    },
  ];

  return allEvents;
  */
}
