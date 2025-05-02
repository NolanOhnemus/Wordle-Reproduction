import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './pages/App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Admin } from './pages/Admin';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  </>,
);
