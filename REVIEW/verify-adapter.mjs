import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
const dir=fileURLToPath(new URL('../src/Web/static/js/', import.meta.url));
class Element {
  children=[]; dataset={}; style={}; connected=true; textContent='';
  classList={add(){},remove(){}};
  get isConnected(){return this.connected;}
  insertBefore(element,next){const i=this.children.indexOf(next);if(i<0)this.children.push(element);else this.children.splice(i,0,element);}
  matches(){return 'visualHost' in this.dataset;}
  querySelectorAll(){return this.children.flatMap(c=>[...(c.matches()?[c]:[]),...c.querySelectorAll()]);}
  dispatchEvent(){}
  set innerHTML(text){this.textContent=text;}
  querySelector(){return null;}
}
async function environment({enabled=true,fail=false,gate=null}={}){
 const frames=new Map();let counter=0;const calls=[];
 const context=vm.createContext({console:{error(){}},URLSearchParams,
   window:{location:{search:enabled?'?visualDemo=1':''}},
   document:{createElement:()=>new Element()},
   requestAnimationFrame:cb=>{frames.set(++counter,cb);return counter;},
   cancelAnimationFrame:id=>frames.delete(id),
   marked:{parse:text=>text},DOMPurify:{sanitize:text=>text},
 });
 const renderer=new vm.SyntheticModule(['demoVisual','mountVisual','unmountVisual'],function(){
   this.setExport('demoVisual',{kind:'checklist',response:'fixture'});
   this.setExport('mountVisual',(element,options)=>calls.push(['mount',element,options]));
   this.setExport('unmountVisual',element=>calls.push(['unmount',element]));
 },{context});await renderer.link(()=>{});await renderer.evaluate();
 const visuals=new vm.SourceTextModule(await readFile(dir+'visuals.js','utf8'),{context,
 importModuleDynamically:async()=>{if(gate)await gate;if(fail)throw Error('bundle missing');return renderer;}});
 await visuals.link(()=>{});await visuals.evaluate();
 const rendering=new vm.SourceTextModule(await readFile(dir+'rendering.js','utf8'),{context});
 await rendering.link(()=>visuals);await rendering.evaluate();
 return {v:visuals.namespace,r:rendering.namespace,calls,frames};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
let passed=0;
{
 const {r,calls,frames}=await environment();const box=new Element();const state=r.createResponseBlockState(box);
 // Receive out of order and keep the persisted numeric block order.
 r.setResponseBlock(state,{id:3,type:'text',content:'After'});
 r.setResponseBlock(state,{id:2,type:'visual',visual_id:42});
 r.setResponseBlock(state,{id:1,type:'text',content:'Before'});
 r.flushResponseBlocks(state);await settle();
 assert.deepEqual(box.children.map(e=>e.dataset.blockId),['1','2','3']);
 assert.equal(calls.filter(c=>c[0]==='mount').length,1);passed++;
 r.setResponseBlock(state,{id:2,type:'visual',visual_id:42});
 r.appendResponseText(state,3,' more');r.flushResponseBlocks(state);await settle();
 assert.equal(calls.filter(c=>c[0]==='mount').length,1);
 assert.equal(box.children[2].textContent,'After more');passed++;
 box.style.display='none';box.style.display='block';assert.equal(calls.length,1);passed++;
 r.appendResponseText(state,3,' pending');assert.equal(frames.size,1);
 r.disposeResponseBlocks(state);assert.equal(frames.size,0);
 assert.equal(calls.filter(c=>c[0]==='unmount').length,1);
 r.setResponseBlock(state,{id:4,type:'visual',visual_id:42});
 r.flushResponseBlocks(state);assert.equal(state.blocks.size,0);passed++;
}
{
 let release;const gate=new Promise(resolve=>release=resolve);
 const {v,calls}=await environment({gate});const box=new Element();
 v.renderVisual(box,42);v.unmountVisuals(box);release();await settle();
 assert.equal(calls.length,0);passed++;
}
{
 const {v,calls}=await environment({enabled:false});const box=new Element();
 v.renderVisual(box,42);await settle();assert.match(box.textContent,/unavailable/);assert.equal(calls.length,0);passed++;
}
{
 const {v,calls}=await environment();const box=new Element();
 v.renderVisual(box,99);await settle();assert.match(box.textContent,/unavailable/);assert.equal(calls.length,0);passed++;
}
{
 const {v}=await environment({fail:true});const box=new Element();
 v.renderVisual(box,42);await settle();assert.match(box.textContent,/could not be displayed/);passed++;
}
{
 const {v,calls}=await environment();const box=new Element();
 v.renderVisual(box,42);await settle();v.renderVisual(box,99);await settle();
 assert.deepEqual(calls.map(c=>c[0]),['mount','unmount']);assert.match(box.textContent,/unavailable/);passed++;
}
console.log(`${passed} adapter checks passed (mock DOM and renderer; React/browser build not executed).`);
