import { useRef, useState } from 'react'
import './App.css'
import MainMint from './MainMint';
import NavBar from './NavBar';
import Riddle from './Riddle';
import Whitelist from './Whitelist';

function App() {
  const [accounts, setAccounts] = useState([]);

  const aboutSection = useRef(null);
  const riddleSection = useRef(null);
  const whitelistSection = useRef(null);

  return (
    <div className='overlay'>
      <div className='App'>
        <NavBar accounts={accounts} setAccounts={setAccounts} aboutSection={aboutSection} riddleSection={riddleSection} whitelistSection={whitelistSection} />
        <MainMint accounts={accounts} setAccounts={setAccounts} />
        <Riddle accounts={accounts} setAccounts={setAccounts} riddleSection={riddleSection} />
        <Whitelist accounts={accounts} setAccounts={setAccounts} whitelistSection={whitelistSection} />
      </div>
      <div className='moving-background'></div>
    </div>
  )
}

export default App;
