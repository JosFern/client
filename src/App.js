// import { useEffect, useState } from "react";
// import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import RequireAuth from "./components/RequireAuth";
import AdminRoom from "./pages/AdminRoom"

function App() {
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   console.log(email, password);
  //   const credentials = {email: email, password: password}

  //   axios.post('http://localhost:8080/login',JSON.stringify(credentials)).then((response) => {
  //     console.log(response);
  //   }).catch(err => console.log(err))
  // }

  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={
              <RequireAuth role={["user"]}>
                <Dashboard />
              </RequireAuth>} />
            <Route path='/admin' element={
              <RequireAuth role={["admin"]}>
                <Admin />
              </RequireAuth>} />
            <Route path='/profile' element={
              <RequireAuth role={["user","admin"]}>
                <Profile />
              </RequireAuth>} />
            <Route path='/rooms' element={
              <RequireAuth role={["admin"]}>
                <AdminRoom />
              </RequireAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
