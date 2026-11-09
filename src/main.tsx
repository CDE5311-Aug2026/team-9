import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, useLocation } from 'react-router-dom';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-400-italic.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import { App } from './App';
import { V2App } from './v2/App';
import { V3App } from './v3/App';
function Root(){const {pathname}=useLocation();return pathname.startsWith('/v3')||pathname==='/'?<V3App/>:pathname.startsWith('/v2')?<V2App/>:<App/>;}
import './styles.css';

// Resolve the public and QR entry URLs once, before in-app navigation starts.
const entryPath = window.location.hash.slice(1).split('?')[0].replace(/\/$/, '');
if (['', '/v3', '/v3/home'].includes(entryPath)) {
  window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + '#/v3/welcome');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><HashRouter><Root /></HashRouter></React.StrictMode>,
);
