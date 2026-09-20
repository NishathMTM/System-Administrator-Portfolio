import { useState, useEffect } from 'react';
import { getContacts, markContactRead, deleteContact } from '../../api/contacts';
import { errorMessage } from './adminUtils';
import Icon from '../../components/Icon';

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    let active = true;
    getContacts({ page }).then(({ data }) => {
      if (!active) return;
      setContacts(data.data);
      setMeta(data.meta || null);
      setError('');
    }).catch(err => { if (active) setError(errorMessage(err, 'Could not load messages. Please try again.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, refresh]);

  async function markRead(contact) {
    setSaving(true);
    setError('');
    try {
      await markContactRead(contact.id);
      setContacts(previous => previous.map(item => item.id === contact.id ? { ...item, is_read: true } : item));
      setSuccess('Message marked as read.');
    } catch (err) { setError(errorMessage(err, 'Could not update this message. Please try again.')); }
    finally { setSaving(false); }
  }

  async function remove(contact) {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await deleteContact(contact.id);
      setConfirmDelete(null);
      setSuccess('Message deleted.');
      setLoading(true);
      if (contacts.length === 1 && page > 1) setPage(value => value - 1);
      else setRefresh(value => value + 1);
    } catch (err) { setError(errorMessage(err, 'Could not delete this message. Please try again.')); }
    finally { setSaving(false); }
  }

  const changePage = next => { setLoading(true); setConfirmDelete(null); setPage(next); };
  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">YOUR INBOX</p><h1>Messages</h1><p>Conversations start here. Read enquiries from your contact form.</p></div></div>
      {error && <div className="admin-notice admin-notice-error" role="alert"><p>{error}</p><button className="admin-button admin-button-small" onClick={() => { setLoading(true); setRefresh(value => value + 1); }}>Reload messages</button></div>}
      {success && <p className="admin-notice admin-notice-success" role="status">{success}</p>}
      {loading ? <p className="admin-loading" role="status">Loading messages…</p> : !contacts.length && !error ? <div className="admin-empty"><Icon name="mail" size={34} /><h2>You are all caught up.</h2><p>New messages will appear here when someone contacts you.</p></div> : <div className="admin-inbox">{contacts.map(contact => (
        <article className="admin-panel admin-message" key={contact.id}>
          <details><summary><span className="admin-message-title"><span className={`admin-badge ${contact.is_read ? '' : 'is-published'}`}>{contact.is_read ? 'Read' : 'New'}</span><strong>{contact.subject || 'Website enquiry'}</strong></span><span className="admin-message-meta">{contact.name} · {new Date(contact.created_at).toLocaleDateString()}</span></summary><div className="admin-message-body"><a href={`mailto:${contact.email}`} className="admin-text-link">{contact.email}</a><p>{contact.message}</p></div></details>
          <div className="admin-row-actions">{!contact.is_read && <button className="admin-button admin-button-small" disabled={saving} onClick={() => markRead(contact)}>Mark as read</button>}<a className="admin-button admin-button-small" href={`mailto:${contact.email}?subject=${encodeURIComponent(`Re: ${contact.subject || 'Website enquiry'}`)}`}>Reply by email</a><button className="admin-button admin-button-small admin-button-danger" disabled={saving} onClick={() => setConfirmDelete(contact.id)}>Delete<span className="admin-sr-only"> message from {contact.name}</span></button></div>
          {confirmDelete === contact.id && <div className="admin-delete-confirm" role="group" aria-label="Confirm message deletion"><p>Delete this message from {contact.name}? This cannot be undone.</p><div className="admin-row-actions"><button className="admin-button admin-button-small admin-button-danger" disabled={saving} onClick={() => remove(contact)}>{saving ? 'Deleting…' : 'Delete permanently'}</button><button className="admin-button admin-button-small" disabled={saving} onClick={() => setConfirmDelete(null)}>Keep it</button></div></div>}
        </article>
      ))}</div>}
      {meta?.last_page > 1 && <div className="admin-pagination"><button className="admin-button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Previous</button><span>Page {meta.current_page} of {meta.last_page}</span><button className="admin-button" disabled={page >= meta.last_page || loading} onClick={() => changePage(page + 1)}>Next</button></div>}
    </>
  );
}
