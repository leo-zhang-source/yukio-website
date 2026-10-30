import test from 'node:test';
import assert from 'node:assert/strict';
import { STEP, SETTINGS, createBody, stepBody, stepDrop, seatedPose, grip, bounds, sampleMotion } from '../dist/pet-physics.js';
const close=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);

test('one off-center pull changes both linear and angular momentum in the matching direction',()=>{
  const b=createBody({width:240,height:300,x:400,y:150});
  const before=grip(b), oldVX=b.vx, oldVY=b.vy, oldOmega=b.omega;
  stepBody(b,STEP,{x:405,y:150,vx:0,vy:0},{gravity:0,linearDrag:0,angularDrag:0});
  assert.ok(b.vx>0);
  assert.ok(b.angle>0,'Accelerating the head RIGHT must leave the feet to its LEFT.');
  close(b.inertia*(b.omega-oldOmega),before.rx*(b.vy-oldVY)-before.ry*(b.vx-oldVX));
});

test('steady translation settles close to vertical instead of maintaining a speed-based tilt',()=>{
  const b=createBody({width:240,height:300,x:400,y:150});
  for(let i=0;i<14/STEP;i++)stepBody(b,STEP,{x:400+i*STEP*600,y:150,vx:600,vy:0});
  assert.ok(Math.abs(b.angle)<0.06,`Persistent tilt: ${b.angle}`);
  assert.ok(Math.abs(b.vx-600)<15);
});

test('stopping the grip preserves body inertia and swings the feet past the held point',()=>{
  const b=createBody({width:240,height:300,x:400,y:150});
  // Establish steady travel first; the phase of the initial pickup swing is
  // deliberately independent of the later braking response.
  for(let i=0;i<5/STEP;i++)stepBody(b,STEP,{x:400+i*STEP*600,y:150,vx:600,vy:0});
  assert.ok(b.vx>550);
  let crossed=false;
  for(let i=0;i<240;i++){
    stepBody(b,STEP,{x:3400,y:150,vx:0,vy:0});
    if(b.angle<0&&b.x>grip(b).x)crossed=true;
  }
  assert.ok(crossed,'The body must continue RIGHT after the held point stops.');
});

test('release conserves horizontal and angular momentum when external drag is disabled',()=>{
  const b=createBody({width:240,height:300,x:400,y:150,vx:280,vy:-110,omega:0.7,angle:0.15});
  const x=b.x,oldVX=b.vx,oldOmega=b.omega;
  stepBody(b,STEP,null,{linearDrag:0,angularDrag:0});
  close(b.vx,oldVX);close(b.omega,oldOmega);
  assert.ok(b.x>x,'A release must not stop or reverse the existing trajectory.');
});

test('frame rates of 30, 60 and 144 Hz produce the same fixed-step body trajectory',()=>{
  function simulate(fps){
    const b=createBody({width:200,height:250,x:300,y:120});
    let accumulator=0,ticks=0;
    for(let frame=0;frame<fps*4;frame++){
      accumulator+=1/fps;
      while(accumulator+1e-10>=STEP){
        const t=ticks++*STEP;
        stepBody(b,STEP,{x:300+90*Math.sin(t*3),y:180+35*Math.cos(t*2),vx:270*Math.cos(t*3),vy:-70*Math.sin(t*2)});
        accumulator-=STEP;
      }
    }
    return b;
  }
  const reference=simulate(60);
  for(const fps of [30,144])for(const key of ['x','y','vx','vy','angle','omega'])close(simulate(fps)[key],reference[key]);
});

test('diagonal rapid pulls stay finite and inside all four viewport walls',()=>{
  const view={width:390,height:844};
  const b=createBody({width:176,height:220,x:190,y:130});
  for(let i=0;i<2400;i++){
    const t=i*STEP;
    stepBody(b,STEP,{x:195+240*Math.sin(t*5),y:420+500*Math.cos(t*3),vx:1200*Math.cos(t*5),vy:-1500*Math.sin(t*3)},{viewport:view});
    const box=bounds(b);
    assert.ok(Object.values(b).every(Number.isFinite));
    assert.ok(Math.abs(b.angle)<=SETTINGS.hardAngle+1e-10,'Fast pulls keep the new smaller swing limit.');
    assert.ok(box.left>=7.999&&box.top>=7.999&&box.right<=382.001&&box.bottom<=836.001);
  }
});

test('a wall impact exchanges linear and angular momentum without adding impact energy',()=>{
  const b=createBody({width:160,height:200,x:90,y:100,vx:-300});
  const energy=0.5*(b.vx*b.vx+b.vy*b.vy)+0.5*b.inertia*b.omega*b.omega;
  for(let i=0;i<8;i++)stepBody(b,STEP,null,{gravity:0,linearDrag:0,angularDrag:0,viewport:{width:800,height:600}});
  const after=0.5*(b.vx*b.vx+b.vy*b.vy)+0.5*b.inertia*b.omega*b.omega;
  assert.ok(after<energy);
  assert.ok(Math.abs(b.omega)>0.01);
  assert.ok(bounds(b).left>=7.999);
});

test('sampled target velocity is the derivative of the same diagonal target path',()=>{
  const path=[{t:0,x:0,y:10},{t:100,x:40,y:30},{t:200,x:100,y:90}];
  const a=sampleMotion(path,140),b=sampleMotion(path,150);
  close((b.x-a.x)/0.01,a.vx);close((b.y-a.y)/0.01,a.vy);
  close(sampleMotion(path,210).vx,0);
});

test('placing preserves the release impulse, then settles locally without moving back to the hero',()=>{
  const b=createBody({width:200,height:250,x:800,y:200,vx:420,vy:-80,omega:0.7,angle:0.25});
  const initialX=b.x,initialY=b.y;
  for(let i=0;i<SETTINGS.maxDropSeconds/STEP;i++){
    stepDrop(b,STEP);
    if(i===12)assert.ok(b.x>initialX,'The initial release impulse must continue in the same direction.');
  }
  assert.ok(b.x>initialX && b.x-initialX<420/SETTINGS.dropLinearDrag);
  assert.ok(Math.abs(b.y-initialY)<80/SETTINGS.dropLinearDrag);
  assert.ok(Math.hypot(b.vx,b.vy)<1);
  assert.ok(Math.abs(b.angle)<0.04);
});

test('seated placement stays near the released body, preserves art scale and leaves controls on screen',()=>{
  const b=createBody({width:220,height:275,x:420,y:180});
  const pose=seatedPose(b,{width:1280,height:800});
  close(pose.x+pose.width/2,b.x);
  close(pose.y+pose.height,b.y+b.height/2);
  close(pose.width,b.width);
  close(pose.height/pose.width,416/384);
  for(const [x,y] of [[-200,-100],[1600,1400],[200,1000]]){
    b.x=x;b.y=y;
    const edge=seatedPose(b,{width:390,height:844});
    assert.ok(edge.x>=8&&edge.y>=8&&edge.x+edge.width<=382&&edge.y+edge.height<=802);
  }
});
