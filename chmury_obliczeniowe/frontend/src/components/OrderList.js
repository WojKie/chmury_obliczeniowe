import React, { useState, useEffect } from 'react';
import api from '../services/api';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [sortedOrders, setSortedOrders] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await api.get('/orders/');
                setOrders(response.data);
                setSortedOrders(response.data);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
    
        fetchOrders();
    }, []);

    useEffect(() => {
        if (sortField) {
            const sorted = [...orders].sort((a, b) => {
                if (sortDirection === 'asc') {
                    return a[sortField] > b[sortField] ? 1 : -1;
                }
                return a[sortField] < b[sortField] ? 1 : -1;
            });
            setSortedOrders(sorted);
        } else {
            setSortedOrders(orders);
        }
    }, [orders, sortField, sortDirection]);

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
        setSortedOrders(orders);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Orders</h2>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => handleSort('id')}>
                    Sort by ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('created_at')}>
                    Sort by Date {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('status')}>
                    Sort by Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderList;