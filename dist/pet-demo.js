// Every source animation is shown, with time for at least one full sequence.
export const DEMO_STATES = Object.freeze([
  'idle', 'read_file', 'write_file', 'verify', 'view_image', 'read_web', 'thinking',
  'respond', 'question_for_user', 'task_complete', 'default_work', 'failed',
]);

export const nextDemoState = (current) => DEMO_STATES[(DEMO_STATES.indexOf(current) + 1) % DEMO_STATES.length];
export const demoDelay = (duration) => Math.max(5000, duration + 350);
