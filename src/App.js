
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Stockist from './components/Stockist';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {

  return (
    <>

      <BrowserRouter>

        <div className="">
          <Navbar />
          <Routes>

            <Route index path="/" element={<Dashboard />} />
            <Route index path="/p" element={<Products />} />
            <Route index path="/s" element={<Stockist />} />

          </Routes>
        </div>

      </BrowserRouter>
    </>
  );
}

export default App;
