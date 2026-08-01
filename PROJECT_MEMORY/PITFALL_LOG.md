# KinetiQ 踩坑日誌

## Windows npm script 相容性

症狀：`npm run build` 顯示 `WRANGLER_LOG_PATH is not recognized`。

原因：`package.json` 使用 Unix 形式的行內環境變數，在 PowerShell／cmd 不相容。

目前做法：

```powershell
$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'
npx vinext build
```

後續可評估使用 `cross-env`，但不要為此任意更換整體建置架構。

## 手機鏡頭無法開啟

常見原因：內嵌瀏覽器限制、未授權、沒有 HTTPS、鏡頭被其他程式占用或裝置沒有鏡頭。

處理方式：公開網站使用 HTTPS；提示改用 Chrome／Safari；提供原生拍照備援。

## AR 模型載入失敗

原因可能是網路、CDN、WebAssembly、GPU delegate 或瀏覽器支援狀態。

處理方式：保留手動點擊關節校準，不讓核心貼附流程完全阻塞。

## 肌貼類型誤判

- I 型不是字母造型，而是完整未分叉直條。
- Y 型是一端共同錨點加兩條分叉尾端。
- 膝部交叉包覆圖示屬於兩條獨立 I 型，不是 Y 型。

## Git 與 Sites 遠端

專案同時具有 `github` 與 `sites` remote。推送前必須確認目標；一般跨裝置同步推送 `github/main`，正式發布依 Sites 流程推送 `sites/main`。
