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
                // If the token is invalid or expired, force a logout
                if (err.response && err.response.status === 401) {
                    logoutUser();
                    navigate('/login');
                }
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // Colors for our Pie Chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
    if (!dashboardData) return <div className="container mt-5">Loading dashboard...</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Financial Dashboard</h2>
            </div>

            {/* Summary Cards */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Total Income</h5>
                            <h3>${dashboardData.total_income}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-danger mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Total Expenses</h5>
                            <h3>${dashboardData.total_expenses}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Net Savings</h5>
                            <h3>${dashboardData.savings_overview}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expense Breakdown Chart */}
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-center">Expense Breakdown by Category</h5>
                            {dashboardData.category_breakdown.length > 0 ? (
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={dashboardData.category_breakdown}
                                                dataKey="total"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                label
                                            >
                                                {dashboardData.category_breakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-center text-muted mt-4">No expenses recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;