import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContacts, markContactRead, deleteContact } from '../../api/contacts';

const ContactsManager = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const { data } = await getContacts();
            setContacts(data.data);
        } catch (error) {
            console.error('Failed to load contacts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markContactRead(id);
            fetchContacts();
        } catch (error) {
            alert('Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this contact message?')) {
            try {
                await deleteContact(id);
                fetchContacts();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading contacts...</div>;

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Contact Messages</h1>
                <Link to="/admin" className="btn btn-secondary">← Back to Dashboard</Link>
            </div>

            {/* Contacts Table */}
            {contacts.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    background: 'var(--card-bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)'
                }}>
                    <p>No messages yet.</p>
                </div>
            ) : (
                <div style={{
                    overflowX: 'auto',
                    background: 'var(--card-bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: '900px'
                    }}>
                        <thead>
                            <tr style={{
                                borderBottom: '2px solid var(--border-color)',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white'
                            }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Subject</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Message</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Received</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(c => (
                                <tr key={c.id} style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    backgroundColor: c.is_read ? 'transparent' : 'rgba(33, 150, 243, 0.05)',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => !c.is_read && (e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.1)')}
                                onMouseLeave={(e) => !c.is_read && (e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.05)')}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontWeight: c.is_read ? 'normal' : 'bold' }}>
                                            {c.name}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        <a href={`mailto:${c.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                                            {c.email}
                                        </a>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontWeight: c.is_read ? 'normal' : 'bold' }}>
                                            {c.subject}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {c.message.substring(0, 50)}{c.message.length > 50 ? '...' : ''}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                                        {new Date(c.created_at).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '20px',
                                            backgroundColor: c.is_read ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                                            color: c.is_read ? '#4caf50' : '#ff9800',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {c.is_read ? 'Read' : 'Unread'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {!c.is_read && (
                                            <button 
                                                onClick={() => handleMarkRead(c.id)}
                                                style={{
                                                    display: 'inline-block',
                                                    marginRight: '0.5rem',
                                                    padding: '0.5rem 0.8rem',
                                                    backgroundColor: 'var(--primary-color)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                                                title="Mark as read"
                                            >
                                                Mark Read
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(c.id)}
                                            style={{
                                                display: 'inline-block',
                                                padding: '0.5rem 0.8rem',
                                                backgroundColor: '#ff6b6b',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
                                            title="Delete message"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContactsManager;