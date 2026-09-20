import { useParams } from 'react-router-dom';
import ContentManager from './ContentManager';

export default function ProjectsManager({ mode = 'list' }) {
  const { id } = useParams();
  return <ContentManager key={`${mode}-${id || ''}`} kind="project" mode={mode} id={id} />;
}
