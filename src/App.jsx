import { useState } from "react";

const BAGUA = [
  { name: "乾", symbol: "☰", lines: [1,1,1], nature: "天", element: "金" },
  { name: "兑", symbol: "☱", lines: [1,1,0], nature: "泽", element: "金" },
  { name: "离", symbol: "☲", lines: [1,0,1], nature: "火", element: "火" },
  { name: "震", symbol: "☳", lines: [0,1,1], nature: "雷", element: "木" },
  { name: "巽", symbol: "☴", lines: [0,0,1], nature: "风", element: "木" },
  { name: "坎", symbol: "☵", lines: [0,1,0], nature: "水", element: "水" },
  { name: "艮", symbol: "☶", lines: [1,0,0], nature: "山", element: "土" },
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
      const total = c.reduce((a, b) => a + b, 0);
      setCoins(c);
      setSpinning(false);
      onResult(total);
    }, 800);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
      <div style={{ display:"flex", gap:"16px" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:"52px", height:"52px", borderRadius:"50%",
            background: coins[i] === null
              ? "rgba(180,140,60,0.2)"
              : coins[i] === 3
                ? "radial-gradient(circle at 35% 35%, #f5d060, #b8860b)"
                : "radial-gradient(circle at 35% 35%, #c8a040, #7a5c10)",
            border:"2px solid rgba(180,140,60,0.6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"18px", fontWeight:"bold",
            boxShadow: coins[i] !== null ? "0 4px 12px rgba(180,140,60,0.4)" : "none",
            transition:"all 0.3s",
            color: coins[i] !== null ? "#fff8e0" : "transparent",
          }}>
            {coins[i] === null ? "" : coins[i] === 3 ? "正" : "反"}
          </div>
        ))}
      </div>
      <button onClick={flip} disabled={spinning} style={{
        padding:"10px 28px",
        background: spinning ? "rgba(180,140,60,0.2)" : "linear-gradient(135deg, #c8960c, #8B6914)",
        border:"1px solid rgba(180,140,60,0.5)", borderRadius:"4px",
        color: spinning ? "rgba(255,220,100,0.4)" : "#ffd700",
        cursor: spinning ? "wait" : "pointer",
        fontSize:"14px", letterSpacing:"3px", fontFamily:"inherit",
      }}>
        {spinning ? "卜中..." : "掷卦"}
      </button>
    </div>
  );
}

function HexagramDisplay({ lines, animated }) {
  return (
    <div style={{ display:"flex", flexDirection:"column-reverse", gap:"6px", alignItems:"center" }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          display:"flex", alignItems:"center", gap:"10px",
          opacity: animated ? 1 : 0,
          animation: animated ? `fadeIn 0.3s ease ${i * 0.12}s both` : "none",
        }}>
          <span style={{ fontSize:"11px", color:"rgba(180,140,60,0.5)", width:"24px", textAlign:"right", fontFamily:"serif" }}>
            {["初","二","三","四","五","上"][i]}爻
          </span>
          {line.yin ? (
            <div style={{ display:"flex", gap:"6px" }}>
              <div style={{ width:"34px", height:"8px", background: line.changing ? "#ff8c00" : "#c8960c", borderRadius:"2px" }} />
              <div style={{ width:"6px" }} />
              <div style={{ width:"34px", height:"8px", background: line.changing ? "#ff8c00" : "#c8960c", borderRadius:"2px" }} />
            </div>
          ) : (
            <div style={{ width:"74px", height:"8px", background: line.changing ? "#ff8c00" : "#ffd700", borderRadius:"2px" }} />
          )}
          {line.changing && <span style={{ fontSize:"11px", color:"#ff8c00" }}>○</span>}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [question, setQuestion] = useState("");
  const [castLines, setCastLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);

  const lines = castLines.map(v => lineType(v));
  const lowerLines = lines.slice(0,3).map(l => l.yin);
  const upperLines = lines.slice(3,6).map(l => l.yin);
  const lowerGua = lines.length === 6 ? getBagua(lowerLines) : null;
  const upperGua = lines.length === 6 ? getBagua(upperLines) : null;
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
      setTimeout(() => setPhase("result"), 500);
    }
  };

  const startCasting = () => {
    if (!question.trim()) return;
    setCastLines([]); setCurrentLine(0); setInterpretation("");
    setPhase("casting");
  };

  // ★ 关键：调用的是 /api/chat，而不是直接调用 Anthropic
  const askAI = async () => {
    setLoading(true);
    setInterpretation("");
    setPhase("reading");

    const changingDesc = lines.map((l,i) =>
      l.changing ? `第${["初","二","三","四","五","上"][i]}爻为动爻` : null
    ).filter(Boolean).join("，");

    const prompt = `你是一位精通周易六爻的易学大师，请为以下六爻卦象进行详细解读。

【所问之事】${question}
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
      // 调用我们自己的后端接口，不暴露API Key
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await resp.json();
      setInterpretation(data.result || "解卦失败，请重试");
    } catch {
      setInterpretation("连接失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhase("intro"); setQuestion(""); setCastLines([]);
    setCurrentLine(0); setInterpretation("");
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#0d0a06", color:"#e8d5a0",
      fontFamily:"'Noto Serif SC', 'SimSun', serif",
      position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        * { box-sizing: border-box; }
        strong { color: #ffd700; }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#8B6914;border-radius:2px}
      `}</style>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none",
        backgroundImage:`radial-gradient(ellipse at 20% 20%, rgba(180,140,60,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, rgba(120,60,20,0.08) 0%, transparent 60%)` }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:"660px", margin:"0 auto", padding:"40px 20px" }}>

        {/* 标题 */}
        <header style={{ textAlign:"center", marginBottom:"44px" }}>
          <div style={{ fontSize:"11px", letterSpacing:"8px", color:"rgba(180,140,60,0.4)", marginBottom:"10px" }}>
            ☰ ☷ ☲ ☵ ☶ ☱ ☴ ☳
          </div>
          <h1 style={{ fontSize:"30px", fontWeight:"300", letterSpacing:"12px", margin:"0 0 6px", color:"#ffd700" }}>
            六爻卜卦
          </h1>
          <p style={{ fontSize:"11px", color:"rgba(180,140,60,0.4)", letterSpacing:"4px", margin:0 }}>
            铜钱起卦 · 周易六十四卦 · AI解读
          </p>
        </header>

        {/* INTRO */}
        {phase === "intro" && (
          <div style={{ animation:"fadeIn 0.8s ease both" }}>
            <div style={{
              border:"1px solid rgba(180,140,60,0.2)", borderRadius:"8px",
              padding:"32px", background:"rgba(180,140,60,0.03)", marginBottom:"28px",
            }}>
              <p style={{ fontSize:"13px", lineHeight:"2.2", color:"rgba(232,213,160,0.6)", marginBottom:"24px", textAlign:"center" }}>
                心存一事，默念三遍，方可起卦<br/>诚心诚意，则卦象应验
              </p>
              <label style={{ fontSize:"12px", letterSpacing:"3px", color:"rgba(180,140,60,0.6)", display:"block", marginBottom:"10px" }}>
                所问之事
              </label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="请输入您想占问的事情，例如：此次求职能否顺利？"
                rows={3}
                style={{
                  width:"100%", padding:"14px",
                  background:"rgba(0,0,0,0.3)",
                  border:"1px solid rgba(180,140,60,0.25)", borderRadius:"4px",
                  color:"#e8d5a0", fontSize:"14px", fontFamily:"inherit",
                  resize:"none", outline:"none", lineHeight:"1.8", marginBottom:"16px",
                }}
              />
              <button onClick={startCasting} disabled={!question.trim()} style={{
                width:"100%", padding:"14px",
                background: question.trim()
                  ? "linear-gradient(135deg, #8B6914 0%, #c8960c 50%, #8B6914 100%)"
                  : "rgba(180,140,60,0.1)",
                border:"1px solid rgba(180,140,60,0.4)", borderRadius:"4px",
                color: question.trim() ? "#fff8e0" : "rgba(180,140,60,0.3)",
                fontSize:"15px", letterSpacing:"6px",
                cursor: question.trim() ? "pointer" : "not-allowed",
                fontFamily:"inherit",
              }}>
                开始起卦
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
              {[
                { icon:"🪙", title:"铜钱起卦", desc:"三枚铜钱掷六次，正面3反面2" },
                { icon:"☯", title:"动爻变化", desc:"老阴老阳为动爻，可推变卦" },
                { icon:"🤖", title:"AI解卦", desc:"易学大师角色，详细解读卦象" },
              ].map(item => (
                <div key={item.title} style={{
                  padding:"16px 12px", border:"1px solid rgba(180,140,60,0.12)",
                  borderRadius:"6px", textAlign:"center", background:"rgba(180,140,60,0.02)",
                }}>
                  <div style={{ fontSize:"22px", marginBottom:"8px" }}>{item.icon}</div>
                  <div style={{ fontSize:"12px", color:"#ffd700", letterSpacing:"1px", marginBottom:"6px" }}>{item.title}</div>
                  <div style={{ fontSize:"11px", color:"rgba(180,140,60,0.5)", lineHeight:"1.6" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASTING */}
        {phase === "casting" && (
          <div style={{ animation:"fadeIn 0.5s ease both" }}>
            <div style={{
              border:"1px solid rgba(180,140,60,0.2)", borderRadius:"8px",
              padding:"28px", background:"rgba(180,140,60,0.03)", marginBottom:"20px", textAlign:"center",
            }}>
              <p style={{ fontSize:"12px", color:"rgba(180,140,60,0.5)", letterSpacing:"3px", marginBottom:"4px" }}>
                第 {currentLine + 1} 爻（共六爻）
              </p>
              <p style={{ fontSize:"11px", color:"rgba(180,140,60,0.35)", marginBottom:"24px" }}>
                {["初爻·地基","二爻·人事","三爻·动变","四爻·官鬼","五爻·君位","上爻·天机"][currentLine]}
              </p>
              <CoinFlip onResult={handleCoinResult} />
            </div>
            {castLines.length > 0 && (
              <div style={{
                border:"1px solid rgba(180,140,60,0.15)", borderRadius:"8px",
                padding:"24px", background:"rgba(0,0,0,0.2)", textAlign:"center",
              }}>
                <p style={{ fontSize:"11px", color:"rgba(180,140,60,0.4)", letterSpacing:"3px", marginBottom:"16px" }}>已得爻位</p>
                <HexagramDisplay
                  lines={lines.concat(Array(6-lines.length).fill({yin:false,changing:false}))}
                  animated={true}
                />
              </div>
            )}
          </div>
        )}

        {/* RESULT & READING */}
        {(phase === "result" || phase === "reading") && lowerGua && upperGua && (
          <div style={{ animation:"fadeIn 0.6s ease both" }}>
            <div style={{ textAlign:"center", marginBottom:"28px" }}>
              <div style={{ fontSize:"11px", letterSpacing:"4px", color:"rgba(180,140,60,0.5)", marginBottom:"8px" }}>本卦</div>
              <div style={{ fontSize:"28px", fontWeight:"600", color:"#ffd700", letterSpacing:"6px", marginBottom:"4px" }}>{hexName}</div>
              <div style={{ fontSize:"12px", color:"rgba(180,140,60,0.5)" }}>
                上{upperGua.name}（{upperGua.nature}）· 下{lowerGua.name}（{lowerGua.nature}）
              </div>
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns: hasChanging ? "1fr auto 1fr" : "1fr",
              gap:"16px", alignItems:"center",
              padding:"28px", border:"1px solid rgba(180,140,60,0.2)",
              borderRadius:"8px", background:"rgba(0,0,0,0.3)", marginBottom:"20px",
            }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"11px", color:"rgba(180,140,60,0.4)", letterSpacing:"3px", marginBottom:"14px" }}>本卦</div>
                <HexagramDisplay lines={lines} animated={true} />
                <div style={{ marginTop:"10px", fontSize:"13px", color:"#ffd700", letterSpacing:"3px" }}>{hexName}</div>
              </div>
              {hasChanging && <>
                <div style={{ color:"rgba(180,140,60,0.4)", fontSize:"18px", textAlign:"center" }}>→</div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"11px", color:"rgba(255,140,0,0.5)", letterSpacing:"3px", marginBottom:"14px" }}>变卦</div>
                  <HexagramDisplay lines={changedLines} animated={true} />
                  <div style={{ marginTop:"10px", fontSize:"13px", color:"#ff8c00", letterSpacing:"3px" }}>{changedHexName}</div>
                </div>
              </>}
            </div>

            {hasChanging && (
              <div style={{
                padding:"10px 16px", border:"1px solid rgba(255,140,0,0.2)",
                borderRadius:"4px", background:"rgba(255,140,0,0.04)",
                marginBottom:"16px", fontSize:"12px", color:"rgba(255,180,60,0.7)",
              }}>
                动爻：{lines.map((l,i) => l.changing ? `${["初","二","三","四","五","上"][i]}爻（${l.yin?"老阴":"老阳"}）` : null).filter(Boolean).join("、")}
              </div>
            )}

            {phase === "result" && (
              <button onClick={askAI} style={{
                width:"100%", padding:"16px",
                background:"linear-gradient(135deg, #5a3e10 0%, #8B6914 50%, #5a3e10 100%)",
                border:"1px solid rgba(180,140,60,0.5)", borderRadius:"4px",
                color:"#ffd700", fontSize:"15px", letterSpacing:"6px",
                cursor:"pointer", fontFamily:"inherit", marginBottom:"12px",
              }}>
                ✦ 请AI大师解卦 ✦
              </button>
            )}

            {phase === "reading" && (
              <div style={{
                border:"1px solid rgba(180,140,60,0.2)", borderRadius:"8px",
                padding:"28px", background:"rgba(0,0,0,0.3)", marginBottom:"16px",
              }}>
                <div style={{ fontSize:"11px", letterSpacing:"4px", color:"rgba(180,140,60,0.4)", marginBottom:"20px", textAlign:"center" }}>
                  — 卦 象 解 读 —
                </div>
                {loading ? (
                  <div style={{ textAlign:"center", padding:"40px 0" }}>
                    <div style={{ fontSize:"28px", animation:"float 2s ease-in-out infinite", marginBottom:"14px" }}>☯</div>
                    <p style={{ color:"rgba(180,140,60,0.5)", letterSpacing:"4px", fontSize:"13px" }}>大师推演中...</p>
                  </div>
                ) : (
                  <div
                    style={{ fontSize:"14px", lineHeight:"2.2", color:"rgba(232,213,160,0.85)", whiteSpace:"pre-wrap" }}
                    dangerouslySetInnerHTML={{ __html: interpretation.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
                  />
                )}
              </div>
            )}

            <button onClick={reset} style={{
              width:"100%", padding:"12px", background:"transparent",
              border:"1px solid rgba(180,140,60,0.2)", borderRadius:"4px",
              color:"rgba(180,140,60,0.5)", fontSize:"13px", letterSpacing:"4px",
              cursor:"pointer", fontFamily:"inherit",
            }}>
              重新起卦
            </button>
          </div>
        )}

        <footer style={{ textAlign:"center", marginTop:"48px", fontSize:"11px", color:"rgba(180,140,60,0.2)", letterSpacing:"3px" }}>
          易有太极，是生两仪，两仪生四象，四象生八卦
        </footer>
      </div>
    </div>
  );
}
