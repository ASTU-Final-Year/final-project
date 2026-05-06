'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Replace with your actual API endpoint (Node.js, Next.js API route, or third-party)
    const API_ENDPOINT = '/api/contact'; // or 'https://your-backend.com/contact'

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: data.message || 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ---------- Organization details (easily customizable) ----------
  const org = {
    name: 'ServeSync Plus',
    email: 'privacy@servesyncplus.et',
    phone: '+251-11-554-3322',
    address: 'Adama Science & Technology University, Department of CSE, P.O. Box 1888, Adama, Ethiopia',
    hours: 'Monday – Friday, 8:00 – 17:00 (EAT)',
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>
          Have questions or need support? Fill out the form and we’ll get back to you within 24h.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              style={styles.textarea}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {status.message && (
            <div
              style={{
                ...styles.status,
                backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                color: status.type === 'success' ? '#155724' : '#721c24',
              }}
            >
              {status.message}
            </div>
          )}
        </form>

        {/* Organization contact details - any org can edit the `org` object above */}
        <div style={styles.orgInfo}>
          <h3 style={styles.orgTitle}>Our organization</h3>
          <p><strong>{org.name}</strong></p>
          <p>📧 <a href={`mailto:${org.email}`} style={styles.link}>{org.email}</a></p>
          <p>📞 <a href={`tel:${org.phone.replace(/\s/g, '')}`} style={styles.link}>{org.phone}</a></p>
          <p>📍 {org.address}</p>
          <p>🕒 {org.hours}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.directionsLink}
          >
            Get directions →
          </a>
        </div>
      </div>
    </div>
  );
}

// Inline styles – you can also move these to a CSS module or global CSS
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #f8faff 0%, #eef2fc 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  card: {
    maxWidth: '700px',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(4px)',
    borderRadius: '2rem',
    padding: '2rem 1.8rem',
    boxShadow: '0 25px 45px -12px rgba(0,0,0,0.15)',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #1f2b48, #2d3a6e)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  subtitle: {
    textAlign: 'center',
    color: '#4a5b6e',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontWeight: 500,
    color: '#1f2f47',
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '1rem',
    border: '1px solid #d8e2ef',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: '0.2s',
  },
  textarea: {
    padding: '0.8rem 1rem',
    borderRadius: '1rem',
    border: '1px solid #d8e2ef',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#2c3e66',
    color: 'white',
    border: 'none',
    padding: '0.9rem',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '2.5rem',
    cursor: 'pointer',
    transition: '0.2s',
    marginTop: '0.5rem',
  },
  status: {
    padding: '0.7rem',
    borderRadius: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  orgInfo: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2edf7',
    color: '#2c3e66',
  },
  orgTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.8rem',
  },
  link: {
    color: '#2c3e66',
    textDecoration: 'none',
    borderBottom: '1px dotted #8da2c0',
  },
  directionsLink: {
    display: 'inline-block',
    marginTop: '0.8rem',
    backgroundColor: '#eef3ff',
    padding: '0.4rem 1rem',
    borderRadius: '2rem',
    fontSize: '0.85rem',
    color: '#2c5282',
    textDecoration: 'none',
  },
};

