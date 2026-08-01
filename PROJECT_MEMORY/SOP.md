# KinetiQ 專案 SOP

## 開始開發

1. 讀取工作區 `AGENTS.md` 與全域文件。
2. 讀取本資料夾六份專案記憶文件。
3. 執行 `git status --short`、`git remote -v`，確認目前機器與同步狀態。
4. 開始修改前執行 `git pull github main`。
5. 安裝依賴後以 `npx vinext dev` 啟動。

## 修改原則

1. 優先維持 `app/page.tsx` 與 `app/globals.css` 的既有單頁架構。
2. 醫療相關文字使用「推測、輔助、參考」，不可宣稱診斷或治療。
3. 相機功能必須保留權限錯誤說明及拍照備援。
4. AR／姿態辨識必須保留手動校準備援。
5. 修改肌貼形狀時先確認 I、Y、雙 I 等術語與視覺一致。

## 驗證

```powershell
$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'
npx vinext build
```

涉及相機或 AR 時，另外用 HTTPS 公開網址在手機 Chrome／Safari 測試：

- 權限詢問是否出現。
- 前後鏡頭是否可切換。
- 關節是否能鎖定。
- 模型失敗時是否能手動校準。
- 肌貼是否跟隨目標並按比例縮放。

## 同步到 GitHub

```powershell
git add <本次檔案>
git commit -m "清楚描述修改"
git push github main
```

## 發布 Sites

1. 先成功完成 vinext build。
2. 取得短效 Sites repository credential，不可保存 Token。
3. 推送相同 commit 至 `sites/main`。
4. 將 `dist` 與 `.openai/hosting.json` 打包並保存新版本。
5. 部署、輪詢至成功，再回報公開網址。
6. 更新本專案 `DEV_LOG.md`。
