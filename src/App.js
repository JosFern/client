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
