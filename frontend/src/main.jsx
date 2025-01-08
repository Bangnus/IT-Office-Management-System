import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from 'react-redux';
import { store } from './store.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <ThemeProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  </Provider>,
) 
