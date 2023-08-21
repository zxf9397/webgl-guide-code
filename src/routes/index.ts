export const routes: [string, () => Promise<typeof import('../captures/01-ponit/index')>][] = [
  ['Point', () => import(`../captures/01-ponit`)],
  ['Triangle', () => import(`../captures/02-triangle`)],
  ['Transform', () => import(`../captures/03-transform`)],
  ['Texture', () => import(`../captures/04-texture`)],
  ['Cube', () => import(`../captures/05-cube`)],
  ['Cube 2', () => import(`../captures/05-cube-2`)],
  ['Diffuse Light', () => import(`../captures/06-light`)],
  ['Ambient Light', () => import(`../captures/07-light-ambient`)],
  ['Point Light', () => import(`../captures/08-point-light`)],
  ['Spot Light', () => import(`../captures/09-spot-light`)],
  ['Specular Light', () => import(`../captures/10-specular-light`)],
  ['Transform Model', () => import(`../captures/11-transform-model`)],
];
