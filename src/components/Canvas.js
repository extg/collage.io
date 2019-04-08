import {html} from 'lit-html'

const Canvas = ({width, height}) => {
  return html`
    <canvas id="canvas" width="${width}" height="${height}"></canvas>   
  `;
}

export default Canvas
