// Illustrative learning material, deliberately separate from published portfolio work.
export const networkLabs = [
  {
    slug: 'vlan-segmentation',
    title: 'A more organized network.',
    category: 'LAN architecture',
    icon: 'network',
    description: 'Explore how VLANs separate users, services, and management traffic into a clear, manageable network.',
    tags: ['VLANs', 'Switching', 'IP addressing'],
    topology: ['USERS', 'SERVICES', 'MANAGEMENT'],
    objective: 'Design a small practice network with separate user, server, and management VLANs. Create an addressing plan, connect the segments, and verify exactly which traffic is allowed between them.',
    steps: [
      { title: 'Map the network', description: 'Sketch the switches, router, and endpoints. Assign a distinct private subnet and VLAN ID to each segment, and record each default gateway.' },
      { title: 'Configure the switching layer', description: 'Create the VLANs and assign endpoint ports to their intended segment. Configure the uplinks as trunks with an explicit list of allowed VLANs.' },
      { title: 'Define inter-VLAN access', description: 'Configure gateways and routing in a lab environment. Add access rules based on a written policy, such as allowing users to reach services while restricting management access.' },
      { title: 'Test and document', description: 'Check address assignment, gateway reachability, and permitted application traffic. Test that restricted connections are blocked and save a labeled topology with your results.' },
    ],
    checks: ['Each endpoint receives the intended subnet.', 'Access and trunk ports match the topology.', 'Allowed connections succeed across VLANs.', 'Restricted management access is blocked.', 'Configuration and test results are documented.'],
  },
  {
    slug: 'site-to-site-connectivity',
    title: 'Two sites. One connection.',
    category: 'WAN connectivity',
    icon: 'route',
    description: 'Plan the routing and secure connectivity that bring two separate office networks together.',
    tags: ['Routing', 'VPN concepts', 'WAN'],
    topology: ['SITE A', 'WAN', 'SITE B'],
    objective: 'Model two office networks with distinct private subnets and a simulated WAN. Understand how route selection, tunnel configuration, and access policies affect connectivity between sites.',
    steps: [
      { title: 'Plan both sites', description: 'Choose non-overlapping address ranges and document the local gateways, WAN endpoints, and services that need to communicate.' },
      { title: 'Establish routed connectivity', description: 'Configure the lab interfaces and routes. Verify next-hop reachability in both directions before adding the tunnel or additional access policies.' },
      { title: 'Add a secure tunnel', description: 'In a supported lab platform, configure a site-to-site VPN using matching peer, authentication, and encryption settings. Limit the tunnel policy to the intended networks.' },
      { title: 'Verify both directions', description: 'Test permitted traffic from each site, inspect tunnel counters and routes, and observe what happens when the simulated WAN connection is interrupted.' },
    ],
    checks: ['Site address ranges do not overlap.', 'Forward and return routes are present.', 'Tunnel parameters match at both ends.', 'Only intended traffic traverses the tunnel.', 'Connection recovery is tested and recorded.'],
  },
  {
    slug: 'network-troubleshooting',
    title: 'Find the fault. Restore the flow.',
    category: 'Network operations',
    icon: 'terminal',
    description: 'Use a structured troubleshooting workflow to move from a connectivity symptom to a verified resolution.',
    tags: ['Diagnostics', 'DNS & DHCP', 'Monitoring'],
    topology: ['ENDPOINT', 'GATEWAY', 'SERVICE'],
    objective: 'Practice diagnosing a controlled connectivity fault in a lab. Gather evidence, isolate the failing layer, change one variable at a time, and verify service restoration from the user’s perspective.',
    steps: [
      { title: 'Define the symptom', description: 'Record which device, application, and destination are affected. Check whether the issue impacts a single endpoint, a subnet, or the whole practice network.' },
      { title: 'Inspect from the endpoint outward', description: 'Check link state, IP configuration, subnet mask, and gateway. Compare local gateway reachability with remote IP reachability before investigating name resolution.' },
      { title: 'Follow the evidence', description: 'Use appropriate diagnostics such as ping, traceroute, DNS lookup, interface counters, and logs. Compare findings against the documented topology and an unaffected endpoint.' },
      { title: 'Resolve and retest', description: 'Apply the smallest justified configuration change. Repeat the original failing test, confirm adjacent services still work, and record the cause, change, and evidence.' },
    ],
    checks: ['The impact and symptoms are recorded.', 'Addressing and link state are checked.', 'Routing and DNS are tested separately.', 'The original application test now succeeds.', 'The resolution includes supporting evidence.'],
  },
  {
    slug: 'it-support-workflow',
    title: 'Solve the issue. Support the person.',
    category: 'IT support',
    icon: 'headset',
    description: 'Work through a desktop support scenario from the first conversation to a clear, documented resolution.',
    tags: ['IT support', 'Diagnostics', 'Documentation'],
    topology: ['PERSON', 'DEVICE', 'SERVICE'],
    objective: 'Practice responding to a user who cannot access a shared service in a controlled lab. Focus on understanding the impact, checking the basics, communicating clearly, and confirming the person can complete their task.',
    steps: [
      { title: 'Listen and record', description: 'Ask what the person was trying to do, capture the exact error, and establish when the issue began. Record the affected device and whether other people have the same problem.' },
      { title: 'Check the essentials', description: 'Verify power, cables, connectivity, and the correct account. Check whether the service works from another test device before changing settings.' },
      { title: 'Investigate with care', description: 'Review relevant application messages and system logs. Explain the next step, make one justified change at a time, and escalate issues outside the support scope with the evidence collected.' },
      { title: 'Confirm and document', description: 'Ask the person to repeat the original task. Document the symptoms, the change, and the result so the same issue is easier to resolve next time.' },
    ],
    checks: ['The impact and exact error are recorded.', 'Basic device and connection checks are complete.', 'Changes are explained and documented.', 'The person can complete the original task.', 'Any escalation includes relevant evidence.'],
  },
];

export const normalizeTags = value => {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(tag => typeof tag === 'string' ? tag : tag?.name).filter(Boolean))];
};
