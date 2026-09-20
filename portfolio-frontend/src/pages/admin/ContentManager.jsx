import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAdminProjects, getAdminProject, createProject, updateProject, deleteProject } from '../../api/projects';
import { getAdminBlogs, getAdminBlog, createBlog, updateBlog, deleteBlog } from '../../api/blogs';
import { safeWebUrl } from '../../context/portfolioContext';
import { errorMessage, splitList } from './adminUtils';
import Icon from '../../components/Icon';
import ContentImage from '../../components/ContentImage';

const configurations = {
  project: { path: '/admin/projects', publicPath: '/projects', plural: 'Projects', list: getAdminProjects, get: getAdminProject, create: createProject, update: updateProject, remove: deleteProject },
  note: { path: '/admin/blogs', publicPath: '/blogs', plural: 'Technical notes', list: getAdminBlogs, get: getAdminBlog, create: createBlog, update: updateBlog, remove: deleteBlog },
};
const initialForm = { title: '', description: '', content: '', github_link: '', live_link: '', technologies: '', is_featured: false, is_published: false, status: 'draft', published_at: '', meta_description: '', featured_image: null };

export default function ContentManager({ kind, mode, id }) {
  const config = configurations[kind];
  const isProject = kind === 'project';
  const isList = mode === 'list';
  const isEdit = mode === 'edit';
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(mode !== 'create');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  const [success, setSuccess] = useState(location.state?.notice || '');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!isList && !isEdit) return;
    let active = true;
    const request = isList ? config.list({ page }) : config.get(id);
    request.then(({ data }) => {
      if (!active) return;
      if (isList) {
        setItems(data.data);
        setMeta(data.meta || null);
      } else {
        const item = data.data;
        setRecord(item);
        setForm({ ...initialForm, ...item, technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : '', github_link: item.github_link || '', live_link: item.live_link || '', meta_description: item.meta_description || '', published_at: item.published_at ? item.published_at.slice(0, 16) : '', featured_image: null });
      }
      setError('');
      setLoadFailed(false);
    }).catch(err => { if (active) { setError(errorMessage(err, `Could not load ${isList ? config.plural.toLowerCase() : `this ${kind}`}. Please try again.`)); setLoadFailed(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [config, id, isEdit, isList, kind, page, refresh]);

  function change(event) {
    const { name, value, files, type, checked } = event.target;
    setForm(previous => ({ ...previous, [name]: type === 'checkbox' ? checked : files ? files[0] || null : value }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = new FormData();
    const fields = isProject ? ['title', 'description', 'github_link', 'live_link'] : ['title', 'content', 'status', 'published_at', 'meta_description'];
    for (const field of fields) payload.append(field, form[field]);
    if (isProject) {
      payload.append('technologies', JSON.stringify(splitList(form.technologies)));
      payload.append('is_featured', form.is_featured ? '1' : '0');
      payload.append('is_published', form.is_published ? '1' : '0');
    }
    if (form.featured_image) payload.append('featured_image', form.featured_image);
    try {
      if (isEdit) await config.update(id, payload);
      else await config.create(payload);
      navigate(config.path, { state: { notice: `${isProject ? 'Project' : 'Note'} saved${(isProject ? form.is_published : form.status === 'published') ? ' and published' : ' as a draft'}.` } });
    } catch (err) { setError(errorMessage(err, `Could not save this ${kind}. Your edits are still here; please try again.`)); }
    finally { setSaving(false); }
  }

  async function remove(item) {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await config.remove(item.id);
      setConfirmDelete(null);
      setSuccess(`“${item.title}” was deleted.`);
      setLoading(true);
      if (items.length === 1 && page > 1) setPage(value => value - 1);
      else setRefresh(value => value + 1);
    } catch (err) { setError(errorMessage(err, `Could not delete this ${kind}. Please try again.`)); }
    finally { setSaving(false); }
  }

  const changePage = next => { setLoading(true); setConfirmDelete(null); setPage(next); };
  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">{isProject ? 'YOUR WORK' : 'YOUR KNOWLEDGE'}</p><h1>{isList ? config.plural : `${isEdit ? 'Edit' : 'New'} ${kind}`}</h1><p>{isList ? `Manage ${isProject ? 'your networking and IT support projects' : 'your technical articles and troubleshooting guides'}.` : 'Draft your content, then publish when you are ready.'}</p></div>{isList ? <Link to={`${config.path}/create`} className="admin-button admin-button-primary">Add {kind}<Icon name="arrow-right" size={16} /></Link> : <Link to={config.path} className="admin-button">Back to {isProject ? 'projects' : 'notes'}</Link>}</div>
      {error && <p className="admin-notice admin-notice-error" role="alert">{error}</p>}
      {success && isList && <p className="admin-notice admin-notice-success" role="status">{success}</p>}
      {loading ? <p className="admin-loading" role="status">Loading {isList ? config.plural.toLowerCase() : kind}…</p> : loadFailed ? <button className="admin-button" onClick={() => { setLoading(true); setRefresh(value => value + 1); }}>Try again</button> : isList ? (
        <>
          {!items.length ? <div className="admin-empty"><Icon name={isProject ? 'network' : 'book'} size={34} /><h2>No {isProject ? 'projects' : 'notes'} yet</h2><p>Your next idea starts here. Add your first {kind}.</p><Link className="admin-button" to={`${config.path}/create`}>Create {kind}</Link></div> : <div className="admin-panel admin-table-panel"><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th scope="col">Title</th><th scope="col">Visibility</th>{isProject && <th scope="col">Featured</th>}<th scope="col">Actions</th></tr></thead><tbody>{items.map(item => (
            <tr key={item.id}><td><strong>{item.title}</strong><small>{isProject ? (item.technologies || []).join(' · ') : item.meta_description}</small></td><td><span className={`admin-badge ${(isProject ? item.is_published : item.status === 'published') ? 'is-published' : ''}`}>{(isProject ? item.is_published : item.status === 'published') ? 'Published' : 'Draft'}</span></td>{isProject && <td>{item.is_featured ? 'Yes' : '—'}</td>}<td><div className="admin-row-actions"><Link className="admin-button admin-button-small" to={`${config.path}/edit/${item.id}`}>Edit<span className="admin-sr-only"> {item.title}</span></Link>{(isProject ? item.is_published : item.status === 'published') && <Link className="admin-button admin-button-small" to={`${config.publicPath}/${item.slug}`}>View<span className="admin-sr-only"> {item.title}</span></Link>}<button className="admin-button admin-button-small admin-button-danger" disabled={saving} onClick={() => setConfirmDelete(item.id)}>Delete<span className="admin-sr-only"> {item.title}</span></button></div>{confirmDelete === item.id && <div className="admin-delete-confirm" role="group" aria-label={`Confirm deletion of ${item.title}`}><p>Delete “{item.title}”? This cannot be undone.</p><div className="admin-row-actions"><button className="admin-button admin-button-small admin-button-danger" onClick={() => remove(item)} disabled={saving}>{saving ? 'Deleting…' : 'Delete permanently'}</button><button className="admin-button admin-button-small" onClick={() => setConfirmDelete(null)} disabled={saving}>Keep it</button></div></div>}</td></tr>
          ))}</tbody></table></div></div>}
          {meta?.last_page > 1 && <div className="admin-pagination"><button className="admin-button" disabled={page <= 1} onClick={() => changePage(page - 1)}>Previous</button><span>Page {meta.current_page} of {meta.last_page}</span><button className="admin-button" disabled={page >= meta.last_page} onClick={() => changePage(page + 1)}>Next</button></div>}
        </>
      ) : <form className="admin-form" onSubmit={save} encType="multipart/form-data"><fieldset disabled={saving}>
        <section className="admin-panel"><div className="admin-panel-heading"><h2>{isProject ? 'Project details' : 'Write your note'}</h2><p>{isProject ? 'Explain the problem, your approach, and what you learned.' : 'Share clear, practical knowledge with your visitors.'}</p></div>
          <label className="admin-field">Title<input name="title" value={form.title} onChange={change} required maxLength={255} /></label>
          <label className="admin-field">{isProject ? 'Description' : 'Content'}<textarea name={isProject ? 'description' : 'content'} value={isProject ? form.description : form.content} onChange={change} required rows={10} /></label>
          {isProject ? <><label className="admin-field">Technologies & skills<input name="technologies" value={form.technologies} onChange={change} placeholder="Routing, Switching, IT support" /><small>Separate each item with a comma.</small></label><div className="admin-form-grid"><label className="admin-field">Repository link<input name="github_link" type="url" value={form.github_link} onChange={change} /></label><label className="admin-field">Project / demo link<input name="live_link" type="url" value={form.live_link} onChange={change} /></label></div></> : <label className="admin-field">Short summary<textarea name="meta_description" value={form.meta_description} onChange={change} rows={2} maxLength={160} /></label>}
          <label className="admin-field">Cover image<input name="featured_image" type="file" accept="image/jpeg,image/png,image/gif" onChange={change} /><small>JPEG, PNG, or GIF, up to 2 MB. Leave empty to keep an existing cover.</small></label>
          <ContentImage className="admin-cover-preview" src={safeWebUrl(record?.featured_image)} resetKey={record?.id} alt="Current cover" />
        </section>
        <section className="admin-panel"><div className="admin-panel-heading"><h2>Publishing</h2><p>Drafts are only visible in your admin workspace.</p></div>{isProject ? <><label className="admin-checkbox"><input type="checkbox" name="is_published" checked={form.is_published} onChange={change} /><span>Publish this project<small>Make it visible on the public Projects page.</small></span></label><label className="admin-checkbox"><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={change} /><span>Feature this project<small>Mark this as a highlight of your work.</small></span></label></> : <div className="admin-form-grid"><label className="admin-field">Visibility<select name="status" value={form.status} onChange={change}><option value="draft">Draft — private</option><option value="published">Published — public</option></select></label><label className="admin-field">Publication date (optional)<input name="published_at" type="datetime-local" value={form.published_at} onChange={change} /><small>This is the displayed date; publication follows the visibility setting.</small></label></div>}</section>
        <div className="admin-save-bar"><Link className="admin-button" to={config.path}>Cancel</Link><button className="admin-button admin-button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : `Save ${kind}`}</button></div>
      </fieldset></form>}
    </>
  );
}
