"use client";

import { useMemo, useState } from "react";

const steps = [
  { short: "身體模型", title: "建立個人化人體模型", hint: "建立肌肉節點與身體比例" },
  { short: "不適區域", title: "選擇不適區域", hint: "定位部位與相關肌群" },
  { short: "症狀分析", title: "描述你的不適", hint: "用簡單問答縮小可能肌群" },
  { short: "姿態校正", title: "準備姿態拍攝", hint: "依輪廓完成指定伸展動作" },
  { short: "肌貼參數", title: "產生個人化肌貼方案", hint: "計算種類、長度、方向與拉伸" },
  { short: "虛擬驗證", title: "模擬裁剪與貼附", hint: "在實際操作前先確認方案" },
  { short: "AR 導引", title: "AR 實際貼附導引", hint: "逐段完成並檢查貼附結果" },
];

const regions = [
  { name: "左手", muscles: "肱二頭肌 · 肱三頭肌", icon: "↙" },
  { name: "右手", muscles: "肱二頭肌 · 肱三頭肌", icon: "↘" },
  { name: "左腿", muscles: "股四頭肌 · 腿後肌群 · 小腿肌群", icon: "◐" },
  { name: "右腿", muscles: "股四頭肌 · 腿後肌群 · 小腿肌群", icon: "◑" },
];

const answers = {
  direction: ["前側", "後側", "內側", "外側"],
  feeling: ["痠痛", "緊繃", "紅腫"],
  trigger: ["運動後", "長時間使用", "重複性動作", "不確定"],
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ gender: "女性", age: "28", height: "165", build: "標準" });
  const [region, setRegion] = useState("左腿");
  const [symptom, setSymptom] = useState({ direction: "後側", feeling: "緊繃", trigger: "運動後" });
  const [poseReady, setPoseReady] = useState(false);
  const [verified, setVerified] = useState(false);

  const selectedRegion = useMemo(() => regions.find((item) => item.name === region) ?? regions[1], [region]);
  const isArm = region.includes("手");
  const targetMuscle = isArm ? "肱二頭肌與肱三頭肌" : "腿後肌群（Hamstrings）";
  const poseTitle = isArm ? `伸展${region}` : `將${region}向前伸展`;
  const poseCopy = isArm
    ? `將${region}自然向外伸直，手掌朝上，直到感覺上臂肌群輕微拉伸。將身體放入透明輪廓內。`
    : `保持背部自然，伸直${region}，直到感覺腿後肌群輕微拉伸。將身體放入透明輪廓內。`;

  function next() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setStep(0)} aria-label="回到開始">
          <span className="brand-mark">K</span>
          <span>KinetiQ</span>
        </button>
        <div className="header-meta">
          <span className="status-dot" />
          <span>個人化肌貼導引</span>
          <button className="help-button" aria-label="使用說明">?</button>
        </div>
      </header>

      <div className="app-shell">
        <aside className="sidebar" aria-label="操作進度">
          <p className="eyebrow">你的導引流程</p>
          <div className="progress-list">
            {steps.map((item, index) => (
              <button
                key={item.short}
                className={`progress-item ${index === step ? "active" : ""} ${index < step ? "done" : ""}`}
                onClick={() => index <= step && setStep(index)}
                disabled={index > step}
              >
                <span className="step-number">{index < step ? "✓" : index + 1}</span>
                <span>
                  <b>{item.short}</b>
                  <small>{item.hint}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="privacy-note">
            <span>⌾</span>
            <p><b>影像隱私保護</b><br />拍攝影像僅用於即時分析，不會公開分享。</p>
          </div>
        </aside>

        <section className="workspace">
          <div className="mobile-progress">
            <span>步驟 {step + 1} / {steps.length}</span>
            <div><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          </div>

          <div className="content-head">
            <p className="eyebrow">STEP {String(step + 1).padStart(2, "0")}</p>
            <h1>{steps[step].title}</h1>
            <p>{steps[step].hint}</p>
          </div>

          <div className="stage">
            {step === 0 && (
              <div className="two-column">
                <div className="form-card">
                  <label>生理性別
                    <div className="segmented">
                      {["女性", "男性"].map((value) => <button key={value} className={profile.gender === value ? "selected" : ""} onClick={() => setProfile({ ...profile, gender: value })}>{value}</button>)}
                    </div>
                  </label>
                  <div className="field-row">
                    <label>年齡<input value={profile.age} inputMode="numeric" onChange={(e) => setProfile({ ...profile, age: e.target.value })} /><span>歲</span></label>
                    <label>身高<input value={profile.height} inputMode="numeric" onChange={(e) => setProfile({ ...profile, height: e.target.value })} /><span>cm</span></label>
                  </div>
                  <label>體型
                    <div className="build-options">
                      {["纖細", "標準", "健壯"].map((value) => <button key={value} className={profile.build === value ? "selected" : ""} onClick={() => setProfile({ ...profile, build: value })}><i className={`body-shape ${value}`} />{value}</button>)}
                    </div>
                  </label>
                  <button className="camera-option"><span>＋</span><div><b>使用手機鏡頭估測體型</b><small>更精準建立你的身體比例（選填）</small></div><em>開始掃描 →</em></button>
                </div>
                <ModelPanel profile={profile} region={region} />
              </div>
            )}

            {step === 1 && (
              <div className="two-column">
                <div>
                  <div className="region-grid">
                    {regions.map((item) => (
                      <button key={item.name} className={`region-card ${region === item.name ? "selected" : ""}`} onClick={() => setRegion(item.name)}>
                        <span>{item.icon}</span><div><b>{item.name}</b><small>{item.muscles}</small></div><i>✓</i>
                      </button>
                    ))}
                  </div>
                  <div className="info-strip">選擇後，系統會載入該部位的肌肉資料、常見不適原因與適用肌貼類型。</div>
                </div>
                <ModelPanel profile={profile} region={region} highlight />
              </div>
            )}

            {step === 2 && (
              <div className="question-card">
                <div className="summary-chip"><span>目前選擇</span><b>{region}</b><small>{selectedRegion.muscles}</small></div>
                <ChoiceQuestion number="01" title="不適主要在哪個方向？" choices={answers.direction} value={symptom.direction} onChange={(value) => setSymptom({ ...symptom, direction: value })} />
                <ChoiceQuestion number="02" title="你感受到哪種不適？" choices={answers.feeling} value={symptom.feeling} onChange={(value) => setSymptom({ ...symptom, feeling: value })} />
                <ChoiceQuestion number="03" title="不適通常在什麼情況發生？" choices={answers.trigger} value={symptom.trigger} onChange={(value) => setSymptom({ ...symptom, trigger: value })} />
              </div>
            )}

            {step === 3 && (
              <div className="camera-stage">
                <div className="camera-view">
                  <div className="scan-line" />
                  <div className="pose-figure">
                    <i className="head" /><i className="torso" /><i className="arm left" /><i className="arm right" /><i className="leg left" /><i className="leg right" />
                    {[0,1,2,3,4,5].map((n) => <b key={n} className={`joint j${n}`} />)}
                  </div>
                  <div className="frame-corner c1" /><div className="frame-corner c2" /><div className="frame-corner c3" /><div className="frame-corner c4" />
                  <span className="camera-badge">{poseReady ? "姿態符合" : "等待鏡頭"}</span>
                </div>
                <div className="instruction-panel">
                  <p className="eyebrow">指定動作</p>
                  <h2>{poseTitle}</h2>
                  <p>{poseCopy}</p>
                  <ul>{isArm ? <><li className="ok">肩膀維持自然</li><li className={poseReady ? "ok" : ""}>手肘完全伸直</li><li className={poseReady ? "ok" : ""}>手腕保持自然</li></> : <><li className="ok">髖部維持正面</li><li className={poseReady ? "ok" : ""}>膝蓋完全伸直</li><li className={poseReady ? "ok" : ""}>腳踝保持自然</li></>}</ul>
                  <button className="secondary-button" onClick={() => setPoseReady(!poseReady)}>{poseReady ? "重新校正" : "模擬啟用鏡頭"}</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="result-layout">
                <div className="tape-visual">
                  <span className="result-badge">分析完成</span>
                  <div className="tape-shape"><i /><i /></div>
                  <b>{isArm ? "I 型肌貼" : "Y 型肌貼"}</b>
                  <small>{isArm ? "適合上臂肌群單一路徑" : "適合腿後肌群分支走向"}</small>
                </div>
                <div className="metrics">
                  <div><span>建議長度</span><b>22 <small>cm</small></b><em>肌肉路徑 20 cm + 錨點預留</em></div>
                  <div><span>拉伸比例</span><b>25<small>%</small></b><em>中度支撐，不影響活動</em></div>
                  <div><span>貼附方向</span><b>由下往上</b><em>沿{isArm ? "上臂" : "腿後"}肌群排列方向</em></div>
                  <div><span>起始位置</span><b>{isArm ? "手肘上方" : "膝窩上方"}</b><em>保留 3 cm 無拉力錨點</em></div>
                </div>
                <div className="reason-card"><b>方案依據</b><p>{profile.height} cm · {profile.build}體型 · {region}{symptom.direction} · {symptom.feeling} · {symptom.trigger}</p><p>可能相關肌群：<strong>{targetMuscle}</strong></p></div>
              </div>
            )}

            {step === 5 && (
              <div className="simulation-layout">
                <div className="cutting-board">
                  <span className="camera-badge">AR 裁剪預覽</span>
                  <div className="ruler">{[0,5,10,15,20].map((n) => <span key={n}>{n}</span>)}</div>
                  <div className="tape-strip"><i className="cut-line" /><b>從此處分叉</b><em>保留 5 cm 錨點</em></div>
                  <p>將未裁剪的肌貼平放於畫面範圍內</p>
                </div>
                <div className="check-panel">
                  <h2>裁剪與貼附檢查</h2>
                  <div className="check-row"><span>01</span><p><b>裁剪長度</b><small>22 cm，末端修圓角</small></p><i>✓</i></div>
                  <div className="check-row"><span>02</span><p><b>Y 型分支</b><small>從 5 cm 錨點後開始</small></p><i>✓</i></div>
                  <div className="check-row"><span>03</span><p><b>貼附方向</b><small>膝窩上方至坐骨方向</small></p><i>{verified ? "✓" : "—"}</i></div>
                  <button className="secondary-button" onClick={() => setVerified(true)}>{verified ? "方案已通過驗證" : "模擬驗證方案"}</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="ar-layout">
                <div className="phone-frame">
                  <div className="phone-camera">
                    <span>AR LIVE</span>
                    <div className="ar-leg"><i /><b className="virtual-tape t1" /><b className="virtual-tape t2" /></div>
                    <div className="anchor-label">① 對準起點</div>
                    <div className="stretch-label">保持 25% 拉伸</div>
                  </div>
                </div>
                <div className="ar-guide">
                  <span className="result-badge">準備完成</span>
                  <h2>跟著畫面逐段貼附</h2>
                  <p>真人影像會與虛擬肌貼疊加顯示。依照起點、方向與拉伸提示完成貼附。</p>
                  <ol><li className="current"><span>1</span><div><b>固定無拉力錨點</b><small>膝窩上方約 3 cm</small></div></li><li><span>2</span><div><b>沿肌肉方向貼附</b><small>維持約 25% 拉伸</small></div></li><li><span>3</span><div><b>完成末端固定</b><small>末端 3 cm 不施加拉力</small></div></li></ol>
                  <div className="medical-note"><b>注意</b> 若出現明顯紅腫、劇烈疼痛或麻木，請停止使用並諮詢醫療專業人員。</div>
                </div>
              </div>
            )}
          </div>

          <footer className="actions">
            <button className="back-button" onClick={back} disabled={step === 0}>← 上一步</button>
            <span>約需 {Math.max(1, 7 - step)} 分鐘完成</span>
            {step < 6 ? <button className="primary-button" onClick={next} disabled={step === 3 && !poseReady}>繼續 <span>→</span></button> : <button className="primary-button" onClick={() => { setStep(0); setPoseReady(false); setVerified(false); }}>完成並重新開始 <span>↻</span></button>}
          </footer>
        </section>
      </div>
    </main>
  );
}

function ChoiceQuestion({ number, title, choices, value, onChange }: { number: string; title: string; choices: string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset><legend><span>{number}</span>{title}</legend><div className="choice-row">{choices.map((choice) => <button type="button" key={choice} className={value === choice ? "selected" : ""} onClick={() => onChange(choice)}>{choice}<i>✓</i></button>)}</div></fieldset>;
}

function ModelPanel({ profile, region, highlight = false }: { profile: { gender: string; age: string; height: string; build: string }; region: string; highlight?: boolean }) {
  return <div className="model-panel"><div className="model-top"><span>3D BODY MAP</span><span className="live-chip">● 模型預覽</span></div><div className="body-model"><div className="human"><i className="h-head" /><i className="h-neck" /><i className="h-body" /><i className="h-arm left" /><i className="h-arm right" /><i className="h-leg left" /><i className="h-leg right" />{[0,1,2,3,4,5,6,7].map((n) => <b key={n} className={`node n${n} ${highlight ? "visible" : ""}`} />)}{highlight && <em className={`muscle-highlight ${region}`} />}</div><div className="orbit o1" /><div className="orbit o2" /></div><div className="model-stats"><span><b>{profile.height}</b> cm<small>身高</small></span><span><b>{profile.build}</b><small>體型</small></span><span><b>24</b> points<small>肌肉節點</small></span></div></div>;
}
