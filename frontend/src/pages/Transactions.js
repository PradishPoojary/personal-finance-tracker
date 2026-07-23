import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('transactions/');
            setTransactions(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch transaction history.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // Confirm before deleting
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await api.delete(`transactions/${id}/`);
                // Remove the deleted item from the UI without reloading the page
                setTransactions(transactions.filter(t => t.id !== id));
            } catch (err) {
                alert('Failed to delete transaction.');
            }
        }
    };

    if (loading) return <div className="container mt-5 text-neon-blue text-center"><div className="spinner-border" role="status"></div><h4 className="mt-3">Decrypting Data...</h4></div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card futuristic-card p-4 border-0">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="text-neon-blue fw-bold m-0">
                                <i className="bi bi-clock-history me-2"></i>Transaction Ledger
                            </h3>
                            <span className="badge bg-dark border border-info text-info fs-6">
                                Total Records: {transactions.length}
                            </span>
                        </div>

                        {error && <div className="alert alert-danger bg-danger text-white border-0">{error}</div>}

                        <div className="table-responsive">
                            {/* Using standard Bootstrap table but overriding the background to stay transparent */}
                            <table className="table text-light align-middle" style={{ '--bs-table-bg': 'transparent', '--bs-table-color': '#e2e8f0' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(0, 229, 255, 0.3)' }}>
                                        <th className="text-uppercase text-muted small">Date</th>
                                        <th className="text-uppercase text-muted small">Description</th>
                                        <th className="text-uppercase text-muted small">Category</th>
                                        <th className="text-uppercase text-muted small">Type</th>
                                        <th className="text-uppercase text-muted small">Amount</th>
                                        <th className="text-uppercase text-muted small text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length > 0 ? (
                                        transactions.map((t) => (
                                            <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                <td>{t.date}</td>
                                                <td>{t.description || <span className="text-muted fst-italic">None</span>}</td>
                                                <td><span className="badge bg-dark border border-secondary">{t.category}</span></td>
                                                <td>
                                                    {t.transaction_type === 'Income' ? (
                                                        <span className="text-neon-green"><i className="bi bi-arrow-up-right-circle me-1"></i>Income</span>
                                                    ) : (
                                                        <span className="text-neon-red"><i className="bi bi-arrow-down-right-circle me-1"></i>Expense</span>
                                                    )}
                                                </td>
                                                <td className="fw-bold fs-5">
                                                    ${t.amount}
                                                </td>
                                                <td className="text-end">
                                                    <button 
                                                        onClick={() => handleDelete(t.id)} 
                                                        className="btn btn-sm btn-outline-danger"
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No transactions found in the database.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;