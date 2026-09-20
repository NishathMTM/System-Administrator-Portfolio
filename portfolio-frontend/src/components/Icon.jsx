const paths = {
  headset: <><path d="M4 13v-2a8 8 0 0 1 16 0v6a4 4 0 0 1-4 4h-3"/><rect x="2" y="10" width="5" height="8" rx="2"/><rect x="17" y="10" width="5" height="8" rx="2"/><path d="M10 21h3"/></>,
  tools: <><path d="m14 6 4 4 3-3a6 6 0 0 1-8 7l-7 7-3-3 7-7a6 6 0 0 1 7-8l-3 3Z"/></>,
  network: <><rect x="8" y="3" width="8" height="6" rx="1.5"/><rect x="2" y="16" width="7" height="5" rx="1.5"/><rect x="15" y="16" width="7" height="5" rx="1.5"/><path d="M12 9v4M5.5 16v-3h13v3"/></>,
  route: <><circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h5M16 3l2 2-2 2"/></>,
  shield: <><path d="m12 3 8 3v5c0 5-4.5 8.5-8 10-3.5-1.5-8-5-8-10V6l8-3Z"/><path d="m8.5 11.5 2.5 2.5 4.5-5"/></>,
  server: <><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></>,
  terminal: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m6 0h4"/></>,
  monitor: <><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5M8 21h8M6 12l3-3 3 2 5-5"/></>,
  'arrow-up-right': <path d="M6 18 18 6M6 6h12v12"/>,
  'arrow-right': <path d="M4 12h16m-6-6 6 6-6 6"/>,
  'arrow-left': <path d="M20 12H4m6-6-6 6 6 6"/>,
  'arrow-down': <path d="M12 4v16m-6-6 6 6 6-6"/>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
  book: <><path d="M12 5v16M3 3h5l4 2 4-2h5v16h-5l-4 2-4-2H3V3Z"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-10v.01M11 17v-7m0 3a3 3 0 0 1 6 0v4"/></>,
};

export default function Icon({ name = 'network', size = 22, className = '', ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} {...props}>{paths[name] || paths.network}</svg>;
}
