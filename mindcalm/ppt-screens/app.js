const SCREENS = [
  {
    id: "urgent",
    no: "01",
    title: "感知紧急状态",
    sub: "交感负荷升高 · 锁屏浮窗",
    body: `
      <div class="bg-abs"></div>
      <div class="pulse-ring"></div>
      <div class="pad s-urgent">
        <div class="lock-time">
          <div class="big">21:48</div>
          <div class="date">9月26日 星期六</div>
        </div>
        <div class="notify glass">
          <div class="notify-top">
            <div class="brand-mini"><span></span>MindCalm</div>
            <div class="ago">刚刚</div>
          </div>
          <div class="nt">交感负荷正在升高</div>
          <div class="nd">贴片连续 6 分钟读到 EDA 抬升，与会后场景的历史模式相近。建议现在做一个 8 分钟回落。</div>
          <div class="spark">
            <div>
              <div class="lab">EDA · 实时窗</div>
              <svg class="wave" viewBox="0 0 200 48" preserveAspectRatio="none">
                <path d="M0 34 C12 32 18 28 28 30 C40 33 48 18 60 16 C74 14 82 28 94 26 C108 24 118 8 132 10 C148 12 156 22 168 18 C180 14 188 6 200 8" fill="none" stroke="#ff6b5b" stroke-width="2.2" stroke-linecap="round"/>
                <path d="M0 34 C12 32 18 28 28 30 C40 33 48 18 60 16 C74 14 82 28 94 26 C108 24 118 8 132 10 C148 12 156 22 168 18 C180 14 188 6 200 8 V48 H0 Z" fill="url(#ug)" opacity="0.25"/>
                <defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff6b5b"/><stop offset="100%" stop-color="#ff6b5b" stop-opacity="0"/></linearGradient></defs>
              </svg>
            </div>
            <div style="text-align:right">
              <div class="lab">峰值</div>
              <div class="num">6.8</div>
            </div>
          </div>
          <div class="actions">
            <button class="cta ghost">稍后</button>
            <button class="cta danger">打开训练</button>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "diag",
    no: "02",
    title: "状态诊断",
    sub: "信号读取完成 · 四指标编译",
    body: `
      <div class="bg-abs"></div>
      <div class="pad s-diag">
        <div class="eyebrow">Signal locked · 21:49</div>
        <h1 class="h1">此刻更接近<br/><em>高唤醒</em></h1>
        <div class="signal">
          <span class="chip ok">阻抗合格</span>
          <span class="chip peri">EEG 窗稳定</span>
          <span class="chip hot">EDA 偏高</span>
        </div>
        <div class="hero-score glass">
          <div>
            <div class="label">情绪指数 · 软件编译</div>
            <div class="score">72</div>
          </div>
          <div class="side">
            <span class="band">需介入</span>
            <div class="note">非电极直读。主观 + 生理窗合编。</div>
          </div>
        </div>
        <div class="bars glass">
          <div class="bar-row"><span>EDA</span><div class="bar-track"><div class="bar-fill eda"></div></div><span>6.8</span></div>
          <div class="bar-row"><span>HRV</span><div class="bar-track"><div class="bar-fill hrv"></div></div><span>34ms</span></div>
          <div class="bar-row"><span>专注</span><div class="bar-track"><div class="bar-fill focus"></div></div><span>7.1</span></div>
          <div class="bar-row"><span>情绪</span><div class="bar-track"><div class="bar-fill mood"></div></div><span>72</span></div>
        </div>
        <div class="verdict glass">
          <strong>判断：</strong>会后场景下交感抬升，恢复窗尚未打开。建议短程电刺激 + 呼吸回落，而不是加长刺激。
        </div>
        <div class="footer-cta"><button class="cta">查看推荐方案</button></div>
      </div>
    `,
  },
  {
    id: "plan",
    no: "03",
    title: "方案与刺激调节",
    sub: "5 刺激位 · 2 采集触点",
    body: `
      <div class="bg-abs"></div>
      <div class="pad s-plan">
        <div class="eyebrow">Prescription</div>
        <h1 class="h1" style="font-size:26px">今夜回落</h1>
        <p class="lede">8 分钟 · 偏好记忆：神庭 + 耳甲区为主，百会轻托。</p>
        <div class="plan-card glass">
          <div class="meta">
            <span class="chip lime">推荐</span>
            <span class="chip">可调</span>
          </div>
          <h2>三步闭环</h2>
          <div class="steps">
            <div class="step"><div class="ix">1</div><div><div class="nm">呼吸 4-7-8</div><div class="ds">先打开恢复窗</div></div><div class="dur">2′</div></div>
            <div class="step"><div class="ix">2</div><div><div class="nm">电刺激 + 温觉</div><div class="ds">5 蓝点可控输出</div></div><div class="dur">4′</div></div>
            <div class="step"><div class="ix">3</div><div><div class="nm">回落对照</div><div class="ds">后测写入回档</div></div><div class="dur">2′</div></div>
          </div>
        </div>
        <div class="stim glass">
          <div class="stim-head">
            <h3>硬件 I/O 位图</h3>
            <span class="chip peri">偏好已套用</span>
          </div>
          <div class="map-legend">
            <span><i class="stim-dot"></i>刺激 · 蓝</span>
            <span><i class="sense-dot"></i>采集 · 橙</span>
          </div>
          <div class="body-map">
            <svg viewBox="0 0 280 200" fill="none" aria-label="头侧位穴位图">
              <!-- skull profile facing right -->
              <path d="M118 158
                C108 148 98 128 96 108
                C94 82 102 58 122 40
                C142 22 168 16 194 24
                C218 32 236 52 242 78
                C248 104 242 128 228 146
                C216 160 200 168 186 172
                L176 176 L168 158
                C166 148 158 142 148 144
                C138 146 128 152 118 158 Z"
                stroke="rgba(255,255,255,0.28)" stroke-width="1.6"
                fill="rgba(255,255,255,0.03)"/>
              <!-- jaw / face line -->
              <path d="M186 172 C198 168 214 158 224 142 C230 130 232 116 230 104"
                stroke="rgba(255,255,255,0.16)" stroke-width="1.2"/>
              <!-- ear outer -->
              <ellipse cx="108" cy="108" rx="16" ry="22"
                stroke="rgba(255,255,255,0.22)" stroke-width="1.3"
                fill="rgba(255,255,255,0.04)"/>
              <!-- ear concha bowl -->
              <ellipse cx="112" cy="110" rx="7" ry="9"
                stroke="rgba(79,124,255,0.35)" stroke-width="1"
                fill="rgba(79,124,255,0.06)"/>
              <!-- midline guide -->
              <path d="M148 30 C168 28 190 40 210 58"
                stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="3 4"/>

              <!-- SENSE orange: forehead -->
              <circle cx="222" cy="92" r="6" fill="#ff8a3d" opacity="0.95"/>
              <circle cx="222" cy="92" r="11" stroke="#ff8a3d" stroke-opacity="0.35" fill="none"/>
              <text x="232" y="88" fill="rgba(255,176,122,0.9)" font-size="9" font-family="Manrope,sans-serif">额采集</text>
              <!-- SENSE orange: temple -->
              <circle cx="138" cy="98" r="6" fill="#ff8a3d" opacity="0.95"/>
              <circle cx="138" cy="98" r="11" stroke="#ff8a3d" stroke-opacity="0.35" fill="none"/>
              <text x="78" y="94" fill="rgba(255,176,122,0.9)" font-size="9" font-family="Manrope,sans-serif" text-anchor="end">颞采集</text>

              <!-- STIM blue: 耳甲区 -->
              <circle cx="112" cy="110" r="5.5" fill="#4f7cff"/>
              <circle cx="112" cy="110" r="10" stroke="#4f7cff" stroke-opacity="0.4" fill="none"/>
              <text x="78" y="124" fill="rgba(168,186,255,0.95)" font-size="9" font-family="Manrope,sans-serif" text-anchor="end">耳甲区</text>
              <!-- STIM blue: 百会 -->
              <circle cx="152" cy="28" r="5.5" fill="#4f7cff"/>
              <circle cx="152" cy="28" r="10" stroke="#4f7cff" stroke-opacity="0.4" fill="none"/>
              <text x="152" y="16" fill="rgba(168,186,255,0.95)" font-size="9" font-family="Manrope,sans-serif" text-anchor="middle">百会</text>
              <!-- STIM blue: 前顶 -->
              <circle cx="174" cy="32" r="5.5" fill="#4f7cff"/>
              <circle cx="174" cy="32" r="10" stroke="#4f7cff" stroke-opacity="0.4" fill="none"/>
              <text x="186" y="22" fill="rgba(168,186,255,0.95)" font-size="9" font-family="Manrope,sans-serif">前顶</text>
              <!-- STIM blue: 囟会 -->
              <circle cx="194" cy="42" r="5.5" fill="#4f7cff"/>
              <circle cx="194" cy="42" r="10" stroke="#4f7cff" stroke-opacity="0.4" fill="none"/>
              <text x="206" y="36" fill="rgba(168,186,255,0.95)" font-size="9" font-family="Manrope,sans-serif">囟会</text>
              <!-- STIM blue: 神庭 -->
              <circle cx="212" cy="58" r="5.5" fill="#4f7cff"/>
              <circle cx="212" cy="58" r="10" stroke="#4f7cff" stroke-opacity="0.4" fill="none"/>
              <text x="224" y="56" fill="rgba(168,186,255,0.95)" font-size="9" font-family="Manrope,sans-serif">神庭</text>
            </svg>
          </div>
          <div class="sliders">
            <div class="sl"><span class="nm">神庭</span><div class="track"><div class="fill" style="width:58%"></div><div class="knob" style="left:58%"></div></div><span>58%</span></div>
            <div class="sl"><span class="nm">囟会</span><div class="track"><div class="fill" style="width:32%"></div><div class="knob" style="left:32%"></div></div><span>32%</span></div>
            <div class="sl"><span class="nm">前顶</span><div class="track"><div class="fill" style="width:28%"></div><div class="knob" style="left:28%"></div></div><span>28%</span></div>
            <div class="sl"><span class="nm">百会</span><div class="track"><div class="fill" style="width:40%"></div><div class="knob" style="left:40%"></div></div><span>40%</span></div>
            <div class="sl"><span class="nm">耳甲区</span><div class="track"><div class="fill" style="width:46%"></div><div class="knob" style="left:46%"></div></div><span>46%</span></div>
          </div>
          <div class="sense-row">
            <div class="sense-pill"><span class="orb"></span><span class="lab">额采集</span><span class="val">阻抗 OK</span></div>
            <div class="sense-pill"><span class="orb"></span><span class="lab">颞采集</span><span class="val">信号稳</span></div>
          </div>
        </div>
        <div class="footer-cta">
          <button class="cta">开始训练</button>
        </div>
      </div>
    `,
  },
  {
    id: "session",
    no: "04",
    title: "疗程动效",
    sub: "呼吸相位 · 实时四指标",
    body: `
      <div class="bg-abs"></div>
      <div class="pad s-session">
        <div class="topbar">
          <span class="chip peri">训练中 · 流气</span>
          <span class="timer">04:12 / 08:00</span>
        </div>
        <div class="orb-wrap">
          <div class="breath"><div class="core"></div></div>
          <div class="phase">
            <div class="p">屏 · 7</div>
            <div class="sub">神庭 · 耳甲区输出中 · 额/颞采集开</div>
          </div>
        </div>
        <div class="live">
          <div class="cell glass"><div class="k">EDA</div><div class="v">5.1</div></div>
          <div class="cell glass"><div class="k">HRV</div><div class="v">41</div></div>
          <div class="cell glass"><div class="k">专注</div><div class="v">8.2</div></div>
          <div class="cell glass"><div class="k">情绪</div><div class="v">58</div></div>
        </div>
      </div>
    `,
  },
  {
    id: "feed",
    no: "05",
    title: "训练后反馈",
    sub: "前→后对照 · 主观写入",
    body: `
      <div class="bg-abs"></div>
      <div class="pad s-feed">
        <div class="done-mark">✓</div>
        <div class="eyebrow" style="margin-top:10px">Session closed</div>
        <h1 class="h1" style="font-size:26px">这 8 分钟<br/>负荷往回落走了</h1>
        <div class="compare glass">
          <div class="pair">
            <div class="box"><div class="k">情绪 前</div><div class="v">72</div></div>
            <div class="arrow">→</div>
            <div class="box"><div class="k">情绪 后</div><div class="v" style="color:var(--lime)">48</div></div>
          </div>
          <div class="metric-row">
            <div class="metric glass" style="padding:10px 12px"><div class="k">EDA</div><div class="v">6.8<small>→4.2</small></div><div class="delta down">↓ 回落</div></div>
            <div class="metric glass" style="padding:10px 12px"><div class="k">HRV</div><div class="v">34<small>→47</small></div><div class="delta down">↑ 打开</div></div>
          </div>
        </div>
        <div class="feel glass invite">
          <div class="feel-head">
            <div>
              <div class="feel-ask">请写下此刻主观感受</div>
              <h3>软件需要你主动输入，才能对齐生理对照</h3>
            </div>
            <span class="chip lime">必填</span>
          </div>
          <div class="feel-box">
            <div class="feel-caret"></div>
            <div class="feel-text">肩颈松开了一些，呼吸比刚才顺……</div>
            <div class="feel-hint">不输入则情绪指数不完整，也不进「可求证」</div>
          </div>
          <div class="feel-quick">
            <span class="qk-lab">快捷词 · 点选可改写</span>
            <div class="tags">
              <span class="tag on">肩颈松了</span>
              <span class="tag">呼吸更深</span>
              <span class="tag">脑子安静一点</span>
              <span class="tag">还是偏紧</span>
            </div>
          </div>
        </div>
        <div class="claim glass">
          <strong>可求证：</strong>主观「肩颈松开」与皮电回落、HRV 打开同向。
          <div class="bound">边界：只描述当次前后窗，不是诊断，也不外推全天。</div>
        </div>
        <div class="footer-cta">
          <button class="cta">写入情绪日志</button>
          <button class="cta ghost">回首页</button>
        </div>
      </div>
    `,
  },
  {
    id: "journal",
    no: "06",
    title: "情绪追踪系统",
    sub: "日志 · 复盘 · 周闭环",
    body: `
      <div class="bg-abs"></div>
      <div class="pad s-journal">
        <div class="eyebrow">Evidence loop</div>
        <h1 class="h1" style="font-size:26px">记得住的<br/>每一次对照</h1>
        <div class="tabs">
          <span class="on">日志</span>
          <span>复盘</span>
          <span>本周</span>
        </div>
        <div class="week-strip glass">
          <div class="top">
            <h3>本周情绪指数</h3>
            <div class="stat">可求证 5 · 未对照 1</div>
          </div>
          <svg class="sparkline" viewBox="0 0 320 64" preserveAspectRatio="none">
            <path d="M8 42 L60 38 L112 28 L164 34 L216 18 L268 24 L312 14" fill="none" stroke="#a8b0ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 50 L60 46 L112 40 L164 36 L216 30 L268 28 L312 22" fill="none" stroke="#c9e36a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 4"/>
            <circle cx="312" cy="14" r="3.5" fill="#a8b0ff"/>
            <circle cx="312" cy="22" r="3.5" fill="#c9e36a"/>
          </svg>
          <div class="legend"><span><i class="a"></i>训练前</span><span><i class="b"></i>训练后</span></div>
        </div>
        <div class="log-list">
          <div class="log glass">
            <div>
              <div class="when">9.26 六 · 09:12 · 今夜回落</div>
              <div class="title">会后回落对照</div>
            </div>
            <span class="badge proven">可求证</span>
            <div class="feel">「肩颈松开了一些」· 场景：开会后</div>
            <div class="metrics">
              <div class="m"><div class="k">情绪</div><div class="v">72→<b>48</b></div></div>
              <div class="m"><div class="k">EDA</div><div class="v">6.8→<b>4.2</b></div></div>
              <div class="m"><div class="k">HRV</div><div class="v">34→<b>47</b></div></div>
              <div class="m"><div class="k">专注</div><div class="v">7.1→<b>9.0</b></div></div>
            </div>
          </div>
          <div class="log glass">
            <div>
              <div class="when">9.23 三 · 22:40 · 夜间轻刺激</div>
              <div class="title">后测缺失</div>
            </div>
            <span class="badge gap">未对照</span>
            <div class="feel">主观写了「还好」· 未完成后测，不进周平均</div>
          </div>
        </div>
        <div class="proof-card glass">
          <div class="ph">
            <h3>单次证据条</h3>
            <span class="chip ok">对齐完成</span>
          </div>
          <div class="dual">
            <div class="dual-row"><span>情绪</span><div class="dual-bars"><span class="in"><i style="width:72%"></i></span><span class="out"><i style="width:48%"></i></span></div></div>
            <div class="dual-row"><span>EDA</span><div class="dual-bars"><span class="in"><i style="width:86%"></i></span><span class="out"><i style="width:52%"></i></span></div></div>
            <div class="dual-row"><span>HRV</span><div class="dual-bars"><span class="in"><i style="width:34%"></i></span><span class="out"><i style="width:58%"></i></span></div></div>
          </div>
          <div class="claim-mini"><strong>三类对齐：</strong>场景·会后 / 主观·肩松 / 偏好·神庭 58% · 耳甲区 46%。</div>
        </div>
      </div>
    `,
  },
];

const canvas = document.getElementById("canvas");
const nav = document.getElementById("nav");
const tpl = document.getElementById("phone-shell");
let idx = 0;
let board = false;

function build() {
  nav.innerHTML = "";
  canvas.innerHTML = "";
  canvas.classList.toggle("board", board);

  const wrap = board ? document.createElement("div") : null;
  if (wrap) wrap.className = "board-grid";

  SCREENS.forEach((s, i) => {
    const btn = document.createElement("button");
    btn.className = i === idx && !board ? "on" : "";
    btn.innerHTML = `<span class="n">${s.no}</span><span class="t">${s.title}</span><span class="s">${s.sub}</span>`;
    btn.onclick = () => {
      board = false;
      idx = i;
      build();
      location.hash = s.id;
    };
    nav.appendChild(btn);

    const node = tpl.content.cloneNode(true);
    const phone = node.querySelector(".phone");
    phone.dataset.screen = s.id;
    phone.classList.add(`phone-${s.id}`);
    phone.querySelector(".screen-body").innerHTML = s.body;
    // apply screen root class onto screen-body first child wrapper via body itself
    const body = phone.querySelector(".screen-body");
    // status color: light on dark screens
    phone.querySelector(".cap-no").textContent = s.no;
    phone.querySelector(".cap-title").textContent = s.title;
    if (!board) {
      phone.style.display = i === idx ? "block" : "none";
    } else {
      phone.style.display = "block";
    }
    (wrap || canvas).appendChild(node);
  });

  if (wrap) canvas.appendChild(wrap);

  const boardBtn = document.createElement("button");
  boardBtn.style.marginTop = "12px";
  boardBtn.style.padding = "12px";
  boardBtn.style.borderRadius = "14px";
  boardBtn.style.border = "1px solid rgba(255,255,255,0.12)";
  boardBtn.innerHTML = `<span class="n">BOARD</span><span class="t">六屏总览</span><span class="s">PPT 一页排版</span>`;
  boardBtn.className = board ? "on" : "";
  boardBtn.onclick = () => {
    board = true;
    build();
    location.hash = "board";
  };
  nav.appendChild(boardBtn);
}

function go(d) {
  board = false;
  idx = (idx + d + SCREENS.length) % SCREENS.length;
  build();
  location.hash = SCREENS[idx].id;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
  if (e.key === "b" || e.key === "B") {
    board = !board;
    build();
    location.hash = board ? "board" : SCREENS[idx].id;
  }
  if (e.key === "h" || e.key === "H") {
    document.querySelector(".rail")?.classList.toggle("hide");
    document.querySelector(".stage")?.classList.toggle("rail-off");
  }
});

function boot() {
  const h = location.hash.slice(1);
  if (h === "board") board = true;
  else {
    const i = SCREENS.findIndex((s) => s.id === h);
    if (i >= 0) idx = i;
  }
  build();
}

window.addEventListener("hashchange", () => {
  const h = location.hash.slice(1);
  if (h === "board") {
    board = true;
  } else {
    board = false;
    const i = SCREENS.findIndex((s) => s.id === h);
    if (i >= 0) idx = i;
  }
  build();
});

boot();

window.MindCalmScreens = { go: (i) => { board = false; idx = i; build(); location.hash = SCREENS[i].id; }, SCREENS };
