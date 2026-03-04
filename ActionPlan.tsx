@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    @apply bg-gray-100 text-gray-900;
  }
}

@layer components {
  /* Custom styles for range slider */
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 28px;
    background: #ef4444;
    cursor: pointer;
    border-radius: 50%;
    margin-top: -10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  input[type=range]::-webkit-slider-runnable-track {
    height: 8px;
    background: #fee2e2;
    border-radius: 4px;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Print Control Styles */
@media screen {
  /* 画面上では印刷用コンテナを隠すが、DOMには残してグラフを描画させる */
  .batch-print-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    z-index: -1;
  }
}

@media print {
  @page {
    size: A4;
    margin: 10mm; /* Added margin to prevent edge cutting */
  }

  body {
    background-color: white !important;
    font-size: 8pt; /* Slightly increased for readability */
    line-height: 1.2;
    color: black !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 画面用UIを隠す */
  .screen-view-container,
  .no-print,
  .sticky,
  header,
  nav,
  footer,
  .fixed {
    display: none !important;
  }

  /* 印刷用コンテナを表示 */
  .batch-print-container {
    position: static !important;
    display: block !important;
    width: 100% !important;
    height: auto !important;
    visibility: visible !important;
    overflow: visible !important;
  }

  .print-break-inside-avoid {
    break-inside: avoid;
  }

  /* 改ページ設定 */
  .page-break {
    page-break-after: always;
    break-after: page;
    min-height: 1px;
    padding-top: 10mm; /* Add spacing at top of new page */
  }

  /* フォントサイズ調整 */
  h1 {
    font-size: 16pt !important;
    margin-bottom: 4px !important;
  }

  h2 {
    font-size: 13pt !important;
    margin-bottom: 6px !important;
  }

  h3 {
    font-size: 11pt !important;
    margin-bottom: 4px !important;
  }

  /* 3カラムレイアウト（詳細項目用） */
  .print-grid-cols-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    align-items: start;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }

  /* 詳細項目のボックススタイル */
  .detail-item-box {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 4px;
    margin: 0;
    break-inside: avoid;
    height: 100%;
  }

  /* 詳細項目のフォントサイズを調整 */
  .detail-item-text {
    font-size: 7.5pt !important;
    line-height: 1.2 !important;
  }

  .detail-item-score {
    font-size: 8.5pt !important;
  }

  /* 印刷時のグラフエリア確保 */
  .print-chart-container {
    width: 100%;
    height: 180px; /* Increased height for better chart visibility */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 印刷時のチャートボックス */
  .print-chart-box {
    padding: 4px !important;
    margin-top: 4px !important;
    border: 1px solid #ccc !important;
  }
}
