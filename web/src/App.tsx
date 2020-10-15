import React from 'react';
import Routes from './routes';

import './styles/global.css';
import 'leaflet/dist/leaflet.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <ToastContainer/>
      <Routes/>
    </>
  );
}

export default App;
