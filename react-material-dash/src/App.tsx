import { useEffect } from 'react'
import './App.scss'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import PersistentDrawerLeft from './components/AppBarWithDrawer';


function App() {
  useEffect(() => {
    document.documentElement.classList.add('html');
    document.documentElement.classList.add('light-theme');
  }, []);

  return (
    <>
      <PersistentDrawerLeft></PersistentDrawerLeft>
    </>
  )
}

export default App
