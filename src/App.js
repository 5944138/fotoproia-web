import { useState, useEffect, useRef, useCallback } from "react";

const API = "https://fotoproia-production.up.railway.app";
const SB = "https://fuldesbdunejglscryos.supabase.co/storage/v1/object/public/fotoproia-photos";
const DEMOS = Array.from({ length: 6 }, (_, i) => `${SB}/demos/demo_${i}.webp`);
const WA = "https://wa.me/522226735923?text=Hola!%20Quiero%20mis%20fotos%20profesionales%20con%20FotoProIA";

const PACKAGES = [
  { id: "basico", name: "Básico", price: 19, photos: 40, styles: 3, per: "$0.47", features: ["40 fotos profesionales", "3 estilos a elegir", "Resolución HD", "Listo en ~20 min", "Uso comercial incluido"] },
  { id: "pro", name: "Profesional", price: 29, photos: 80, styles: 6, popular: true, per: "$0.36", features: ["80 fotos profesionales", "6 estilos diferentes", "Resolución 4K", "Mejora facial GFPGAN", "Uso comercial incluido", "Variaciones de fondo"] },
  { id: "premium", name: "Ejecutivo", price: 49, photos: 150, styles: 12, per: "$0.33", features: ["150 fotos profesionales", "Todos los 12+ estilos", "Resolución 4K", "Mejora facial + Upscale", "Procesamiento prioritario", "Optimizado para LinkedIn"] },
];

const STYLES = [
  { id: "ejecutivo", name: "Ejecutivo", icon: "👔", desc: "Traje y corbata" },
  { id: "casual_pro", name: "Casual Pro", icon: "🧥", desc: "Blazer moderno" },
  { id: "corporativo", name: "Corporativo", icon: "🏢", desc: "Ideal LinkedIn" },
  { id: "medico", name: "Médico", icon: "🩺", desc: "Bata y clínica" },
  { id: "abogado", name: "Abogado", icon: "⚖️", desc: "Despacho legal" },
  { id: "creativo", name: "Creativo", icon: "🎨", desc: "Artístico" },
  { id: "emprendedor", name: "Emprendedor", icon: "🚀", desc: "Startup" },
  { id: "academico", name: "Académico", icon: "🎓", desc: "Universidad" },
  { id: "influencer", name: "Influencer", icon: "📱", desc: "Redes sociales" },
  { id: "formal", name: "Formal", icon: "🎩", desc: "Clásico" },
  { id: "natural", name: "Natural", icon: "🌿", desc: "Luz dorada" },
  { id: "moderno", name: "Moderno", icon: "✨", desc: "Minimalista" },
];

const SELFIE_TIPS = [
  { icon: "☀️", title: "Buena luz", desc: "Ponte frente a una ventana. La luz natural es tu mejor amiga." },
  { icon: "📐", title: "Varios ángulos", desc: "Toma fotos de frente, perfil izquierdo y perfil derecho." },
  { icon: "🚫", title: "Sin filtros", desc: "No uses filtros de Instagram ni Snapchat. La IA necesita tu cara real." },
  { icon: "😊", title: "Varias expresiones", desc: "Sonríe, serio, relajado. Más variedad = mejores resultados." },
  { icon: "🧢", title: "Sin accesorios", desc: "Quítate lentes de sol, gorras y audífonos para las fotos." },
  { icon: "🖼️", title: "Fondo limpio", desc: "Una pared lisa de fondo ayuda. Evita fondos desordenados." },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400;1,6..72,600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--c0:#06060a;--c1:#16161d;--c2:#2a2a36;--c3:#5a5a6e;--c4:#8a8a9e;--c5:#b8b8c8;--w:#ffffff;--w2:#fafafb;--w3:#f0f0f3;--w4:#e4e4e9;--accent:#3b5cff;--accent2:#2d47d6;--aglow:rgba(59,92,255,.12);--mint:#10b981;--warm:#f59e0b;--err:#ef4444;--r:8px;--rl:14px;--rx:20px;--f:'Sora',system-ui,sans-serif;--fh:'Newsreader',Georgia,serif}
body{font-family:var(--f);color:var(--c0);background:var(--w);-webkit-font-smoothing:antialiased;overflow-x:hidden}
.V{opacity:0;transform:translateY(24px);transition:all .7s cubic-bezier(.16,1,.3,1)}.V.show{opacity:1;transform:none}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.grain{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:.018;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.b{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--f);font-weight:600;border:none;cursor:pointer;transition:all .25s;text-decoration:none;letter-spacing:-.01em}
.b1{background:var(--c0);color:var(--w);padding:16px 32px;border-radius:var(--r);font-size:.92rem}.b1:hover{background:var(--c1);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.18)}
.b2{background:var(--accent);color:var(--w);padding:16px 32px;border-radius:var(--r);font-size:.92rem}.b2:hover{background:var(--accent2)}
.b3{background:none;color:var(--c0);padding:14px 28px;border-radius:var(--r);font-size:.9rem;border:1.5px solid var(--w4)}.b3:hover{border-color:var(--c2);background:var(--w2)}
.bwa{background:#25D366;color:#fff;padding:14px 24px;border-radius:var(--r);font-size:.88rem;display:inline-flex;align-items:center;gap:8px}.bwa:hover{background:#1da851;transform:translateY(-2px);box-shadow:0 6px 24px rgba(37,211,102,.25)}
.bx{padding:18px 40px;font-size:1rem;border-radius:var(--rl)}
.blin{background:#0A66C2;color:#fff;padding:12px 20px;border-radius:var(--r);font-size:.85rem}.blin:hover{background:#004182}
.tag{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:100px;font-size:.72rem;font-weight:600;letter-spacing:.03em}
.sec{padding:96px 24px;max-width:1120px;margin:0 auto}
@media(max-width:768px){.sec{padding:56px 16px}}
.alert{position:fixed;top:14px;right:14px;background:var(--err);color:var(--w);padding:14px 20px;border-radius:var(--r);z-index:9999;font-size:.84rem;max-width:360px;box-shadow:0 12px 40px rgba(239,68,68,.3);animation:sIn .3s ease}
@keyframes sIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
.wafloat{position:fixed;bottom:24px;right:24px;z-index:9990;animation:float 3s ease-in-out infinite}
.guide-card{padding:16px;border-radius:var(--rl);background:var(--w);border:1px solid var(--w4);text-align:center;transition:all .2s}
.guide-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.06)}
`;

function useReveal(){const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("show");obs.unobserve(el)}},{threshold:.15});obs.observe(el);return()=>obs.disconnect()},[]);return ref}
function R({children,delay=0}){const ref=useReveal();return <div ref={ref} className="V" style={{transitionDelay:`${delay}s`}}>{children}</div>}
function Counter({end,suffix=""}){const[val,setVal]=useState(0);const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){let s=0;const st=end/125;const t=setInterval(()=>{s+=st;if(s>=end){setVal(end);clearInterval(t)}else setVal(Math.floor(s))},16);obs.unobserve(el)}},{threshold:.5});obs.observe(el);return()=>obs.disconnect()},[end]);return <span ref={ref}>{val.toLocaleString()}{suffix}</span>}

export default function App(){
const[step,setStep]=useState("landing");const[pkg,setPkg]=useState(null);const[files,setFiles]=useState([]);const[styles,setStyles]=useState([]);const[email,setEmail]=useState("");const[name,setName]=useState("");const[orderId,setOrderId]=useState(null);const[orderStatus,setOrderStatus]=useState(null);const[photos,setPhotos]=useState([]);const[loading,setLoading]=useState(false);const[error,setError]=useState(null);const[showGuide,setShowGuide]=useState(false);const fileRef=useRef(null);const pollRef=useRef(null);const pricingRef=useRef(null);
useEffect(()=>{if(error){const t=setTimeout(()=>setError(null),5000);return()=>clearTimeout(t)}},[error]);
const startPolling=useCallback((oid)=>{if(pollRef.current)clearInterval(pollRef.current);pollRef.current=setInterval(async()=>{try{const r=await fetch(`${API}/api/orders/${oid}/status`);const d=await r.json();setOrderStatus(d);if(d.status==="completed"){clearInterval(pollRef.current);const pr=await fetch(`${API}/api/orders/${oid}/photos`);const pd=await pr.json();setPhotos(pd.photos||[]);setStep("results")}else if(d.status==="failed")clearInterval(pollRef.current)}catch(e){console.error(e)}},8000)},[]);
useEffect(()=>()=>{if(pollRef.current)clearInterval(pollRef.current)},[]);
const handleUpload=(e)=>{const f=Array.from(e.target.files).filter(f=>["image/jpeg","image/png","image/webp"].includes(f.type)).slice(0,25);setFiles(p=>[...p,...f].slice(0,25))};
const selectedPkg=pkg?PACKAGES.find(p=>p.id===pkg):null;const maxStyles=selectedPkg?.styles||3;
const toggleStyle=(id)=>setStyles(p=>{if(p.includes(id))return p.filter(s=>s!==id);if(p.length>=maxStyles)return p;return[...p,id]});
const handlePay=async()=>{if(!email.includes("@")||!pkg||files.length<8||styles.length===0){setError("Completa todos los campos: email, 8+ selfies y al menos 1 estilo");return}setLoading(true);setError(null);try{const or=await fetch(`${API}/api/orders`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({package:pkg,email,name:name||undefined,styles})});if(!or.ok)throw new Error("Error al crear la orden");const od=await or.json();setOrderId(od.order_id);const fd=new FormData();files.forEach(f=>fd.append("files",f));const ur=await fetch(`${API}/api/orders/${od.order_id}/upload`,{method:"POST",body:fd});if(!ur.ok)throw new Error("Error al subir selfies");if(od.payment_url)window.location.href=od.payment_url;else{setStep("processing");startPolling(od.order_id)}}catch(e){setError(e.message);setLoading(false)}};

/* ═══ LANDING ═══ */
if(step==="landing"){return(
<div style={{background:"var(--w)",minHeight:"100vh",position:"relative"}}><style>{CSS}</style><div className="grain"/>
{error&&<div className="alert">{error}</div>}

{/* WhatsApp floating button */}
<a href={WA} target="_blank" rel="noopener noreferrer" className="wafloat" style={{textDecoration:"none"}}>
<div className="bwa" style={{borderRadius:100,padding:"14px 20px",boxShadow:"0 4px 20px rgba(37,211,102,.3)"}}>💬 WhatsApp</div></a>

{/* NAV */}
<nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 28px",maxWidth:1120,margin:"0 auto"}}>
<div style={{fontSize:"1.15rem",fontWeight:800,letterSpacing:"-.04em"}}>foto<span style={{color:"var(--accent)"}}>pro</span>ia</div>
<div style={{display:"flex",gap:10,alignItems:"center"}}>
<a href={WA} target="_blank" rel="noopener noreferrer" style={{color:"var(--c3)",fontSize:".84rem",fontWeight:500,textDecoration:"none"}}>WhatsApp</a>
<a href="#p" onClick={e=>{e.preventDefault();pricingRef.current?.scrollIntoView({behavior:"smooth"})}} style={{color:"var(--c3)",fontSize:".84rem",fontWeight:500,textDecoration:"none"}}>Precios</a>
<button className="b b1" style={{padding:"10px 22px",fontSize:".82rem"}} onClick={()=>pricingRef.current?.scrollIntoView({behavior:"smooth"})}>Empezar</button>
</div></nav>

{/* HERO */}
<section style={{padding:"72px 24px 48px",maxWidth:880,margin:"0 auto",textAlign:"center"}}>
<R delay={0}><div className="tag" style={{background:"var(--aglow)",color:"var(--accent)",marginBottom:24}}>NUEVO · Tu estudio fotográfico con IA</div></R>
<R delay={.1}><h1 style={{fontFamily:"var(--fh)",fontSize:"clamp(2.8rem,7vw,4.8rem)",fontWeight:600,lineHeight:1.04,letterSpacing:"-.03em",marginBottom:24}}>Fotos profesionales<br/><em style={{fontStyle:"italic",color:"var(--accent)"}}>sin fotógrafo</em></h1></R>
<R delay={.2}><p style={{fontSize:"1.12rem",color:"var(--c3)",lineHeight:1.7,maxWidth:520,margin:"0 auto 36px"}}>Sube tus selfies. Nuestra IA entrena un modelo exclusivo con tu rostro y genera retratos de estudio profesional en 20 minutos.</p></R>
<R delay={.3}><div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
<button className="b b1 bx" onClick={()=>pricingRef.current?.scrollIntoView({behavior:"smooth"})}>Crear mis fotos — desde $19</button>
<a href={WA} target="_blank" rel="noopener noreferrer" className="b bwa" style={{padding:"16px 28px",textDecoration:"none"}}>💬 Dudas? WhatsApp</a>
</div></R>
<R delay={.35}><div style={{display:"flex",justifyContent:"center",gap:20,marginTop:32,flexWrap:"wrap"}}>{["🔒 Fotos eliminadas en 24h","⚡ Listo en 20 min","✅ Garantía de devolución","🌎 Toda Latinoamérica"].map(b=><span key={b} style={{fontSize:".78rem",color:"var(--c4)",fontWeight:500}}>{b}</span>)}</div></R>
</section>

{/* PHOTOS */}
<R delay={.2}><section style={{padding:"0 24px 80px",maxWidth:740,margin:"0 auto"}}>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,borderRadius:"var(--rx)",overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.08)"}}>{DEMOS.map((d,i)=><img key={i} src={d} alt={`Ejemplo ${i+1}`} loading="lazy" style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block"}}/>)}</div>
<p style={{textAlign:"center",color:"var(--c4)",fontSize:".74rem",marginTop:14}}>Resultados reales · IA optimizada para todos los tonos de piel latinoamericanos</p>
</section></R>

{/* STATS */}
<section style={{background:"var(--c0)",padding:"48px 24px"}}><div style={{display:"flex",justifyContent:"center",gap:56,flexWrap:"wrap",maxWidth:800,margin:"0 auto"}}>{[{val:4800,suffix:"+",label:"Fotos generadas"},{val:20,suffix:" min",label:"Tiempo promedio"},{val:96,suffix:"%",label:"Clientes satisfechos"}].map(s=><div key={s.label} style={{textAlign:"center",minWidth:120}}><div style={{color:"var(--w)",fontFamily:"var(--fh)",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:600}}><Counter end={s.val} suffix={s.suffix}/></div><div style={{color:"var(--c4)",fontSize:".78rem",marginTop:6,fontWeight:500}}>{s.label}</div></div>)}</div></section>

{/* HOW IT WORKS */}
<section id="como" className="sec">
<R><h2 style={{fontFamily:"var(--fh)",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:600,textAlign:"center",marginBottom:10}}>¿Cómo funciona?</h2></R>
<R delay={.05}><p style={{textAlign:"center",color:"var(--c3)",marginBottom:56}}>Tres pasos. Sin estudio. Sin cita. Desde tu celular.</p></R>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
{[{n:"01",icon:"📸",t:"Sube tus selfies",d:"8 a 25 fotos claras. Diferentes ángulos, buena luz, sin filtros."},{n:"02",icon:"🎨",t:"Elige tus estilos",d:"Ejecutivo, médico, creativo — los looks profesionales que necesitas."},{n:"03",icon:"✨",t:"Recibe tus fotos",d:"IA exclusiva para TU rostro. Fotos de estudio en ~20 min con calidad 4K."}].map((s,i)=>
<R key={s.n} delay={i*.1}><div style={{padding:"32px 28px",borderRadius:"var(--rl)",background:"var(--w2)",border:"1px solid var(--w4)",transition:"all .3s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:"2rem"}}>{s.icon}</span><span style={{fontSize:".68rem",fontWeight:700,color:"var(--accent)",letterSpacing:".14em"}}>PASO {s.n}</span></div>
<h3 style={{fontSize:"1.05rem",fontWeight:700,marginBottom:8}}>{s.t}</h3><p style={{color:"var(--c3)",fontSize:".86rem",lineHeight:1.65}}>{s.d}</p></div></R>)}</div></section>

{/* COMPARISON */}
<R><section className="sec" style={{background:"var(--w2)",borderRadius:0}}>
<h2 style={{fontFamily:"var(--fh)",fontSize:"clamp(1.6rem,3.5vw,2.2rem)",fontWeight:600,textAlign:"center",marginBottom:40}}>¿Por qué FotoProIA?</h2>
<div style={{maxWidth:640,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:0,fontSize:".86rem"}}>
{[["","Fotógrafo","FotoProIA"],["Precio","$100-400 USD","Desde $19 USD"],["Tiempo","1-2 semanas","20 minutos"],["Fotos","5-10 editadas","40-150 fotos"],["Calidad","Variable","4K + GFPGAN"],["Cita","Agendar + traslado","Desde tu celular"],["Pago","Efectivo/transfer","Tarjeta, OXXO, SPEI"]].map((row,i)=><>{row.map((cell,j)=><div key={`${i}-${j}`} style={{padding:"14px 16px",borderBottom:"1px solid var(--w4)",fontWeight:i===0?700:j===0?600:400,color:i===0?"var(--c0)":j===2?"var(--accent)":j===1?"var(--c3)":"var(--c0)",background:i===0?"var(--w3)":j===2?"var(--aglow)":"transparent",textAlign:j===0?"left":"center",fontSize:i===0?".76rem":".84rem"}}>{cell}</div>)}</>)}</div>
</section></R>

{/* PRICING */}
<section ref={pricingRef} id="precios" className="sec">
<R><h2 style={{fontFamily:"var(--fh)",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:600,textAlign:"center",marginBottom:8}}>Precios transparentes</h2></R>
<R delay={.05}><p style={{textAlign:"center",color:"var(--c3)",marginBottom:48}}>Pago único. Sin suscripción. Garantía de devolución.</p></R>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,maxWidth:920,margin:"0 auto"}}>
{PACKAGES.map((p,i)=><R key={p.id} delay={i*.08}><div onClick={()=>{setPkg(p.id);setStyles([]);setStep("upload")}} style={{padding:"32px 28px",borderRadius:"var(--rl)",cursor:"pointer",transition:"all .3s",position:"relative",background:"var(--w)",border:p.popular?"2px solid var(--accent)":"1.5px solid var(--w4)"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,.1)"}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
{p.popular&&<div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:"var(--accent)",color:"var(--w)",padding:"5px 18px",borderRadius:100,fontSize:".68rem",fontWeight:700,letterSpacing:".08em"}}>MÁS ELEGIDO</div>}
<div style={{fontSize:".82rem",fontWeight:600,color:"var(--c3)",marginBottom:6}}>{p.name}</div>
<div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:6}}><span style={{fontFamily:"var(--fh)",fontSize:"3.2rem",fontWeight:600,letterSpacing:"-.03em"}}>${p.price}</span><span style={{color:"var(--c4)",fontSize:".8rem"}}>USD</span></div>
<div style={{fontSize:".74rem",color:"var(--mint)",fontWeight:600,marginBottom:20}}>{p.per} por foto</div>
<ul style={{listStyle:"none",padding:0,marginBottom:24}}>{p.features.map(f=><li key={f} style={{padding:"5px 0",fontSize:".84rem",color:"var(--c2)",display:"flex",alignItems:"flex-start",gap:10,lineHeight:1.5}}><span style={{color:"var(--mint)",fontSize:".6rem",marginTop:6}}>●</span>{f}</li>)}</ul>
<button className={p.popular?"b b2":"b b3"} style={{width:"100%",padding:"14px"}}>Elegir {p.name}</button></div></R>)}</div>
<R delay={.2}><p style={{textAlign:"center",color:"var(--c4)",fontSize:".78rem",marginTop:28}}>💳 Visa, Mastercard, Amex — cualquier país · 🏪 OXXO · 🏦 SPEI · Pago seguro con Stripe</p></R>
</section>

{/* TESTIMONIALS */}
<section className="sec" style={{background:"var(--c0)",borderRadius:0,padding:"80px 24px"}}>
<R><h2 style={{fontFamily:"var(--fh)",fontSize:"clamp(1.8rem,4vw,2.4rem)",fontWeight:600,textAlign:"center",marginBottom:48,color:"var(--w)"}}>Lo que dicen nuestros clientes</h2></R>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14,maxWidth:1000,margin:"0 auto"}}>
{[{name:"María García",city:"Santo Domingo, RD",text:"Calidad increíble. Mi perfil de LinkedIn se ve completamente diferente. La IA respetó mi tono de piel perfectamente.",role:"Abogada"},{name:"Carlos Ramírez",city:"Monterrey, MX",text:"Pagué con OXXO y en 20 minutos tenía 80 fotos. Al menos 20 quedaron perfectas para mi consultorio.",role:"Médico"},{name:"Ana López",city:"Bogotá, CO",text:"Como freelancer no puedo pagar un fotógrafo. FotoProIA me dio fotos profesionales que uso en todas mis redes.",role:"Diseñadora"},{name:"Roberto Martínez",city:"Buenos Aires, AR",text:"Lo usamos para nuestro equipo completo. 15 personas, estilo consistente. Fracción del costo de un estudio.",role:"Director Comercial"},{name:"Laura Sánchez",city:"Lima, PE",text:"La IA capturó mis rasgos perfectamente. La calidad 4K es impresionante. Mis compañeros no creen que es IA.",role:"Ingeniera"},{name:"Diego Hernández",city:"Santiago, CL",text:"Mejor inversión para mi marca personal. Los headshots ejecutivos son indistinguibles de fotos reales.",role:"Emprendedor"}].map((t,i)=>
<R key={i} delay={i*.06}><div style={{padding:24,borderRadius:"var(--rl)",background:"var(--c1)",border:"1px solid var(--c2)"}}>
<div style={{color:"var(--warm)",marginBottom:12,fontSize:".74rem",letterSpacing:"2px"}}>★★★★★</div>
<p style={{color:"var(--c5)",fontSize:".88rem",lineHeight:1.65,marginBottom:18}}>"{t.text}"</p>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--c2)",paddingTop:12}}><div><p style={{fontWeight:600,fontSize:".82rem",color:"var(--w)"}}>{t.name}</p><p style={{color:"var(--c4)",fontSize:".74rem"}}>{t.role}</p></div><span style={{fontSize:".72rem",color:"var(--c4)"}}>📍 {t.city}</span></div></div></R>)}</div></section>

{/* FAQ */}
<section className="sec" style={{maxWidth:640}}>
<R><h2 style={{fontFamily:"var(--fh)",fontSize:"clamp(1.6rem,3.5vw,2.2rem)",fontWeight:600,textAlign:"center",marginBottom:40}}>Preguntas frecuentes</h2></R>
{[{q:"¿Cuánto tardan mis fotos?",a:"~20 minutos después de subir tus selfies y pagar."},{q:"¿Las fotos se ven reales?",a:"Sí. IA entrenada con TU rostro + mejora facial GFPGAN + resolución 4K con Real-ESRGAN."},{q:"¿Puedo pagar desde República Dominicana, Colombia o Argentina?",a:"¡Sí! Visa, Mastercard y Amex de cualquier país. En México también OXXO y SPEI."},{q:"¿La IA respeta mi tono de piel?",a:"Sí. Nuestros prompts están optimizados para preservar exactamente tu tono de piel y rasgos faciales sin alterarlos."},{q:"¿Mis fotos son privadas?",a:"Absolutamente. Selfies eliminadas en 24 horas. Nunca compartimos ni usamos tus fotos."},{q:"¿Qué pasa si no me gustan?",a:"Garantía de devolución. Si no obtienes al menos una foto profesional utilizable, devolvemos tu dinero."}].map((f,i)=>
<R key={i} delay={i*.04}><details style={{borderBottom:"1px solid var(--w4)",padding:"18px 0"}}><summary style={{cursor:"pointer",fontWeight:600,fontSize:".92rem",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>{f.q}<span style={{color:"var(--c4)",fontSize:"1.2rem",marginLeft:12}}>+</span></summary><p style={{color:"var(--c3)",fontSize:".86rem",lineHeight:1.65,marginTop:12,paddingRight:24}}>{f.a}</p></details></R>)}</section>

{/* CTA */}
<section style={{background:"linear-gradient(135deg,var(--c0) 0%,#1a1a2e 100%)",padding:"80px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,92,255,.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
<R><h2 style={{fontFamily:"var(--fh)",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:600,color:"var(--w)",marginBottom:14,position:"relative"}}>Tu imagen profesional<br/><em style={{fontStyle:"italic",color:"var(--accent)"}}>empieza aquí</em></h2></R>
<R delay={.1}><p style={{color:"rgba(255,255,255,.4)",marginBottom:32,fontSize:".98rem",position:"relative"}}>20 minutos · Desde $19 USD · Sin salir de casa</p></R>
<R delay={.15}><div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",position:"relative"}}>
<button className="b bx" style={{background:"var(--w)",color:"var(--c0)",fontWeight:700}} onClick={()=>pricingRef.current?.scrollIntoView({behavior:"smooth"})}>Crear mis fotos →</button>
<a href={WA} target="_blank" rel="noopener noreferrer" className="b bwa bx" style={{textDecoration:"none"}}>💬 WhatsApp</a>
</div></R></section>

{/* FOOTER */}
<footer style={{padding:"32px 24px",textAlign:"center",borderTop:"1px solid var(--w4)"}}>
<div style={{fontSize:".96rem",fontWeight:800,letterSpacing:"-.04em",marginBottom:8}}>foto<span style={{color:"var(--accent)"}}>pro</span>ia</div>
<p style={{color:"var(--c4)",fontSize:".74rem"}}>Hecho con ❤️ para toda Latinoamérica · IA optimizada para la diversidad latina</p>
<p style={{color:"var(--c4)",fontSize:".7rem",marginTop:4}}>contacto@fotoproia.com · <a href={WA} target="_blank" rel="noopener noreferrer" style={{color:"var(--c4)"}}>WhatsApp</a> · Términos · Privacidad</p>
</footer></div>)}

/* ═══ UPLOAD ═══ */
if(step==="upload"){const canPay=files.length>=8&&styles.length>0&&email.includes("@");return(
<div style={{minHeight:"100vh",background:"var(--w)"}}><style>{CSS}</style><div className="grain"/>{error&&<div className="alert">{error}</div>}
<a href={WA} target="_blank" rel="noopener noreferrer" className="wafloat" style={{textDecoration:"none"}}><div className="bwa" style={{borderRadius:100,padding:"14px 20px",boxShadow:"0 4px 20px rgba(37,211,102,.3)"}}>💬</div></a>
<nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",maxWidth:1120,margin:"0 auto",borderBottom:"1px solid var(--w4)"}}><div style={{fontSize:"1.1rem",fontWeight:800,letterSpacing:"-.04em"}}>foto<span style={{color:"var(--accent)"}}>pro</span>ia</div><button onClick={()=>{setStep("landing");setFiles([]);setStyles([])}} style={{background:"none",border:"none",color:"var(--accent)",cursor:"pointer",fontWeight:600,fontSize:".82rem",fontFamily:"var(--f)"}}>← Cambiar plan</button></nav>
<div style={{maxWidth:560,margin:"0 auto",padding:"32px 20px"}}>
<div style={{padding:"16px 18px",background:"var(--w2)",borderRadius:"var(--r)",marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:"1.05rem",fontWeight:700}}>{selectedPkg?.name}</div><div style={{color:"var(--c3)",fontSize:".78rem"}}>{selectedPkg?.photos} fotos · {selectedPkg?.styles} estilos</div></div><div style={{fontFamily:"var(--fh)",fontSize:"1.6rem",fontWeight:600,color:"var(--accent)"}}>${selectedPkg?.price}</div></div>

{/* Progress */}
<div style={{display:"flex",gap:3,marginBottom:28}}>{["Selfies","Estilos","Pagar"].map((s,i)=>{const done=i===0?files.length>=8:i===1?styles.length>0:false;return<div key={s} style={{flex:1,height:3,borderRadius:2,background:done?"var(--accent)":"var(--w4)",transition:"all .4s"}}/>})}</div>

{/* SELFIE GUIDE */}
<div style={{marginBottom:24}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<h3 style={{fontSize:".92rem",fontWeight:700}}>1. Sube tus selfies</h3>
<button onClick={()=>setShowGuide(!showGuide)} style={{background:"var(--aglow)",color:"var(--accent)",border:"none",padding:"6px 14px",borderRadius:100,fontSize:".74rem",fontWeight:600,cursor:"pointer"}}>
{showGuide?"Cerrar guía":"📸 Guía para mejores fotos"}
</button></div>

{/* Guided selfie capture tips */}
{showGuide&&<div style={{marginBottom:20,padding:20,background:"var(--w2)",borderRadius:"var(--rl)",border:"1px solid var(--w4)"}}>
<p style={{fontSize:".82rem",fontWeight:600,marginBottom:14,color:"var(--accent)"}}>Sigue estas recomendaciones para los mejores resultados:</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
{SELFIE_TIPS.map(tip=><div key={tip.title} className="guide-card">
<div style={{fontSize:"1.4rem",marginBottom:6}}>{tip.icon}</div>
<div style={{fontSize:".76rem",fontWeight:700,marginBottom:4}}>{tip.title}</div>
<div style={{fontSize:".68rem",color:"var(--c3)",lineHeight:1.4}}>{tip.desc}</div>
</div>)}
</div>
<p style={{fontSize:".74rem",color:"var(--mint)",fontWeight:600,marginTop:14,textAlign:"center"}}>✅ Más variedad en tus selfies = mejores resultados de la IA</p>
</div>}

<p style={{color:"var(--c4)",fontSize:".78rem",marginBottom:14}}>Mínimo 8, máximo 25. Sin filtros, buena luz, diferentes ángulos.</p>
<div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed var(--w4)",borderRadius:"var(--rl)",padding:"32px 20px",textAlign:"center",cursor:"pointer",background:"var(--w2)",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--w4)"}>
<input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleUpload} style={{display:"none"}}/>
<div style={{fontSize:"1.8rem",marginBottom:6}}>📷</div>
<p style={{fontWeight:600,fontSize:".86rem"}}>Toca para subir selfies</p>
<p style={{color:"var(--c4)",fontSize:".76rem",marginTop:4}}>{files.length}/25 seleccionadas</p></div>
{files.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(56px,1fr))",gap:4,marginTop:10}}>{files.map((f,i)=><div key={i} style={{position:"relative",borderRadius:6,overflow:"hidden",aspectRatio:"1"}}><img src={URL.createObjectURL(f)} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><button onClick={e=>{e.stopPropagation();setFiles(p=>p.filter((_,j)=>j!==i))}} style={{position:"absolute",top:1,right:1,background:"rgba(0,0,0,.65)",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:".5rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>)}</div>}
{files.length>0&&files.length<8&&<p style={{color:"var(--err)",fontSize:".78rem",marginTop:6}}>Faltan {8-files.length} selfie{8-files.length>1?"s":""}</p>}
</div>

{/* Styles */}
<div style={{marginBottom:28}}><h3 style={{fontSize:".92rem",fontWeight:700,marginBottom:4}}>2. Elige tus estilos</h3><p style={{color:"var(--c4)",fontSize:".78rem",marginBottom:14}}>Hasta {maxStyles} ({styles.length}/{maxStyles})</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(108px,1fr))",gap:7}}>{STYLES.slice(0,maxStyles<=3?6:maxStyles<=6?9:12).map(s=>{const sel=styles.includes(s.id);const dis=!sel&&styles.length>=maxStyles;return<div key={s.id} onClick={()=>!dis&&toggleStyle(s.id)} style={{padding:"11px 6px",border:sel?"2px solid var(--accent)":"1.5px solid var(--w4)",borderRadius:"var(--r)",cursor:dis?"default":"pointer",opacity:dis?.25:1,background:sel?"var(--aglow)":"var(--w)",textAlign:"center",transition:"all .15s"}}><div style={{fontSize:"1.1rem"}}>{s.icon}</div><div style={{fontSize:".72rem",fontWeight:600,marginTop:2}}>{s.name}</div><div style={{fontSize:".62rem",color:"var(--c4)"}}>{s.desc}</div></div>})}</div></div>

{/* Data */}
<div style={{marginBottom:28}}><h3 style={{fontSize:".92rem",fontWeight:700,marginBottom:10}}>3. Tus datos</h3>
<input type="text" placeholder="Tu nombre" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid var(--w4)",borderRadius:"var(--r)",fontSize:".88rem",marginBottom:8,fontFamily:"var(--f)",outline:"none"}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--w4)"}/>
<input type="email" placeholder="tu@correo.com *" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid var(--w4)",borderRadius:"var(--r)",fontSize:".88rem",fontFamily:"var(--f)",outline:"none"}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--w4)"}/>
<p style={{color:"var(--c4)",fontSize:".72rem",marginTop:6}}>Recibirás el enlace de descarga en este correo</p></div>

{/* Pay */}

{/* PREVIEW GRATIS */}
{files.length>=8&&styles.length>0&&!canPay&&<div style={{padding:20,background:"var(--aglow)",borderRadius:"var(--rl)",marginBottom:20,textAlign:"center"}}>
<p style={{fontSize:".86rem",fontWeight:600,color:"var(--accent)",marginBottom:8}}>📸 Completa tu email para ver el preview gratis</p>
<p style={{fontSize:".76rem",color:"var(--c3)"}}>Te mostraremos cómo quedarían tus fotos antes de pagar</p></div>}

{canPay&&<div>
{/* Preview demo with watermark */}
<div style={{marginBottom:20,padding:20,background:"var(--w2)",borderRadius:"var(--rl)",border:"1px solid var(--w4)"}}>
<p style={{fontSize:".82rem",fontWeight:700,marginBottom:12,textAlign:"center"}}>Vista previa de tus fotos</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}>
{[0,1,2].map(i=><div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",aspectRatio:"3/4",background:"var(--w3)"}}>
<img src={`${SB}/demos/demo_${styles.length>i?i:0}.webp`} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover",filter:"blur(1px)"}}/>
<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.15)"}}>
<div style={{transform:"rotate(-25deg)",color:"rgba(255,255,255,.45)",fontSize:"1.1rem",fontWeight:800,letterSpacing:".1em",textShadow:"0 2px 8px rgba(0,0,0,.3)",fontFamily:"var(--f)"}}>FotoProIA</div>
</div></div>)}
</div>
<p style={{fontSize:".72rem",color:"var(--c4)",textAlign:"center"}}>Las fotos reales serán generadas con TU rostro, sin watermark, en calidad {selectedPkg?.id==="basico"?"HD":"4K"}</p>
</div>
<div style={{background:"var(--w2)",borderRadius:"var(--r)",padding:16,marginBottom:14,border:"1px solid var(--w4)"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:".84rem"}}><span style={{color:"var(--c3)"}}>Plan {selectedPkg?.name}</span><span style={{fontWeight:700,fontFamily:"var(--fh)",fontSize:"1rem"}}>${selectedPkg?.price} USD</span></div>
<div style={{fontSize:".76rem",color:"var(--c4)"}}>{files.length} selfies · {styles.length} estilo{styles.length>1?"s":""}</div></div>
<button className="b b1 bx" onClick={handlePay} disabled={loading} style={{width:"100%",opacity:loading?.6:1}}>{loading?"Procesando...":`Pagar $${selectedPkg?.price} USD →`}</button>
<p style={{textAlign:"center",color:"var(--c4)",fontSize:".72rem",marginTop:10}}>🔒 Stripe · Visa, Mastercard, Amex · 🏪 OXXO · 🏦 SPEI</p>
</div>}
</div></div>)}

/* ═══ PROCESSING ═══ */
if(step==="processing"){const s=orderStatus||{};const p=(s.progress||0)*100;const msgs={paid:"Pago confirmado. Iniciando...",preparing:"Preparando tus fotos...",training:"IA aprendiendo tu rostro (~15 min)...",generating:"Generando headshots profesionales...",enhancing:"Mejorando calidad a 4K...",completed:"¡Listas!"};return(
<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--w)"}}><style>{CSS}</style><div className="grain"/>
<div style={{textAlign:"center",maxWidth:360,padding:"40px 20px"}}>
<div style={{width:48,height:48,border:"3px solid var(--w4)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 24px"}}/>
<h2 style={{fontFamily:"var(--fh)",fontSize:"1.4rem",fontWeight:600,marginBottom:8}}>Creando tus fotos</h2>
<p style={{color:"var(--c3)",marginBottom:24,fontSize:".86rem"}}>{msgs[s.status]||"Procesando tu orden..."}</p>
<div style={{background:"var(--w3)",borderRadius:100,height:5,overflow:"hidden",marginBottom:8}}><div style={{background:"var(--accent)",height:"100%",width:`${Math.min(p,100)}%`,borderRadius:100,transition:"width 1s ease"}}/></div>
<p style={{color:"var(--c4)",fontSize:".76rem"}}>{Math.min(Math.round(p),100)}%</p>
<p style={{color:"var(--c4)",fontSize:".72rem",marginTop:24}}>No cierres esta ventana. También te notificaremos por email.</p>
<a href={WA} target="_blank" rel="noopener noreferrer" className="b bwa" style={{marginTop:20,textDecoration:"none",fontSize:".8rem",padding:"10px 18px"}}>💬 ¿Dudas? WhatsApp</a>
</div></div>)}

/* ═══ RESULTS ═══ */
if(step==="results"){return(
<div style={{minHeight:"100vh",background:"var(--w)",padding:"40px 20px"}}><style>{CSS}</style><div className="grain"/>
<div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
<div style={{fontSize:"3rem",marginBottom:10,animation:"float 2s ease-in-out infinite"}}>🎉</div>
<h1 style={{fontFamily:"var(--fh)",fontSize:"1.8rem",fontWeight:600,marginBottom:8}}>¡Tus fotos están listas!</h1>
<p style={{color:"var(--c3)",marginBottom:28}}>Generamos {photos.length} fotos profesionales con mejora facial y resolución 4K.</p>
{photos.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:6,marginBottom:28}}>{photos.map((p,i)=><div key={i} style={{position:"relative",borderRadius:"var(--r)",overflow:"hidden"}}><img src={p.url} alt={`${p.style} ${i}`} loading="lazy" style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block"}}/><div style={{position:"absolute",bottom:4,left:4,background:"rgba(0,0,0,.65)",color:"#fff",padding:"2px 8px",borderRadius:6,fontSize:".64rem",fontWeight:500}}>{p.style}</div></div>)}</div>}

{/* LinkedIn + WhatsApp share buttons */}
<div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
<a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="b blin" style={{textDecoration:"none"}}>🔗 Actualizar LinkedIn</a>
<a href={`https://wa.me/?text=${encodeURIComponent("¡Mira mis nuevas fotos profesionales hechas con IA! 📸 https://fotoproia.vercel.app")}`} target="_blank" rel="noopener noreferrer" className="b bwa" style={{textDecoration:"none",fontSize:".85rem"}}>📤 Compartir en WhatsApp</a>
</div>

<button onClick={()=>{setStep("landing");setFiles([]);setStyles([]);setPkg(null);setEmail("");setName("");setOrderId(null);setOrderStatus(null);setPhotos([])}} className="b b3" style={{marginTop:12}}>Volver al inicio</button>
</div></div>)}

return null}
