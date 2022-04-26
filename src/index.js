import './styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { render } from 'react-dom'

import { App } from './App'
import { init } from './utils/colors'

init()

render(
  <App />,
  document.getElementById('root')
);