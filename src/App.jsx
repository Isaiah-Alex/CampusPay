import React, { useEffect } from 'react';
import Home from './pages/Home/Home';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import ConnectWallet from './pages/ConnectWallet/ConnectWallet';
import Dashboard from './pages/Dashboard/Dashboard'
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import { AuthProvider, useAuth } from './Contexts/AuthContex';

const NotFound = () => {
  return<h1 style={{display:'grid', placeItems: 'center', height:'100vh'}} >404 -Page Not found</h1>;
}
const App = () => {

  // const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(()=> {
    onAuthStateChanged(auth, async (user)=>{
      if (user){
        console.log("Logged In");
        navigate('/dashboard');
      }else{
        console.log("Logged Out");
        navigate('/');
      }
    })
  },[])

  return (
    <div>
      <AuthProvider>
        <ToastContainer theme='dark'/>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/connect-wallet' element={<ConnectWallet/> } />
            <Route path='/dashboard' element={<Dashboard/> } />
            <Route  path='*' element={<NotFound/>} />
          </Routes>
        <ToastContainer />
      </AuthProvider>
      
    </div>
  )
}

export default App;