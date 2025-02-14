import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './assets/scss/main.scss';
import { Provider } from 'react-redux';
import store from './store/index.ts';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
