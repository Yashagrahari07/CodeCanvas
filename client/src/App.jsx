import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Auth from './components/Form/Auth';
import Playground from './components/PlayGround/Playground';
import Home from './components/MyHome/Home';
import { Toaster } from 'react-hot-toast';
import Room from './components/Room/Room';

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
          success: {
            theme: {
            primary: '#4aed88',
            },
          },
        }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />} />     
          <Route path='/playground/:folderId/:fileId' element={<Playground />} />  
          <Route path='/home' element={<Home />} /> 
          <Route path='/room/:roomId' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </> 
  )
}

export default App
