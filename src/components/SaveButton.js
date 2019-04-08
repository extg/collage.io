import {html} from 'lit-html'

const SaveButton = () => {
  const listener = {
    handleEvent(e) {
      e.preventDefault()
      console.log(e)
      const canvas = document.getElementById('canvas')
      const image = canvas.toDataURL("image/jpg")
      // saveBase64AsFile(canvas)
      saveBase64AsFile2(image)
      // window.open(image)
      // e.target.href = image
      // e.target.click()
    },
    capture: true,
  };

  return html`
    <div>
      <a class="link" @click=${listener}>
        Save
      </a> 
    </div>   
  `;
}


function saveBase64AsFile2(base64, fileName = 'collage.jpg') {

  var link = document.createElement("a");

  link.setAttribute("href", base64);
  link.setAttribute("download", fileName);
  link.click();
}


export default SaveButton
