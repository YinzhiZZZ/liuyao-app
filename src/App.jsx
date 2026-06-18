import { useState, useEffect } from "react";

// ── 易学数据 ──────────────────────────────────────────────
const BAGUA = [
  { name: "乾", symbol: "☰", lines: [1,1,1], nature: "天", element: "金" },
  { name: "兑", symbol: "☱", lines: [1,1,0], nature: "泽", element: "金" },
  { name: "离", symbol: "☲", lines: [1,0,1], nature: "火", element: "火" },
  { name: "震", symbol: "☳", lines: [1,0,0], nature: "雷", element: "木" },
  { name: "巽", symbol: "☴", lines: [0,1,1], nature: "风", element: "木" },
  { name: "坎", symbol: "☵", lines: [0,1,0], nature: "水", element: "水" },
  { name: "艮", symbol: "☶", lines: [0,0,1], nature: "山", element: "土" },
  { name: "坤", symbol: "☷", lines: [0,0,0], nature: "地", element: "土" },
];

const HEXAGRAM_NAMES = {
  "乾乾":"乾为天","坤坤":"坤为地","震震":"震为雷","巽巽":"巽为风",
  "坎坎":"坎为水","离离":"离为火","艮艮":"艮为山","兑兑":"兑为泽",
  "乾兑":"夬","乾离":"大有","乾震":"大壮","乾巽":"小畜",
  "乾坎":"需","乾艮":"大畜","乾坤":"泰","兑乾":"履",
  "兑离":"睽","兑震":"归妹","兑巽":"中孚","兑坎":"节",
  "兑艮":"损","兑坤":"临","离乾":"同人","离兑":"革",
  "离震":"丰","离巽":"家人","离坎":"既济","离艮":"贲",
  "离坤":"明夷","震乾":"无妄","震兑":"随","震离":"噬嗑",
  "震巽":"益","震坎":"屯","震艮":"颐","震坤":"复",
  "巽乾":"姤","巽兑":"大过","巽离":"鼎","巽震":"恒",
  "巽坎":"井","巽艮":"蛊","巽坤":"升","坎乾":"讼",
  "坎兑":"困","坎离":"未济","坎震":"解","坎巽":"涣",
  "坎艮":"蹇","坎坤":"师","艮乾":"遁","艮兑":"咸",
  "艮离":"旅","艮震":"小过","艮巽":"渐","艮坎":"蹇",
  "艮坤":"谦","坤乾":"否","坤兑":"萃","坤离":"晋",
  "坤震":"豫","坤巽":"观","坤坎":"比","坤艮":"剥",
};

function getHexagramName(lower, upper) {
  return HEXAGRAM_NAMES[`${upper.name}${lower.name}`]
    || HEXAGRAM_NAMES[`${lower.name}${upper.name}`]
    || `${upper.name}${lower.name}卦`;
}

function lineType(val) {
  if (val === 9) return { yin: false, changing: true };
  if (val === 7) return { yin: false, changing: false };
  if (val === 8) return { yin: true,  changing: false };
  if (val === 6) return { yin: true,  changing: true };
  return { yin: false, changing: false };
}

function getBagua(threeLines) {
  return BAGUA.find(b =>
    b.lines[0] === (threeLines[0] ? 0 : 1) &&
    b.lines[1] === (threeLines[1] ? 0 : 1) &&
    b.lines[2] === (threeLines[2] ? 0 : 1)
  ) || BAGUA[7];
}

// ── 子组件 ────────────────────────────────────────────────
function CoinFlip({ onResult }) {
  const [spinning, setSpinning] = useState(false);
  const [coins, setCoins] = useState([null, null, null]);

  const flip = () => {
    if (spinning) return;
    setSpinning(true);
    setCoins([null, null, null]);
    setTimeout(() => {
      const c = [
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
      ];
      setCoins(c);
      setSpinning(false);
      onResult(c.reduce((a, b) => a + b, 0));
    }, 700);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"14px" }}>
      <div style={{ display:"flex", gap:"18px" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:"54px", height:"54px", borderRadius:"50%",
            background: coins[i] === null
              ? "rgba(180,140,60,0.15)"
              : coins[i] === 3
                ? "radial-gradient(circle at 35% 35%, #f5d060, #b8860b)"
                : "radial-gradient(circle at 35% 35%, #c8a040, #7a5c10)",
            border: `2px solid ${coins[i] === null ? "rgba(180,140,60,0.3)" : "rgba(255,215,0,0.7)"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"16px", fontWeight:"bold", color:"#fff8e0",
            boxShadow: coins[i] !== null ? "0 4px 16px rgba(180,140,60,0.5)" : "none",
            transition:"all 0.4s",
            transform: spinning ? "rotateY(180deg)" : "rotateY(0deg)",
          }}>
            {coins[i] === null ? "" : coins[i] === 3 ? "正" : "反"}
          </div>
        ))}
      </div>
      <button onClick={flip} disabled={spinning} style={{
        padding:"11px 32px",
        background: spinning ? "rgba(180,140,60,0.15)" : "linear-gradient(135deg, #c8960c, #8B6914)",
        border:"1px solid rgba(180,140,60,0.5)", borderRadius:"3px",
        color: spinning ? "rgba(255,220,100,0.4)" : "#fff8e0",
        cursor: spinning ? "wait" : "pointer",
        fontSize:"14px", letterSpacing:"4px", fontFamily:"inherit",
        transition:"all 0.2s",
      }}>
        {spinning ? "卜中…" : "掷　卦"}
      </button>
    </div>
  );
}

function HexagramDisplay({ lines, animated }) {
  return (
    <div style={{ display:"flex", flexDirection:"column-reverse", gap:"7px", alignItems:"center" }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          display:"flex", alignItems:"center", gap:"10px",
          animation: animated ? `fadeUp 0.35s ease ${i * 0.1}s both` : "none",
        }}>
          <span style={{ fontSize:"11px", color:"rgba(180,140,60,0.45)", width:"24px", textAlign:"right" }}>
            {["初","二","三","四","五","上"][i]}
          </span>
          {line.yin ? (
            <div style={{ display:"flex", gap:"7px" }}>
              <div style={{ width:"32px", height:"8px", background: line.changing ? "#ff8c00" : "#b8860b", borderRadius:"2px" }} />
              <div style={{ width:"7px" }} />
              <div style={{ width:"32px", height:"8px", background: line.changing ? "#ff8c00" : "#b8860b", borderRadius:"2px" }} />
            </div>
          ) : (
            <div style={{ width:"71px", height:"8px", background: line.changing ? "#ff8c00" : "#ffd700", borderRadius:"2px" }} />
          )}
          {line.changing && <span style={{ fontSize:"10px", color:"#ff8c00" }}>○</span>}
        </div>
      ))}
    </div>
  );
}

// ── 签文页组件 ────────────────────────────────────────────
function SignPage({ hexName, lowerGua, upperGua, hasChanging, changedHexName, lines, castLines, onNext }) {
  const [signText, setSignText] = useState("");
  const [signSource, setSignSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    fetchSign();
  }, []);

  const fetchSign = async () => {
    const prompt = `你是一位精通周易的易学大师。现已起得【${hexName}】，上卦${upperGua.name}（${upperGua.nature}），下卦${lowerGua.name}（${lowerGua.nature}）${hasChanging ? `，变卦为${changedHexName}` : "，无动爻"}。

请为此卦创作一首签文判词，要求：
1. 仿古签文风格，文辞古雅，带有玄学神秘色彩，四句，每句五到七字
2. 内容须契合此卦卦象与象意，不可泛泛而谈
3. 尽量引用或化用真实易学典籍（如《周易》《梅花易数》《增删卜易》等）的语意，并在最后标注出处（格式：——出自《xxx》）；若无合适出处则不标注
4. 只输出签文正文四句加出处，不要任何解释、标题或多余文字
5. 每句之间用换行分隔

示例格式：
云开日出见光明
险处藏机莫轻行
静守中正待时至
福至心灵自然成
——化自《周易·坎卦》`;

    try {
      const resp = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ prompt }),
      });
      const data = await resp.json();
      const text = (data.result || "").trim();
      // 分离出处
      const lines = text.split("\n").filter(l => l.trim());
      const sourceLine = lines.find(l => l.startsWith("——") || l.startsWith("—"));
      const bodyLines = lines.filter(l => !l.startsWith("——") && !l.startsWith("—"));
      setSignText(bodyLines.join("\n"));
      setSignSource(sourceLine || "");
    } catch {
      setSignText("山重水复疑无路\n柳暗花明又一村\n静待天时莫强求\n顺势而为自有缘");
      setSignSource("");
    } finally {
      setLoading(false);
    }
  };

  const signLines = signText.split("\n").filter(l => l.trim());

  return (
    <div style={{ animation:"fadeUp 0.6s ease both" }}>
      {/* 卦名 */}
      <div style={{ textAlign:"center", marginBottom:"28px" }}>
        <div style={{ fontSize:"11px", letterSpacing:"5px", color:"rgba(180,140,60,0.4)", marginBottom:"8px" }}>本卦已成</div>
        <div style={{ fontSize:"26px", fontWeight:"600", color:"#ffd700", letterSpacing:"8px" }}>{hexName}</div>
        <div style={{ fontSize:"12px", color:"rgba(180,140,60,0.45)", marginTop:"4px" }}>
          上{upperGua.name}（{upperGua.nature}）· 下{lowerGua.name}（{lowerGua.nature}）
        </div>
      </div>

      {/* 卦象 */}
      <div style={{
        display:"grid", gridTemplateColumns: hasChanging ? "1fr auto 1fr" : "1fr",
        gap:"12px", alignItems:"center",
        padding:"20px", border:"1px solid rgba(180,140,60,0.15)",
        borderRadius:"6px", background:"rgba(0,0,0,0.25)", marginBottom:"28px",
      }}>
        <div style={{ textAlign:"center" }}>
          <HexagramDisplay lines={lines} animated={true} />
          <div style={{ marginTop:"10px", fontSize:"12px", color:"#ffd700", letterSpacing:"3px" }}>{hexName}</div>
        </div>
        {hasChanging && <>
          <div style={{ color:"rgba(180,140,60,0.35)", fontSize:"16px", textAlign:"center" }}>→</div>
          <div style={{ textAlign:"center" }}>
            <HexagramDisplay
              lines={lines.map(l => ({ yin: l.changing ? !l.yin : l.yin, changing: false }))}
              animated={true}
            />
            <div style={{ marginTop:"10px", fontSize:"12px", color:"#ff8c00", letterSpacing:"3px" }}>{changedHexName}</div>
          </div>
        </>}
      </div>

      {/* 签文 */}
      <div style={{
        position:"relative",
        border:"1px solid rgba(180,140,60,0.35)",
        borderRadius:"6px",
        background:"linear-gradient(160deg, rgba(30,18,5,0.95) 0%, rgba(20,12,3,0.98) 100%)",
        padding:"36px 28px 28px",
        marginBottom:"28px",
        boxShadow:"0 0 40px rgba(180,140,60,0.08), inset 0 0 60px rgba(0,0,0,0.3)",
        overflow:"hidden",
      }}>
        {/* 装饰角 */}
        {["topLeft","topRight","bottomLeft","bottomRight"].map(pos => (
          <div key={pos} style={{
            position:"absolute",
            top: pos.includes("top") ? "8px" : "auto",
            bottom: pos.includes("bottom") ? "8px" : "auto",
            left: pos.includes("Left") ? "8px" : "auto",
            right: pos.includes("Right") ? "8px" : "auto",
            width:"16px", height:"16px",
            borderTop: pos.includes("top") ? "1px solid rgba(180,140,60,0.4)" : "none",
            borderBottom: pos.includes("bottom") ? "1px solid rgba(180,140,60,0.4)" : "none",
            borderLeft: pos.includes("Left") ? "1px solid rgba(180,140,60,0.4)" : "none",
            borderRight: pos.includes("Right") ? "1px solid rgba(180,140,60,0.4)" : "none",
          }} />
        ))}

        {/* 签文标题 */}
        <div style={{ textAlign:"center", marginBottom:"24px" }}>
          <span style={{
            fontSize:"11px", letterSpacing:"6px", color:"rgba(180,140,60,0.5)",
            borderBottom:"1px solid rgba(180,140,60,0.2)", paddingBottom:"8px",
          }}>
            ✦ 卦 辞 签 文 ✦
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ fontSize:"22px", animation:"floatAnim 2s ease-in-out infinite", marginBottom:"12px" }}>☯</div>
            <p style={{ color:"rgba(180,140,60,0.4)", letterSpacing:"4px", fontSize:"12px" }}>推演签文中…</p>
          </div>
        ) : (
          <>
            {/* 竖排签文 */}
            <div style={{
              display:"flex",
              flexDirection:"row",
              justifyContent:"center",
              gap:"20px",
              marginBottom:"20px",
              minHeight:"120px",
            }}>
              {signLines.map((line, i) => (
                <div key={i} style={{
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:"6px",
                  animation:`fadeUp 0.4s ease ${i * 0.15}s both`,
                }}>
                  {line.split("").map((char, j) => (
                    <span key={j} style={{
                      fontSize:"18px",
                      color: i % 2 === 0 ? "rgba(255,220,120,0.92)" : "rgba(220,185,90,0.85)",
                      lineHeight:"1.4",
                      fontWeight: j === 0 ? "600" : "400",
                      textShadow:"0 0 12px rgba(180,140,60,0.3)",
                      letterSpacing:"1px",
                    }}>
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* 分隔线 */}
            <div style={{
              width:"60%", margin:"0 auto 14px",
              height:"1px",
              background:"linear-gradient(90deg, transparent, rgba(180,140,60,0.3), transparent)",
            }} />

            {/* 出处 */}
            {signSource && (
              <div style={{ textAlign:"center", fontSize:"11px", color:"rgba(180,140,60,0.45)", letterSpacing:"2px" }}>
                {signSource}
              </div>
            )}
          </>
        )}
      </div>

      {/* 输入问题 + 解卦按钮 */}
      <div style={{
        border:"1px solid rgba(180,140,60,0.2)", borderRadius:"6px",
        padding:"24px", background:"rgba(180,140,60,0.03)",
      }}>
        <label style={{ fontSize:"12px", letterSpacing:"3px", color:"rgba(180,140,60,0.6)", display:"block", marginBottom:"10px" }}>
          此刻心中所问之事
        </label>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="请写下您心中默念的问题，例如：此次求职能否顺利？"
          rows={3}
          style={{
            width:"100%", padding:"14px",
            background:"rgba(0,0,0,0.3)",
            border:"1px solid rgba(180,140,60,0.25)", borderRadius:"4px",
            color:"#e8d5a0", fontSize:"14px", fontFamily:"inherit",
            resize:"none", outline:"none", lineHeight:"1.8",
            marginBottom:"16px", boxSizing:"border-box",
          }}
        />
        <button
          onClick={() => question.trim() && onNext(question)}
          disabled={!question.trim() || loading}
          style={{
            width:"100%", padding:"14px",
            background: question.trim() && !loading
              ? "linear-gradient(135deg, #8B6914 0%, #c8960c 50%, #8B6914 100%)"
              : "rgba(180,140,60,0.1)",
            border:"1px solid rgba(180,140,60,0.4)", borderRadius:"3px",
            color: question.trim() && !loading ? "#fff8e0" : "rgba(180,140,60,0.3)",
            fontSize:"15px", letterSpacing:"8px",
            cursor: question.trim() && !loading ? "pointer" : "not-allowed",
            fontFamily:"inherit", transition:"all 0.2s",
          }}
        >
          解　卦
        </button>
      </div>
    </div>
  );
}

// ── 主应用 ────────────────────────────────────────────────
export default function App() {
  // phase: intro | casting | sign | reading
  const [phase, setPhase] = useState("intro");
  const [castLines, setCastLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [question, setQuestion] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [loadingRead, setLoadingRead] = useState(false);

  const lines = castLines.map(v => lineType(v));
  const lowerGua = lines.length === 6 ? getBagua(lines.slice(0,3).map(l=>l.yin)) : null;
  const upperGua = lines.length === 6 ? getBagua(lines.slice(3,6).map(l=>l.yin)) : null;
  const hexName = lowerGua && upperGua ? getHexagramName(lowerGua, upperGua) : "";
  const hasChanging = lines.some(l => l.changing);
  const changedLines = lines.map(l => ({ yin: l.changing ? !l.yin : l.yin, changing: false }));
  const changedLowerGua = lines.length === 6 ? getBagua(changedLines.slice(0,3).map(l=>l.yin)) : null;
  const changedUpperGua = lines.length === 6 ? getBagua(changedLines.slice(3,6).map(l=>l.yin)) : null;
  const changedHexName = changedLowerGua && changedUpperGua ? getHexagramName(changedLowerGua, changedUpperGua) : "";

  const handleCoinResult = (val) => {
    const next = [...castLines, val];
    setCastLines(next);
    if (next.length < 6) {
      setCurrentLine(next.length);
    } else {
      setCurrentLine(6);
      setTimeout(() => setPhase("sign"), 500);
    }
  };

  const handleReading = async (q) => {
    setQuestion(q);
    setLoadingRead(true);
    setInterpretation("");
    setPhase("reading");

    const changingDesc = lines.map((l,i) =>
      l.changing ? `第${["初","二","三","四","五","上"][i]}爻为动爻` : null
    ).filter(Boolean).join("，");

    const prompt = `你是一位精通周易六爻的易学大师，请为以下六爻卦象进行详细解读。

【所问之事】${q}
【本卦】${hexName}
上卦：${upperGua?.name}（${upperGua?.nature}）
下卦：${lowerGua?.name}（${lowerGua?.nature}）
六爻爻值（初爻→上爻）：${castLines.join(", ")}（6=老阴动爻，7=少阳，8=少阴，9=老阳动爻）
${hasChanging ? `动爻：${changingDesc}` : "无动爻"}
${hasChanging ? `【变卦】${changedHexName}` : ""}

请按以下结构解读，语言优美古雅：

**【卦象概述】**
简述本卦核心象意（2-3句）

**【卦辞解析】**
结合所问之事解析整体指向

**【动爻分析】**
${hasChanging ? "分析动爻含义及对事情走势的影响" : "无动爻，分析静卦之意"}
${hasChanging ? "\n**【变卦启示】**\n结合变卦预测发展走向" : ""}

**【综合建议】**
给出3-4条具体实用建议

**【吉凶判断】**
以"大吉/吉/中平/凶/大凶"评定并说明原因`;

    try {
      const resp = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ prompt }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setInterpretation(`解卦失败：${data.error || "请稍后重试"}`);
      } else {
        setInterpretation(data.result || "解卦失败，请重试");
      }
    } catch {
      setInterpretation("连接失败，请重试。");
    } finally {
      setLoadingRead(false);
    }
  };

  const reset = () => {
    setPhase("intro"); setCastLines([]); setCurrentLine(0);
    setQuestion(""); setInterpretation("");
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#0d0a06", color:"#e8d5a0",
      fontFamily:"'Noto Serif SC', 'SimSun', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        * { box-sizing:border-box; }
        strong { color:#ffd700; }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#8B6914;border-radius:2px}
        textarea::placeholder { color: rgba(180,140,60,0.3); }
      `}</style>

      {/* 背景 */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`radial-gradient(ellipse at 15% 15%, rgba(180,140,60,0.07) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 85%, rgba(120,60,20,0.07) 0%, transparent 55%)`,
      }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:"640px", margin:"0 auto", padding:"40px 20px" }}>

        {/* 标题 */}
        <header style={{ textAlign:"center", marginBottom:"44px" }}>
          <div style={{ fontSize:"11px", letterSpacing:"8px", color:"rgba(180,140,60,0.35)", marginBottom:"10px" }}>
            ☰ ☷ ☲ ☵ ☶ ☱ ☴ ☳
          </div>
          <h1 style={{ fontSize:"28px", fontWeight:"300", letterSpacing:"12px", margin:"0 0 6px", color:"#ffd700" }}>
            六爻卜卦
          </h1>
          <p style={{ fontSize:"11px", color:"rgba(180,140,60,0.35)", letterSpacing:"4px", margin:0 }}>
            铜钱起卦 · 周易六十四卦 · AI解读
          </p>
        </header>

        {/* ── PHASE: INTRO ── */}
        {phase === "intro" && (
          <div style={{ animation:"fadeUp 0.8s ease both" }}>
            <div style={{
              border:"1px solid rgba(180,140,60,0.2)", borderRadius:"8px",
              padding:"44px 36px", background:"rgba(180,140,60,0.03)",
              textAlign:"center", marginBottom:"28px",
            }}>
              {/* 太极图 */}
              <div style={{
                fontSize:"56px", marginBottom:"28px",
                animation:"floatAnim 4s ease-in-out infinite",
                filter:"drop-shadow(0 0 20px rgba(180,140,60,0.3))",
              }}>☯</div>

              <p style={{
                fontSize:"15px", lineHeight:"2.6", color:"rgba(232,213,160,0.75)",
                marginBottom:"12px", letterSpacing:"2px",
              }}>
                请于心中默念所问之事
              </p>
              <p style={{
                fontSize:"13px", lineHeight:"2.2", color:"rgba(180,140,60,0.5)",
                marginBottom:"36px", letterSpacing:"1px",
              }}>
                反复默念三遍<br/>
                心神专注，方可感应天地
              </p>

              {/* 三次默念提示 */}
              <div style={{ display:"flex", justifyContent:"center", gap:"20px", marginBottom:"36px" }}>
                {["一念", "再念", "三念"].map((text, i) => (
                  <div key={i} style={{
                    display:"flex", flexDirection:"column", alignItems:"center", gap:"6px",
                    animation:`fadeUp 0.5s ease ${0.3 + i * 0.2}s both`,
                  }}>
                    <div style={{
                      width:"36px", height:"36px", borderRadius:"50%",
                      border:"1px solid rgba(180,140,60,0.3)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"18px", color:"rgba(180,140,60,0.4)",
                    }}>
                      {["一","二","三"][i]}
                    </div>
                    <span style={{ fontSize:"11px", color:"rgba(180,140,60,0.35)", letterSpacing:"1px" }}>{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPhase("casting")}
                style={{
                  padding:"15px 48px",
                  background:"linear-gradient(135deg, #8B6914 0%, #c8960c 50%, #8B6914 100%)",
                  border:"1px solid rgba(180,140,60,0.5)", borderRadius:"3px",
                  color:"#fff8e0", fontSize:"15px", letterSpacing:"8px",
                  cursor:"pointer", fontFamily:"inherit",
                  boxShadow:"0 4px 20px rgba(180,140,60,0.2)",
                }}
              >
                开始起卦
              </button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
              {[
                { icon:"🪙", title:"铜钱起卦", desc:"三枚铜钱掷六次" },
                { icon:"📜", title:"签文判词", desc:"古雅签文玄机" },
                { icon:"🤖", title:"AI解卦", desc:"易学大师详解" },
              ].map(item => (
                <div key={item.title} style={{
                  padding:"16px 10px", border:"1px solid rgba(180,140,60,0.1)",
                  borderRadius:"6px", textAlign:"center", background:"rgba(180,140,60,0.02)",
                }}>
                  <div style={{ fontSize:"20px", marginBottom:"8px" }}>{item.icon}</div>
                  <div style={{ fontSize:"12px", color:"#ffd700", letterSpacing:"1px", marginBottom:"5px" }}>{item.title}</div>
                  <div style={{ fontSize:"11px", color:"rgba(180,140,60,0.45)", lineHeight:"1.6" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PHASE: CASTING ── */}
        {phase === "casting" && (
          <div style={{ animation:"fadeUp 0.5s ease both" }}>
            <div style={{
              border:"1px solid rgba(180,140,60,0.2)", borderRadius:"8px",
              padding:"32px", background:"rgba(180,140,60,0.03)",
              marginBottom:"20px", textAlign:"center",
            }}>
              <div style={{ marginBottom:"6px" }}>
                <span style={{ fontSize:"11px", color:"rgba(180,140,60,0.4)", letterSpacing:"4px" }}>
                  起第
                </span>
                <span style={{ fontSize:"22px", color:"#ffd700", margin:"0 8px" }}>
                  {["初","二","三","四","五","上"][currentLine]}
                </span>
                <span style={{ fontSize:"11px", color:"rgba(180,140,60,0.4)", letterSpacing:"4px" }}>
                  爻
                </span>
              </div>
              <p style={{ fontSize:"11px", color:"rgba(180,140,60,0.3)", marginBottom:"28px", letterSpacing:"2px" }}>
                {["地基之爻","人事之爻","动变之爻","官鬼之爻","君位之爻","天机之爻"][currentLine]}
              </p>

              {/* 进度 */}
              <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"28px" }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    width:"8px", height:"8px", borderRadius:"50%",
                    background: i < castLines.length ? "#ffd700" : i === castLines.length ? "rgba(255,215,0,0.5)" : "rgba(180,140,60,0.15)",
                    transition:"all 0.3s",
                  }} />
                ))}
              </div>

              <CoinFlip onResult={handleCoinResult} />
            </div>

            {castLines.length > 0 && (
              <div style={{
                border:"1px solid rgba(180,140,60,0.12)", borderRadius:"8px",
                padding:"22px", background:"rgba(0,0,0,0.2)", textAlign:"center",
              }}>
                <p style={{ fontSize:"11px", color:"rgba(180,140,60,0.35)", letterSpacing:"3px", marginBottom:"14px" }}>已成爻象</p>
                <HexagramDisplay
                  lines={lines.concat(Array(6-lines.length).fill({yin:false,changing:false}))}
                  animated={true}
                />
              </div>
            )}
          </div>
        )}

        {/* ── PHASE: SIGN ── */}
        {phase === "sign" && lowerGua && upperGua && (
          <SignPage
            hexName={hexName}
            lowerGua={lowerGua}
            upperGua={upperGua}
            hasChanging={hasChanging}
            changedHexName={changedHexName}
            lines={lines}
            castLines={castLines}
            onNext={handleReading}
          />
        )}

        {/* ── PHASE: READING ── */}
        {phase === "reading" && lowerGua && upperGua && (
          <div style={{ animation:"fadeUp 0.6s ease both" }}>
            <div style={{ textAlign:"center", marginBottom:"24px" }}>
              <div style={{ fontSize:"11px", letterSpacing:"4px", color:"rgba(180,140,60,0.4)", marginBottom:"8px" }}>卦象解读</div>
              <div style={{ fontSize:"24px", fontWeight:"600", color:"#ffd700", letterSpacing:"6px" }}>{hexName}</div>
            </div>

            <div style={{
              display:"grid", gridTemplateColumns: hasChanging ? "1fr auto 1fr" : "1fr",
              gap:"12px", alignItems:"center",
              padding:"20px", border:"1px solid rgba(180,140,60,0.15)",
              borderRadius:"6px", background:"rgba(0,0,0,0.25)", marginBottom:"20px",
            }}>
              <div style={{ textAlign:"center" }}>
                <HexagramDisplay lines={lines} animated={true} />
                <div style={{ marginTop:"10px", fontSize:"12px", color:"#ffd700", letterSpacing:"3px" }}>{hexName}</div>
              </div>
              {hasChanging && <>
                <div style={{ color:"rgba(180,140,60,0.35)", fontSize:"16px", textAlign:"center" }}>→</div>
                <div style={{ textAlign:"center" }}>
                  <HexagramDisplay lines={changedLines} animated={true} />
                  <div style={{ marginTop:"10px", fontSize:"12px", color:"#ff8c00", letterSpacing:"3px" }}>{changedHexName}</div>
                </div>
              </>}
            </div>

            {question && (
              <div style={{
                padding:"10px 16px", marginBottom:"16px",
                border:"1px solid rgba(180,140,60,0.15)", borderRadius:"4px",
                background:"rgba(180,140,60,0.03)", fontSize:"13px",
                color:"rgba(180,140,60,0.6)", letterSpacing:"1px",
              }}>
                所问：{question}
              </div>
            )}

            <div style={{
              border:"1px solid rgba(180,140,60,0.2)", borderRadius:"8px",
              padding:"28px", background:"rgba(0,0,0,0.3)", marginBottom:"16px",
            }}>
              <div style={{ fontSize:"11px", letterSpacing:"4px", color:"rgba(180,140,60,0.35)", marginBottom:"20px", textAlign:"center" }}>
                — 大 师 解 读 —
              </div>
              {loadingRead ? (
                <div style={{ textAlign:"center", padding:"40px 0" }}>
                  <div style={{ fontSize:"26px", animation:"floatAnim 2s ease-in-out infinite", marginBottom:"12px" }}>☯</div>
                  <p style={{ color:"rgba(180,140,60,0.4)", letterSpacing:"4px", fontSize:"12px" }}>大师推演中…</p>
                </div>
              ) : (
                <div
                  style={{ fontSize:"14px", lineHeight:"2.2", color:"rgba(232,213,160,0.85)", whiteSpace:"pre-wrap" }}
                  dangerouslySetInnerHTML={{ __html: interpretation.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
                />
              )}
            </div>

            <button onClick={reset} style={{
              width:"100%", padding:"12px", background:"transparent",
              border:"1px solid rgba(180,140,60,0.18)", borderRadius:"4px",
              color:"rgba(180,140,60,0.45)", fontSize:"13px", letterSpacing:"4px",
              cursor:"pointer", fontFamily:"inherit",
            }}>
              重新起卦
            </button>
          </div>
        )}

        <footer style={{ textAlign:"center", marginTop:"48px", fontSize:"10px", color:"rgba(180,140,60,0.2)", letterSpacing:"3px" }}>
          易有太极，是生两仪，两仪生四象，四象生八卦
        </footer>
      </div>
    </div>
  );
}
