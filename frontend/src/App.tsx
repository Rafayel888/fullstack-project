import { ToastContainer } from 'react-toastify';
import MyRoutes from './routes/MyRoutes';

function App() {
  return (
    <>
      <ToastContainer position='top-right' autoClose={2500} />
      <MyRoutes />
    </>
  );
}

export default App;
