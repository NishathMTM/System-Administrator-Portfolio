import { useParams } from 'react-router-dom';
import ContentManager from './ContentManager';

export default function BlogsManager({ mode = 'list' }) {
  const { id } = useParams();
  return <ContentManager key={`${mode}-${id || ''}`} kind="note" mode={mode} id={id} />;
}
