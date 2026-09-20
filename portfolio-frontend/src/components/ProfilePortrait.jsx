import { useState } from 'react';
import { usePortfolio, defaultProfile } from '../context/portfolioContext';

function PortraitImage({ src, name, className }) {
  const [failed, setFailed] = useState(false);
  return <img className={className} src={failed ? defaultProfile.profile_image : src} alt={`${name} — networking and IT support professional`} width="1148" height="1370" fetchPriority="high" onError={() => setFailed(true)}/>;
}

export default function ProfilePortrait({ className = '' }) {
  const profile = usePortfolio();
  return <PortraitImage key={profile.profile_image} src={profile.profile_image || defaultProfile.profile_image} name={profile.full_name} className={className}/>;
}
