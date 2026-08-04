"use client";

import { useEffect, useRef } from "react";

const en: Record<string, string> = {
  "個人化智慧肌貼導引":"Personalized Kinesiology Tape Guide","訪客":"Guest","使用說明":"Help","切換亮色模式":"Switch to light mode","切換暗黑模式":"Switch to dark mode",
  "從不適關節與症狀開始，取得個人化肌貼參數與逐步貼附指引。":"Start with the affected joint and symptoms to receive personalized tape parameters and step-by-step guidance.","建立體驗檔案":"Create demo profile","直接以訪客開始":"Continue as guest","約 8 分鐘完成 · 體驗資料僅保存在此裝置 · 本服務不能取代醫療診斷":"About 8 minutes · Demo data stays on this device · This service does not replace medical advice",
  "你的導引流程":"Your guided flow","身體模型":"Body profile","不適關節":"Affected joint","運動項目":"Activity","不適位置":"Pain location","姿態校正":"Pose calibration","肌貼參數":"Tape plan","虛擬驗證":"Virtual preview","AR 導引":"AR guidance","貼後追蹤":"Follow-up",
  "建立身體比例並記錄不適原因":"Build body proportions and record the cause","選擇關節並描述目前的不適":"Choose a joint and describe your discomfort","選擇關節的前、後、內或外側":"Choose the front, back, inner, or outer side","依輪廓完成指定伸展動作":"Follow the outline to complete the stretch","計算種類、長度、方向與拉伸":"Calculate shape, length, direction, and tension","在實際操作前先確認方案":"Review the plan before application","逐段完成並檢查貼附結果":"Apply step by step and check the result","記錄效果並優化下次建議":"Track results and improve future recommendations",
  "影像隱私保護":"Image privacy","拍攝影像僅用於即時分析，不會公開分享。":"Images are used only for real-time analysis and are never shared publicly.",
  "建立個人化人體模型":"Create your body profile","選擇不適關節與感受":"Choose the joint and symptoms","選擇要進行的運動":"Choose your activity","依運動型態調整肌貼支撐建議":"Adjust tape support for the selected activity","確認不適位置":"Confirm discomfort location","準備姿態拍攝":"Prepare for pose capture","產生個人化肌貼方案":"Generate your personalized tape plan","模擬裁剪與貼附":"Simulate cutting and placement","AR 實際貼附導引":"AR application guidance","貼後追蹤與個人化分析":"Follow-up and personalized analysis",
  "生理性別":"Biological sex","女性":"Female","男性":"Male","年齡":"Age","歲":"yrs","身高":"Height","體重":"Weight","你的 BMI":"Your BMI","健康範圍":"Healthy range","BMI 僅作為身體比例估算參考":"BMI is used only as a body-proportion reference","體型":"Body type","纖細":"Slim","標準":"Average","健壯":"Athletic",
  "這次因為什麼原因而不適？":"What caused the discomfort?","扭傷":"Sprain","拉傷":"Strain","撞擊":"Impact","過度使用":"Overuse","你感受到哪種不適？":"What are you feeling?","痠痛":"Soreness","緊繃":"Tightness","紅腫":"Swelling","瘀青":"Bruising","發熱":"Warmth","無力":"Weakness",
  "點擊關節進行選擇":"Select a joint","模型預覽":"Model preview","目前選擇":"Selected","尚未選擇":"Not selected","請在下一步選擇不適關節":"Choose the affected joint in the next step","可選關節":"available joints","不適主要在哪個方向？":"Where is the discomfort located?","前側":"Front","後側":"Back","內側":"Inner","外側":"Outer","右側人體模型會顯示你在上一步選擇的關節位置。":"The model shows the joint selected in the previous step.",
  "這次準備進行什麼運動？":"What activity are you preparing for?","選擇最接近的運動，系統會在後續方案中調整支撐方向與穩定需求。":"Choose the closest activity so the plan can adjust support and stability.","健走":"Walking","跑步":"Running","深蹲":"Squats","啞鈴":"Dumbbells","騎腳踏車":"Cycling","羽球／網球":"Badminton / Tennis","尚未選擇運動":"No activity selected","請先選擇一項運動":"Choose an activity first","下一步將選擇需要支撐的關節位置":"Next, choose the joint that needs support","請點擊右側人體模型，選擇需要肌貼支撐的關節位置。":"Select the joint needing support on the body model.",
  "指定動作":"Required pose","肩膀維持自然":"Keep shoulders relaxed","手肘完全伸直":"Fully extend the elbow","手腕保持自然":"Keep the wrist neutral","髖部維持正面":"Keep hips facing forward","膝蓋完全伸直":"Fully extend the knee","腳踝保持自然":"Keep the ankle neutral","我已完成指定姿勢":"I completed the pose","重新校正":"Recalibrate","等待鏡頭":"Waiting for camera","姿態符合":"Pose confirmed",
  "分析完成":"Analysis complete","建議長度":"Recommended length","拉伸比例":"Tension","貼附方向":"Application direction","起始位置":"Starting point","方案依據":"Plan rationale","可能相關肌群：":"Related muscles:","下一步":"Next","選擇自行貼或是機台貼":"Choose self-application or machine","方案與檔案號碼會保留於本次紀錄":"The plan and file number will be saved in this session","自行貼":"Self-apply","機台貼":"Machine apply","透過手機完成剪裁與個人化肌貼導引":"Use your phone for cutting and personalized guidance","取得檔案號碼，前往智慧肌貼機台讀取方案":"Get a file number and load the plan at a smart tape machine","選擇此方式":"Choose","已選擇":"Selected","自行貼附":"Self-application","下一步將確認肌貼長度、剪裁形狀與貼附位置。":"Next, confirm tape length, cut shape, and placement.","確認並進入 Step 6":"Confirm and enter Step 6","查看機台位置":"View machine locations",
  "照片模擬與貼附檢查":"Photo simulation and placement check","肌貼長度":"Tape length","貼附角度":"Application angle","Y 型分支展開":"Y-branch spread","爪尾展開":"Fan-tail spread","收合":"Closed","建議":"Recommended","展開":"Expanded","裁剪長度":"Cut length","末端修圓角":"Round the ends","允許並開啟鏡頭":"Allow camera","使用手機相機拍照":"Take a phone photo","開啟即時鏡頭":"Open live camera","首次使用時，瀏覽器會詢問鏡頭權限。":"Your browser will request camera permission on first use.",
  "跟著畫面逐條貼附":"Follow the overlay step by step","固定第一條錨點":"Secure the first anchor","沿虛擬路徑貼附":"Apply along the virtual path","末端放鬆並拍攝驗證":"Release the end and capture the result","完成這一段，繼續下一步":"Complete this section","請使用鏡頭拍攝完成結果":"Capture the completed result","AR 貼附結果已確認":"AR result confirmed","相機":"Camera","關節":"Joint","比例":"Scale","肌貼":"Tape",
  "← 上一步":"← Back","繼續":"Continue","完成並返回首頁":"Finish and return home","儲存追蹤紀錄":"Save follow-up","正在準備下一步":"Preparing next step","啟動個人化導引":"Starting personalized guidance","了解，繼續操作":"Got it, continue","原型提醒":"Prototype note",
};

function translateText(value: string) {
  const trimmed = value.trim();
  if (en[trimmed]) return value.replace(trimmed, en[trimmed]);
  if (/^STEP \d+$/.test(trimmed)) return value;
  const step = trimmed.match(/^步驟 (\d+) \/ (\d+)$/); if (step) return `Step ${step[1]} / ${step[2]}`;
  const minutes = trimmed.match(/^約需 (\d+) 分鐘完成$/); if (minutes) return `About ${minutes[1]} min remaining`;
  return value;
}

export function usePageLanguage(language: "zh" | "en") {
  const originals = useRef(new WeakMap<Node, string>());
  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
    const root = document.querySelector("main"); if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const current = node.nodeValue ?? "";
      const saved = originals.current.get(node);
      if (language === "zh") {
        if (saved !== undefined) node.nodeValue = saved;
        continue;
      }
      let original = saved ?? current;
      let translated = translateText(original);
      if (saved !== undefined && current !== translated && current !== original) {
        original = current;
        originals.current.set(node, original);
        translated = translateText(original);
      }
      if (translated !== original) {
        if (saved === undefined) originals.current.set(node, original);
        node.nodeValue = translated;
      }
    }
    root.querySelectorAll<HTMLElement>("[aria-label],[title],[placeholder]").forEach((element) => {
      ["aria-label","title","placeholder"].forEach((attribute) => {
        const value = element.getAttribute(attribute); if (!value) return;
        const key = `data-original-${attribute}`; if (!element.hasAttribute(key)) element.setAttribute(key, value);
        const original = element.getAttribute(key) ?? value;
        element.setAttribute(attribute, language === "en" ? translateText(original) : original);
      });
    });
    localStorage.setItem("kinetiq-language", language);
  });
}
