import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProfile } from '../api/profile';
import { defaultProfile, normalizeProfile, PortfolioContext, PortfolioActionsContext } from './portfolioContext';

export default function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  const updatePublicProfile = useCallback(source => setProfile(normalizeProfile(source?.data || source)), []);
  const refreshProfile = useCallback(async () => {
    const { data } = await getProfile();
    updatePublicProfile(data);
  }, [updatePublicProfile]);
  const actions = useMemo(() => ({ updatePublicProfile, refreshProfile }), [updatePublicProfile, refreshProfile]);

  useEffect(() => {
    let active = true;
    getProfile().then(({ data }) => {
      if (active) updatePublicProfile(data);
    }).catch(() => { /* Keep the neutral profile when no public profile is available. */ });
    return () => { active = false; };
  }, [updatePublicProfile]);

  useEffect(() => {
    document.title = `${profile.full_name || 'Network'} | ${profile.title}`;
  }, [profile]);

  return <PortfolioActionsContext.Provider value={actions}><PortfolioContext.Provider value={profile}>{children}</PortfolioContext.Provider></PortfolioActionsContext.Provider>;
}
