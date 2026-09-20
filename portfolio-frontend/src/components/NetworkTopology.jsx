import { useId, useState } from 'react';
import Icon from './Icon';

const nodes = {
  internet: { label: 'Internet', icon: 'globe', detail: 'The connection beyond the local network. Traffic enters through the network edge.', code: '01 / NETWORK EDGE', x: 50, y: 12 },
  firewall: { label: 'Firewall', icon: 'shield', detail: 'A security boundary that controls which traffic can enter or leave the network.', code: '02 / SECURITY LAYER', x: 50, y: 37 },
  switch: { label: 'Core switch', icon: 'network', detail: 'The central connection between local devices, servers, and the network edge.', code: '03 / DISTRIBUTION', x: 50, y: 64 },
  server: { label: 'Server', icon: 'server', detail: 'The services and shared resources that support the people using the network.', code: '04 / INFRASTRUCTURE', x: 17, y: 84 },
  endpoint: { label: 'Workstation', icon: 'monitor', detail: 'An endpoint on the local network, connected to the services people use every day.', code: '05 / ACCESS LAYER', x: 83, y: 84 },
};

export default function NetworkTopology() {
  const [selected, setSelected] = useState('switch');
  const id = useId();
  const node = nodes[selected];
  return <div className="topology-card">
    <div className="topology-toolbar"><span><span className="status-dot"/> NETWORK TOPOLOGY</span><span>INTERACTIVE DEMO</span></div>
    <div className="topology-canvas">
      <span className="diagram-label diagram-label-left">WAN / LAN</span><span className="diagram-label diagram-label-right">LOGICAL VIEW</span>
      <svg className="topology-lines" viewBox="0 0 500 360" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id={`${id}-line`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="360"><stop stopColor="#b9f47a"/><stop offset="1" stopColor="#376d67"/></linearGradient></defs>
        <g fill="none" stroke={`url(#${id}-line)`} strokeWidth="1.5"><path d="M250 43V230"/><path d="M250 230v32H85v40M250 262h165v40"/></g>
        <g className="packet-lines" fill="none" stroke="#c3fa98" strokeWidth="2.5" strokeDasharray="4 75"><path d="M250 43V230v32H85v40"/><path d="M250 230v32h165v40"/></g>
        <g fill="#b9f47a"><circle cx="250" cy="262" r="3"/><circle cx="85" cy="262" r="2"/><circle cx="415" cy="262" r="2"/></g>
      </svg>
      <span className="connection-label">SECURE GATEWAY</span>
      {Object.entries(nodes).map(([key, item]) => <button key={key} type="button" className={`topology-node ${key === selected ? 'is-selected' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => setSelected(key)} aria-pressed={selected === key} aria-describedby={`${id}-detail`}><span className="node-icon"><Icon name={item.icon} size={25}/><i/></span><span className="node-label">{item.label}</span></button>)}
      <span className="subnet-label">LOCAL NETWORK / 192.168.10.0/24</span>
    </div>
    <div className="topology-detail" id={`${id}-detail`} aria-live="polite"><span className="topology-detail-icon"><Icon name={node.icon}/></span><div><span className="mono">{node.code}</span><p>{node.detail}</p></div></div>
    <div className="topology-foot"><span><span className="tiny-cross">+</span> Select a device to explore</span><span>5 NODES · 4 LINKS</span></div>
  </div>;
}
