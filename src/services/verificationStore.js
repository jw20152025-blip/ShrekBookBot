import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "verifications.json");
fs.mkdirSync(DATA_DIR, { recursive: true });
function load() { if (!fs.existsSync(DATA_FILE)) return {pending:{},verified:{}}; try { const x=JSON.parse(fs.readFileSync(DATA_FILE,"utf8")); return {pending:x?.pending??{},verified:x?.verified??{}}; } catch { return {pending:{},verified:{}}; } }
function save(data) { const t=`${DATA_FILE}.tmp`; fs.writeFileSync(t,JSON.stringify(data,null,2),"utf8"); fs.renameSync(t,DATA_FILE); }
function generateCode(){return `SB-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;}
export function createVerification(discordId){const data=load(); for(const [code,e] of Object.entries(data.pending)) if(e.discordId===discordId) delete data.pending[code]; const code=generateCode(); data.pending[code]={discordId,createdAt:Date.now()}; save(data); return code;}
export function consumeVerification(code){const data=load(); const normalized=code.trim().toUpperCase(); const e=data.pending[normalized]; if(!e)return null; if(Date.now()-e.createdAt>10*60*1000){delete data.pending[normalized];save(data);return null;} delete data.pending[normalized];save(data);return e;}
export function setVerified(discordId,username){const data=load();data.verified[discordId]={username,verifiedAt:Date.now()};save(data);}
export function getVerified(discordId){return load().verified[discordId]??null;}
export function removeVerified(discordId){const data=load();delete data.verified[discordId];save(data);}
