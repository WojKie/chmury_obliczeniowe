import React, { useState, useEffect } from 'react';
import api from '../services/api';

function DeliveryList() {
    const [deliveries, setDeliveries] = useState([]);
    const [sortedDeliveries, setSortedDeliveries] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                setLoading(true);
                const response = await api.get('/deliveries/');
                setDeliveries(response.data);
                setSortedDeliveries(response.data);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to fetch deliveries');
            } finally {
                setLoading(false);
            }
        };
    
        fetchDeliveries();
    }, []);

    useEffect(() => {
        if (sortField) {
            const sorted = [...deliveries].sort((a, b) => {
                if (sortDirection === 'asc') {
                    return a[sortField] > b[sortField] ? 1 : -1;
                }
                return a[sortField] < b[sortField] ? 1 : -1;
            });
            setSortedDeliveries(sorted);
        } else {
            setSortedDeliveries(deliveries);
        }
    }, [deliveries, sortField, sortDirection]);

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
        setSortedDeliveries(deliveries);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Deliveries</h2>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => handleSort('id')}>
                    Sort by ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('supplier')}>
                    Sort by Supplier {sortField === 'supplier' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('delivery_date')}>
                    Sort by Date {sortField === 'delivery_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('status')}>
                    Sort by Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', border: '1px solid #ddd' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Supplier</th>
                        <th style={tableHeaderStyle}>Date</th>
                        <th style={tableHeaderStyle}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedDeliveries.map(delivery => (
                        <tr key={delivery.id} style={tableRowStyle}>
                            <td style={tableCellStyle}>{delivery.id}</td>
                            <td style={tableCellStyle}>{delivery.supplier?.name || 'N/A'}</td>
                            <td style={tableCellStyle}>
                                {delivery.delivery_date ? 
                                    new Date(delivery.delivery_date).toLocaleDateString() : 
                                    'N/A'
                                }
                            </td>
                            <td style={tableCellStyle}>{delivery.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

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

export default DeliveryList;