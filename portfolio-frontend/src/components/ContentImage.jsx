import { useState } from 'react';
import Icon from './Icon';

function ImageWithFallback({ src, alt = '', className, loading, fallback }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    if (!fallback) return null;
    const isJournal = fallback === 'journal';
    return (
      <div className="content-project-cover" role="img" aria-label={isJournal ? 'Networking journal illustration' : 'Network topology illustration'}>
        <Icon name={isJournal ? 'book' : 'network'} />
        <span aria-hidden="true">{isJournal ? 'Networking / Journal' : 'Network / Project'}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} loading={loading} decoding="async" onError={() => setFailed(true)} />;
}

export default function ContentImage({ src, resetKey = '', ...props }) {
  // A new URL or record must retry the image rather than inherit an earlier failure.
  return <ImageWithFallback key={`${resetKey}:${src ?? ''}`} src={src} {...props} />;
}
