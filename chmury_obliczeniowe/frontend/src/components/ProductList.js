import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products/');
            setProducts(response.data);
            setSortedProducts(response.data);
            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (sortField) {
            const sorted = [...products].sort((a, b) => {
                if (sortDirection === 'asc') {
                    return a[sortField] > b[sortField] ? 1 : -1;
                }
                return a[sortField] < b[sortField] ? 1 : -1;
            });
            setSortedProducts(sorted);
        } else {
            setSortedProducts(products);
        }
    }, [products, sortField, sortDirection]);

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
        setSortedProducts(products);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Products</h2>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => handleSort('name')}>
                    Sort by Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('price')}>
                    Sort by Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={() => handleSort('stock')}>
                    Sort by Stock {sortField === 'stock' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProducts.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;