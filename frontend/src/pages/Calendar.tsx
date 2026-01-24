import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // FullCalendarコンポーネント
import dayGridPlugin from '@fullcalendar/daygrid'; // 月間カレンダー
import timeGridPlugin from '@fullcalendar/timegrid'; // 週間・日間カレンダー
import interactionPlugin from '@fullcalendar/interaction'; // ユーザー操作対応
import jaLocale from '@fullcalendar/core/locales/ja';
import tippy from 'tippy.js';
import type { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import type { components } from '../api/types.tsx';
import { backGroundApi } from '../api/BackGround.tsx';

type EventsRequest = components['schemas']['EventsRequest'];
type EventsResponse = components['schemas']['EventsResponse'];

/**
 * イベント状態ごとの背景色・文字色定義
 */
const EVENT_COLOR_RED = '#ff0000';
const EVENT_COLOR_ORANGE = '#eec510';
const EVENT_COLOR_YELLOW = '#ffff00';
const EVENT_COLOR_BLUE = '#6baaf3';
const EVENT_COLOR_GRAY = '#e0e0e0';
const EVENT_COLOR_GREEN = '#03221f';
const EVENT_COLOR_WHITE = '#ffffff';

/**
 * FullCalendar のイベント表示内容をカスタマイズするレンダラー
 *
 * extendedProps に設定された背景色・文字色を使用して
 * イベントタイトルを装飾表示する。
 *
 * @param {Object} eventInfo - FullCalendar から渡されるイベント情報
 * @param {Object} eventInfo.event - イベントオブジェクト
 * @returns {JSX.Element} カスタマイズされたイベント表示要素
 */
function renderEventContent(eventInfo: any) {
  const bg = eventInfo.event.extendedProps.bgColor || '#e0e0e0';
  const fg = eventInfo.event.extendedProps.fgColor || '#000';

  return (
    <div
      style={{
        backgroundColor: bg,
        color: fg,
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        display: 'inline-block',
        /* タイトル部分を自動改行 */
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.2',
      }}
    >
      {eventInfo.event.title}
    </div>
  );
}

/**
 * カレンダー画面コンポーネント
 *
 * - バックエンドAPIからイベント情報を取得
 * - 種別（kind）によるフィルタリング
 * - FullCalendar による月・週・日表示
 * - Tippy.js を用いたイベント詳細の吹き出し表示
 *
 * @component
 * @returns {JSX.Element} カレンダー画面
 */
function Calendar() {
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [kindSelected, setKindSelected] = useState('all');
  const tippyInstancesRef = useRef<Instance[]>([]);

  /**
   * イベント種別（kind）ラジオボタン変更時のハンドラ
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - changeイベント
   */
  const kindHandleChange = (e: any) => {
    setKindSelected(e.target.value);
  };

  /**
   * イベントのステータスから背景色を取得する
   *
   * @param {string} status - イベントステータス
   * @returns {string} 背景色（HEX）
   */
  const getBgColor = (status: string) => {
    switch (status) {
      case 'error':
        return EVENT_COLOR_RED;
      case 'warning':
        return EVENT_COLOR_ORANGE;
      case 'info':
        return EVENT_COLOR_BLUE;
      case 'done':
        return EVENT_COLOR_GREEN;
      case 'wait':
        return EVENT_COLOR_YELLOW;
      default:
        return EVENT_COLOR_GRAY;
    }
  };

  /**
   * イベントのステータスから文字色を取得する
   *
   * @param {string} status - イベントステータス
   * @returns {string} 文字色（HEX）
   */
  const getFgColor = (status: string) => {
    switch (status) {
      case 'done':
        return EVENT_COLOR_WHITE;
      default:
        return '#000';
    }
  };

  useEffect(() => {
    /**
     * バックエンドAPIからイベント一覧を取得し、
     * FullCalendar 用の形式に変換して state に設定する
     *
     * @returns {Promise<void>}
     */
    const fetchEvents = async () => {
      try {
        const response = await backGroundApi<EventsRequest, EventsResponse>('events', {
          userId: 'user-001',
          from: 'calendar',
        }); // ← 実際のAPIに変更
        // FullCalendar用に組み立て
        const formattedEvents = response.events?.map((item: any) => ({
          id: item.id,
          title: item.title,
          start: item.start,
          end: item.end,
          kind: item.kind,
          extendedProps: {
            bgColor: getBgColor(item.status),
            fgColor: getFgColor(item.status),
          },
        }));
        setAllEvents(formattedEvents ? formattedEvents : []);
      } catch (err) {
        console.error('イベント取得失敗', err);
      }
    };
    fetchEvents();

    return () => {
      /**
       * コンポーネント unmount 時に
       * 作成済みの Tippy インスタンスをすべて破棄する
       */
      tippyInstancesRef.current.forEach((instance) => {
        instance.destroy();
      });
      tippyInstancesRef.current = [];
    };
  }, []);

  useEffect(() => {
    /* 以下のコードを実行すると、ラジオボタン選択後吹き出しが出なくなる
    return () => {
      // コンポーネント unmount 時に全破棄
      tippyInstancesRef.current.forEach((i) => i.destroy());
      tippyInstancesRef.current = [];
    };
    */
  }, [kindSelected]);

  /**
   * 選択中の種別（kind）に応じてフィルタリングされたイベント一覧
   */
  const filterdEvents = allEvents.filter((event) => {
    // 「すべて」が選択されている場合は全件表示
    if (kindSelected === 'all') return true;
    // event.kind が選択中の kind と一致するものだけ表示
    return event.kind === kindSelected;
  });

  // 読み込み中
  if (!allEvents.length) {
    return <div style={{ padding: 20 }}>読み込み中...</div>;
  }

  return (
    // 親要素を画面全体の高さ(100vh)にし、Flexboxで縦並びにする
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー部分は高さを固定または自動 */}
      <h4 style={{ textAlign: 'center', margin: '10px 0' }}>
        <label>
          <input
            type="radio"
            name="category"
            value="all"
            checked={kindSelected === 'all'}
            onChange={kindHandleChange}
          />
          すべて
        </label>
        <label style={{ marginLeft: '16px' }}>
          <input
            type="radio"
            name="category"
            value="shipper"
            checked={kindSelected === 'shipper'}
            onChange={kindHandleChange}
          />
          荷主
        </label>
        <label style={{ marginLeft: '16px' }}>
          <input
            type="radio"
            name="category"
            value="warehouse"
            checked={kindSelected === 'warehouse'}
            onChange={kindHandleChange}
          />
          倉庫
        </label>
        <label style={{ marginLeft: '16px' }}>
          <input
            type="radio"
            name="category"
            value="partner"
            checked={kindSelected === 'partner'}
            onChange={kindHandleChange}
          />
          協力会社
        </label>
      </h4>

      {/* カレンダー部分を flex: 1 にして残りの空間を全て埋める */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 20px 20px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          locale={jaLocale}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={filterdEvents}
          editable={true}
          selectable={true}
          // 重要: カレンダーの高さを親要素(div)いっぱいにする
          height="100%"
          dateClick={(info) => window.alert(`日付: ${info.dateStr}`)}
          //eventClick={(info) => window.alert(`イベント: ${info.event.title}`)}
          eventContent={renderEventContent}
          firstDay={1}
          /**
           * イベント描画後に呼ばれ、以下を行う
           * - イベント要素の背景色・文字色調整
           * - Tippy.js による詳細ポップアップ設定
           * - インスタンスを ref に保持（後で破棄するため）
           */
          eventDidMount={(info) => {
            const bgColor = info.event.extendedProps.bgColor;
            const fgColor = info.event.extendedProps.fgColor || '#000';
            if (bgColor) {
              // イベント全体（timeGrid の青バー含む）
              info.el.style.backgroundColor = bgColor;
              info.el.style.borderColor = bgColor;
              // タイトル側（eventContent を使っているため念押し）
              const main = info.el.querySelector('.fc-event-main');
              if (main) {
                (main as HTMLElement).style.backgroundColor = bgColor;
                (main as HTMLElement).style.color = fgColor;
              }
            }

            const instance = tippy(info.el, {
              content: `
        <strong>${info.event.title}</strong><br/>
        ${info.event.startStr} 〜 ${info.event.endStr}
      `,
              allowHTML: true,
              placement: 'top',
              interactive: true,
              trigger: 'click',
              /* 吹き出しの色をタイトルに合わせる */
              onShow(instance: any) {
                const box = instance.popper.querySelector('.tippy-box') as HTMLElement;
                const arrow = instance.popper.querySelector('.tippy-arrow') as HTMLElement;
                if (box) {
                  box.style.backgroundColor = bgColor;
                  box.style.color = fgColor;
                }
                if (arrow) {
                  arrow.style.color = bgColor;
                }
              },
            });
            // ここで保持
            tippyInstancesRef.current.push(instance);
          }}
        />
      </div>
    </div>
  );
}
export default Calendar;
