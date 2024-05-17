import { Outlet } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <main data-theme = {'dark'}>
        <Outlet/>
      </main>
    </>
  )
}

export default App
