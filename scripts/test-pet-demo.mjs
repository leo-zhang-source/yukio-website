import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DEMO_STATES, nextDemoState, demoDelay } from '../dist/pet-demo.js';
const catalog=JSON.parse(readFileSync(new URL('../dist/assets/motion.json',import.meta.url)));

test('automatic playback visits every available action once, then loops to the seated pose',()=>{
  let current='idle';
  const visited=[];
  for(let i=0;i<catalog.states.length;i++){
    visited.push(current);
    current=nextDemoState(current);
  }
  assert.equal(current,'idle');
  assert.equal(visited.length,new Set(visited).size);
  assert.deepEqual([...visited].sort(),catalog.states.map(s=>s.id).sort());
  assert.equal(nextDemoState('idle'),'read_file');
});

test('each automatic action has enough time for its complete original sequence',()=>{
  for(const id of DEMO_STATES){
    const state=catalog.states.find(s=>s.id===id);
    const duration=state.durationsMs.reduce((sum,ms)=>sum+ms,0);
    assert.ok(demoDelay(duration)>duration,id);
    assert.ok(demoDelay(duration)>=5000,id);
  }
});
