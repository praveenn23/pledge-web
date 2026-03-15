import { useState } from 'react';

export default function CertIdModal({ isOpen, onClose, onSubmit }) {
  const [val, setVal] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (val.trim()) {
      onSubmit(val.trim());
      setVal('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Certificate Download</h3>
          <p className="modal-desc">Enter your unique ID to retrieve your pledge</p>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="input-group">
            <label className="input-label">Certificate ID</label>
            <input 
              autoFocus
              className="input-field" 
              placeholder="e.g. WCP-2026-XXXX" 
              value={val}
              onChange={e => setVal(e.target.value)}
              required
            />
          </div>
          <div className="modal-footer" style={{ padding: '24px 0 0' }}>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-modal-primary">Retrieve Certificate</button>
          </div>
        </form>
      </div>
    </div>
  );
}
