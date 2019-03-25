import {html, render} from 'lit-html';

const UNSPLASH_COLLECTION_URL =
  "https://source.unsplash.com/collection/583479/";
const WIDTH = 500
const HEIGHT = 500


let totalImagesCount

let canvas;
let ctx;
let saveButton;
let quoteText
let quoteIsLoaded = false
let imagesAreLoaded = false
let loadedImagesCount = 0

const images = []

function addCanvas() {
  canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;

  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");
  ctx.font = "30px Arial";
  ctx.textAlign = "center"
  ctx.filter = 'sepia(35%)'

  ctx.fillText("Loading...", 250, 50)
}

const Canvas = () => {
  return html`
    <canvas id="canvas" width="${WIDTH}" height="${HEIGHT}"></canvas>   
  `;
}

const SaveButton = () => {
  const listener = {
    handleEvent(e) {
      console.log('clicked');
    },
    capture: true,
  };

  return html`
    <div>
      <a @click=${listener}>
        Save
      </a> 
    </div>   
  `;
}

const Main = () => html`
  <main>
    ${Canvas()}
    ${SaveButton()}
  </main>  
`

// It's rendered with the `render()` function:
// render(sayHello('World'), document.body);

function addSaveButton() {
  saveButton = document.createElement("a");
  saveButton.download = "web3.jpg"
  saveButton.innerHTML = "Save image";

  document.body.appendChild(saveButton);
}

function generateBasicHTML() {
  render(Main(), document.body);

  const canvas = document.getElementById('canvas')
  ctx = canvas.getContext("2d");
  ctx.font = "30px Arial";
  ctx.textAlign = "center"
  ctx.filter = 'sepia(35%)'

  ctx.fillText("Loading...", 250, 50)
  // addCanvas();
  // addSaveButton();
}

function downloadImage() {
  const image = canvas.toDataURL("image/jpg")
  saveButton.href=image
}

function displayImages() {
  images.forEach(({image,left,top})=>ctx.drawImage(image, left, top))
}

function displayText() {
  ctx.filter = ''
  const quoteChunks = []
  let c = 0
  let j = 0

  for(let i = 0; i < quoteText.length; i++) {
    c++
    if (c > 20 && quoteText[i] === ' ') {
      quoteChunks.push(quoteText.slice(j, i))
      j = i
      c = 0
    }
  }

  quoteChunks.push(quoteText.slice(j))

  console.log(quoteChunks, quoteText)

  ctx.fillStyle = "#ffffff"
  // ctx.lineWidth = 3
  // // ctx.font = "italic bold 25pt Tahoma"

  const chunksCount = quoteChunks.length

  for (let i = 0; i< chunksCount; i++){

    ctx.shadowBlur=7;
    ctx.lineWidth=5;
    ctx.strokeText(quoteChunks[i], 250, 250 + (40* (i-chunksCount/2)))
    ctx.shadowBlur=0;
    ctx.fillStyle="white";

    ctx.fillText(quoteChunks[i], 250, 250 + (40* (i-chunksCount/2)))
    // ctx.strokeText(quoteChunks[i], 250, 250 + (40* (i-chunksCount/2)))
  }
}

function displayContent() {
  ctx.clearRect(0,0,500,500)
  displayImages()
  displayText()
}

function generateImage(width, height, left, top) {
  const image = new Image();

  image.crossOrigin = 'anonymous'

  image.src = `${UNSPLASH_COLLECTION_URL}${width}x${height}`;

  image.onload = () => {
    images.push({ image, left, top })
    loadedImagesCount++

    imagesAreLoaded = loadedImagesCount === totalImagesCount

    if (imagesAreLoaded && quoteIsLoaded) {
      displayContent()
    }
  };
}

function generateImageCollage() {
  const randomNumber = Math.random() * 3

  if (randomNumber <= 1) {
    totalImagesCount = 4
    generateImage(300, 200, 0, 0);
    generateImage(200, 200, 300, 0);
    generateImage(200, 300, 0, 200);
    generateImage(300, 300, 200, 200);
  } else if (randomNumber <= 2) {
    totalImagesCount = 3
    generateImage(500, 300, 0, 0);
    generateImage(200, 200, 0, 300);
    generateImage(300, 200, 200, 300);
  } else {
    totalImagesCount = 5
    generateImage(100, 150, 0, 0);
    generateImage(140, 150, 100, 0);
    generateImage(260, 150, 240, 0);
    generateImage(200, 350, 0, 150);
    generateImage(300, 350, 200, 150);
  }
}

async function generateText() {
  const response = await fetch(
    'https://thesimpsonsquoteapi.glitch.me/quotes'
  )

  const [{quote}] = await response.json()
  quoteText = quote.replace(/\.\.\./g, ' ')
  quoteIsLoaded = true

  if (imagesAreLoaded) {
    displayContent()
  }
}

function generateCanvasContent() {
  generateImageCollage();
  generateText();
}

window.onload = () => {
  generateBasicHTML();
  generateCanvasContent();

  saveButton.addEventListener("click", downloadImage);
}
