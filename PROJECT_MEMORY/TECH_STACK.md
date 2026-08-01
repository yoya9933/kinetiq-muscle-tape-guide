# KinetiQ 技術棧

更新日期：2026-08-01

## 應用架構

- Next.js 16、React 19、TypeScript。
- vinext + Vite，輸出 Cloudflare Worker 相容 ESM。
- UI 主要位於 `app/page.tsx`，樣式位於 `app/globals.css`。
- 目前為單頁用戶端流程，狀態保存在 React state，沒有資料庫持久化。

## 相機與姿態辨識

- 相機使用 `navigator.mediaDevices.getUserMedia()`。
- 支援前後鏡頭切換、快門與原生手機拍照備援。
- AR 姿態辨識使用瀏覽器端 MediaPipe Pose Landmarker。
- 模型提供 33 個人體節點；目前映射肩、肘、腕、髖、膝與踝作為比例計算參考。
- 模型或 CDN 載入失敗時，使用者可點擊畫面手動指定目標關節。

## 重要路徑

- `app/page.tsx`：完整產品流程與互動。
- `app/globals.css`：視覺、響應式、肌貼形狀與 AR 疊圖。
- `public/kinetiq-home.png`：首頁主視覺。
- `.openai/hosting.json`：Sites 專案識別資訊，不存放秘密。

## 本機需求

- Node.js `>=22.13.0`。
- 安裝：`npm install`。
- Windows 開發建議使用：`npx vinext dev`。
- Windows 驗證建議使用：`$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'; npx vinext build`。

## Git 與部署

- 私人 GitHub：`https://github.com/yoya9933/kinetiq-muscle-tape-guide`。
- Git remote `github`：桌電與筆電程式同步。
- Git remote `sites`：OpenAI Sites 發布來源。
- 公開網址：`https://muscle-tape-ai-guide.bowersbayley13783.chatgpt.site`。
- Sites project ID 存於 `.openai/hosting.json`；不要把短效憑證或 Token 寫入文件。
