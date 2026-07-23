import React, { useState, useEffect } from 'react';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await api.delete(`transactions/${id}/`);
                setTransactions(transactions.filter(t => t.id !== id));
            } catch (err) {
                alert('Failed to delete transaction.');
            }
        }
    };

    // --- EXPORT TO CSV ---
    const exportToCSV = () => {
        if (transactions.length === 0) return alert('No data to export.');
        
        // 1. Create CSV headers
        const headers = ['Date,Description,Category,Type,Amount'];
        
        // 2. Map data to rows
        const rows = transactions.map(t => 
            `${t.date},"${t.description || ''}",${t.category},${t.transaction_type},${t.amount}`
        );
        
        // 3. Combine and create a downloadable blob
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "finance_ledger.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- EXPORT TO PDF ---
    const exportToPDF = () => {
        if (transactions.length === 0) return alert('No data to export.');
        
        const doc = new jsPDF();
        
        // Add Title
        doc.setFontSize(18);
        doc.text("Financial Transaction Ledger", 14, 22);
        
        // Add Timestamp
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Build the Table
        const tableColumn = ["Date", "Description", "Category", "Type", "Amount ($)"];
        const tableRows = [];
        
        transactions.forEach(t => {
            const rowData = [
                t.date,
                t.description || 'None',
                t.category,
                t.transaction_type,
                t.amount
            ];
            tableRows.push(rowData);
        });
        
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [0, 229, 255] }, // Neon Blue header
        });

        doc.save("finance_ledger.pdf");
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
                            
                            {/* Export Buttons */}
                            <div>
                                <button onClick={exportToCSV} className="btn btn-sm btn-outline-success me-2" style={{ borderRadius: '8px' }}>
                                    <i className="bi bi-filetype-csv me-1"></i>CSV
                                </button>
                                <button onClick={exportToPDF} className="btn btn-sm btn-outline-danger me-3" style={{ borderRadius: '8px' }}>
                                    <i className="bi bi-filetype-pdf me-1"></i>PDF
                                </button>
                                <span className="badge bg-dark border border-info text-info fs-6">
                                    Total Records: {transactions.length}
                                </span>
                            </div>
                        </div>

                        {error && <div className="alert alert-danger bg-danger text-white border-0">{error}</div>}

                        <div className="table-responsive">
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