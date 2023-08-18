import './style.css';
import { routes } from './routes';

let canvasReplacement: HTMLCanvasElement;
function renderGL(name: string, render: () => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 400;
  canvas.id = 'canvas';

  canvasReplacement ? canvasReplacement.replaceWith(canvas) : document.body.appendChild(canvas);
  canvasReplacement = canvas;
  render();
}

const fragment = document.createElement('div');
const links = routes.map(([name, importScript]) => {
  const a = document.createElement('a');
  a.innerText = name;
  a.onclick = async (e) => {
    e.preventDefault();
    window.location.hash = `#${name}`;
  };

  fragment.appendChild(a);

  return { name, el: a, importScript };
});
document.body.appendChild(fragment);

async function load() {
  for (let i = 0; i < links.length; i++) {
    const { name, el, importScript } = links[i];
    if (decodeURIComponent(window.location.hash) === `#${name}`) {
      el.classList.add('active');
      const { default: render } = await importScript();
      renderGL(name, render);
    } else {
      el.classList.remove('active');
    }
  }
}

load();
window.addEventListener('hashchange', load);
