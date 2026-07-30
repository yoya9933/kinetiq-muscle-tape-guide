"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const steps = [
  { short: "身體模型", title: "建立個人化人體模型", hint: "建立肌肉節點與身體比例" },
  { short: "不適關節", title: "選擇不適關節", hint: "點選卡片或直接點人體關節" },
  { short: "症狀分析", title: "描述你的不適", hint: "用簡單問答縮小可能肌群" },
  { short: "姿態校正", title: "準備姿態拍攝", hint: "依輪廓完成指定伸展動作" },
  { short: "肌貼參數", title: "產生個人化肌貼方案", hint: "計算種類、長度、方向與拉伸" },
  { short: "虛擬驗證", title: "模擬裁剪與貼附", hint: "在實際操作前先確認方案" },
  { short: "AR 導引", title: "AR 實際貼附導引", hint: "逐段完成並檢查貼附結果" },
];

const joints = [
  { name: "左肘", muscles: "肱二頭肌 · 肱三頭肌", icon: "肘", node: "left-elbow" },
  { name: "右肘", muscles: "肱二頭肌 · 肱三頭肌", icon: "肘", node: "right-elbow" },
  { name: "左腕", muscles: "前臂屈肌群 · 伸肌群", icon: "腕", node: "left-wrist" },
  { name: "右腕", muscles: "前臂屈肌群 · 伸肌群", icon: "腕", node: "right-wrist" },
  { name: "左膝", muscles: "股四頭肌 · 腿後肌群", icon: "膝", node: "left-knee" },
  { name: "右膝", muscles: "股四頭肌 · 腿後肌群", icon: "膝", node: "right-knee" },
  { name: "左踝", muscles: "腓腸肌 · 脛前肌", icon: "踝", node: "left-ankle" },
  { name: "右踝", muscles: "腓腸肌 · 脛前肌", icon: "踝", node: "right-ankle" },
];

const answers = {
  direction: ["前側", "後側", "內側", "外側"],
  feeling: ["痠痛", "緊繃", "紅腫"],
  trigger: ["扭傷", "拉傷", "撞擊", "過度使用"],
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ gender: "女性", age: "28", height: "165", weight: "60", build: "標準" });
  const [region, setRegion] = useState("左膝");
  const [symptom, setSymptom] = useState({ direction: "後側", feeling: "緊繃", trigger: "扭傷" });
  const [poseReady, setPoseReady] = useState(false);
  const [verified, setVerified] = useState(false);
  const [simulationPhoto, setSimulationPhoto] = useState("");
  const [tapeLength, setTapeLength] = useState(22);
  const [tapeRotation, setTapeRotation] = useState(-6);
  const [tapePosition, setTapePosition] = useState({ x: 50, y: 50 });
  const simulationRef = useRef<HTMLDivElement>(null);

  const selectedRegion = useMemo(() => joints.find((item) => item.name === region) ?? joints[4], [region]);
  const isArm = ["肩", "肘", "腕"].some((joint) => region.includes(joint));
  const targetMuscle = selectedRegion.muscles;
  const poseTitle = isArm ? `伸展${region}周圍肌群` : `伸展${region}周圍肌群`;
  const poseCopy = isArm
    ? `將${region.slice(0, 1)}手自然向外伸直，緩慢調整手掌方向，直到${region}周圍感到輕微拉伸。將身體放入透明輪廓內。`
    : `保持背部自然，緩慢伸直${region.slice(0, 1)}腿，直到${region}周圍肌群感到輕微拉伸。將身體放入透明輪廓內。`;
  const bmi = Number(profile.height) > 0 ? Number(profile.weight) / ((Number(profile.height) / 100) ** 2) : 0;
  const bmiLabel = bmi < 18.5 ? "體重過輕" : bmi < 24 ? "健康範圍" : bmi < 27 ? "體重偏高" : "肥胖範圍";

  function next() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function moveSimulatedTape(clientX: number, clientY: number) {
    const rect = simulationRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTapePosition({
      x: Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(15, Math.min(85, ((clientY - rect.top) / rect.height) * 100)),
    });
    setVerified(false);
  }

  if (!started) {
    return (
      <main className="landing-page">
        <img src="/kinetiq-home.png" alt="KinetiQ 個人化智慧肌貼導引：身體模型、症狀分析、姿勢矯正、肌貼方案、模擬預覽與 AR 導引" />
        <div className="landing-shade" />
        <div className="landing-top">
          <span className="landing-logo"><i>K</i>KinetiQ</span>
          <span>個人化智慧肌貼導引</span>
        </div>
        <div className="landing-action">
          <p>從不適關節與症狀開始，取得個人化肌貼參數與逐步貼附指引。</p>
          <button onClick={() => setStarted(true)}>開始個人化導引 <span>→</span></button>
          <small>約 7 分鐘完成 · 本服務為操作輔助，不能取代醫療診斷</small>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => { setStep(0); setStarted(false); }} aria-label="回到首頁">
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
                  <div className="field-row profile-fields">
                    <label>年齡<input value={profile.age} inputMode="numeric" onChange={(e) => setProfile({ ...profile, age: e.target.value })} /><span>歲</span></label>
                    <label>身高<input value={profile.height} inputMode="numeric" onChange={(e) => setProfile({ ...profile, height: e.target.value })} /><span>cm</span></label>
                    <label>體重<input value={profile.weight} inputMode="decimal" onChange={(e) => setProfile({ ...profile, weight: e.target.value })} /><span>kg</span></label>
                  </div>
                  <div className="bmi-card"><div><span>你的 BMI</span><b>{Number.isFinite(bmi) ? bmi.toFixed(1) : "—"}</b></div><div><strong>{bmiLabel}</strong><small>BMI 僅作為身體比例估算參考</small></div></div>
                  <label>體型
                    <div className="build-options">
                      {["纖細", "標準", "健壯"].map((value) => <button key={value} className={profile.build === value ? "selected" : ""} onClick={() => setProfile({ ...profile, build: value })}><i className={`body-shape ${value}`} />{value}</button>)}
                    </div>
                  </label>
                </div>
                <ModelPanel profile={profile} region={region} />
              </div>
            )}

            {step === 1 && (
              <div className="two-column">
                <div>
                  <div className="region-grid">
                    {joints.map((item) => (
                      <button key={item.name} className={`region-card ${region === item.name ? "selected" : ""}`} onClick={() => setRegion(item.name)}>
                        <span>{item.icon}</span><div><b>{item.name}</b><small>{item.muscles}</small></div><i>✓</i>
                      </button>
                    ))}
                  </div>
                  <div className="info-strip">可點選左側關節卡片，或直接點擊人體模型上的亮點。兩者會同步選取。</div>
                </div>
                <ModelPanel profile={profile} region={region} highlight onSelect={setRegion} />
              </div>
            )}

            {step === 2 && (
              <div className="question-card">
                <div className="summary-chip"><span>目前選擇</span><b>{region}</b><small>{selectedRegion.muscles}</small></div>
                <ChoiceQuestion number="01" title="不適主要在哪個方向？" choices={answers.direction} value={symptom.direction} onChange={(value) => setSymptom({ ...symptom, direction: value })} />
                <ChoiceQuestion number="02" title="你感受到哪種不適？" choices={answers.feeling} value={symptom.feeling} onChange={(value) => setSymptom({ ...symptom, feeling: value })} />
                <ChoiceQuestion number="03" title={`${region}因為什麼原因而不適？`} choices={answers.trigger} value={symptom.trigger} onChange={(value) => setSymptom({ ...symptom, trigger: value })} />
              </div>
            )}

            {step === 3 && (
              <div className="camera-stage">
                <div className="camera-view">
                  <CameraModule embedded onCapture={() => setPoseReady(true)} />
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
                  <button className="secondary-button" onClick={() => setPoseReady(!poseReady)}>{poseReady ? "重新校正" : "我已完成指定姿勢"}</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="result-layout">
                <div className="tape-visual">
                  <span className="result-badge">分析完成</span>
                  <div className={`tape-shape ${isArm ? "i-cut" : "y-cut"}`}><i /><i /></div>
                  <b>{isArm ? "I 型（單條未分叉）" : "Y 型（單端縱向分叉）"}</b>
                  <small>{isArm ? "一整條肌貼，兩端修圓" : "保留共同錨點，再沿中線剪出兩條尾端"}</small>
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
                <div className="simulation-camera">
                  {!simulationPhoto ? (
                    <>
                      <CameraModule onCapture={(image) => { setSimulationPhoto(image); setVerified(false); }} />
                      <div className="simulation-hint"><b>拍攝{region}貼附位置</b><small>請讓關節與周圍皮膚清楚出現在畫面中央</small></div>
                    </>
                  ) : (
                    <div
                      ref={simulationRef}
                      className="simulation-result"
                      onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); moveSimulatedTape(event.clientX, event.clientY); }}
                      onPointerMove={(event) => { if (event.buttons === 1) moveSimulatedTape(event.clientX, event.clientY); }}
                    >
                      <img src={simulationPhoto} alt={`${region}肌貼模擬照片`} />
                      <span className="camera-badge">模擬示意圖</span>
                      <div
                        className={`photo-tape ${isArm ? "i-shape" : "y-shape"}`}
                        style={{ left: `${tapePosition.x}%`, top: `${tapePosition.y}%`, transform: `translate(-50%,-50%) rotate(${tapeRotation}deg) scale(${tapeLength / 22})` }}
                      ><i /><i /><b>{tapeLength} cm</b></div>
                      <div className="photo-anchor">① 拖曳肌貼調整位置</div>
                      <div className="photo-direction">角度 {tapeRotation}°</div>
                      <div className="photo-stretch">25% 拉伸</div>
                      <button className="retake-button" onPointerDown={(event) => event.stopPropagation()} onClick={() => { setSimulationPhoto(""); setVerified(false); }}>↺ 重新拍攝</button>
                    </div>
                  )}
                </div>
                <div className="check-panel">
                  <h2>照片模擬與貼附檢查</h2>
                  <div className="tape-control"><label><span>肌貼長度</span><b>{tapeLength} cm</b></label><input type="range" min="12" max="35" value={tapeLength} onChange={(event) => { setTapeLength(Number(event.target.value)); setVerified(false); }} /></div>
                  <div className="tape-control"><label><span>貼附角度</span><b>{tapeRotation}°</b></label><input type="range" min="-90" max="90" value={tapeRotation} onChange={(event) => { setTapeRotation(Number(event.target.value)); setVerified(false); }} /></div>
                  <div className="check-row"><span>01</span><p><b>裁剪長度</b><small>{tapeLength} cm，末端修圓角</small></p><i>{simulationPhoto ? "✓" : "—"}</i></div>
                  <div className="check-row"><span>02</span><p><b>{isArm ? "I 型：單條未分叉" : "Y 型：單端縱向分叉"}</b><small>{isArm ? "整條直接沿肌肉路徑貼附，兩端修圓" : "保留 5 cm 共同錨點，其餘沿中線分成兩尾"}</small></p><i>✓</i></div>
                  <div className="check-row"><span>03</span><p><b>貼附方向</b><small>沿{region}周圍肌群向上貼附</small></p><i>{verified ? "✓" : "—"}</i></div>
                  <button className="secondary-button" disabled={!simulationPhoto} onClick={() => setVerified(true)}>{verified ? `已確認 ${tapeLength} cm 與貼附位置` : simulationPhoto ? "確認長度與貼附位置" : "請先拍攝貼附位置"}</button>
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
            {step < 6 ? <button className="primary-button" onClick={next} disabled={step === 3 && !poseReady}>繼續 <span>→</span></button> : <button className="primary-button" onClick={() => { setStep(0); setPoseReady(false); setVerified(false); setStarted(false); }}>完成並返回首頁 <span>↻</span></button>}
          </footer>
        </section>
      </div>
    </main>
  );
}

function ChoiceQuestion({ number, title, choices, value, onChange }: { number: string; title: string; choices: string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset><legend><span>{number}</span>{title}</legend><div className="choice-row">{choices.map((choice) => <button type="button" key={choice} className={value === choice ? "selected" : ""} onClick={() => onChange(choice)}>{choice}<i>✓</i></button>)}</div></fieldset>;
}

function ModelPanel({ profile, region, highlight = false, onSelect }: { profile: { gender: string; age: string; height: string; build: string }; region: string; highlight?: boolean; onSelect?: (joint: string) => void }) {
  return (
    <div className={`model-panel ${onSelect ? "interactive" : ""}`}>
      <div className="model-top">
        <span>3D JOINT MAP</span>
        <span className="live-chip">● {onSelect ? "點擊關節進行選擇" : "模型預覽"}</span>
      </div>
      <div className="body-model">
        <div className="human">
          <i className="h-head" /><i className="h-neck" /><i className="h-body" />
          <i className="h-arm left" /><i className="h-arm right" />
          <i className="h-leg left" /><i className="h-leg right" />
          {joints.map((joint) => (
            <button
              type="button"
              key={joint.name}
              aria-label={`選擇${joint.name}`}
              title={joint.name}
              disabled={!onSelect}
              onClick={() => onSelect?.(joint.name)}
              className={`node ${joint.node} ${highlight ? "visible" : ""} ${region === joint.name ? "active" : ""}`}
            >
              <span>{joint.name}</span>
            </button>
          ))}
        </div>
        <div className="orbit o1" /><div className="orbit o2" />
      </div>
      <div className="selected-joint">
        <span>目前選擇</span><b>{region}</b>
        <small>{joints.find((joint) => joint.name === region)?.muscles}</small>
      </div>
      <div className="model-stats">
        <span><b>{profile.height}</b> cm<small>身高</small></span>
        <span><b>{profile.build}</b><small>體型</small></span>
        <span><b>8</b> joints<small>可選關節</small></span>
      </div>
    </div>
  );
}

function CameraModule({ embedded = false, onCapture }: { embedded?: boolean; onCapture: (image: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [status, setStatus] = useState<"idle" | "starting" | "live" | "error">("idle");
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState("");
  const [isEmbeddedBrowser, setIsEmbeddedBrowser] = useState(false);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startCamera(mode = facingMode) {
    stopCamera();
    setStatus("starting");
    setError("");
    setSnapshot("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("此瀏覽器不支援鏡頭功能");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("live");
    } catch (cameraError) {
      let message = cameraError instanceof Error ? cameraError.message : "無法啟動鏡頭，請稍後再試。";
      if (cameraError instanceof DOMException && cameraError.name === "NotAllowedError") message = "鏡頭權限被拒絕。請改用 Chrome／Safari 開啟，並允許網站使用相機。";
      if (cameraError instanceof DOMException && cameraError.name === "NotFoundError") message = "找不到可使用的鏡頭，請確認裝置相機未被其他程式占用。";
      if (cameraError instanceof DOMException && cameraError.name === "NotReadableError") message = "鏡頭正被其他程式使用，請關閉其他相機程式後重試。";
      if (cameraError instanceof DOMException && cameraError.name === "SecurityError") message = "目前的內嵌瀏覽器禁止相機，請在 Chrome／Safari 開啟網站。";
      setError(message);
      setStatus("error");
    }
  }

  async function switchCamera() {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    await startCamera(nextMode);
  }

  function capture() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const capturedImage = canvas.toDataURL("image/jpeg", 0.86);
    setSnapshot(capturedImage);
    stopCamera();
    onCapture(capturedImage);
  }

  function useNativePhoto(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const capturedImage = String(reader.result);
      setSnapshot(capturedImage);
      setStatus("idle");
      stopCamera();
      onCapture(capturedImage);
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    setIsEmbeddedBrowser(window.self !== window.top);
    return () => stopCamera();
  }, []);

  return (
    <div className={`camera-module ${embedded ? "embedded" : ""} ${status !== "live" && !snapshot ? "awaiting" : ""}`}>
      {snapshot ? <img className="camera-preview" src={snapshot} alt="剛拍攝的畫面" /> : <video ref={videoRef} className="camera-video" playsInline muted />}
      {status !== "live" && !snapshot && (
        <div className="camera-permission">
          <span className="camera-icon">◉</span>
          <b>{status === "starting" ? "正在啟動鏡頭…" : "開啟即時鏡頭"}</b>
          <small>{error || (isEmbeddedBrowser ? "目前位於內嵌預覽，可能無法取得相機權限。" : "首次使用時，瀏覽器會詢問鏡頭權限。")}</small>
          <button onClick={() => startCamera()} disabled={status === "starting"}>{status === "error" ? "重新嘗試" : "允許並開啟鏡頭"}</button>
          <div className="camera-fallback">
            {isEmbeddedBrowser && <a href="https://muscle-tape-ai-guide.bowersbayley13783.chatgpt.site" target="_blank" rel="noreferrer">在瀏覽器開啟 ↗</a>}
            <button className="native-photo" onClick={() => fileRef.current?.click()}>使用手機相機拍照</button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={(event) => useNativePhoto(event.target.files?.[0])} />
          </div>
        </div>
      )}
      {status === "live" && (
        <div className="camera-controls">
          <button onClick={switchCamera} aria-label="切換前後鏡頭">↺</button>
          <button className="shutter" onClick={capture} aria-label="拍攝"><i /></button>
          <button onClick={() => { stopCamera(); setStatus("idle"); }} aria-label="關閉即時鏡頭">×</button>
        </div>
      )}
      {status === "live" && <span className="camera-live">● LIVE</span>}
    </div>
  );
}
