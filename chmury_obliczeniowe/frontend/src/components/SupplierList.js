import React, { useState, useEffect } from 'react';
import api from '../services/api';

function SupplierList() {
    const [suppliers, setSuppliers] = useState([]);
    const [sortedSuppliers, setSortedSuppliers] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/suppliers/');
                setSuppliers(response.data);
                setSortedSuppliers(response.data);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to fetch suppliers');
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    useEffect(() => {
        if (sortField) {
            const sorted = [...suppliers].sort((a, b) => {
                if (sortDirection === 'asc') {
                    return a[sortField] > b[sortField] ? 1 : -1;
                }
                return a[sortField] < b[sortField] ? 1 : -1;
            });
            setSortedSuppliers(sorted);
        } else {
            setSortedSuppliers(suppliers);
        }
    }, [suppliers, sortField, sortDirection]);

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
        setSortedSuppliers(suppliers);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Suppliers</h2>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => handleSort('name')}>
                    Sort by Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('contact')}>
                    Sort by Contact {sortField === 'contact' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('email')}>
                    Sort by Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>Contact</th>
                        <th style={tableHeaderStyle}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedSuppliers.map(supplier => (
                        <tr key={supplier.id} style={tableRowStyle}>
                            <td style={tableCellStyle}>{supplier.name}</td>
                            <td style={tableCellStyle}>{supplier.contact}</td>
                            <td style={tableCellStyle}>{supplier.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

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

export default SupplierList;