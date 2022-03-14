import ReactDOM from 'react-dom'
import { App } from './App'
import './styles.css'
import { init } from './utils/colors'

init()

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)