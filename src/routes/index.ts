export const routes: [string, () => Promise<typeof import('../captures/01-ponit/index')>][] = [
  ['point', () => import(`../captures/01-ponit`)],
  ['triangle', () => import(`../captures/02-triangle`)],
  ['transform', () => import(`../captures/03-transform`)],
  ['texture', () => import(`../captures/04-texture`)],
  ['cube', () => import(`../captures/05-cube`)],
  ['light', () => import(`../captures/06-light`)],
  ['ambient light', () => import(`../captures/07-light-ambient`)],
  ['point light', () => import(`../captures/08-point-light`)],
];
