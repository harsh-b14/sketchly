import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RoomsPage from './pages/RoomsPage';
import CreateRoomPage from './pages/CreateRoomPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CanvasPage from './pages/CanvasPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/canvas/:roomId" element={<CanvasPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
