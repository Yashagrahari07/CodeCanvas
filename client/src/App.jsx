import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Auth from './components/Form/Auth';
import Playground from './components/PlayGround/Playground';
import Home from './components/MyHome/Home';
import { Toaster } from 'react-hot-toast';
import Room from './components/Room/Room';
import About from './components/About/About';
import JoinRoom from './components/JoinRoom/JoinRoom';

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
          <Route path='/' element={<Landing />} />     
          <Route path='/auth' element={<Auth />} />     
          <Route path='/join-room' element={<JoinRoom />} />
          <Route path='/playground/:folderId/:fileId' element={<Playground />} />  
          <Route path='/home' element={<Home />} /> 
          <Route path='/room/:roomId' element={<Room />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </BrowserRouter>
    </> 
  )
}

export default App
