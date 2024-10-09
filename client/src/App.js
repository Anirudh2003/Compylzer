import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EditorPage from './components/EditorPage';
import Signup from './components/signup';
import Login from './components/login';
import Home from './components/home';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/resetPassword';
import Dashboard from './components/dashboard';

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
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
                    <Route path="/resetPassword/:token" element={<ResetPassword />}></Route>
                    <Route path="/dashboard" element={<Dashboard />}></Route>
                    <Route
                        path = "/editor"
                        element={<EditorPage />}
                    ></Route>
              </Routes>
          </BrowserRouter>
      </>
  );
}

export default App;
