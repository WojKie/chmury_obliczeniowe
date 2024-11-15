import React, { useState, useEffect } from 'react';
import api from '../services/api';

function DeliveryList() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                setLoading(true);
                const response = await api.get('/deliveries/');
                setDeliveries(response.data);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Deliveries</h2>
            <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                marginTop: '1rem',
                border: '1px solid #ddd'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Supplier</th>
                        <th style={tableHeaderStyle}>Date</th>
                        <th style={tableHeaderStyle}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveries.map(delivery => (
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

// Style dla tabeli
const tableHeaderStyle = {
    padding: '12px',
    borderBottom: '2px solid #ddd',
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