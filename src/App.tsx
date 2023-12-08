import React from 'react';
import logo from './logo.svg';
import './App.css';
import Contact from './component/conatct-details/contact';
import { Provider } from 'react-redux';
import store from './component/Redux/store';

function App() {
  return (
    <Provider store={store}>
    <div>
      <h3>Contact Details </h3>
      <Contact />
    </div>
  </Provider>
  );
}

export default App;







