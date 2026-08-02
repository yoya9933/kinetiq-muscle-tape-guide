const locations = [
  { name: "KinetiQ 台北車站示範站", status: "可使用", distance: "0.8 km", address: "台北市中正區忠孝西路一段", hours: "09:00–21:00", lat: "25.0478", lon: "121.5170" },
  { name: "KinetiQ 華山健康站", status: "可使用", distance: "1.2 km", address: "台北市中正區八德路一段", hours: "10:00–20:00", lat: "25.0441", lon: "121.5294" },
  { name: "KinetiQ 松江運動站", status: "維護中", distance: "2.4 km", address: "台北市中山區松江路", hours: "暫停服務", lat: "25.0520", lon: "121.5331" },
];

export default async function MachineMapPage({ searchParams }: { searchParams: Promise<{ file?: string }> }) {
  const params = await searchParams;
  const fileNo = params.file || "尚未建立";

  return (
    <main className="machine-page">
      <header className="machine-page-header">
        <a className="brand" href="/" aria-label="回到 KinetiQ 首頁"><span className="brand-mark">K</span><span>KinetiQ</span></a>
        <div><span className="status-dot" /><span>智慧肌貼機台地圖</span></div>
      </header>

      <section className="machine-hero">
        <div><p className="eyebrow">SMART TAPE STATIONS</p><h1>找到附近的智慧肌貼機台</h1><p>攜帶檔案號碼前往機台，即可讀取個人化肌貼形狀、長度與剪裁資料。</p></div>
        <div className="file-pass"><span>本次檔案號碼</span><b>{fileNo}</b><small>到機台後輸入這組 9 位數號碼</small></div>
      </section>

      <section className="machine-map-layout">
        <aside className="station-list">
          <div className="station-list-head"><div><span>台北市</span><b>3 個示範據點</b></div><a href="/">返回肌貼方案</a></div>
          {locations.map((location, index) => (
            <article className={`station-card ${index === 0 ? "active" : ""}`} key={location.name}>
              <div className="station-number">{String(index + 1).padStart(2, "0")}</div>
              <div><div className="station-name"><b>{location.name}</b><span className={location.status === "可使用" ? "available" : "maintenance"}>{location.status}</span></div><p>{location.address}</p><small>{location.hours} · 距離 {location.distance}</small></div>
              <a href={`https://www.openstreetmap.org/directions?to=${location.lat}%2C${location.lon}`} target="_blank" rel="noreferrer">導航 ↗</a>
            </article>
          ))}
          <div className="station-note"><b>示範模式</b><p>目前據點與營業資訊為介面示範。正式機台上線後，可串接即時位置、可用狀態與預約服務。</p></div>
        </aside>

        <div className="full-map">
          <iframe title="KinetiQ 智慧肌貼機台完整地圖" src="https://www.openstreetmap.org/export/embed.html?bbox=121.5000%2C25.0200%2C121.5500%2C25.0700&amp;layer=mapnik&amp;marker=25.0478%2C121.5170" loading="lazy" />
          <div className="map-overlay"><span>目前選擇</span><b>KinetiQ 台北車站示範站</b><small>0.8 km · 可使用</small></div>
        </div>
      </section>
    </main>
  );
}
