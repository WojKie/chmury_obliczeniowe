import React, { useEffect, useState } from 'react';
import api from '../services/api';

const OrderProductList = () => {
    const [orderProducts, setOrderProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get('/order-products/');
                setOrderProducts(response.data);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to fetch order products');
            } finally {
                setLoading(false);
            }
        };
    
        fetchOrderProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Order Products</h2>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Order ID</th>
                        <th style={tableHeaderStyle}>Product</th>
                        <th style={tableHeaderStyle}>Quantity</th>
                        <th style={tableHeaderStyle}>Price</th>
                        <th style={tableHeaderStyle}>Order Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orderProducts.map((item, index) => (
                        <tr key={`${item.order_id}-${index}`} style={tableRowStyle}>
                            <td style={tableCellStyle}>{item.order_id}</td>
                            <td style={tableCellStyle}>{item.product_name}</td>
                            <td style={tableCellStyle}>{item.quantity}</td>
                            <td style={tableCellStyle}>${item.price_at_time}</td>
                            <td style={tableCellStyle}>
                                {new Date(item.order_date).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    border: '1px solid #ddd'
};

const tableHeaderStyle = {
    padding: '12px',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f8f9fa',
    textAlign: 'left'
};

const tableRowStyle = {
    '&:hover': {
        backgroundColor: '#f5f5f5'
    }
};

const tableCellStyle = {
    padding: '8px',
    borderBottom: '1px solid #ddd'
};

export default OrderProductList;