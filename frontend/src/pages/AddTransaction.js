import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddTransaction = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        transaction_type: 'Expense',
        date: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
            await api.post('transactions/', formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            setError('Failed to add transaction. Please check your inputs.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card futuristic-card p-5 border-0">
                        <h3 className="text-center mb-4 text-neon-blue fw-bold">
                            <i className="bi bi-cpu me-2"></i>Initialize Transaction
                        </h3>
                        
                        {error && <div className="alert alert-danger bg-danger text-white border-0"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
                        {success && <div className="alert alert-success bg-success text-white border-0"><i className="bi bi-check-circle-fill me-2"></i>Data Synchronized! Redirecting...</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Transaction Type</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-blue">
                                            <i className="bi bi-arrow-left-right"></i>
                                        </span>
                                        <select 
                                            name="transaction_type" 
                                            className="form-select futuristic-input border-start-0" 
                                            value={formData.transaction_type}
                                            onChange={handleChange}
                                        >
                                            <option value="Expense" className="bg-dark text-light">Expense</option>
                                            <option value="Income" className="bg-dark text-light">Income</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Amount ($)</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-green">
                                            <i className="bi bi-currency-dollar"></i>
                                        </span>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            name="amount" 
                                            className="form-control futuristic-input border-start-0" 
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Category</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-blue">
                                            <i className="bi bi-tags"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            name="category" 
                                            className="form-control futuristic-input border-start-0" 
                                            placeholder="e.g. Groceries"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-blue">
                                            <i className="bi bi-calendar-event"></i>
                                        </span>
                                        <input 
                                            type="date" 
                                            name="date" 
                                            className="form-control futuristic-input border-start-0" 
                                            value={formData.date}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-muted small text-uppercase fw-bold">Description</label>
                                <div className="input-group">
                                    <span className="input-group-text futuristic-input border-end-0 text-neon-blue">
                                        <i className="bi bi-card-text"></i>
                                    </span>
                                    <textarea 
                                        name="description" 
                                        className="form-control futuristic-input border-start-0" 
                                        rows="2"
                                        placeholder="Optional details..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="btn futuristic-btn w-100 py-2 fs-5 mt-2">
                                <i className="bi bi-cloud-arrow-up me-2"></i>Transmit Data
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;