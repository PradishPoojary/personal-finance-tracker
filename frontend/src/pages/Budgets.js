import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [formData, setFormData] = useState({
        category: '',
        monthly_limit: '', 
        month: currentMonth, 
        year: currentYear    
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch BOTH budgets and transactions to calculate progress
    const fetchData = async () => {
        try {
            const [budgetRes, transactionRes] = await Promise.all([
                api.get('budgets/'),
                api.get('transactions/')
            ]);
            setBudgets(budgetRes.data);
            setTransactions(transactionRes.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to retrieve financial telemetry.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('budgets/', formData);
            setFormData({ category: '', monthly_limit: '', month: currentMonth, year: currentYear });
            fetchData(); 
        } catch (err) {
            setError('Failed to establish budget constraints. Check your inputs.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to terminate this budget limit?')) {
            try {
                await api.delete(`budgets/${id}/`);
                setBudgets(budgets.filter(b => b.id !== id));
            } catch (err) {
                alert('Failed to delete budget.');
            }
        }
    };

    // Helper function to calculate how much has been spent in a specific category
    const calculateSpent = (category) => {
        return transactions
            .filter(t => t.category.toLowerCase() === category.toLowerCase() && t.transaction_type === 'Expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    };

    if (loading) return <div className="container mt-5 text-neon-blue text-center"><div className="spinner-border" role="status"></div><h4 className="mt-3">Calibrating Telemetry...</h4></div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-light"><i className="bi bi-crosshair me-2 text-neon-blue"></i>Budget Controls</h2>
            </div>

            {error && <div className="alert alert-danger bg-danger text-white border-0"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}

            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className="card futuristic-card p-4 border-0 h-100">
                        <h4 className="text-neon-green mb-4">Set New Limit</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Category</label>
                                <div className="input-group">
                                    <span className="input-group-text futuristic-input border-end-0 text-neon-green">
                                        <i className="bi bi-tags"></i>
                                    </span>
                                    <input type="text" name="category" className="form-control futuristic-input border-start-0" placeholder="e.g. Groceries" value={formData.category} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Monthly Limit ($)</label>
                                <div className="input-group">
                                    <span className="input-group-text futuristic-input border-end-0 text-neon-green">
                                        <i className="bi bi-currency-dollar"></i>
                                    </span>
                                    <input type="number" step="0.01" name="monthly_limit" className="form-control futuristic-input border-start-0" value={formData.monthly_limit} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-6">
                                    <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Month</label>
                                    <select name="month" className="form-select futuristic-input" value={formData.month} onChange={handleChange}>
                                        {[...Array(12).keys()].map(m => (
                                            <option key={m+1} value={m+1} className="bg-dark text-light">{m+1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Year</label>
                                    <input type="number" name="year" className="form-control futuristic-input" value={formData.year} onChange={handleChange} required />
                                </div>
                            </div>
                            <button type="submit" className="btn futuristic-btn w-100 py-2">
                                <i className="bi bi-plus-circle me-2"></i>Establish Limit
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="row">
                        {budgets.length > 0 ? (
                            budgets.map((b) => {
                                const spent = calculateSpent(b.category);
                                const limit = parseFloat(b.monthly_limit);
                                const percentage = Math.min((spent / limit) * 100, 100).toFixed(1);
                                
                                // Change color based on how close you are to the limit
                                let progressColor = '#00e5ff'; // Default Neon Blue
                                if (percentage > 75) progressColor = '#ffbb28'; // Warning Yellow
                                if (percentage >= 100) progressColor = '#ff3366'; // Danger Neon Red

                                return (
                                    <div className="col-md-6 mb-4" key={b.id}>
                                        <div className="card futuristic-card border-0">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h5 className="card-title text-light m-0 text-uppercase fw-bold">{b.category}</h5>
                                                    <button onClick={() => handleDelete(b.id)} className="btn btn-sm text-danger opacity-75">
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </div>
                                                
                                                <div className="d-flex justify-content-between align-items-end mb-2">
                                                    <h3 className="m-0" style={{ color: progressColor }}>${spent.toFixed(2)}</h3>
                                                    <span className="text-light opacity-50 small">/ ${limit.toFixed(2)}</span>
                                                </div>

                                                {/* Futuristic Progress Bar */}
                                                <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                                    <div 
                                                        className="progress-bar progress-bar-striped progress-bar-animated" 
                                                        role="progressbar" 
                                                        style={{ 
                                                            width: `${percentage}%`, 
                                                            backgroundColor: progressColor,
                                                            boxShadow: `0 0 10px ${progressColor}` 
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-end mt-1">
                                                    <small className="text-light opacity-50">{percentage}% Consumed</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-12">
                                <div className="card futuristic-card p-5 text-center border-0">
                                    <h4 className="text-light opacity-50"><i className="bi bi-inboxes me-2"></i>No budget parameters established.</h4>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budgets;