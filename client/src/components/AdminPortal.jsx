import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './AdminPortal.css';

function AdminPortal() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/submissions`);
      const result = await response.json();
      
      if (result.success) {
        // Ensure equipment fields are objects
        const processedData = result.data.map(sub => ({
          ...sub,
          equipment: typeof sub.equipment === 'string' ? JSON.parse(sub.equipment) : (sub.equipment || {}),
          auxiliary_equipment: typeof sub.auxiliary_equipment === 'string' ? JSON.parse(sub.auxiliary_equipment) : (sub.auxiliary_equipment || {})
        }));
        setSubmissions(processedData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        const response = await fetch(`${API_URL}/api/submissions/${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          fetchSubmissions();
        }
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Portal</h1>
        <p>View all detection equipment submissions</p>
        <button className="btn btn-refresh" onClick={fetchSubmissions}>
          Refresh Data
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-state">
          <p>No submissions yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Distributor</th>
                <th>End-User</th>
                <th>City, State</th>
                <th>Cabinet Type</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <>
                  <tr key={submission.id} className={expandedRow === submission.id ? 'expanded' : ''}>
                    <td>{submission.id}</td>
                    <td>{submission.distributor}</td>
                    <td>{submission.end_user}</td>
                    <td>{submission.city}, {submission.state}</td>
                    <td>{submission.cabinet_type}</td>
                    <td>{formatDate(submission.created_at)}</td>
                    <td>
                      <button 
                        className="btn btn-small btn-info"
                        onClick={() => toggleExpand(submission.id)}
                      >
                        {expandedRow === submission.id ? 'Hide' : 'Details'}
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(submission.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedRow === submission.id && (
                    <tr className="details-row">
                      <td colSpan="7">
                        <div className="details-content">
                          <div className="details-section">
                            <h3>Technical Information</h3>
                            <div className="details-grid">
                              <div className="detail-item">
                                <strong>Cabinet Type:</strong> {submission.cabinet_type}
                              </div>
                              <div className="detail-item">
                                <strong>Detection I/O:</strong> {submission.detection_io}
                              </div>
                              <div className="detail-item">
                                <strong>TLS Connection:</strong> {submission.tls_connection}
                              </div>
                              <div className="detail-item">
                                <strong>Intersection Phasing:</strong>
                                {submission.intersection_phasing_file ? (
                                  <a 
                                    href={`${API_URL}/uploads/${submission.intersection_phasing_file}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="file-link"
                                  >
                                    📄 {submission.intersection_phasing_file}
                                  </a>
                                ) : (
                                  ' No file uploaded'
                                )}
                              </div>
                              <div className="detail-item">
                                <strong>Signal Timing:</strong>
                                {submission.signal_timing_file ? (
                                  <a 
                                    href={`${API_URL}/uploads/${submission.signal_timing_file}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="file-link"
                                  >
                                    📄 {submission.signal_timing_file}
                                  </a>
                                ) : (
                                  ' No file uploaded'
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="details-section">
                            <h3>Equipment</h3>
                            <div className="equipment-list">
                              {Object.keys(submission.equipment || {}).length > 0 ? (
                                <ul>
                                  {Object.entries(submission.equipment).map(([item, qty]) => (
                                    <li key={item}>
                                      {item}: <strong>{qty}</strong> unit{qty > 1 ? 's' : ''}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No equipment selected</p>
                              )}
                            </div>
                          </div>

                          <div className="details-section">
                            <h3>Auxiliary Equipment</h3>
                            <div className="equipment-list">
                              {Object.keys(submission.auxiliary_equipment || {}).length > 0 ? (
                                <ul>
                                  {Object.entries(submission.auxiliary_equipment).map(([item, qty]) => (
                                    <li key={item}>
                                      {item}: <strong>{qty}</strong> unit{qty > 1 ? 's' : ''}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No auxiliary equipment selected</p>
                              )}
                            </div>
                          </div>

                          <div className="details-section">
                            <h3>Contact Information</h3>
                            <div className="details-grid">
                              <div className="detail-item">
                                <strong>Distributor:</strong> {submission.distributor}
                              </div>
                              <div className="detail-item">
                                <strong>End-User:</strong> {submission.end_user}
                              </div>
                              <div className="detail-item">
                                <strong>Address:</strong> {submission.address}
                              </div>
                              <div className="detail-item">
                                <strong>City:</strong> {submission.city}
                              </div>
                              <div className="detail-item">
                                <strong>State:</strong> {submission.state}
                              </div>
                              <div className="detail-item">
                                <strong>ZIP:</strong> {submission.zip}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPortal;

