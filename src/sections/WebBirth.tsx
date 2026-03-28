import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Code, Link, Shield, Cookie, Code2, Zap } from 'lucide-react';
import { ConceptTooltip } from '../components/ConceptTooltip';


export function WebBirth() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [timelineYear, setTimelineYear] = useState(1990);

  const technologies = [
    { id: 'html',       icon: Code,   title: 'HTML',       year: 1991, description: 'HyperText Markup Language — structured documents with hyperlinks enabling navigation between pages.' },
    { id: 'http',       icon: Globe,  title: 'HTTP',       year: 1991, description: 'HyperText Transfer Protocol — the request/response protocol for transmitting hypermedia across the network.' },
    { id: 'url',        icon: Link,   title: 'URL',        year: 1991, description: 'Uniform Resource Locator — standardized addressing to locate any resource on the web.' },
    { id: 'ssl',        icon: Shield, title: 'SSL',        year: 1994, description: 'Secure Sockets Layer — encryption enabling secure credit card transactions and private browsing.' },
    { id: 'cookies',    icon: Cookie, title: 'Cookies',    year: 1994, description: 'Browser cookies allowed state management — websites could remember users between sessions, enabling shopping carts and logins.' },
    { id: 'javascript', icon: Code2,  title: 'JavaScript', year: 1995, description: 'Created by Brendan Eich in just 10 days — brought interactive behavior to static web pages.' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth || 600;
    canvas.height = 280;

    const points = [
      { x: 0.05, y: 0.25 }, { x: 0.15, y: 0.30 }, { x: 0.25, y: 0.40 },
      { x: 0.35, y: 0.55 }, { x: 0.45, y: 0.70 }, { x: 0.55, y: 0.85 },
      { x: 0.62, y: 0.92 }, // Peak
      { x: 0.68, y: 0.72 }, { x: 0.75, y: 0.52 }, { x: 0.82, y: 0.35 }, { x: 0.95, y: 0.28 },
    ];

    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad + ((h - pad * 2) / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
    }

    // Fill area
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = pad + (w - pad * 2) * p.x;
      const y = h - pad - (h - pad * 2) * p.y;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(pad + (w - pad * 2) * points[points.length - 1].x, h - pad);
    ctx.lineTo(pad, h - pad);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, 0, 0, h);
    fill.addColorStop(0, 'rgba(245,158,11,0.3)');
    fill.addColorStop(1, 'rgba(239,68,68,0.05)');
    ctx.fillStyle = fill;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = pad + (w - pad * 2) * p.x;
      const y = h - pad - (h - pad * 2) * p.y;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#10b981');
    grad.addColorStop(0.55, '#f59e0b');
    grad.addColorStop(1, '#ef4444');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Peak dot
    const px = pad + (w - pad * 2) * 0.62;
    const py = h - pad - (h - pad * 2) * 0.92;
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NASDAQ 5048', px, py - 14);
    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.fillText('Mar 2000', px, py - 3);

    // Axis labels
    ctx.fillStyle = '#444';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ['1993', '1996', '1999', '2001', '2003'].forEach((label, i) => {
      ctx.fillText(label, pad + (w - pad * 2) * (0.1 + i * 0.22), h - 10);
    });
  }, []);

  const getYearContent = () => {
    if (timelineYear <= 1991) return {
      color: '#10b981',
      title: '1991: The Web is Born',
      body: 'Tim Berners-Lee releases HTML, HTTP, and the first website at CERN. The web is public.',
    };
    if (timelineYear <= 1993) return {
      color: '#10b981',
      title: '1993: NCSA Mosaic',
      body: 'The first graphical browser. Images in web pages. 600% growth in web traffic in 12 months.',
    };
    if (timelineYear <= 1995) return {
      color: '#00f0ff',
      title: '1994–1995: Commerce Arrives',
      body: 'Netscape IPO, SSL for secure payments, JavaScript for interactivity. The browser wars begin.',
    };
    if (timelineYear <= 1999) return {
      color: '#f59e0b',
      title: '1996–1999: Dot-com Mania',
      body: 'Venture capital floods the web. "Eyeballs" over revenue. Pets.com. Kozmo.com. Webvan.',
    };
    return {
      color: '#ef4444',
      title: '2000: The Crash',
      body: 'NASDAQ peaks March 10. Collapses 78%. $5 trillion evaporates. Only the survivors build Web 2.0.',
    };
  };

  const yearContent = getYearContent();

  return (
    <section
      id="web-birth"
      ref={sectionRef}
      className="relative min-h-screen py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #000000 0%, #001a0a 50%, #000000 100%)' }}
    >
      <div className="web-birth-parallax absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#10b981] rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#00f0ff] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Zap className="w-3 h-3 text-[#10b981]" />
              <span className="text-[#10b981] font-mono text-xs tracking-widest">1989 – 2001</span>
            </div>
            <h2
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#00f0ff]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700' }}
            >
              Web Birth
            </h2>
          </div>

          {/* Timeline Slider */}
          <div className="mb-16 p-6 rounded-xl" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <h3 className="text-center font-bold mb-6" style={{ color: '#10b981', fontSize: '1.2rem' }}>
              Scrub Through the 1990s
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600 font-mono text-sm w-10">1990</span>
              <div className="relative flex-1">
                <input
                  type="range"
                  min={1990}
                  max={2000}
                  value={timelineYear}
                  onChange={(e) => setTimelineYear(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  data-cursor="drag"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(timelineYear - 1990) * 10}%, #1f2937 ${(timelineYear - 1990) * 10}%, #1f2937 100%)`,
                    accentColor: '#10b981',
                  }}
                />
              </div>
              <span className="text-gray-600 font-mono text-sm w-10 text-right">2000</span>
              <div
                className="px-3 py-1.5 rounded-lg font-mono font-bold text-lg min-w-[70px] text-center"
                style={{
                  color: yearContent.color,
                  background: `${yearContent.color}12`,
                  border: `1px solid ${yearContent.color}40`,
                }}
              >
                {timelineYear}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={timelineYear}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="p-5 rounded-lg"
                style={{
                  background: `${yearContent.color}08`,
                  border: `1px solid ${yearContent.color}30`,
                }}
              >
                <h4 className="font-bold mb-2" style={{ color: yearContent.color }}>
                  {yearContent.title}
                </h4>
                <p className="text-gray-400 text-sm">{yearContent.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tim Berners-Lee */}
          <div className="mb-12 p-8 rounded-xl" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <h3 className="font-bold mb-3" style={{ color: '#10b981', fontSize: '1.3rem' }}>
              Tim Berners-Lee: The Information Mesh
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              In 1989, Berners-Lee proposed a distributed hypertext system using{' '}
              <ConceptTooltip
                term="HTTP"
                short="Protocol for transferring hypertext"
                detail="HyperText Transfer Protocol defines how messages are formatted and transmitted on the web. HTTP is stateless — each request is independent. This simplicity enabled massive scalability. HTTPS adds TLS encryption, securing ~95% of web traffic today."
                color="#10b981"
              />
              ,{' '}
              <ConceptTooltip
                term="HTML"
                short="The language of the web"
                detail="HyperText Markup Language describes the structure of web pages. The key innovation: hyperlinks. By embedding links in documents, Berners-Lee created a web of interconnected information — the first true hypertext system at global scale."
                color="#10b981"
              />
              , and{' '}
              <ConceptTooltip
                term="URLs"
                short="Universal addresses for web resources"
                detail="The Uniform Resource Locator provides a consistent way to address any resource on the internet. The genius of the URL is its universality — any server, any protocol, any file format can be addressed with the same syntax."
                color="#10b981"
              />
              . By 1991, the first website was live.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {technologies.slice(0, 3).map((tech, index) => {
                const Icon = tech.icon;
                const isSelected = selectedTech === tech.id;
                return (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setSelectedTech(isSelected ? null : tech.id)}
                    whileHover={{ scale: 1.03 }}
                    className="p-5 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: isSelected ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.4)',
                      border: `1px solid ${isSelected ? '#10b981' : 'rgba(16,185,129,0.15)'}`,
                      boxShadow: isSelected ? '0 0 20px rgba(16,185,129,0.2)' : 'none',
                    }}
                    data-cursor="node"
                  >
                    <Icon className="w-8 h-8 text-[#10b981] mb-3" />
                    <h4 className="text-white font-bold mb-1">{tech.title}</h4>
                    <p className="text-gray-600 text-xs font-mono">{tech.year}</p>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-gray-400 text-sm mt-3"
                        >
                          {tech.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Browser War */}
          <div className="mb-12 p-8 rounded-xl" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,240,255,0.2)' }}>
            <h3 className="font-bold mb-4" style={{ color: '#00f0ff', fontSize: '1.3rem' }}>
              Netscape & The Browser War
            </h3>
            <p className="text-gray-400 mb-6">
              NCSA Mosaic made the web visual. Netscape built an empire on top — introducing{' '}
              <ConceptTooltip
                term="SSL"
                short="Secure encryption for web transactions"
                detail="Secure Sockets Layer (SSL), invented by Netscape in 1994, enabled encrypted connections between browsers and servers. This made e-commerce possible — you could safely transmit credit card numbers. SSL became TLS, which now secures all HTTPS traffic."
                color="#00f0ff"
              />
              ,{' '}
              <ConceptTooltip
                term="JavaScript"
                short="The programming language of the web"
                detail="Brendan Eich created JavaScript in 10 days at Netscape in 1995. Originally called Mocha, then LiveScript. The name 'JavaScript' was a marketing decision to capitalize on Java's popularity. Today, JavaScript runs in every browser and on the server (Node.js)."
                color="#f59e0b"
              />
              , and{' '}
              <ConceptTooltip
                term="cookies"
                short="State management for the stateless web"
                detail="HTTP is stateless — each request is independent. Lou Montulli invented browser cookies in 1994 to solve this. Cookies allow servers to remember users across requests, enabling logins, shopping carts, and personalization. They later became central to the surveillance capitalism model."
                color="#ec4899"
              />
              .
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {technologies.slice(3).map((tech, index) => {
                const Icon = tech.icon;
                const isSelected = selectedTech === tech.id;
                return (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setSelectedTech(isSelected ? null : tech.id)}
                    whileHover={{ scale: 1.03 }}
                    className="p-5 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: isSelected ? 'rgba(0,240,255,0.1)' : 'rgba(0,0,0,0.4)',
                      border: `1px solid ${isSelected ? '#00f0ff' : 'rgba(0,240,255,0.12)'}`,
                      boxShadow: isSelected ? '0 0 20px rgba(0,240,255,0.15)' : 'none',
                    }}
                    data-cursor="node"
                  >
                    <Icon className="w-8 h-8 text-[#00f0ff] mb-3" />
                    <h4 className="text-white font-bold mb-1">{tech.title}</h4>
                    <p className="text-gray-600 text-xs font-mono">{tech.year}</p>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-gray-400 text-sm mt-3"
                        >
                          {tech.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Dot-com Crash Chart */}
          <div className="p-8 rounded-xl" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <h3 className="font-bold mb-2" style={{ color: '#f59e0b', fontSize: '1.3rem' }}>
              The Dot-com Bubble & Crash
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Speculation and unchecked optimism drove a historic bubble. What collapsed built the survivors stronger.
            </p>

            <div className="rounded-lg overflow-hidden mb-6" style={{ border: '1px solid rgba(245,158,11,0.15)' }}>
              <canvas ref={canvasRef} className="w-full" style={{ height: '280px', display: 'block' }} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '$5T', label: 'Market value lost', color: '#ef4444' },
                { value: '78%', label: 'NASDAQ decline',   color: '#f59e0b' },
                { value: '2002', label: 'Recovery begins',  color: '#10b981' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-lg text-center"
                  style={{
                    background: `${stat.color}08`,
                    border: `1px solid ${stat.color}25`,
                  }}
                >
                  <p className="font-mono font-bold mb-1" style={{ color: stat.color, fontSize: '1.8rem' }}>
                    {stat.value}
                  </p>
                  <p className="text-gray-600 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
