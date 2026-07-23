import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { logoutUser } from '../services/authService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('dashboard/');
                setDashboardData(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please log in again.');
                if (err.response && err.response.status === 401) {
                    logoutUser();
                    navigate('/login');
                }
            }
        };

        fetchDashboardData();
    }, [navigate]);

    // Colors for our Pie Chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
    if (!dashboardData) return <div className="container mt-5 text-light">Loading dashboard...</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-light">Financial Dashboard</h2>
            </div>

           {/* Summary Cards */}
            <div className="row mb-4">
                <div className="col-md-3"> {/* Changed from col-md-4 to col-md-3 to fit 4 cards */}
                    <div className="card futuristic-card mb-3">
                        <div className="card-body">
                            <h5 className="card-title text-light opacity-75">Total Income</h5>
                            <h2 className="text-neon-green">${dashboardData.total_income}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card futuristic-card mb-3">
                        <div className="card-body">
                            <h5 className="card-title text-light opacity-75">Total Expenses</h5>
                            <h2 className="text-neon-red">${dashboardData.total_expenses}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card futuristic-card mb-3">
                        <div className="card-body">
                            <h5 className="card-title text-light opacity-75">Net Savings</h5>
                            <h2 className="text-neon-blue">${dashboardData.savings_overview}</h2>
                        </div>
                    </div>
                </div>
                {/* NEW AI PREDICTION CARD */}
                <div className="col-md-3">
                    <div className="card futuristic-card mb-3" style={{ border: '1px solid rgba(175, 25, 255, 0.4)' }}>
                        <div className="card-body">
                            {/* Changed title to be more explicit */}
                            <h5 className="card-title text-light opacity-75 fs-6 text-uppercase fw-bold">
                                <i className="bi bi-cpu me-2" style={{ color: '#AF19FF' }}></i>Predicted Spend
                            </h5>
                            <h2 className="m-0" style={{ color: '#AF19FF', textShadow: '0 0 12px rgba(175, 25, 255, 0.4)' }}>
                                ${dashboardData.projected_spend || '0.00'}
                            </h2>
                            {/* Added a descriptive subtitle */}
                            <p className="text-light opacity-50 small mt-2 mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>
                                Estimated total expenses by end of the month based on your current velocity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expense Breakdown Chart */}
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="card futuristic-card">
                        <div className="card-body">
                            <h5 className="card-title text-center text-light mb-4">Expense Breakdown by Category</h5>
                            {dashboardData.category_breakdown.length > 0 ? (
                                <div style={{ width: '100%', height: 350 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={dashboardData.category_breakdown}
                                                dataKey="total"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                label={{ fill: '#e2e8f0' }}
                                            >
                                                {dashboardData.category_breakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: 'rgba(15, 32, 39, 0.9)', border: '1px solid #00e5ff', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-center text-light opacity-75 mt-4">No expenses recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;