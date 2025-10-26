// import { useEffect } from 'react';
// import { usePulsy } from 'pulsy';
// import { validateToken } from './services/auth.service';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  // const [auth] = usePulsy('auth');

  // useEffect(() => {
  //   // Check token validity on app load
  //   if (auth.token) {
  //     validateToken();
  //   }
  // }, [auth.token]);

  return (
    <div className="App">
      <Register></Register>
      <Login></Login>
      {/* <input type='button' value={'Login'}></input>
      <input type='button' value={'Register'}></input> */}
      {/* {auth.user ? <Dashboard /> : <Login />} */}
    </div>
  );
}

export default App;
