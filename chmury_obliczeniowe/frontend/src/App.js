import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import SupplierList from './components/SupplierList';
import DeliveryList from './components/DeliveryList';
import DeliveryProductList from './components/DeliveryProductList';
import OrderProductList from './components/OrderProductList';

function App() {
    return (
        <Router>
            <div>
                <nav style={{ 
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    marginBottom: '2rem'
                }}>
                    <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                    <Link to="/products" style={{ marginRight: '1rem' }}>Products</Link>
                    <Link to="/orders" style={{ marginRight: '1rem' }}>Orders</Link>
                    <Link to="/suppliers" style={{ marginRight: '1rem' }}>Suppliers</Link>
                    <Link to="/deliveries" style={{ marginRight: '1rem' }}>Deliveries</Link>
                    <Link to="/delivery-products" style={{ marginRight: '1rem' }}>Delivery Products</Link>
                    <Link to="/order-products">Order Products</Link>
                </nav>

                <div style={{ padding: '0 2rem' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/orders" element={<OrderList />} />
                        <Route path="/suppliers" element={<SupplierList />} />
                        <Route path="/deliveries" element={<DeliveryList />} />
                        <Route path="/delivery-products" element={<DeliveryProductList />} />
                        <Route path="/order-products" element={<OrderProductList />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

// Prosty komponent strony głównej
function Home() {
    return (
        <div>
            <h1>Warehouse Management System</h1>
            <p>Welcome to the warehouse management system. Please select an option from the navigation menu.</p>
        </div>
    );
}

export default App;
