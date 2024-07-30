import { useEffect, useState } from 'react'
import './App.css'
import { UserContext } from './context/UserContext'
import { Router } from './router/Router'

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <div className='main'>
      <UserContext.Provider value={{ user, setUser }}>
        <Router />
      </UserContext.Provider>
    </div>
  );
}

export default App;
