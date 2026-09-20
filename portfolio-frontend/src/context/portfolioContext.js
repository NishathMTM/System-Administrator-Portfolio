import { createContext, useContext } from 'react';

export const defaultProfile = {
  full_name: 'Mohamed Nishath',
  title: 'Networking & IT Support Professional',
  bio: 'Connecting systems. Supporting people. A practical approach to networking, IT support, and the technology that keeps everyday work moving.',
  about_heading: 'Technology works best when it works for people.',
  about_body: 'My professional direction brings together networking and IT support: understanding how systems communicate, resolving everyday technical challenges, and helping people get the most from their technology.\n\nThis portfolio is a space for my practical work, professional journey, and the ideas I explore along the way.',
  skills: ['Networking', 'IT support', 'Troubleshooting'],
  experience: '',
  education: '',
  certifications: '',
  profile_image: '/images/mohamed-nishath.png',
  resume_file: '',
  linkedin_url: '',
  github_url: '',
};

export const PortfolioContext = createContext(defaultProfile);
export const usePortfolio = () => useContext(PortfolioContext);
export const PortfolioActionsContext = createContext({ updatePublicProfile: () => {}, refreshProfile: async () => {} });
export const usePortfolioActions = () => useContext(PortfolioActionsContext);

export function normalizeProfile(source) {
  const next = { ...defaultProfile };
  if (!source || source.full_name === 'Your Full Name') return next;
  ['full_name', 'title', 'bio', 'about_heading', 'about_body', 'experience', 'education', 'certifications'].forEach(key => {
    if (key === 'title' && source[key] === 'Web Developer') return;
    if (key === 'bio' && source[key] === 'i am a full stack Developer') return;
    if (typeof source[key] === 'string') next[key] = source[key].trim();
    else if (Object.hasOwn(source, key) && !['full_name', 'title'].includes(key)) next[key] = '';
  });
  if (Array.isArray(source.skills)) next.skills = source.skills.filter(item => typeof item === 'string' && item.trim());
  ['profile_image', 'resume_file', 'linkedin_url', 'github_url'].forEach(key => {
    if (typeof source[key] === 'string' && !source[key].includes('yourusername')) next[key] = safeWebUrl(source[key]) || next[key];
  });
  return next;
}

export function safeWebUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.origin);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}
