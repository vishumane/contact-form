import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Contact from './component/conatct-details/contact';
import { Provider } from 'react-redux';
import store from './component/Redux/store';
import Login from "./component/login/login";
import "./App.css"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HeaderAndRoutes />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </Provider>
  );
}

function HeaderAndRoutes() {
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';

  return (
    <div>
      {isContactPage ? <h3>Contact Details</h3>:""}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
