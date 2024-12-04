import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DeliveryProductList = () => {
    const [deliveryProducts, setDeliveryProducts] = useState([]);
    const [sortedDeliveryProducts, setSortedDeliveryProducts] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeliveryProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get('/delivery-products/');
                setDeliveryProducts(response.data);
                setSortedDeliveryProducts(response.data);
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

    useEffect(() => {
        if (sortField) {
            const sorted = [...deliveryProducts].sort((a, b) => {
                if (sortDirection === 'asc') {
                    return a[sortField] > b[sortField] ? 1 : -1;
                }
                return a[sortField] < b[sortField] ? 1 : -1;
            });
            setSortedDeliveryProducts(sorted);
        } else {
            setSortedDeliveryProducts(deliveryProducts);
        }
    }, [deliveryProducts, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleReset = () => {
        setSortField(null);
        setSortDirection('asc');
        setSortedDeliveryProducts(deliveryProducts);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Delivery Products</h2>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => handleSort('delivery_id')}>
                    Sort by Delivery ID {sortField === 'delivery_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('supplier_name')}>
                    Sort by Supplier {sortField === 'supplier_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('product_name')}>
                    Sort by Product {sortField === 'product_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('quantity')}>
                    Sort by Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={handleReset}>Reset</button>
            </div>
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
                    {sortedDeliveryProducts.map((item, index) => (
                        <tr key={`${item.delivery_id}-${index}`} style={tableRowStyle}>
                            <td style={tableCellStyle}>{item.delivery_id}</td>
                            <td style={tableCellStyle}>{item.supplier_name}</td>
                            <td style={tableCellStyle}>{item.product_name}</td>
                            <td style={tableCellStyle}>{item.quantity}</td>
                            <td style={tableCellStyle}>
                                {item.delivery_date ? 
                                    new Date(item.delivery_date).toLocaleDateString() : 
                                    'N/A'
                                }
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