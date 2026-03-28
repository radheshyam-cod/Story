export const platforms = [
  { name: 'Wikipedia', year: 2001, color: '#00f0ff', users: '60M editors', desc: 'Collaborative knowledge — the read/write web begins', icon: '📖' },
  { name: 'Facebook', year: 2004, color: '#3b82f6', users: '3B users', desc: 'Social graph — monetizing human connection', icon: '👥' },
  { name: 'YouTube', year: 2005, color: '#ef4444', users: '2.7B users', desc: 'User-generated video at planetary scale', icon: '🎥' },
  { name: 'Twitter', year: 2006, color: '#10b981', users: '400M users', desc: 'Real-time public discourse, 280 chars at a time', icon: '🐦' },
  { name: 'iPhone', year: 2007, color: '#7a5cff', users: '1.4B devices', desc: 'The web goes mobile — everything changes', icon: '📱' },
  { name: 'Instagram', year: 2010, color: '#ec4899', users: '2B users', desc: 'Visual social network — the attention economy peaks', icon: '📸' },
];

export const dataFlowItems = [
  { action: 'You scroll Facebook', extraction: 'Time-on-screen, scroll speed, eye tracking proxies' },
  { action: 'You search Google', extraction: 'Intent signals, location, browsing history, psychographic profile' },
  { action: 'You like a post', extraction: 'Emotional state, relationship graph, political leanings' },
  { action: 'You use Google Maps', extraction: 'Physical location history, daily routine, home & work addresses' },
];

export const retroPosts = [
  {
    id: 1,
    title: 'June 2007: iPhone puts the web in your pocket',
    body: 'Multi-touch Safari made desktop-era feeds suddenly feel cramped. Designers scrambled to shrink nav bars, reflow columns, and ship “m dot” sites.',
    meta: 'Steve Jobs keynote · AT&T exclusive',
  },
  {
    id: 2,
    title: '2008–2009: App Store + Android spark the gold rush',
    body: 'RSS readers, Facebook, and YouTube landed on home screens. The feed became the new homepage, and push notifications stole time from the open web.',
    meta: '1M apps by 2011 · SDKs everywhere',
  },
  {
    id: 3,
    title: 'Walled gardens take shape',
    body: 'Links started opening in in-app browsers. Identity, payments, and distribution moved behind platform rules — data stayed inside the garden.',
    meta: '30% store tax · single sign-on · closed data pipes',
  },
];

export const retroLinks = ['News Feed', 'Photos', 'Groups', 'Marketplace', 'Events'];
export const trendingTopics = ['#iphone2007', '#appstore', '#socialfeed', '#touchui', '#walledgarden'];
export const friendSuggestions = ['Chris (Design)', 'Sam (Android dev)', 'Priya (iOS SDK)', 'Alex (PM)'];
