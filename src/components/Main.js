import {html} from 'lit-html'
import Canvas from './Canvas'
import SaveButton from './SaveButton'

const WIDTH = 500
const HEIGHT = 500

const Main = () => html`
  <main>
    ${Canvas({width: WIDTH, height: HEIGHT})}
    ${SaveButton()}
  </main>  
`

export default Main
