import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile } from '../../api/profile';
import { safeWebUrl, usePortfolioActions } from '../../context/portfolioContext';
import { errorMessage, splitList } from './adminUtils';

const emptyProfile = {
  full_name: '', title: '', bio: '', about_heading: '', about_body: '', skills: '',
  experience: '', education: '', certifications: '', github_url: '', linkedin_url: '', twitter_url: '',
  profile_image: null, resume_file: null,
};

function toForm(profile) {
  return { ...emptyProfile, ...Object.fromEntries(Object.keys(emptyProfile).filter(key => !['skills', 'profile_image', 'resume_file'].includes(key)).map(key => [key, profile[key] || ''])), skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '' };
}

export default function ProfileManager() {
  const { updatePublicProfile } = usePortfolioActions();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [retry, setRetry] = useState(0);
  const [fileKey, setFileKey] = useState(0);

  useEffect(() => {
    let active = true;
    getProfile().then(({ data }) => {
      if (!active) return;
      setProfile(data.data);
      setForm(toForm(data.data));
      setError('');
    }).catch(err => {
      if (active) setError(errorMessage(err, 'Could not load your profile. Please try again.'));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);

  function change(event) {
    const { name, value, files } = event.target;
    setForm(previous => ({ ...previous, [name]: files ? files[0] || null : value }));
    setSuccess('');
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const payload = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value !== null) payload.append(key, key === 'skills' ? JSON.stringify(splitList(value)) : value);
    }
    try {
      const { data } = await updateProfile(payload);
      const updated = data.data;
      setProfile(updated);
      setForm(toForm(updated));
      updatePublicProfile(updated);
      setFileKey(previous => previous + 1);
      setSuccess('Profile saved. Your changes are now visible on the website.');
    } catch (err) {
      setError(errorMessage(err, 'Could not save your profile. Your edits are still here; please try again.'));
    } finally { setSaving(false); }
  }

  if (loading) return <p className="admin-loading" role="status">Loading your profile…</p>;
  if (!profile) return <div className="admin-panel"><p className="admin-notice admin-notice-error" role="alert">{error}</p><button className="admin-button" onClick={() => { setLoading(true); setRetry(value => value + 1); }}>Try again</button></div>;
  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">YOUR STORY</p><h1>About & profile</h1><p>Make your experience and personality part of your portfolio.</p></div><Link className="admin-button" to="/about">View About page</Link></div>
      {error && <p className="admin-notice admin-notice-error" role="alert">{error}</p>}
      {success && <p className="admin-notice admin-notice-success" role="status">{success}</p>}
      <form className="admin-form" onSubmit={submit} encType="multipart/form-data">
        <fieldset disabled={saving}>
          <section className="admin-panel"><div className="admin-panel-heading"><h2>The introduction</h2><p>These details appear on your Home and About pages.</p></div>
            <div className="admin-form-grid"><label className="admin-field">Full name<input name="full_name" value={form.full_name} onChange={change} required maxLength={255} autoComplete="name" /></label><label className="admin-field">Professional title<input name="title" value={form.title} onChange={change} placeholder="Networking & IT Support Professional" maxLength={255} /></label></div>
            <label className="admin-field">Home introduction<textarea name="bio" value={form.bio} onChange={change} rows={3} /></label>
            <label className="admin-field">About heading<input name="about_heading" value={form.about_heading} onChange={change} maxLength={255} /></label>
            <label className="admin-field">About you<textarea name="about_body" value={form.about_body} onChange={change} rows={6} /><small>Tell your story in your own words. Paragraphs are preserved.</small></label>
            <label className="admin-field">Skills<input name="skills" value={form.skills} onChange={change} placeholder="Networking, IT support, Troubleshooting" /><small>Separate each skill with a comma.</small></label>
          </section>
          <section className="admin-panel"><div className="admin-panel-heading"><h2>Experience & qualifications</h2><p>Add the details you want visitors to see on your About page.</p></div>
            <label className="admin-field">Experience<textarea name="experience" value={form.experience} onChange={change} rows={5} placeholder="Role, organisation, dates, and what you worked on" /></label>
            <label className="admin-field">Education<textarea name="education" value={form.education} onChange={change} rows={4} /></label>
            <label className="admin-field">Certifications<textarea name="certifications" value={form.certifications} onChange={change} rows={4} /></label>
          </section>
          <section className="admin-panel"><div className="admin-panel-heading"><h2>Photo & CV</h2><p>Keep your portrait and downloadable CV up to date.</p></div>
            <div className="admin-media-fields"><img className="admin-profile-preview" src={safeWebUrl(profile.profile_image) || `${import.meta.env.BASE_URL}images/mohamed-nishath.png`} alt="Current profile portrait" /><div>
              <label className="admin-field">Replace profile photo<input key={`photo-${fileKey}`} type="file" name="profile_image" accept="image/jpeg,image/png,image/gif" onChange={change} /><small>JPEG, PNG, or GIF, up to 2 MB. Leave empty to keep your current photo.</small></label>
              <label className="admin-field">Upload CV<input key={`cv-${fileKey}`} type="file" name="resume_file" accept=".pdf,.doc,.docx" onChange={change} /><small>PDF, DOC, or DOCX, up to 5 MB.</small></label>
              {safeWebUrl(profile.resume_file) && <a className="admin-text-link" href={safeWebUrl(profile.resume_file)} target="_blank" rel="noopener noreferrer">View current CV ↗</a>}
            </div></div>
          </section>
          <section className="admin-panel"><div className="admin-panel-heading"><h2>Social links</h2><p>Use complete links, including https://.</p></div><div className="admin-form-grid">
            <label className="admin-field">LinkedIn<input name="linkedin_url" type="url" value={form.linkedin_url} onChange={change} /></label>
            <label className="admin-field">GitHub<input name="github_url" type="url" value={form.github_url} onChange={change} /></label>
            <label className="admin-field">X / Twitter<input name="twitter_url" type="url" value={form.twitter_url} onChange={change} /></label>
          </div></section>
          <div className="admin-save-bar"><p>Saving publishes your profile changes.</p><button className="admin-button admin-button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button></div>
        </fieldset>
      </form>
    </>
  );
}
