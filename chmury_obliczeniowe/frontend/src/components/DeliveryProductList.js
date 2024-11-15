import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DeliveryProductList = () => {
    const [deliveryProducts, setDeliveryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeliveryProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get('/delivery-products/');
                setDeliveryProducts(response.data);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to fetch delivery products');
            } finally {
                setLoading(false);
            }
        };
    
        fetchDeliveryProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Delivery Products</h2>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Delivery ID</th>
                        <th style={tableHeaderStyle}>Supplier</th>
                        <th style={tableHeaderStyle}>Product</th>
                        <th style={tableHeaderStyle}>Quantity</th>
                        <th style={tableHeaderStyle}>Delivery Date</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveryProducts.map((item, index) => (
                        <tr key={`${item.delivery_id}-${index}`} style={tableRowStyle}>
                            <td style={tableCellStyle}>{item.delivery_id}</td>
                            <td style={tableCellStyle}>{item.supplier_name}</td>
                            <td style={tableCellStyle}>{item.product_name}</td>
                            <td style={tableCellStyle}>{item.quantity}</td>
                            <td style={tableCellStyle}>
                                {new Date(item.delivery_date).toLocaleDateString()}
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

export default DeliveryProductList;