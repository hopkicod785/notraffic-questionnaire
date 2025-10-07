import { useState } from 'react';
import { API_URL } from '../config';
import './Questionnaire.css';

const CABINET_TYPE_OPTIONS = [
  'NEMA TS-1',
  'NEMA TS-2 Type 1',
  'NEMA TS-2 Type 2',
  'ATC Cabinet',
  '332 Cabinet',
  '334 Cabinet',
  '336 Cabinet',
  'TEES Cabinet',
  'NYDOT Cabinet',
  'M Cabinet',
  'G Cabinet',
  'P Cabinet',
  'R Cabinet',
  'Super P Cabinet',
  'Super M Cabinet',
  'ITS Cabinet',
  'Other'
];

const DETECTION_IO_OPTIONS = [
  'DB37 to Spades',
  'SDLC 15 Pin',
  'SDLC 25 to 15 Pin',
  'NTCIP',
  'Smart Harness',
  'Other'
];

const TLS_CONNECTION_OPTIONS = [
  'NTCIP',
  'SDLC',
  'C1/C4 Harness',
  'DB25 to Spade Cables',
  'None',
  'Other'
];

const EQUIPMENT_OPTIONS = [
  'Nexus Unit',
  'Sensor Power Unit',
  'Type 1 Sensor',
  'Type 2 Sensor'
];

const AUXILIARY_OPTIONS = [
  'Wifi Repeater',
  '19" Rack Mount Kit',
  'Shelf Mount Kit',
  'C1 Harness'
];

function Questionnaire() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cabinetType: '',
    detectionIO: '',
    tlsConnection: '',
    intersectionPhasing: '',
    signalTiming: '',
    equipment: {},
    auxiliaryEquipment: {},
    distributor: '',
    endUser: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [cabinetTypeOther, setCabinetTypeOther] = useState('');
  const [detectionIOOther, setDetectionIOOther] = useState('');
  const [tlsConnectionOther, setTlsConnectionOther] = useState('');
  const [intersectionPhasingFile, setIntersectionPhasingFile] = useState(null);
  const [signalTimingFile, setSignalTimingFile] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (field, item, quantity) => {
    setFormData(prev => {
      const updatedField = { ...prev[field] };
      const qty = parseInt(quantity) || 0;
      
      if (qty > 0) {
        updatedField[item] = qty;
      } else {
        delete updatedField[item];
      }
      
      return { ...prev, [field]: updatedField };
    });
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('cabinetType', formData.cabinetType === 'Other' ? cabinetTypeOther : formData.cabinetType);
      formDataToSend.append('detectionIO', formData.detectionIO === 'Other' ? detectionIOOther : formData.detectionIO);
      formDataToSend.append('tlsConnection', formData.tlsConnection === 'Other' ? tlsConnectionOther : formData.tlsConnection);
      formDataToSend.append('equipment', JSON.stringify(formData.equipment));
      formDataToSend.append('auxiliaryEquipment', JSON.stringify(formData.auxiliaryEquipment));
      formDataToSend.append('distributor', formData.distributor);
      formDataToSend.append('endUser', formData.endUser);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('zip', formData.zip);
      
      // Add files if they exist
      if (intersectionPhasingFile) {
        formDataToSend.append('intersectionPhasingFile', intersectionPhasingFile);
      }
      if (signalTimingFile) {
        formDataToSend.append('signalTimingFile', signalTimingFile);
      }
      
      const response = await fetch(`${API_URL}/api/submissions`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
      } else {
        alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      cabinetType: '',
      detectionIO: '',
      tlsConnection: '',
      intersectionPhasing: '',
      signalTiming: '',
      equipment: {},
      auxiliaryEquipment: {},
      distributor: '',
      endUser: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    });
    setCabinetTypeOther('');
    setDetectionIOOther('');
    setTlsConnectionOther('');
    setIntersectionPhasingFile(null);
    setSignalTimingFile(null);
    setStep(1);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="questionnaire-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Submission Successful!</h2>
          <p>Your detection equipment questionnaire has been submitted successfully.</p>
          <button className="btn btn-primary" onClick={resetForm}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="form-step">
            <h2>Cabinet Type</h2>
            <p className="step-description">Please select your cabinet type</p>
            <div className="form-group">
              <select
                className="form-input"
                value={formData.cabinetType}
                onChange={(e) => {
                  handleChange('cabinetType', e.target.value);
                  if (e.target.value !== 'Other') {
                    setCabinetTypeOther('');
                  }
                }}
              >
                <option value="">-- Select Cabinet Type --</option>
                {CABINET_TYPE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {formData.cabinetType === 'Other' && (
              <div className="form-group">
                <label>Please specify cabinet type</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter custom cabinet type"
                  value={cabinetTypeOther}
                  onChange={(e) => setCabinetTypeOther(e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2>Detection I/O</h2>
            <p className="step-description">Specify the detection input/output configuration</p>
            <div className="form-group">
              <select
                className="form-input"
                value={formData.detectionIO}
                onChange={(e) => {
                  handleChange('detectionIO', e.target.value);
                  if (e.target.value !== 'Other') {
                    setDetectionIOOther('');
                  }
                }}
              >
                <option value="">-- Select Detection I/O --</option>
                {DETECTION_IO_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {formData.detectionIO === 'Other' && (
              <div className="form-group">
                <label>Please specify detection I/O</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter custom detection I/O"
                  value={detectionIOOther}
                  onChange={(e) => setDetectionIOOther(e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2>TLS Connection</h2>
            <p className="step-description">Select the TLS connection type</p>
            <div className="form-group">
              <select
                className="form-input"
                value={formData.tlsConnection}
                onChange={(e) => {
                  handleChange('tlsConnection', e.target.value);
                  if (e.target.value !== 'Other') {
                    setTlsConnectionOther('');
                  }
                }}
              >
                <option value="">-- Select TLS Connection --</option>
                {TLS_CONNECTION_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {formData.tlsConnection === 'Other' && (
              <div className="form-group">
                <label>Please specify TLS connection</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter custom TLS connection"
                  value={tlsConnectionOther}
                  onChange={(e) => setTlsConnectionOther(e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h2>Intersection Phasing</h2>
            <p className="step-description">Upload intersection phasing file</p>
            <div className="form-group">
              <label className="file-upload-label">
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => setIntersectionPhasingFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                />
                <span className="file-upload-button">Choose File</span>
                <span className="file-name">
                  {intersectionPhasingFile ? intersectionPhasingFile.name : 'No file selected'}
                </span>
              </label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-step">
            <h2>Signal Timing</h2>
            <p className="step-description">Upload signal timing file</p>
            <div className="form-group">
              <label className="file-upload-label">
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => setSignalTimingFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                />
                <span className="file-upload-button">Choose File</span>
                <span className="file-name">
                  {signalTimingFile ? signalTimingFile.name : 'No file selected'}
                </span>
              </label>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-step">
            <h2>Equipment</h2>
            <p className="step-description">Enter quantity needed for each equipment type</p>
            <div className="quantity-group">
              {EQUIPMENT_OPTIONS.map(option => (
                <div key={option} className="quantity-item">
                  <label className="quantity-label">{option}</label>
                  <input
                    type="number"
                    min="0"
                    className="quantity-input"
                    placeholder="0"
                    value={formData.equipment[option] || ''}
                    onChange={(e) => handleQuantityChange('equipment', option, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="form-step">
            <h2>Auxiliary Equipment</h2>
            <p className="step-description">Enter quantity needed for each auxiliary equipment type</p>
            <div className="quantity-group">
              {AUXILIARY_OPTIONS.map(option => (
                <div key={option} className="quantity-item">
                  <label className="quantity-label">{option}</label>
                  <input
                    type="number"
                    min="0"
                    className="quantity-input"
                    placeholder="0"
                    value={formData.auxiliaryEquipment[option] || ''}
                    onChange={(e) => handleQuantityChange('auxiliaryEquipment', option, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="form-step">
            <h2>Review Your Selections</h2>
            <p className="step-description">Please review your selections before proceeding to authorization</p>
            <div className="review-section">
              <div className="review-item">
                <strong>Cabinet Type:</strong> {formData.cabinetType === 'Other' ? cabinetTypeOther : formData.cabinetType}
              </div>
              <div className="review-item">
                <strong>Detection I/O:</strong> {formData.detectionIO === 'Other' ? detectionIOOther : formData.detectionIO}
              </div>
              <div className="review-item">
                <strong>TLS Connection:</strong> {formData.tlsConnection === 'Other' ? tlsConnectionOther : formData.tlsConnection}
              </div>
              <div className="review-item">
                <strong>Intersection Phasing:</strong> {intersectionPhasingFile ? intersectionPhasingFile.name : 'No file uploaded'}
              </div>
              <div className="review-item">
                <strong>Signal Timing:</strong> {signalTimingFile ? signalTimingFile.name : 'No file uploaded'}
              </div>
              <div className="review-item">
                <strong>Equipment:</strong>
                <ul>
                  {Object.keys(formData.equipment).length > 0 ? (
                    Object.entries(formData.equipment).map(([item, qty]) => (
                      <li key={item}>{item}: {qty} unit{qty > 1 ? 's' : ''}</li>
                    ))
                  ) : (
                    <li>None selected</li>
                  )}
                </ul>
              </div>
              <div className="review-item">
                <strong>Auxiliary Equipment:</strong>
                <ul>
                  {Object.keys(formData.auxiliaryEquipment).length > 0 ? (
                    Object.entries(formData.auxiliaryEquipment).map(([item, qty]) => (
                      <li key={item}>{item}: {qty} unit{qty > 1 ? 's' : ''}</li>
                    ))
                  ) : (
                    <li>None selected</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="form-step">
            <h2>Authorization Form</h2>
            <p className="step-description">Complete the checkout information</p>
            <div className="authorization-form">
              <div className="form-group">
                <label>Distributor</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter distributor name"
                  value={formData.distributor}
                  onChange={(e) => handleChange('distributor', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End-User</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter end-user name"
                  value={formData.endUser}
                  onChange={(e) => handleChange('endUser', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter street address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>ZIP</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ZIP Code"
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="questionnaire-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 9) * 100}%` }}></div>
      </div>
      
      <div className="step-indicator">
        Step {step} of 9
      </div>

      <div className="form-card">
        {renderStep()}

        <div className="button-group">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={prevStep}>
              Previous
            </button>
          )}
          
          {step < 9 ? (
            <button className="btn btn-primary" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;

