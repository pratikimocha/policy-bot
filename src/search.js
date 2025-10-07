import fs from "fs"; import path from "path";
const KB = JSON.parse(fs.readFileSync(path.join(process.cwd(), "kb.json"), "utf8"));

const SYN = {
  wfo: ["work for success","office attendance"],
  rfid: ["access card","swipe"],
  "lost laptop": ["stolen device","device missing"],
  vpn: ["globalprotect","anyconnect"],
  "password reset": ["sspr","forgot password"]
};

function expand(q){
  const low=q.toLowerCase(), extra=[];
  for(const [k,arr] of Object.entries(SYN)) if(low.includes(k)) extra.push(...arr);
  return [q, ...extra].join(" ");
}
function score(d, terms){
  const t=(d.title+" "+d.content).toLowerCase();
  return terms.reduce((s,w)=> s + (t.match(new RegExp("\\b"+w.replace(/[.*+?^${}()|[\\]\\]/g,"\\$&")+"\\b","ig"))||[]).length, 0);
}
export function searchKB(query){
  const terms = expand(query).toLowerCase().split(/\s+/).filter(Boolean);
  const ranked = KB.map(d => ({...d, _s: score(d, terms)})).filter(d=>d._s>0).sort((a,b)=>b._s-a._s);
  for(const r of ranked){ const s=r.content.slice(0,280).replace(/\s+/g," ").trim(); r.snippet=s+(r.content.length>280?"…":""); }
  return ranked;
}
