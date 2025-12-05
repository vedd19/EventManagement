import { Popover } from '@radix-ui/react-popover'
import './App.css'
import { Dropdown } from './components/Dropdown'
import { Home } from './pages/Home'

function App() {

  return (
    <div className=' h-screen flex justify-center bg-[#f5f7f9]'>
      <Home />
      <Dropdown type='timeZone' inForm={false} />
      {/* <Popover>hello</Popover> */}
    </div>
  )
}

export default App
