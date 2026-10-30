import { STEP, GRIP, SETTINGS, createBody, resizeBody, grip, bounds, containBody, stepBody, stepDrop, seatedPose, sampleMotion } from './pet-physics.js';

// The held artwork and the real animated button share a body-level workspace.
// Only one Yukio is visible: held -> settling nearby -> seated at the drop.
export function mountPetCarry({ element, layer, puppet, shadow, companion, homeButton, reducedMotion, onPickup, onRelease, onClick, onSettle, onReset }) {
  let pointer = null, state = null, raf = null, suppressClick = false;
  let parked = null;
  const homeParent = element.parentNode, homeNext = element.nextSibling;
  const viewport = () => ({ width: document.documentElement.clientWidth, height: innerHeight });

  function dimensions() {
    const rect = element.getBoundingClientRect(), view = viewport();
    const desiredWidth = parked?.preferredWidth ?? rect.width;
    const height = Math.min(desiredWidth / 0.8, view.height * 0.58, (Math.min(view.width,view.height)-16) / Math.hypot(0.8,1));
    return { height, width: height * 0.8 };
  }

  function renderParked() {
    if (!parked) return;
    const view = viewport();
    const maxWidth = Math.min(view.height * 0.58, (Math.min(view.width,view.height)-16) / Math.hypot(0.8,1)) * 0.8;
    parked.width = Math.min(parked.preferredWidth,maxWidth);
    parked.height = parked.width * 416 / 384;
    parked.x = Math.min(Math.max(8,parked.x),Math.max(8,view.width-parked.width-8));
    parked.y = Math.min(Math.max(8,parked.y),Math.max(8,view.height-parked.height-42));
    companion.style.width = parked.width+'px';
    companion.style.height = parked.height+'px';
    companion.style.transform = 'translate3d('+parked.x+'px,'+parked.y+'px,0)';
  }

  function paint() {
    if (!state) return;
    const body = state.body;
    puppet.style.width = body.width+'px';
    puppet.style.height = body.height+'px';
    puppet.style.transform = 'translate3d('+(body.x-body.width/2)+'px,'+(body.y-body.height/2)+'px,0) rotate('+(body.angle*180/Math.PI)+'deg)';
    const box = bounds(body);
    shadow.style.width = body.width*0.52+'px';
    shadow.style.transform = 'translate3d('+(body.x-body.width*0.26)+'px,'+(box.bottom+2)+'px,0)';
    shadow.style.opacity = '0.12';
  }

  function stopFrames() {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
  }

  function hideHeld() {
    stopFrames();
    state = null;
    layer.hidden = true;
    delete layer.dataset.phase;
    element.classList.remove('is-carrying');
    companion.classList.remove('is-lifted');
    document.body.classList.remove('pet-is-held');
  }

  function reset() {
    const wasAway = Boolean(state || parked);
    hideHeld();
    parked = null;
    companion.hidden = true;
    homeParent.insertBefore(element,homeNext);
    document.body.classList.remove('pet-is-away');
    if (wasAway) onReset?.();
  }

  function park() {
    if (!state) return;
    const pose = seatedPose(state.body,viewport());
    parked = { ...pose, preferredWidth:parked?.preferredWidth ?? state.body.width };
    // Move the original canvas/player, rather than creating a second pet.
    companion.append(element);
    renderParked();
    companion.hidden = false;
    hideHeld();
    document.body.classList.add('pet-is-away');
    onSettle?.();
  }

  function advance(now) {
    if (!state) return;
    const realElapsed = Math.max(0,(now-state.lastFrame)/1000);
    const elapsed = Math.min(realElapsed,0.064);
    // Drop old catch-up time after a long frame, keeping input timestamps aligned.
    state.simTime += Math.max(0,realElapsed-elapsed)*1000;
    state.lastFrame = now;
    const view = viewport();
    if (reducedMotion.matches) {
      if (state.phase !== 'held') { park(); return; }
      const at = state.samples[state.samples.length-1], body = state.body;
      body.angle = 0; body.vx = 0; body.vy = 0; body.omega = 0;
      body.x = at.x-body.width*(GRIP.x-0.5);
      body.y = at.y-body.height*(GRIP.y-0.5);
      containBody(body,view);
      paint();
      return;
    }
    state.accumulator += elapsed;
    while (state.accumulator >= STEP) {
      state.simTime += STEP*1000;
      state.accumulator -= STEP;
      if (state.phase === 'held') {
        stepBody(state.body,STEP,sampleMotion(state.samples,state.simTime-16),{viewport:view});
      } else {
        state.dropAge += STEP;
        stepDrop(state.body,STEP,view);
      }
    }
    if (state.phase === 'settling') {
      const b = state.body;
      const settled = state.dropAge>0.18 && Math.hypot(b.vx,b.vy)<20 && Math.abs(b.angle)<0.065 && Math.abs(b.omega)<0.4;
      if (settled || state.dropAge>SETTINGS.maxDropSeconds) { park(); return; }
    }
    paint();
  }

  function tick(now) {
    raf = null;
    advance(now);
    if (state) raf=requestAnimationFrame(tick);
  }

  function wake() { if (raf===null) raf=requestAnimationFrame(tick); }

  function addInput(event) {
    if (!state) return;
    const now=performance.now();
    const events=event.getCoalescedEvents?.()??[];
    for (const e of [...events,event]) {
      if (!Number.isFinite(e.clientX)||!Number.isFinite(e.clientY)) continue;
      const t=Number.isFinite(e.timeStamp)&&Math.abs(e.timeStamp-now)<5000?e.timeStamp:now;
      const sample={t,x:e.clientX+state.inputOffset.x,y:e.clientY+state.inputOffset.y};
      const last=state.samples[state.samples.length-1];
      if (t>last.t) state.samples.push(sample);
      else if (t===last.t) state.samples[state.samples.length-1]=sample;
    }
    while (state.samples.length>2 && state.samples[1].t<now-300) state.samples.shift();
  }

  function begin(event) {
    const now=performance.now(), size=dimensions();
    state={phase:'held',body:createBody({...size,x:event.clientX,y:event.clientY}),
      samples:[{t:now,x:event.clientX,y:event.clientY}],inputOffset:{x:0,y:0},
      lastFrame:now,simTime:now,accumulator:0,dropAge:0};
    containBody(state.body,viewport());
    element.classList.remove('greeting');
    element.classList.add('is-carrying');
    document.body.classList.add('pet-is-held','pet-is-away');
    // Keep the capture owner rendered when lifting the parked button again.
    // Its artwork is transparent; hiding an ancestor would cancel capture.
    if (parked) companion.classList.add('is-lifted');
    else companion.hidden=true;
    layer.hidden=false;
    layer.dataset.phase='held';
    paint(); onPickup(); wake();
  }

  function release(event,immediate=false) {
    if (!pointer) {
      if (immediate && state) park();
      return;
    }
    if (event && event.pointerId!==pointer.id) return;
    if (state) { if(event)addInput(event); advance(performance.now()); }
    const current=pointer;
    pointer=null;
    suppressClick=current.moved;
    document.body.classList.remove('pet-is-held');
    if (current.owner.hasPointerCapture(current.id)) current.owner.releasePointerCapture(current.id);
    if (!current.moved || !state) return;
    onRelease({cancelled:immediate});
    if (immediate || reducedMotion.matches) { park(); return; }
    // No home target: existing velocity dissipates locally as she is set down.
    state.phase='settling';
    state.dropAge=0;
    layer.dataset.phase='settling';
    wake();
  }

  function down(event) {
    if (event.button!==0 || pointer) return;
    const catching=Boolean(state && state.phase==='settling' && event.currentTarget===puppet);
    if (catching) { advance(performance.now()); if(!state)return; }
    if (state && !catching) park();
    suppressClick=false;
    pointer={id:event.pointerId,owner:event.currentTarget,startX:event.clientX,startY:event.clientY,moved:catching};
    event.currentTarget.setPointerCapture(event.pointerId);
    if (catching) {
      const at=grip(state.body);
      state.inputOffset={x:at.x-event.clientX,y:at.y-event.clientY};
      state.phase='held';
      state.samples=[{t:performance.now(),x:at.x,y:at.y}];
      layer.dataset.phase='held';
      document.body.classList.add('pet-is-held');
      paint(); onPickup(); wake();
    }
  }

  function move(event) {
    if (!pointer || pointer.id!==event.pointerId) return;
    if (!pointer.moved && Math.hypot(event.clientX-pointer.startX,event.clientY-pointer.startY)<7) return;
    if (!pointer.moved) { pointer.moved=true; begin(event); }
    if (event.cancelable) event.preventDefault();
    addInput(event);
  }

  for (const target of [element,puppet]) {
    target.addEventListener('pointerdown',down);
    target.addEventListener('pointermove',move,{passive:false});
    target.addEventListener('pointerup',event=>release(event));
    target.addEventListener('pointercancel',event=>release(event,true));
    target.addEventListener('lostpointercapture',event=>{if(pointer)release(event,true);});
    target.addEventListener('dragstart',event=>event.preventDefault());
    target.addEventListener('click',event=>{
      if (suppressClick && event.detail!==0) { suppressClick=false; event.preventDefault(); event.stopPropagation(); return; }
      if (target===element) onClick();
    });
  }
  homeButton.addEventListener('click',()=>reset());
  window.addEventListener('blur',()=>release(null,true));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)release(null,true);});
  document.addEventListener('keydown',event=>{
    if (event.key==='Escape' && (pointer || state || parked)) {
      event.preventDefault(); release(null,true); reset();
    }
  });
  window.addEventListener('resize',()=>{
    if (state) {
      const size=dimensions(); resizeBody(state.body,size.width,size.height);
      containBody(state.body,viewport()); paint();
    }
    if (parked) renderParked();
  });
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches && state?.phase==='settling')park();});
  return { get active(){return Boolean(pointer||state);}, get parked(){return Boolean(parked);} };
}
