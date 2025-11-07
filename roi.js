import { SwimlaneElement, css, html, svg } from '@swimlane/swimlane-element@2';
import { reportFrameTemplate } from '@swimlane/swimlane-element@2/lib/templates.js';

// API helpers
const apiPaths = {
  playbooks: (accountId) => `/tenant/api/usage/${accountId}/playbook-runs`,
  actions:   (accountId) => `/tenant/api/usage/${accountId}/actions`,
  heroai:    (accountId) => `/tenant/api/heroai-prompts/account/${accountId}/tenant/prompts`,
  tenantNames: (accountId) => `/tenant/api/accounts/${accountId}/tenants?size=100&pageNumber=1&includeVisuals=true`,
  playbooksMeta: (accountId) => `/tenant/api/usage/${accountId}/playbooks`,
  solutions: (accountId, tenantId) => `/api/account/${accountId}/tenant/${tenantId}/solution-builder/solutions/filter?page=1&size=100`,
  components: (accountId, tenantId) => `/api/account/${accountId}/tenant/${tenantId}/solution-builder/components/filter?page=1&size=100`,
  assetRql: (accountId, tenantId) => `/orchestration/api/account/${accountId}/tenant/${tenantId}/v1/asset/rql`,
  assetCreate: (accountId, tenantId) => `/orchestration/api/account/${accountId}/tenant/${tenantId}/v1/asset`,
  assetUpdate: (accountId, tenantId, assetId) => `/orchestration/api/account/${accountId}/tenant/${tenantId}/v1/asset/${assetId}`
};

// one source of tab truth
const TAB_CONFIG = {
  playbooks: {
    title: 'Playbook Runs',
    metricLabel: 'Total Playbook Runs',
    avgLabel: 'Avg Runs / Day',
    groupable: true
  },
  actions: {
    title: 'Actions',
    metricLabel: 'Total Actions',
    avgLabel: 'Avg Actions / Day'
  },
  heroai: {
    title: 'HeroAI',
    metricLabel: 'Total HeroAI Prompts',
    avgLabel: 'Avg Prompts / Day'
  },
  reporting: {
    title: 'Reporting',
    metricLabel: 'Category Analysis',
    avgLabel: 'Breakdown by Category'
  }
};

// Widget Version and Release Notes
const WIDGET_VERSION = '1.4.4';
const RELEASE_NOTES = {
  '1.4.4': {
    date: '2025-11-06',
    title: 'Glassmorphism Design & Modal Positioning',
    changes: [
      '🎯 FIXED: Configuration modal no longer cuts off at top of screen',
      '📍 FIXED: Modal now uses proper vertical centering (top: 50%, transform: translate(-50%, -50%))',
      '✨ NEW: Glassmorphism design with frosted glass effect (backdrop-filter: blur(20px))',
      '🎨 IMPROVED: Darker modal background (rgba(15, 20, 30, 0.85)) for better contrast',
      '💎 IMPROVED: Enhanced backdrop with blur effect and increased darkness (75% opacity)',
      '🌟 IMPROVED: Multiple shadow layers for depth and blue glow accent',
      '🔷 IMPROVED: Input fields with dark glass effect and enhanced focus states',
      '✨ IMPROVED: Subtle light highlight on top edge for premium depth effect',
      '💫 Result: Modern glassmorphism UI with perfect positioning and enhanced visual depth'
    ]
  },
  '1.4.3': {
    date: '2025-11-06',
    title: 'Scrollbar Styling & Column Alignment',
    changes: [
      '🎨 IMPROVED: Custom scrollbar styling added to Manage Categories modal',
      '✨ IMPROVED: Scrollbar now matches widget aesthetic with blue gradient and glow effects',
      '📊 IMPROVED: All table columns now center-aligned for better visual consistency',
      '🎯 IMPROVED: Config modal scrollbar also styled to match widget theme',
      '💫 Result: Cohesive UI with consistent styling across all scrollable areas'
    ]
  },
  '1.4.2': {
    date: '2025-11-06',
    title: 'Modal Positioning & Animation Balance',
    changes: [
      '🎯 FIXED: Settings modal now properly centered on screen',
      '📍 FIXED: Modal positioning uses fixed viewport centering (top: 50%, left: 50%)',
      '📏 IMPROVED: Added max-height constraint and scrolling for tall modals',
      '⚡ IMPROVED: Pulse animation increased to 50-85% opacity for better visibility',
      '💫 IMPROVED: Pulse scale increased to 1.08 for more noticeable effect',
      '✨ Result: Perfect balance - pulse is visible but not distracting at 5s duration'
    ]
  },
  '1.4.1': {
    date: '2025-11-06',
    title: 'UI Polish & Visual Refinements',
    changes: [
      '🎨 IMPROVED: Theme toggle moved to Settings modal for cleaner header',
      '📊 IMPROVED: ROI bar now matches card styling with darker, more subtle appearance',
      '💎 IMPROVED: Reduced ROI bar glow effects to match premium card aesthetic',
      '🌊 IMPROVED: All ROI bar colors (blue, red, green, yellow, orange, gray) now use consistent darker styling',
      '⏱️ IMPROVED: Card pulse animation slowed from 2s to 5s for less distraction',
      '✨ IMPROVED: Pulse effect made more subtle (40-70% opacity range)',
      '🎯 Result: Cohesive, professional UI with unified dark aesthetic across all components'
    ]
  },
  '1.4.0': {
    date: '2025-11-06',
    title: 'Major Performance & UX Enhancements',
    changes: [
      '🎨 NEW: Persistent dark/light theme toggle with automatic asset storage',
      '💫 NEW: Smooth animated transitions when switching between tabs',
      '📊 NEW: Real-time progress indicators on chunked API loads',
      '⚡ NEW: Parallelized fetch queue with concurrency control for faster loading',
      '✨ NEW: Solid sparkline with bright glow highlight moving left-to-right',
      '🌊 NEW: 3-second continuous sweep animation showing data flow',
      '🎬 NEW: Animated SVG gradient with 5-stop color progression',
      '📊 NEW: Dark 3D ROI bar with deep gradient matching premium aesthetic',
      '📈 NEW: Animated sparkline trend charts showing daily usage patterns',
      '🎨 IMPROVED: Standardized all modal buttons with neon blue outline style',
      '🎯 Result: Production-ready widget with premium animations and performance'
    ]
  }
};

// Default Playbook Run Categories (used for initial setup only)
const DEFAULT_CATEGORIES = [
  { id: 'ai-assisted-analysis', name: 'AI Assisted Analysis', isDefault: true, visible: true },
  { id: 'collaboration-notification', name: 'Collaboration/Notification', isDefault: true, visible: true },
  { id: 'continuous-improvement', name: 'Continuous Improvement/Governance', isDefault: true, visible: true },
  { id: 'detection-analysis', name: 'Detection/Analysis', isDefault: true, visible: true },
  { id: 'enrichment-context', name: 'Enrichment/Context Building', isDefault: true, visible: true },
  { id: 'infrastructure-toolchain', name: 'Infrastructure/Toolchain', isDefault: true, visible: true },
  { id: 'ingestion-normalization', name: 'Ingestion/Normalization', isDefault: true, visible: true },
  { id: 'reporting-metrics', name: 'Reporting/Metrics', isDefault: true, visible: true },
  { id: 'response-remediation', name: 'Response/Remediation', isDefault: true, visible: true },
  { id: 'testing-validation', name: 'Testing/Validation', isDefault: true, visible: true },
  { id: 'threat-hunting', name: 'Threat Hunting/Proactive Defense', isDefault: true, visible: true }
];

// Loading animation now uses native Swimlane arc spinner (no external GIF needed)

export default class RoiCalculatorWidget extends SwimlaneElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          height: 100%;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          --sw-radius: 16px;
          transition: background 0.5s ease, color 0.5s ease, box-shadow 0.5s ease;
        }
        
        :host * {
          transition: background 0.5s ease, color 0.5s ease, border-color 0.5s ease;
          --sw-radius-inner: 10px;
          --sw-primary: #02aaff;
          --sw-neon-glow-focus: rgba(2,170,255,.5);
          --sw-positive: var(--sw-primary);
          --sw-negative: #ff3366;
          --sw-gray: #646F79;
          --sw-orange: #ff9900;
          --sw-yellow: #ffdd00;
          --sw-green: #39CCCC;
        }
        :host([theme="dark"]) {
          --sw-bg: #101520;
          --sw-bg-light: rgba(255,255,255,.05);
          --sw-border: rgba(255,255,255,.1);
          --sw-text: #eaf3ff;
          --sw-text-dim: #c6d1db;
          --sw-shadow: 0 4px 12px rgba(0,0,0,.3);
          --sw-modal-backdrop: rgba(0,0,0,.80);
          --sw-neon-glow: rgba(2,170,255,.3);
          --sw-input-bg: rgba(255,255,255,.1);
          --sw-input-border: rgba(255,255,255,.2);
        }
        :host([theme="light"]) {
          --sw-bg: #EEF4FA;
          --sw-bg-light: rgba(0,0,0,.05);
          --sw-border: rgba(0,0,0,.1);
          --sw-text: #070F52;
          --sw-text-dim: #646F79;
          --sw-shadow: 0 4px 12px rgba(0,0,0,.1);
          --sw-modal-backdrop: rgba(0,0,0,.55);
          --sw-neon-glow: rgba(2,170,255,.2);
          --sw-input-bg: rgba(0,0,0,.05);
          --sw-input-border: rgba(0,0,0,.2);
        }
        .frame { display:flex!important; flex-direction:column!important; height:100%!important; padding:0!important; }
        .widget-container {
          background: var(--sw-bg);
          border-radius: var(--sw-radius);
          border: 1px solid var(--sw-border);
          color: var(--sw-text);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: var(--sw-shadow), 0 0 15px var(--sw-neon-glow);
          min-height: 0;
          position: relative;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .header {
          display:flex; justify-content:space-between; align-items:center;
          font-size:1.4rem; font-weight:700; 
          background: rgba(26,140,255,0.12);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.1);
          margin-bottom:1.25rem;
        }
        .header > span {
          background: linear-gradient(90deg, #1a8cff, #4db8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform:uppercase;
          text-shadow: 0 0 8px rgba(26,140,255,0.3);
        }
        .header-buttons {
          display:flex; gap:.5rem; align-items:center;
        }
        .settings-button {
          background:var(--sw-bg-light); border:1px solid var(--sw-border);
          border-radius:50%; width:32px; height:32px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:var(--sw-text-dim); transition:all 0.3s ease;
        }
        .settings-button:hover { 
          border-color:var(--sw-primary); color:var(--sw-primary); 
          transform:scale(1.1);
        }

        .tab-nav { display:flex; border-bottom:1px solid var(--sw-border); margin-bottom:1.5rem; align-items:center; }
        .tab-button {
          padding:.75rem 1.25rem; background:none; border:none;
          cursor:pointer; color:var(--sw-text-dim); display:flex; gap:.5rem; align-items:center;
          border-bottom:3px solid transparent; margin-bottom:-2px;
        }
        .tab-button.active { 
          border-bottom: 2px solid transparent;
          background: linear-gradient(90deg, #1a8cff, #4db8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight:600;
          position: relative;
        }
        .tab-button.active::after {
          content: "";
          position: absolute;
          bottom: -3px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #1a8cff, #4db8ff);
          border-radius: 2px;
        }
        .tab-button:hover { color:var(--sw-text); background:var(--sw-bg-light); }
        
        .tab-content-wrapper {
          animation: fadeSlideIn 0.4s ease-out;
        }
        
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .refresh-button {
          background:var(--sw-bg-light); border:1px solid var(--sw-border);
          border-radius:50%; width:32px; height:32px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:var(--sw-text-dim); transition:all 0.3s ease;
          padding:0;
        }
        .refresh-button:hover { 
          border-color:var(--sw-primary); color:var(--sw-primary); 
          transform:scale(1.1);
        }
        .refresh-button:active { transform:scale(0.98); }
        .refresh-button:disabled { opacity:.4; cursor:not-allowed; transform:none; }
        .refresh-button svg { width:16px; height:16px; }
        .refresh-button.refreshing svg { animation:spin .6s linear infinite; }
        
        .release-notes-button {
          background:var(--sw-bg-light); border:1px solid var(--sw-border);
          border-radius:50%; width:32px; height:32px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:var(--sw-text-dim); transition:all 0.3s ease;
          padding:0;
          font-size:16px;
        }
        .release-notes-button:hover { 
          border-color:var(--sw-primary); 
          transform:scale(1.1);
          filter: brightness(1.2);
        }
        .release-notes-button:active { transform:scale(0.98); }
        
        .help-button {
          background:var(--sw-bg-light); border:1px solid var(--sw-border);
          border-radius:50%; width:32px; height:32px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:var(--sw-text-dim); transition:all 0.3s ease;
          padding:0;
          font-size:16px;
        }
        .help-button:hover { 
          border-color:var(--sw-primary); 
          transform:scale(1.1);
          filter: brightness(1.2);
        }
        .help-button:active { transform:scale(0.98); }
        
        .theme-toggle-button {
          background:var(--sw-bg-light); border:1px solid var(--sw-border);
          border-radius:50%; width:32px; height:32px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.3s ease;
          padding:0;
          font-size:16px;
        }
        .theme-toggle-button:hover { 
          border-color:var(--sw-primary); 
          transform:scale(1.1);
          filter: brightness(1.2);
        }
        .theme-toggle-button:active { transform:scale(0.98); }
        
        .last-updated {
          font-size: 0.7rem;
          color: var(--sw-text-dim);
          opacity: 0.6;
        }
        
        @keyframes spin {
          from { transform:rotate(0deg); }
          to { transform:rotate(360deg); }
        }
        
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .kpi-box:nth-child(1) { animation-delay: 0.05s; }
        .kpi-box:nth-child(2) { animation-delay: 0.1s; }
        .kpi-box:nth-child(3) { animation-delay: 0.15s; }
        .kpi-box:nth-child(4) { animation-delay: 0.2s; }

        .kpi-grid { 
          display:grid; 
          grid-template-columns:repeat(4,1fr); 
          gap:1.5rem; 
          margin-top: 1rem;
          margin-bottom:2rem;
          margin-inline: 0.25rem;
        }
        .kpi-box {
          background: linear-gradient(145deg, rgba(26,140,255,0.15), rgba(77,184,255,0.10));
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 
            0 4px 10px rgba(0,0,0,0.4),
            inset 0 1px 3px rgba(255,255,255,0.05);
          padding:1rem 1.5rem;
          cursor:grab;
          text-align:center;
          transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: fadeInCard 0.4s ease forwards;
        }
        .kpi-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #1a8cff, #4db8ff);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .kpi-box:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 8px 20px rgba(26,140,255,0.2),
            inset 0 1px 3px rgba(255,255,255,0.1);
          background: linear-gradient(145deg, rgba(26,140,255,0.2), rgba(77,184,255,0.1));
        }
        .kpi-box:hover::before {
          opacity: 1;
        }
        .kpi-box .value { 
          font-size:1.75rem; 
          font-weight:600;
          text-shadow: 0 1px 8px rgba(0,0,0,0.5);
          position: relative;
          filter: drop-shadow(0 0 8px rgba(26,140,255,0.3));
        }
        .kpi-box .value::before {
          content: '';
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(26,140,255,0.25), transparent 70%);
          z-index: -1;
          animation: pulse 5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        .kpi-box .label { 
          font-size:.75rem; 
          text-transform:uppercase; 
          color:var(--sw-text-dim);
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        
        .sparkline-container {
          width: 100%;
          height: 50px;
          margin-top: 0.75rem;
          position: relative;
          border-radius: 8px;
          background: radial-gradient(circle at 50% 80%, rgba(26,140,255,0.05), transparent 80%);
        }
        .sparkline-svg {
          width: 100%;
          height: 100%;
        }
        .sparkline-path {
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 4px rgba(26,140,255,0.3));
          animation: drawSparkline 1.5s ease-out forwards;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }
        .sparkline-area {
          opacity: 0.12;
          animation: fadeInSparklineArea 1s ease-out forwards;
        }
        @keyframes drawSparkline {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeInSparklineArea {
          from { opacity: 0; }
          to { opacity: 0.12; }
        }

        .value-meter { 
          display:grid; 
          grid-template-columns:repeat(3,1fr); 
          gap:1.25rem; 
          margin-bottom:1.5rem;
          margin-inline: 0.25rem;
          background: linear-gradient(135deg, rgba(26,140,255,0.10), rgba(77,184,255,0.08));
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 18px rgba(0,0,0,0.4);
          padding:1rem;
          position: relative;
          overflow: hidden;
        }
        .value-meter::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #1a8cff, #4db8ff);
          opacity: 0.6;
        }
        .roi-bar-container { 
          position:relative; 
          height:40px; 
          background: linear-gradient(145deg, rgba(10,15,30,0.9), rgba(15,20,35,0.85));
          border-radius: 16px;
          border: 1px solid rgba(26,140,255,0.2);
          box-shadow: 
            0 4px 18px rgba(0,0,0,0.5),
            inset 0 2px 4px rgba(0,0,0,0.4),
            inset 0 -1px 2px rgba(26,140,255,0.1);
          margin-bottom:1.5rem;
          margin-inline: 0.25rem;
          overflow:hidden;
          padding: 5px;
        }
        .roi-bar { 
          position:absolute; 
          top:5px; 
          bottom:5px; 
          left:5px;
          border-radius: 12px;
          transition:width .5s ease-out;
          box-shadow: 
            0 2px 10px rgba(0,0,0,0.4),
            inset 0 1px 2px rgba(255,255,255,0.2);
        }
        .roi-bar.c-green { 
          background: linear-gradient(145deg, rgba(77,184,127,0.6), rgba(77,184,127,0.7));
          box-shadow: 
            0 2px 6px rgba(77,184,127,0.25),
            inset 0 1px 2px rgba(255,255,255,0.15);
        }
        .roi-bar.c-blue { 
          background: linear-gradient(145deg, rgba(26,140,255,0.6), rgba(77,184,255,0.7), rgba(26,140,255,0.6));
          background-size: 200% 100%;
          box-shadow: 
            0 2px 6px rgba(26,140,255,0.25),
            inset 0 1px 2px rgba(255,255,255,0.15),
            0 0 8px rgba(26,140,255,0.2);
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .roi-bar.c-yellow { 
          background: linear-gradient(145deg, rgba(255,193,7,0.6), rgba(255,215,0,0.7));
          box-shadow: 
            0 2px 6px rgba(255,193,7,0.25),
            inset 0 1px 2px rgba(255,255,255,0.15);
        }
        .roi-bar.c-orange { 
          background: linear-gradient(145deg, rgba(255,140,66,0.6), rgba(255,140,66,0.7));
          box-shadow: 
            0 2px 6px rgba(255,140,66,0.25),
            inset 0 1px 2px rgba(255,255,255,0.15);
        }
        .roi-bar.c-gray { 
          background: linear-gradient(145deg, rgba(108,117,125,0.6), rgba(108,117,125,0.7));
          box-shadow: 
            0 2px 6px rgba(108,117,125,0.25),
            inset 0 1px 2px rgba(255,255,255,0.15);
        }
        .roi-bar.c-negative { 
          background: linear-gradient(145deg, rgba(255,77,109,0.6), rgba(255,51,85,0.7));
          box-shadow: 
            0 2px 6px rgba(255,77,109,0.25),
            inset 0 1px 2px rgba(255,255,255,0.15),
            0 0 8px rgba(255,77,109,0.2);
          right:5px; 
        }
        .roi-bar-text { 
          position:absolute; inset:0; display:flex; align-items:center; 
          justify-content:center; font-weight:600;
          animation: countUp 0.4s ease;
        }
        
        @keyframes countUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .settings-header {
          font-size:.75rem; text-transform:uppercase; font-weight:600;
          color:var(--sw-text-dim); cursor:pointer; margin-bottom:1rem;
          border-bottom:1px solid var(--sw-border); padding-bottom:.75rem;
          display:flex; align-items:center; gap:.5rem;
        }
        .results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--sw-text-dim);
  cursor: pointer;
  padding: 0.75rem 0;
  border-top: 1px solid var(--sw-border);
  border-bottom: 1px solid var(--sw-border);
  margin-top: 1rem;
  user-select: none;
  transition: color 0.3s ease, border 0.3s ease;
}
.results-header:hover {
  color: var(--sw-primary);
}

.results-header .caret {
  font-size: 1rem;
  color: var(--sw-text-dim);
  transition: transform 0.3s ease, color 0.3s ease;
}
.results-header:hover .caret {
  color: var(--sw-primary);
}

.results-container {
  overflow: hidden;
  transition: max-height 0.4s ease, opacity 0.4s ease;
}
.results-container.expanded {
  max-height: 2000px;
  opacity: 1;
}
.results-container.collapsed {
  max-height: 0;
  opacity: 0;
}
/* SETTINGS PANEL ***********************************************************/

.settings-header {
  flex-shrink: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--sw-text-dim);
  cursor: pointer;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--sw-border);
  padding-bottom: 0.75rem;
  transition: color 0.3s ease, border 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.settings-header:hover {
  color: var(--sw-primary);
}

/* hidden by default; shown when .expanded */
.config-grid {
  display: none;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
.config-grid.expanded {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  position: relative;
  display: grid;
}
/* ─────────────────────────────── */
/* SETTINGS PANEL FROSTED BACKGROUND */
/* ─────────────────────────────── */

.config-grid,
.config-footer {
  position: relative;
  z-index: 1;
}

/* Frosted-glass background tuned for dark + light themes */
.config-grid.expanded::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: rgba(25, 30, 40, 0.5); /* light veil only */
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  z-index: -1;
  transition: opacity 0.4s ease;
  opacity: 1;
}

/* Hide the background when collapsed */
.config-grid::before {
  opacity: 0;
  pointer-events: none;
}

/* Light-mode tweak: lighter frosted tone */
:host([theme="light"]) .config-grid.expanded::before {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* hidden when collapsed */
.config-grid::before {
  opacity: 0;
  pointer-events: none;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.config-item label {
  font-size: 0.85rem;
  color: var(--sw-text-dim);
  opacity: 0.85;
  transition: color 0.3s ease;
}

/* actual inputs */
.config-item input,
.config-item select {
  width: 100%;
  padding: 0.55rem 0.7rem;
  background-color: var(--sw-bg-light);
  color: var(--sw-text);
  border: 1px solid var(--sw-border);
  border-radius: var(--sw-radius-inner);
  box-sizing: border-box;
  font-family: inherit;
  font-size: 0.9rem;
  transition: box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.config-item input:focus,
.config-item select:focus {
  border-color: var(--sw-primary);
  box-shadow: 0 0 8px var(--sw-neon-glow-focus);
  outline: none;
}

/* select caret */
.config-item select {
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23C6D1DB" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
}
:host([theme="light"]) .config-item select {
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23646F79" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
}

/* toggle row */
.config-item.toggle {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

/* switch */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background-color: var(--sw-bg-light);
  border: 1px solid var(--sw-border);
  transition: .3s;
  border-radius: 24px;
  cursor: pointer;
}
.slider:before {
  content: "";
  position: absolute;
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: var(--sw-text-dim);
  transition: .3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: var(--sw-primary);
  border-color: var(--sw-primary);
}
input:checked + .slider:before {
  background-color: var(--sw-bg);
  transform: translateX(20px);
}

/* footer + button */
.config-footer {
  display: none;
  border-top: 1px solid var(--sw-border);
  padding-top: 1rem;
  margin-top: 0.25rem;
  justify-content: flex-end;
}
.config-grid.expanded + .config-footer {
  display: flex;
}

.apply-button {
  background-color: var(--sw-primary);
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.apply-button:hover {
  box-shadow: 0 0 10px var(--sw-neon-glow-focus);
}
.apply-button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* ─────────────────────────────── */
/* TAB-SPECIFIC SETTINGS ANIMATION */
/* ─────────────────────────────── */

.config-anim {
  display: contents; /* default, no impact when static */
  animation: fadeSlideIn 0.45s ease forwards;
  opacity: 0;
  transform: translateY(8px);
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  60% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

/* Smooth exit transition when tabs switch */
.config-anim.exit {
  animation: fadeSlideOut 0.35s ease forwards;
}

@keyframes fadeSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-8px);
  }
}

/* Switch toggle refinement */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--sw-bg-light);
  border: 1px solid var(--sw-input-border);
  transition: .3s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: var(--sw-text-dim);
  transition: .3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: var(--sw-primary);
  border-color: var(--sw-primary);
}
input:checked + .slider:before {
  background-color: var(--sw-bg);
  transform: translateX(20px);
}

/* Footer (Apply button row) */
.config-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
  transition:
    max-height 0.45s ease,
    opacity 0.35s ease,
    transform 0.35s ease,
    margin 0.3s ease,
    padding 0.3s ease;
  border-top: 1px solid transparent;
  padding: 0;
  margin: 0;
}

.config-footer.expanded {
  max-height: 80px;
  opacity: 1;
  transform: translateY(0);
  margin-top: 1rem;
  border-top: 1px solid var(--sw-border);
  padding-top: 1rem;
}
.apply-button {
  background-color: var(--sw-primary);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: box-shadow 0.3s ease, opacity 0.3s ease;
}
.apply-button:hover {
  box-shadow: 0 0 10px var(--sw-neon-glow-focus);
}
.apply-button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 🔹 Glow effect when there are unsaved changes */
.apply-button.unsaved {
  animation: glowPulse 1.2s infinite ease-in-out;
}
@keyframes glowPulse {
  0%   { box-shadow: 0 0 4px var(--sw-primary); }
  50%  { box-shadow: 0 0 15px var(--sw-neon-glow-focus); }
  100% { box-shadow: 0 0 4px var(--sw-primary); }
}

        .results-container { flex:1; overflow-y:auto; border-top:1px solid var(--sw-border); min-height:0; }
        table { 
          width:100%; 
          border-collapse:collapse; 
          font-size:.875rem;
          background: rgba(255,255,255,0.08);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 18px rgba(0,0,0,0.4);
          overflow: hidden;
        }
        th, td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--sw-border);
  transition: border 0.3s ease, color 0.3s ease;
  vertical-align: middle;
}

th {
  font-weight: 600;
  color: var(--sw-text-dim);
  text-transform: uppercase;
  font-size: 0.75rem;
  background-color: var(--sw-bg);
  position: sticky;
  top: 0;
  text-align: center;
}

td {
  color: var(--sw-text);
  text-align: center;
}

/* 🔹 Center all columns */
th:nth-child(4), td:nth-child(4),
th:nth-child(5), td:nth-child(5),
th:nth-child(6), td:nth-child(6),
th:nth-child(7), td:nth-child(7) {
  text-align: center;
  padding-right: 1.25rem;
}

/* 🔹 Keep checkbox column compact and centered */
th.col-check, td.col-check {
  width: 48px;
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
        th.col-ai-marker, td.col-ai-marker {
          width: 48px;
          text-align: center;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        .ai-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          width: 24px;
          height: 24px;
        }
        .ai-badge svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 2px rgba(26, 140, 255, 0.3));
        }
        th { text-transform:uppercase; font-size:.7rem; color:var(--sw-text-dim); position:sticky; top:0; background:var(--sw-bg); cursor:grab; user-select:none; text-align: center; }
        th:active { cursor:grabbing; }
        th.dragging { opacity:.5; }
        th.drag-over { border-left:3px solid var(--sw-primary); }
        .col-check { width:40px; text-align:center; cursor:default !important; }
        tr.clickable { cursor:pointer; transition:background 0.2s ease; }
        tr.clickable:hover { background:var(--sw-bg-light); }
        .sw-checkbox { width:18px; height:18px; border:1px solid var(--sw-input-border); border-radius:4px; display:inline-block; }
        .sw-checkbox.checked { background:var(--sw-primary); border-color:var(--sw-primary); position:relative; }
        .sw-checkbox.checked::after { content:''; position:absolute; left:5px; top:1px; width:6px; height:12px; border:solid #fff; border-width:0 3px 3px 0; transform:rotate(45deg); }

        /* Reporting Charts */
        .reporting-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem 0;
          overflow-y: auto;
          min-height: 0;
        }
        .chart-section {
          background: linear-gradient(135deg, rgba(26,140,255,0.10), rgba(77,184,255,0.08));
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 18px rgba(0,0,0,0.4);
          padding: 1.5rem;
          transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .chart-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #1a8cff, #4db8ff);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .chart-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.5);
          background: linear-gradient(135deg, rgba(26,140,255,0.10), rgba(77,184,255,0.06));
        }
        .chart-section:hover::before {
          opacity: 1;
        }
        .chart-title {
          font-size: 0.9rem;
          font-weight: 600;
          background: linear-gradient(90deg, #1a8cff, #4db8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.35rem;
          filter: drop-shadow(0 1px 4px rgba(0,0,0,0.3));
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .chart-subtitle {
          font-size: 0.8rem;
          color: var(--sw-text-dim);
          margin-bottom: 1.5rem;
          opacity: 0.7;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .chart-content {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1200px;
          margin: 0 auto;
        }
        /* Modernized Pie Chart Look */
        .pie-chart-container {
          position: relative;
          flex-shrink: 0;
          max-width: 400px;
          width: 100%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 60%);
          border-radius: 50%;
          box-shadow:
            inset 0 4px 6px rgba(255, 255, 255, 0.15),
            inset 0 -4px 6px rgba(0, 0, 0, 0.2),
            0 4px 18px rgba(0, 0, 0, 0.35);
        }
        .pie-chart {
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
          transform: perspective(600px) rotateX(8deg);
          transition: transform 0.4s ease, filter 0.4s ease;
          max-width: 100%;
          height: auto;
          shape-rendering: geometricPrecision;
        }
        .pie-chart:hover {
          transform: perspective(600px) rotateX(0deg) scale(1.03);
          filter: drop-shadow(0 8px 18px rgba(2, 170, 255, 0.35));
        }
        /* slice gradient highlight */
        .pie-chart path {
          transition: all 0.25s ease-in-out;
          cursor: pointer;
          stroke-width: 2;
          opacity: 0.95;
          filter: brightness(1);
          transform-origin: 50% 50%;
          animation: slicePop 0.6s ease forwards;
          shape-rendering: geometricPrecision;
          vector-effect: non-scaling-stroke;
        }
        .pie-chart path:hover {
          opacity: 1;
          filter: brightness(1.2) drop-shadow(0 0 10px var(--sw-neon-glow-focus));
        }
        /* subtle inner rim glow */
        .pie-chart-container::after {
          content: "";
          position: absolute;
          inset: 12%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(0,0,0,0.15));
          z-index: 2;
          pointer-events: none;
        }
        /* center text improvements */
        .pie-chart-center-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
          opacity: 0;
          animation: fadeInCenter 0.4s ease-out 0.3s forwards;
          text-shadow: 0 0 8px rgba(2, 170, 255, 0.25);
        }
        @keyframes fadeInCenter {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .center-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--sw-primary);
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .center-label {
          font-size: 0.7rem;
          color: var(--sw-text-dim);
          text-transform: uppercase;
          margin-top: 0.3rem;
          letter-spacing: 0.7px;
          font-weight: 500;
        }
        @keyframes slicePop {
          from {
            transform: scale(0.9);
            opacity: 0.4;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          width: 380px;
          max-width: 100%;
          min-width: 280px;
          flex-shrink: 0;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0;
          border-bottom: 1px solid transparent;
          transition: all 0.2s ease;
          cursor: default;
          opacity: 0;
          animation: fadeInLegend 0.3s ease-out forwards;
        }
        .legend-item:nth-child(1) { animation-delay: 0.1s; }
        .legend-item:nth-child(2) { animation-delay: 0.15s; }
        .legend-item:nth-child(3) { animation-delay: 0.2s; }
        .legend-item:nth-child(4) { animation-delay: 0.25s; }
        .legend-item:nth-child(5) { animation-delay: 0.3s; }
        .legend-item:nth-child(6) { animation-delay: 0.35s; }
        .legend-item:nth-child(7) { animation-delay: 0.4s; }
        .legend-item:nth-child(8) { animation-delay: 0.45s; }
        @keyframes fadeInLegend {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .legend-item:last-child {
          border-bottom: none;
        }
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .legend-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .legend-label {
          font-size: 0.85rem;
          color: var(--sw-text);
          font-weight: 500;
        }
        .legend-value {
          font-size: 0.7rem;
          color: var(--sw-text-dim);
          opacity: 0.8;
        }
        .legend-percentage {
          font-size: 0.95rem;
          color: var(--sw-primary);
          font-weight: 600;
          min-width: 55px;
          text-align: right;
        }
        .no-data-message {
          text-align: center;
          padding: 3rem;
          color: var(--sw-text-dim);
          font-style: italic;
          font-size: 0.95rem;
        }

        .heroai-summary {
          background: rgba(255,255,255,0.08);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 18px rgba(0,0,0,0.4);
          padding: 2rem;
          text-align: center;
        }
        .heroai-summary p {
          font-size: 1.1rem;
          margin: 0.75rem 0;
        }
        
        .pagination-controls {
          
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0 0.5rem 0;
  color: var(--sw-text-dim);
  font-size: 0.875rem;
  border-top: 1px solid var(--sw-border);
  margin-top: 0.5rem;
}
.pagination-controls span {
  color: var(--sw-primary);
  font-weight: 600;
}

.pagination-button {
  background: var(--sw-bg-light);
  border: 1px solid var(--sw-border);
  color: var(--sw-text);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;
  min-width: 90px;
  text-align: center;
}

.pagination-button:hover:not([disabled]) {
  border-color: var(--sw-primary);
  color: var(--sw-primary);
  box-shadow: 0 0 8px var(--sw-neon-glow-focus);
}

.pagination-button[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
  color: var(--sw-text-dim);
  border-color: var(--sw-border);
  background: var(--sw-bg-light);
}
        .debug-toggle { margin-top:1rem; font-size:.75rem; color:var(--sw-primary); cursor:pointer; }

/* ─────────────────────────────── */
/* LOADING OVERLAY WITH FROSTED GLASS EFFECT */
/* ─────────────────────────────── */

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(10, 15, 25, 0.6); /* translucent dark layer */
  color: var(--sw-text-dim);
  opacity: 0;
  transform: scale(0.98);
  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s ease-in-out,
    visibility 0.5s ease-in-out;
  visibility: hidden;
  z-index: 200; /* sits above content but below modals */
  border-radius: var(--sw-radius);
}

.loading-container.fade-in {
  opacity: 1;
  transform: scale(1);
  visibility: visible;
}

.loading-container.fade-out {
  opacity: 0;
  transform: scale(0.97);
  visibility: hidden;
}

.loading-text-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.loading-progress {
  color: #1a8cff;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(26, 140, 255, 0.5);
}

.loading-text {
  color: #dee2ea;
  font-size: 13px;
  letter-spacing: 2px;
  font-weight: 600;
}

/* Swimlane Arc Spinner */
.ngx-preloader {
  width: 200px;
  height: 200px;
  position: relative;
  animation: arc-spinner-rotator-arc 5.4s linear infinite;
}

.ngx-preloader .arc {
  position: absolute;
  top: 50%;
  left: 0;
  height: 3px;
  width: 100%;
  border-right: 10px solid #02aaff;
  transform: rotate(0deg);
  animation: arc-spinner-rotator-arc 1.8s cubic-bezier(0.8, 0, 0.4, 0.8) 0s infinite;
}

.ngx-preloader .arc-0 { animation-delay: 0s; }
.ngx-preloader .arc-1 { animation-delay: 0.015s; }
.ngx-preloader .arc-2 { animation-delay: 0.03s; }
.ngx-preloader .arc-3 { animation-delay: 0.045s; }
.ngx-preloader .arc-4 { animation-delay: 0.06s; }
.ngx-preloader .arc-5 { animation-delay: 0.075s; }
.ngx-preloader .arc-6 { animation-delay: 0.09s; }
.ngx-preloader .arc-7 { animation-delay: 0.105s; }
.ngx-preloader .arc-8 { animation-delay: 0.12s; }
.ngx-preloader .arc-9 { animation-delay: 0.135s; }
.ngx-preloader .arc-10 { animation-delay: 0.15s; }
.ngx-preloader .arc-11 { animation-delay: 0.165s; }
.ngx-preloader .arc-12 { animation-delay: 0.18s; }
.ngx-preloader .arc-13 { animation-delay: 0.195s; }
.ngx-preloader .arc-14 { animation-delay: 0.21s; }
.ngx-preloader .arc-15 { animation-delay: 0.225s; }
.ngx-preloader .arc-16 { animation-delay: 0.24s; }
.ngx-preloader .arc-17 { animation-delay: 0.255s; }
.ngx-preloader .arc-18 { animation-delay: 0.27s; }
.ngx-preloader .arc-19 { animation-delay: 0.285s; }
.ngx-preloader .arc-20 { animation-delay: 0.3s; }
.ngx-preloader .arc-21 { animation-delay: 0.315s; }
.ngx-preloader .arc-22 { animation-delay: 0.33s; }
.ngx-preloader .arc-23 { animation-delay: 0.345s; }
.ngx-preloader .arc-24 { animation-delay: 0.36s; }

@keyframes arc-spinner-rotator-arc {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
        /* modals */
        .modal-backdrop {
          position:fixed; 
          inset:0; 
          background:var(--sw-modal-backdrop); 
          z-index:1040; 
          opacity:0; 
          transition:opacity .3s ease;
        }
        .modal-backdrop.fade-in { opacity:1; }
        .modal-content {
          position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
          background:var(--sw-bg); color:var(--sw-text);
          border:1px solid var(--sw-border); border-radius:8px; z-index:1050;
          width:90%; max-width:500px; max-height:90vh; overflow-y:auto;
          display:flex; flex-direction:column;
          box-shadow:var(--sw-shadow), 0 0 20px var(--sw-neon-glow);
          opacity:0; transition:opacity .3s ease, transform .3s ease;
        }
        .modal-content.fade-in { opacity:1; transform:translate(-50%, -50%); }
        .modal-content.wizard { 
          max-width: 600px; 
          background: #1a1d2e;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          box-shadow: 0 0 40px rgba(2,170,255,0.35), 0 0 10px rgba(2,170,255,0.2);
          transform-origin: center;
          animation: fadeInPop 0.3s ease-out forwards;
        }
        
        .wizard-header {
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: #1a1d2e;
        }
        
        .wizard-header h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--sw-text);
        }
        
        .wizard-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #1a1d2e;
        }
        
        .wizard-subtitle {
          margin: 0 0 1rem 0;
          color: var(--sw-text-dim);
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .wizard-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .wizard-field label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--sw-text);
          margin: 0;
        }
        
        .wizard-field input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #242736;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          color: #ffffff;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        
        .wizard-field input:focus {
          outline: none;
          border-color: var(--sw-primary);
          box-shadow: 0 0 0 3px rgba(26, 140, 255, 0.1);
        }
        
        .wizard-field input:hover {
          border-color: var(--sw-primary);
        }
        
        .wizard-footer {
          padding: 1.5rem 2rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          background: #1a1d2e;
        }
        
        .wizard-button {
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .wizard-button.primary {
          background: transparent;
          color: #fff;
          border: 2px solid #1a8cff;
          box-shadow: 0 0 10px rgba(26, 140, 255, 0.3);
        }
        
        .wizard-button.primary:hover {
          background: rgba(26, 140, 255, 0.2);
          border-color: #4db8ff;
          transform: translateY(-1px);
          box-shadow: 0 0 15px rgba(26, 140, 255, 0.5);
        }
        
        .wizard-button.primary:active {
          transform: translateY(0);
        }
        
        .wizard-button.secondary {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
        }
        
        .wizard-button.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        /* ─── RELEASE NOTES MODAL ───────────────────────────────── */
        .modal-content.release-notes {
          max-width: 700px;
          background: #1a1d2e;
          border: 1px solid rgba(26, 140, 255, 0.3);
          border-radius: 12px;
          box-shadow: 0 0 40px rgba(2,170,255,0.35), 0 0 10px rgba(2,170,255,0.2);
          transform-origin: center;
          animation: fadeInPop 0.3s ease-out forwards;
        }
        
        .release-header {
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(135deg, rgba(26, 140, 255, 0.1) 0%, transparent 100%);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .release-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--sw-primary);
        }
        
        .release-date {
          margin: 0;
          font-size: 0.9rem;
          color: var(--sw-text-dim);
        }
        
        .release-header .close-btn {
          background: transparent;
          border: none;
          color: var(--sw-text-dim);
          font-size: 2rem;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .release-header .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--sw-text);
        }
        
        .release-body {
          padding: 2rem;
        }
        
        .release-body h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--sw-text);
        }
        
        .release-changes {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        
        .release-changes li {
          padding: 0.75rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: var(--sw-text);
          line-height: 1.6;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .release-changes li:last-child {
          border-bottom: none;
        }
        
        .release-changes li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--sw-primary);
          font-weight: bold;
        }
        
        .release-footer {
          padding: 1.5rem 2rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          justify-content: center;
          background: #1a1d2e;
        }
        
        .release-button {
          padding: 0.75rem 3rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .release-button.primary {
          background: var(--sw-primary);
          color: #fff;
        }
        
        .release-button.primary:hover {
          background: #0ba0d4;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26, 140, 255, 0.4);
        }
        
        .release-button.primary:active {
          transform: translateY(0);
        }

        /* ─── HELP MODAL ───────────────────────────────── */
        .modal-content.help-modal {
          max-width: 900px;
          max-height: 90vh;
          background: #1a1d2e;
          border: 1px solid rgba(26, 140, 255, 0.3);
          border-radius: 12px;
          box-shadow: 0 0 40px rgba(2,170,255,0.35), 0 0 10px rgba(2,170,255,0.2);
          transform-origin: center;
          animation: fadeInPop 0.3s ease-out forwards;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(26, 140, 255, 0.6) rgba(0, 0, 0, 0.2);
        }

        .modal-content.help-modal::-webkit-scrollbar {
          width: 10px;
        }

        .modal-content.help-modal::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          margin: 4px;
        }

        .modal-content.help-modal::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(26, 140, 255, 0.4), rgba(26, 140, 255, 0.6));
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 0 8px rgba(26, 140, 255, 0.3);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        .modal-content.help-modal::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(26, 140, 255, 0.6), rgba(77, 184, 255, 0.7));
          box-shadow: 0 0 12px rgba(26, 140, 255, 0.5);
        }
        
        .help-header {
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(135deg, rgba(26, 140, 255, 0.1) 0%, transparent 100%);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: #1a1d2e;
        }
        
        .help-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--sw-primary);
        }
        
        .help-subtitle {
          margin: 0;
          font-size: 0.9rem;
          color: var(--sw-text-dim);
        }
        
        .help-header .close-btn {
          background: transparent;
          border: none;
          color: var(--sw-text-dim);
          font-size: 2rem;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .help-header .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--sw-text);
        }
        
        .help-body {
          padding: 2rem;
        }
        
        .help-section {
          margin-bottom: 2rem;
        }
        
        .help-section:last-child {
          margin-bottom: 0;
        }
        
        .help-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--sw-primary);
          border-bottom: 2px solid rgba(26, 140, 255, 0.2);
          padding-bottom: 0.5rem;
        }
        
        .help-section p {
          margin: 0 0 1rem 0;
          color: var(--sw-text);
          line-height: 1.6;
        }
        
        .help-list {
          margin: 0.5rem 0 1rem 1.5rem;
          padding: 0;
          list-style: none;
        }
        
        .help-list li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: var(--sw-text);
          line-height: 1.6;
        }
        
        .help-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--sw-primary);
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .help-list li strong {
          color: var(--sw-primary);
        }
        
        .help-tab-info {
          margin: 1rem 0 1.5rem 0;
          padding: 1rem;
          background: rgba(26, 140, 255, 0.05);
          border-left: 3px solid rgba(26, 140, 255, 0.3);
          border-radius: 6px;
        }
        
        .help-tab-info h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--sw-text);
        }
        
        .help-tab-info p {
          margin: 0.5rem 0;
          color: var(--sw-text-dim);
          font-size: 0.95rem;
        }
        
        .help-footer {
          padding: 1.5rem 2rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          justify-content: center;
          background: #1a1d2e;
          position: sticky;
          bottom: 0;
        }
        
        .help-button-primary {
          padding: 0.75rem 3rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--sw-primary);
          color: #fff;
        }
        
        .help-button-primary:hover {
          background: #0ba0d4;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26, 140, 255, 0.4);
        }
        
        .help-button-primary:active {
          transform: translateY(0);
        }
        
        .modal-header { padding:1rem; border-bottom:1px solid var(--sw-border); display:flex; justify-content:space-between; }
        .modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:1rem; }
        .modal-footer { padding:1rem; border-top:1px solid var(--sw-border); display:flex; justify-content:space-between; }
        .modal-button { 
          background: transparent;
          color: #fff;
          border: 2px solid #1a8cff;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 0 10px rgba(26, 140, 255, 0.3);
        }
        .modal-button:hover:not(:disabled) {
          background: rgba(26, 140, 255, 0.2);
          border-color: #4db8ff;
          box-shadow: 0 0 15px rgba(26, 140, 255, 0.5);
          transform: translateY(-1px);
        }
        .modal-button:active:not(:disabled) {
          transform: translateY(0);
        }
        .modal-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: rgba(26, 140, 255, 0.4);
        }
        .modal-button.secondary { 
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
        }
        .modal-button.secondary:hover:not(:disabled) {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .manage-categories-btn {
          background: transparent;
          color: #fff;
          border: 2px solid #1a8cff;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-family: inherit;
          transition: all 0.3s ease;
          margin-right: 0.75rem;
          font-weight: 500;
          box-shadow: 0 0 10px rgba(26, 140, 255, 0.3);
        }
        .manage-categories-btn:hover {
          background: rgba(26, 140, 255, 0.2);
          border-color: #4db8ff;
          box-shadow: 0 0 15px rgba(26, 140, 255, 0.5);
          transform: translateY(-1px);
        }
        .manage-categories-btn:active {
          transform: translateY(0);
        }
        .category-list {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 1rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(26, 140, 255, 0.6) rgba(0, 0, 0, 0.2);
        }
        
        /* Custom Scrollbar Styling for Category List */
        .category-list::-webkit-scrollbar {
          width: 10px;
        }
        
        .category-list::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          margin: 4px;
        }
        
        .category-list::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(26, 140, 255, 0.4), rgba(26, 140, 255, 0.6));
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 0 8px rgba(26, 140, 255, 0.3);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        
        .category-list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(26, 140, 255, 0.6), rgba(77, 184, 255, 0.7));
          box-shadow: 0 0 12px rgba(26, 140, 255, 0.5);
        }
        .category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          border-bottom: 1px solid var(--sw-border);
          transition: background 0.2s ease;
        }
        .category-item:hover {
          background: var(--sw-bg-light);
        }
        .category-item-name {
          flex: 1;
          font-weight: 500;
        }
        .category-item-id {
          font-size: 0.75rem;
          color: var(--sw-text-dim);
          margin-left: 0.5rem;
        }
        .category-item-actions {
          display: flex;
          gap: 0.5rem;
        }
        .category-edit-btn, .category-delete-btn, .category-toggle-btn {
          background: none;
          border: 1px solid var(--sw-border);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          color: var(--sw-text);
          transition: all 0.2s ease;
        }
        .category-edit-btn:hover {
          background: var(--sw-primary);
          border-color: var(--sw-primary);
          color: #fff;
        }
        .category-delete-btn:hover {
          background: #ff4444;
          border-color: #ff4444;
          color: #fff;
        }
        .category-toggle-btn:hover {
          background: var(--sw-green);
          border-color: var(--sw-green);
          color: #fff;
        }
        .category-edit-btn:disabled, .category-delete-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          pointer-events: none;
        }
        .category-badge {
          display: inline-block;
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          margin-left: 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .category-badge.default {
          background: var(--sw-primary);
          color: #fff;
        }
        .category-badge.custom {
          background: var(--sw-green);
          color: #fff;
        }
        .category-badge.hidden {
          background: var(--sw-gray);
          color: #fff;
        }
        .category-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--sw-bg-light);
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .category-form input {
          padding: 0.5rem;
          border: 1px solid var(--sw-border);
          border-radius: 4px;
          background: var(--sw-bg);
          color: var(--sw-text);
          font-size: 0.9rem;
        }
        .category-form-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }
        .config-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 360px;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(15, 20, 30, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 16px;
  border: 1px solid rgba(26, 140, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(2, 170, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: var(--sw-text);
  transform-origin: center;
  animation: fadeInPop 0.3s ease-out forwards;
  padding: 0.5rem;
  z-index: 10000;
  scrollbar-width: thin;
  scrollbar-color: rgba(26, 140, 255, 0.6) rgba(0, 0, 0, 0.2);
}

/* Custom Scrollbar Styling for Config Modal */
.config-modal::-webkit-scrollbar {
  width: 10px;
}

.config-modal::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin: 4px;
}

.config-modal::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(26, 140, 255, 0.4), rgba(26, 140, 255, 0.6));
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 8px rgba(26, 140, 255, 0.3);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.config-modal::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(26, 140, 255, 0.6), rgba(77, 184, 255, 0.7));
  box-shadow: 0 0 12px rgba(26, 140, 255, 0.5);
}

@keyframes fadeInPop {
  0% { 
    opacity: 0; 
    transform: translate(-50%, -45%) scale(0.94); 
  }
  100% { 
    opacity: 1; 
    transform: translate(-50%, -50%) scale(1); 
  }
}

.config-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(26, 140, 255, 0.2);
  background: linear-gradient(135deg, rgba(26,140,255,0.15), rgba(77,184,255,0.08));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.config-modal-content {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0 0 12px 12px;
}

.config-modal-item label {
  font-size: 0.85rem;
  color: var(--sw-text-dim);
  display: block;
  margin-bottom: 0.25rem;
}

.config-modal-item input,
.config-modal-item select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(26, 140, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--sw-text);
  font-family: inherit;
  transition: all 0.25s ease;
}
.config-modal-item input:focus,
.config-modal-item select:focus {
  border-color: rgba(26, 140, 255, 0.6);
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 
    0 0 15px rgba(26, 140, 255, 0.4),
    inset 0 0 10px rgba(26, 140, 255, 0.1);
  outline: none;
}
.config-modal-item select {
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23C6D1DB" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  cursor: pointer;
}

.config-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem 1rem 1rem 1rem;
  border-top: 1px solid rgba(26, 140, 255, 0.2);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0 0 16px 16px;
}

.config-modal .save-btn {
  background: transparent;
  color: #fff;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: 2px solid #1a8cff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(26, 140, 255, 0.3);
}
.config-modal .save-btn:hover {
  background: rgba(26, 140, 255, 0.2);
  border-color: #4db8ff;
  box-shadow: 0 0 15px rgba(26, 140, 255, 0.5);
  transform: translateY(-1px);
}
/* Highlight rows with custom config */
tbody tr.custom-config {
  box-shadow: inset 0 0 8px var(--sw-primary);
  background-color: rgba(2, 170, 255, 0.05);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
tbody tr.custom-config:hover {
  background-color: rgba(2, 170, 255, 0.1);
  box-shadow: inset 0 0 12px var(--sw-primary);
}

.config-modal .close-btn {
  font-size: 1.4rem;
  background: none;
  border: none;
  color: var(--sw-text-dim);
  cursor: pointer;
  transition: color 0.2s ease;
}
.config-modal .close-btn:hover {
  color: var(--sw-primary);
}
/* --- Fix modal layering and backdrop transparency --- */

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 998; /* lower than modal */
  transition: opacity 0.3s ease;
}

.config-modal {
  z-index: 999; /* higher than backdrop */
  background: rgba(15, 20, 30, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: var(--sw-text);
  border-radius: 16px;
  border: 1px solid rgba(26, 140, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(2, 170, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  opacity: 1;
  transition: opacity 0.3s ease;
}

.config-modal.fade-in {
  opacity: 1;
}

.config-modal.fade-out {
  opacity: 0;
}
      `
    ];
  }

  static get properties() {
    return {
      ['context-data']: { type: Object },
      isLoading: { type: Boolean },
      // defaults for all tabs
      defaultTimePerPlaybook: { type: Number },
      defaultHourlyRateForPlaybook: { type: Number },
      defaultTimePerAction: { type: Number },
      defaultHourlyRateForAction: { type: Number },
      defaultTimePerHeroAI: { type: Number },
      defaultHourlyRateForHeroAI: { type: Number },
      groupBy: { type: String },
      lookbackDays: { type: Number },
      isSingleConfigOpen: { type: Boolean },
      selectedItem: { type: Object },
      modalTime: { type: Number },
      modalCost: { type: Number },
      apiData: { type: Array },
      heroAiTotal: { type: Number },
      playbookTotalDollars: { type: Number },
      playbookNameMap: { type: Map },
      playbookMetadataMap: { type: Map },
      playbookConfigMap: { type: Map },
      playbookCategoryMap: { type: Map },
      aggregatedData: { type: Array },
      grandTotal: { type: Object },
      showRawData: { type: Boolean },
      rawApiResponse: { type: String },
      isSettingsOpen: { type: Boolean },
      initialized: { type: Boolean },
      theme: { type: String, reflect: true },
      excludedPlaybooks: { type: Object },
      tenantList: { type: Array },
      selectedTenantId: { type: String },
      tenantNameMap: { type: Map },
      activeTab: { type: String },
      kpiCardOrder: { type: Array },
      playbookColumnOrder: { type: Array },
      actionColumnOrder: { type: Array },
      wizardVisible: { type: Boolean },
      wizardCompleted: { type: Boolean },
      releaseNotesVisible: { type: Boolean },
      helpModalVisible: { type: Boolean },
      lastSeenVersion: { type: String },
      annualLicenseCost: { type: Number },
      showValueMeter: { type: Boolean },
      _wizardTime: { type: Number },
      _wizardCost: { type: Number },
      _wizardLicense: { type: Number },
      currentPage: { type: Number },
      itemsPerPage: { type: Number },
      actionTypes: { type: Array },
      connectorNames: { type: Array },
      selectedActionType: { type: String },
      selectedConnectorName: { type: String },
      selectedCategory: { type: String },
      modalCategory: { type: String },
      actionCategoryMap: { type: Map },
      actionConfigMap: { type: Map },
      reportingData: { type: Object },
      _tempSettings: { type: Object },
      _debounceTimeout: { type: Object },
      sortColumn: { type: String },
      sortDirection: { type: String },
      tableCollapsed: { type: Boolean },
      categories: { type: Array },
      categoryModalOpen: { type: Boolean },
      editingCategory: { type: Object },
      newCategoryName: { type: String },
      newCategoryId: { type: String },
      settingsModalOpen: { type: Boolean },
      categoryModalOpenedFromSettings: { type: Boolean },
      aiEstimationInProgress: { type: Boolean },
      aiEstimationStatus: { type: String },
      aiCategorizationInProgress: { type: Boolean },
      aiCategorizationStatus: { type: String },
      showSparklines: { type: Boolean },
      lastDataUpdate: { type: Number },
      dailyMetrics: { type: Object },
      loadProgress: { type: Number },
      loadStatus: { type: String }
    };
  }

  constructor() {
    super();
    this.isLoading = true;

    // defaults
    this.defaultTimePerPlaybook = 5;
    this.defaultHourlyRateForPlaybook = 50;
    this.defaultTimePerAction = 1;
    this.defaultHourlyRateForAction = 50;
    this.defaultTimePerHeroAI = 2;
    this.defaultHourlyRateForHeroAI = 50;
    this.annualLicenseCost = 0;
    this.groupBy = 'playbookId';
    this.lookbackDays = 7;
    this.tableCollapsed = false;

    this.apiData = [];
    this.heroAiTotal = 0;
    this.heroAiDailyData = [];
    this.playbookTotalDollars = 0;
    this._playbookTotalsCache = null; // Cache for playbook totals calculation
    this._cacheKey = null; // Key to track if cache is still valid
    this.playbookNameMap = new Map();
    this.playbookMetadataMap = new Map();
    this.playbookConfigMap = new Map();
    this.playbookCategoryMap = new Map();
    this.actionCategoryMap = new Map();
    this.actionConfigMap = new Map();
    this.playbookAiConfigured = new Map(); // Track AI configuration: {time: boolean, category: boolean}
    this.actionAiConfigured = new Map(); // Track AI configuration: {time: boolean, category: boolean}
    this.aggregatedData = [];
    this.grandTotal = { primaryMetric: 0, hours: 0, dollars: 0 };

    this.isSettingsOpen = false;
    this.settingsModalOpen = false;
    this.categoryModalOpenedFromSettings = false;
    this.initialized = false;
    this.theme = 'dark';
    
    // AI Estimation
    this.aiEstimationInProgress = false;
    this.aiEstimationStatus = '';
    this.excludedPlaybooks = new Set();
    
    // AI Categorization
    this.aiCategorizationInProgress = false;
    this.aiCategorizationStatus = '';

    this['context-data'] = null;
    this.tenantList = [{ id: '', name: 'All Tenants' }];
    this.selectedTenantId = '';
    this.tenantNameMap = new Map();

    this.activeTab = 'playbooks';
    this.kpiCardOrder = ['primaryMetric', 'hours', 'dollars', 'avg'];
    this.playbookColumnOrder = ['name', 'parentPlaybook', 'tenantName', 'categoryName', 'totalActions', 'totalHoursSaved', 'totalDollarsSaved'];
    this.actionColumnOrder = ['name', 'tenantName', 'categoryName', 'totalActions', 'totalHoursSaved', 'totalDollarsSaved'];

    this.wizardVisible = false;
    this.wizardCompleted = false;
    this.releaseNotesVisible = false;
    this.helpModalVisible = false;
    this.lastSeenVersion = null;
    this.showValueMeter = false;
    this.showSparklines = false; // Disabled by default
    this.lastDataUpdate = null;
    this.dailyMetrics = {}; // Store daily aggregated metrics
    this.loadProgress = 0;
    this.loadStatus = '';
    this._wizardTime = 5;
    this._wizardCost = 50;
    this._wizardLicense = 100000;

    // Asset storage
    this.settingsAssetId = null;
    this.settingsAssetPoolId = null;

    this.currentPage = 1;
    this.itemsPerPage = 20;

    this.actionTypes = [{ id: '', name: 'All Types' }];
    this.connectorNames = [{ id: '', name: 'All Connectors' }];
    this.selectedActionType = '';
    this.selectedConnectorName = '';
    this.selectedCategory = '';
    this.modalCategory = '';

    this.sortColumn = 'totalDollarsSaved';
    this.sortDirection = 'desc';

    this.reportingData = {
      playbooksByCategory: [],
      actionsByCategory: []
    };

    // Category management
    this.categories = [];
    this.categoryModalOpen = false;
    this.editingCategory = null;
    this.newCategoryName = '';
    this.newCategoryId = '';

    // Settings will be loaded from asset after context-data is available
    this._tempSettings = this.getCurrentSettings();
  }

  // ===== PROGRESS TRACKING & PARALLELIZED FETCH UTILITIES =====
  
  /**
   * Update load progress and status message
   * @param {number} progress - Progress percentage (0-100)
   * @param {string} status - Status message to display
   */
  updateLoadProgress(progress, status) {
    this.loadProgress = Math.min(100, Math.max(0, progress));
    this.loadStatus = status;
    this.requestUpdate();
  }

  /**
   * Parallelized fetch queue with concurrency control
   * @param {Array} items - Array of items to process
   * @param {Function} fetchFn - Async function to call for each item
   * @param {number} concurrency - Max concurrent requests (default: 5)
   * @param {Function} progressCallback - Optional callback for progress updates
   * @returns {Promise<Array>} - Results array
   */
  async parallelFetchQueue(items, fetchFn, concurrency = 5, progressCallback = null) {
    const results = [];
    const executing = [];
    let completed = 0;
    
    for (const [index, item] of items.entries()) {
      const promise = Promise.resolve().then(async () => {
        const result = await fetchFn(item, index);
        completed++;
        
        // Calculate progress if callback provided
        if (progressCallback) {
          const progress = (completed / items.length) * 100;
          progressCallback(progress, completed, items.length);
        }
        
        return result;
      });
      
      results.push(promise);
      executing.push(promise);
      
      // Remove from executing array when done
      promise.then(() => {
        executing.splice(executing.indexOf(promise), 1);
      });
      
      // Wait if we've hit concurrency limit
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
    
    return Promise.all(results);
  }

  /**
   * Load all initial data with progress tracking
   */
  async loadAllData() {
    this.isLoading = true;
    this.updateLoadProgress(0, 'Initializing...');
    
    try {
      // Step 1: Load tenant names (10%)
      this.updateLoadProgress(5, 'Loading tenant information...');
      await this.loadTenantNames();
      this.updateLoadProgress(10, 'Tenant information loaded');
      
      // Step 2: Load playbook metadata (25%)
      this.updateLoadProgress(15, 'Loading playbook metadata...');
      await this.loadPlaybookMetadata();
      await this.loadAllNames();
      this.updateLoadProgress(25, 'Playbook metadata loaded');
      
      // Step 3: Load active tab data in parallel with HeroAI data (75%)
      this.updateLoadProgress(30, 'Loading usage data...');
      
      await Promise.all([
        this.loadActiveTabData().then(() => {
          this.updateLoadProgress(60, 'Usage data loaded');
        }),
        this.loadHeroAiData().then(() => {
          this.updateLoadProgress(75, 'HeroAI data loaded');
        })
      ]);
      
      // Step 4: Process and finalize (100%)
      this.updateLoadProgress(90, 'Processing data...');
      this.lastDataUpdate = Date.now();
      this.updateLoadProgress(100, 'Complete');
      
      // Small delay to show 100% before hiding loader
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('Error loading data:', error);
      this.updateLoadProgress(0, `Error: ${error.message}`);
      throw error;
    } finally {
      this.isLoading = false;
      this.loadProgress = 0;
      this.loadStatus = '';
      this.requestUpdate();
    }
  }

  /**
   * Get current settings as an object
   */
  getCurrentSettings() {
    return {
      defaultTimePerPlaybook: this.defaultTimePerPlaybook,
      defaultHourlyRateForPlaybook: this.defaultHourlyRateForPlaybook,
      defaultTimePerAction: this.defaultTimePerAction,
      defaultHourlyRateForAction: this.defaultHourlyRateForAction,
      defaultTimePerHeroAI: this.defaultTimePerHeroAI,
      defaultHourlyRateForHeroAI: this.defaultHourlyRateForHeroAI,
      annualLicenseCost: this.annualLicenseCost,
      showValueMeter: this.showValueMeter,
      showSparklines: this.showSparklines,
      kpiCardOrder: this.kpiCardOrder,
      playbookColumnOrder: this.playbookColumnOrder,
      actionColumnOrder: this.actionColumnOrder,
      activeTab: this.activeTab,
      theme: this.theme,
      isSettingsOpen: this.isSettingsOpen,
      wizardCompleted: this.wizardCompleted,
      lastSeenVersion: this.lastSeenVersion
    };
  }

  /**
   * Save a single setting to asset storage
   */
  async saveSettingToStorage(key, value) {
    if (!this.settingsAssetData) {
      console.warn('Settings asset not loaded yet, skipping save');
      return;
    }
    
    // Update the setting in the asset data
    if (!this.settingsAssetData.params) {
      this.settingsAssetData.params = {};
    }
    if (!this.settingsAssetData.params.settings) {
      this.settingsAssetData.params.settings = {};
    }
    
    this.settingsAssetData.params.settings[key] = value;
    
    // Save to backend asynchronously
    try {
      const { origin, accountId } = this['context-data'];
      const url = `${origin}/api/assets/${accountId}/${this.settingsAssetData.poolId}/${this.settingsAssetId}`;
      await this.authenticatedPut(url, this.settingsAssetData);
    } catch (error) {
      console.error(`Failed to save ${key} setting:`, error);
    }
  }

  // react to context-data
  updated(changed) {
    super.updated(changed);
    if (changed.has('context-data') && this['context-data'] && !this.initialized) {
      const { origin, accountId, tenantId } = this['context-data'] || {};
      if (origin && accountId && tenantId) {
        this.initialized = true;
        // Load settings from asset first
        this.loadSettingsFromAsset()
          .catch(e => {
            console.error('Failed to load settings:', e);
            // Set defaults so widget can function
            this.categories = [...DEFAULT_CATEGORIES];
            this.wizardCompleted = false;
          })
          .finally(() => {
            // Always continue regardless of success/failure
            this.requestUpdate();
            if (!this.wizardCompleted) {
              this.wizardVisible = true;
              this.isLoading = false;
              setTimeout(() => {
                this.shadowRoot.querySelector('.modal-backdrop')?.classList.add('fade-in');
                this.shadowRoot.querySelector('.modal-content.wizard')?.classList.add('fade-in');
              }, 10);
            } else {
              this.loadAllData().catch(e => {
                console.error('Failed to load data:', e);
                this.isLoading = false;
                this.rawApiResponse = `Failed to load data: ${e.message}`;
              });
            }
          });
      }
    }
    if (changed.has('isSettingsOpen') && this.isSettingsOpen) {
      this._tempSettings = this.getCurrentSettings();
    }
  }

  // storage
  async loadSettingsFromAsset() {
    try {
      const { origin, accountId, tenantId: contextTenantId } = this['context-data'];
      
      if (!origin || !accountId) {
        console.warn('⚠️ Missing origin or accountId, using defaults');
        this.categories = [...DEFAULT_CATEGORIES];
        return;
      }
      
      // Try to get tenant ID from context first, then from tenant list
      let tenantId = contextTenantId || this.selectedTenantId;
      
      // If still no tenant ID, try to load tenant names first
      if (!tenantId) {
        try {
          await this.loadTenantNames();
          tenantId = this.tenantList[1]?.id;
        } catch (tenantError) {
          console.warn('⚠️ Failed to load tenant names:', tenantError);
          this.categories = [...DEFAULT_CATEGORIES];
          return;
        }
      }
      
      if (!tenantId) {
        console.warn('⚠️ No tenant ID available for loading settings');
        // Set default categories so widget can still function
        this.categories = [...DEFAULT_CATEGORIES];
        return;
      }

      // Search for the ROI_Settings asset
      const rqlUrl = origin + apiPaths.assetRql(accountId, tenantId);
      const assetsResponse = await this.authenticatedPost(rqlUrl, { rql: 'limit(100)' });
      
      let asset = assetsResponse?.items?.find(item => item.item?.name === 'ROI_Settings');
      
      if (asset) {
        this.settingsAssetId = asset.item.id;
        this.settingsAssetPoolId = asset.item.poolId;
        
        // Store the complete asset so we can update it properly
        this.settingsAssetData = asset.item;
        
        const settings = asset.item.params?.settings || {};
        
        // Load all settings from the asset
        this.defaultTimePerPlaybook = settings.defaultTimePerPlaybook ?? 5;
        this.defaultHourlyRateForPlaybook = settings.defaultHourlyRateForPlaybook ?? 50;
        this.defaultTimePerAction = settings.defaultTimePerAction ?? 1;
        this.defaultHourlyRateForAction = settings.defaultHourlyRateForAction ?? 50;
        this.defaultTimePerHeroAI = settings.defaultTimePerHeroAI ?? 2;
        this.defaultHourlyRateForHeroAI = settings.defaultHourlyRateForHeroAI ?? 50;
        this.annualLicenseCost = settings.annualLicenseCost ?? 0;
        this.showValueMeter = settings.showValueMeter === true;
        this.showSparklines = settings.showSparklines === true;
        this.kpiCardOrder = settings.kpiCardOrder || ['primaryMetric', 'hours', 'dollars', 'avg'];
        this.playbookColumnOrder = settings.playbookColumnOrder || ['name', 'parentPlaybook', 'tenantName', 'categoryName', 'totalActions', 'totalHoursSaved', 'totalDollarsSaved'];
        this.actionColumnOrder = settings.actionColumnOrder || ['name', 'tenantName', 'categoryName', 'totalActions', 'totalHoursSaved', 'totalDollarsSaved'];
        this.activeTab = settings.activeTab || 'playbooks';
        this.theme = settings.theme || 'dark';
        this.isSettingsOpen = settings.isSettingsOpen === true;
        this.wizardCompleted = settings.wizardCompleted === true;
        this.lastSeenVersion = settings.lastSeenVersion || null;
        this._wizardTime = this.defaultTimePerPlaybook;
        this._wizardCost = this.defaultHourlyRateForPlaybook;
        this._wizardLicense = this.annualLicenseCost;
        
        // Load category mappings
        if (settings.playbookCategories) {
          this.playbookCategoryMap = new Map(Object.entries(settings.playbookCategories));
        }
        if (settings.actionCategories) {
          this.actionCategoryMap = new Map(Object.entries(settings.actionCategories));
        }
        
        // Load individual config mappings (time/cost per playbook/action)
        if (settings.playbookConfigs) {
          this.playbookConfigMap = new Map(Object.entries(settings.playbookConfigs));
        }
        if (settings.actionConfigs) {
          this.actionConfigMap = new Map(Object.entries(settings.actionConfigs));
        }
        
        // Load AI configuration tracking
        if (settings.playbookAiConfigured) {
          this.playbookAiConfigured = new Map(Object.entries(settings.playbookAiConfigured));
        }
        if (settings.actionAiConfigured) {
          this.actionAiConfigured = new Map(Object.entries(settings.actionAiConfigured));
        }
        
        // Load custom categories - always start with defaults and merge saved data
        if (settings.customCategories && settings.customCategories.length > 0) {
          // Start with default categories
          const defaultCats = DEFAULT_CATEGORIES.map(defCat => {
            // Find if this default category was saved (to get visibility state)
            const savedCat = settings.customCategories.find(c => c.id === defCat.id);
            return {
              ...defCat,
              // Preserve visibility state from saved data, default to true
              visible: savedCat?.visible !== undefined ? savedCat.visible : true,
              isDefault: true
            };
          });
          
          // Get custom (non-default) categories
          const defaultCategoryIds = DEFAULT_CATEGORIES.map(c => c.id);
          const customCats = settings.customCategories
            .filter(cat => !defaultCategoryIds.includes(cat.id))
            .map(cat => ({
              ...cat,
              visible: cat.visible !== undefined ? cat.visible : true,
              isDefault: false
            }));
          
          // Merge: defaults first, then custom
          this.categories = [...defaultCats, ...customCats];
        } else {
          // No saved categories, use defaults
          this.categories = [...DEFAULT_CATEGORIES];
        }
        
        // Check if we need to show release notes
        this.checkVersionUpdate();
      } else {
        // Create the asset if it doesn't exist
        try {
          await this.createSettingsAsset(accountId, tenantId, origin);
        } catch (createError) {
          console.warn('⚠️ Failed to create settings asset, using defaults:', createError);
          this.categories = [...DEFAULT_CATEGORIES];
        }
      }
    } catch (e) {
      console.error('❌ Failed to load settings from asset:', e);
      // Set default categories so widget can still function
      this.categories = [...DEFAULT_CATEGORIES];
      // Don't throw - allow widget to continue with defaults
    }
  }

  async createSettingsAsset(accountId, tenantIdParam, origin) {
    try {
      const { tenantId: contextTenantId } = this['context-data'];
      const tenantId = tenantIdParam || contextTenantId || this.tenantList[1]?.id;
      
      if (!tenantId) {
        console.error('❌ Cannot create asset without tenant ID');
        return;
      }
      
      // Find a pool ID from existing assets or use a default
      const rqlUrl = origin + apiPaths.assetRql(accountId, tenantId);
      const assetsResponse = await this.authenticatedPost(rqlUrl, { rql: 'limit(1)' });
      const poolId = assetsResponse?.items?.[0]?.item?.poolId || '6489deef3912ca1a147d176d';
      
      this.settingsAssetPoolId = poolId;
      
      const createUrl = origin + apiPaths.assetCreate(accountId, tenantId);
      const newAsset = {
        name: 'ROI_Settings',
        title: 'ROI Calculator Settings',
        description: 'Stores settings for the ROI Calculator widget',
        testingEnabled: false,
        interval: 15,
        poolId: poolId,
        status: 'active',
        docSchemaVersion: 1,
        connectorAsset: '.custom',
        params: {
          settings: this.buildSettingsObject()
        },
        paramSchema: {
          type: 'object',
          properties: {
            settings: {
              properties: {},
              required: [],
              type: 'object',
              display: {
                jsonEditor: {
                  isDeletable: true,
                  isKeyEditable: true,
                  isChildPropertyDeletable: true,
                  isChildPropertyKeyEditable: true
                }
              }
            }
          }
        },
        testParams: {},
        testParamSchema: {
          type: 'object',
          properties: {}
        },
        isCustom: true
      };
      
      const createdAsset = await this.authenticatedPost(createUrl, newAsset);
      this.settingsAssetId = createdAsset.id;
      this.settingsAssetPoolId = createdAsset.poolId;
      
      // Store the complete asset data for future updates
      this.settingsAssetData = createdAsset;
    } catch (e) {
      console.error('❌ Failed to create settings asset:', e);
    }
  }

  buildSettingsObject() {
    return {
      defaultTimePerPlaybook: this.defaultTimePerPlaybook,
      defaultHourlyRateForPlaybook: this.defaultHourlyRateForPlaybook,
      defaultTimePerAction: this.defaultTimePerAction,
      defaultHourlyRateForAction: this.defaultHourlyRateForAction,
      defaultTimePerHeroAI: this.defaultTimePerHeroAI,
      defaultHourlyRateForHeroAI: this.defaultHourlyRateForHeroAI,
      annualLicenseCost: this.annualLicenseCost,
      showValueMeter: this.showValueMeter,
      showSparklines: this.showSparklines,
      kpiCardOrder: this.kpiCardOrder,
      playbookColumnOrder: this.playbookColumnOrder,
      actionColumnOrder: this.actionColumnOrder,
      activeTab: this.activeTab,
      isSettingsOpen: this.isSettingsOpen,
      wizardCompleted: this.wizardCompleted,
      lastSeenVersion: this.lastSeenVersion,
      playbookCategories: Object.fromEntries(this.playbookCategoryMap),
      actionCategories: Object.fromEntries(this.actionCategoryMap),
      playbookConfigs: Object.fromEntries(this.playbookConfigMap),
      actionConfigs: Object.fromEntries(this.actionConfigMap),
      playbookAiConfigured: Object.fromEntries(this.playbookAiConfigured),
      actionAiConfigured: Object.fromEntries(this.actionAiConfigured),
      customCategories: this.categories
    };
  }

  async saveSettingsToAsset() {
    try {
      if (!this.settingsAssetId) {
        console.error('❌ No asset ID, cannot save settings');
        return;
      }

      if (!this.settingsAssetData) {
        console.error('❌ No asset data stored, cannot update');
        return;
      }

      const { origin, accountId, tenantId: contextTenantId } = this['context-data'];
      const tenantId = contextTenantId || this.selectedTenantId || this.tenantList[1]?.id;
      
      if (!tenantId) {
        console.error('❌ No tenant ID available for saving settings');
        return;
      }


      const updateUrl = origin + apiPaths.assetUpdate(accountId, tenantId, this.settingsAssetId);
      
      // Use the existing asset data and only update the params.settings
      const updatedAsset = {
        ...this.settingsAssetData,
        params: {
          ...this.settingsAssetData.params,
          settings: this.buildSettingsObject()
        }
      };

      await this.authenticatedPut(updateUrl, updatedAsset);
      
      // Update our stored asset data with the new params
      this.settingsAssetData = updatedAsset;
    } catch (e) {
      console.error('❌ Failed to save settings to asset:', e);
    }
  }

  async saveSettingToStorage(key, value) {
    // Update the property and save all settings to the asset
    this[key] = value;
    await this.saveSettingsToAsset();
  }

  async saveCategoryMappings() {
    await this.saveSettingsToAsset();
  }

  async saveActionCategoryMappings() {
    await this.saveSettingsToAsset();
  }

  async saveCategories() {
    await this.saveSettingsToAsset();
  }

  // Helper method to get categories with "All Categories" option for filters
  getCategoriesWithAll() {
    const visibleCategories = this.categories.filter(cat => cat.visible !== false);
    return [{ id: '', name: 'All Categories' }, ...visibleCategories];
  }

  // Helper method to check if an item is AI-configured
  isAiConfigured(itemId) {
    const map = this.activeTab === 'playbooks' ? this.playbookAiConfigured : this.actionAiConfigured;
    const config = map.get(itemId);
    return config && (config.time || config.category);
  }

  // Category management methods
  openCategoryModal(fromSettings = false) {
    // Track if opened from settings modal
    this.categoryModalOpenedFromSettings = fromSettings;
    // Close settings modal if open to avoid layering issues
    if (this.settingsModalOpen) {
      this.settingsModalOpen = false;
    }
    this.categoryModalOpen = true;
    this.editingCategory = null;
    this.newCategoryName = '';
    this.newCategoryId = '';
  }

  closeCategoryModal() {
    this.categoryModalOpen = false;
    this.editingCategory = null;
    this.newCategoryName = '';
    this.newCategoryId = '';
    // Reopen settings modal if category modal was opened from settings
    if (this.categoryModalOpenedFromSettings) {
      this.settingsModalOpen = true;
      this.categoryModalOpenedFromSettings = false;
    }
  }

  openSettingsModal() {
    this.settingsModalOpen = true;
    this._tempSettings = this.getCurrentSettings();
  }

  closeSettingsModal() {
    this.settingsModalOpen = false;
  }

  startEditCategory(category) {
    // Prevent editing default categories
    if (category.isDefault) {
      alert('Default categories cannot be edited.');
      return;
    }
    this.editingCategory = category;
    this.newCategoryName = category.name;
    this.newCategoryId = category.id;
  }

  cancelEditCategory() {
    this.editingCategory = null;
    this.newCategoryName = '';
    this.newCategoryId = '';
  }

  saveCategory() {
    const name = this.newCategoryName.trim();
    const id = this.newCategoryId.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    if (!name) {
      alert('Category name is required');
      return;
    }

    if (this.editingCategory) {
      // Edit existing category (only custom categories can be edited)
      if (this.editingCategory.isDefault) {
        alert('Default categories cannot be edited');
        return;
      }
      const index = this.categories.findIndex(c => c.id === this.editingCategory.id);
      if (index !== -1) {
        const oldId = this.editingCategory.id;
        this.categories[index] = { 
          id, 
          name, 
          isDefault: false, 
          visible: this.editingCategory.visible !== undefined ? this.editingCategory.visible : true 
        };
        
        // Update all mappings that use the old ID
        if (oldId !== id) {
          // Update playbook category mappings
          for (const [key, catId] of this.playbookCategoryMap.entries()) {
            if (catId === oldId) {
              this.playbookCategoryMap.set(key, id);
            }
          }
          // Update action category mappings
          for (const [key, catId] of this.actionCategoryMap.entries()) {
            if (catId === oldId) {
              this.actionCategoryMap.set(key, id);
            }
          }
          this.saveCategoryMappings();
          this.saveActionCategoryMappings();
        }
      }
    } else {
      // Add new category (always custom)
      if (this.categories.find(c => c.id === id)) {
        alert('A category with this ID already exists');
        return;
      }
      this.categories.push({ id, name, isDefault: false, visible: true });
    }

    this.categories = [...this.categories]; // Trigger reactivity
    this.saveCategories();
    this.cancelEditCategory();
    this.requestUpdate();
  }

  deleteCategory(category) {
    // Prevent deletion of default categories
    if (category.isDefault) {
      alert('Default categories cannot be deleted. You can hide them instead.');
      return;
    }

    if (!confirm(`Delete category "${category.name}"? Playbooks and actions assigned to this category will be set to "No Category".`)) {
      return;
    }

    this.categories = this.categories.filter(c => c.id !== category.id);
    
    // Remove from mappings
    for (const [key, catId] of this.playbookCategoryMap.entries()) {
      if (catId === category.id) {
        this.playbookCategoryMap.delete(key);
      }
    }
    for (const [key, catId] of this.actionCategoryMap.entries()) {
      if (catId === category.id) {
        this.actionCategoryMap.delete(key);
      }
    }
    
    this.saveCategories();
    this.saveCategoryMappings();
    this.saveActionCategoryMappings();
    this.requestUpdate();
  }

  toggleCategoryVisibility(category) {
    const index = this.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      this.categories[index] = {
        ...this.categories[index],
        visible: !this.categories[index].visible
      };
      this.categories = [...this.categories]; // Trigger reactivity
      this.saveCategories();
      this.requestUpdate();
    }
  }

  restoreDefaultCategories() {
    if (!confirm('Restore all default categories? This will add back any missing default categories. Custom categories will be preserved.')) {
      return;
    }

    // Get existing category IDs
    const existingIds = new Set(this.categories.map(c => c.id));
    
    // Get default category IDs
    const defaultIds = new Set(DEFAULT_CATEGORIES.map(c => c.id));
    
    // Find missing default categories
    const missingDefaults = DEFAULT_CATEGORIES.filter(defCat => !existingIds.has(defCat.id));
    
    // Get custom categories (not defaults)
    const customCategories = this.categories.filter(cat => !defaultIds.has(cat.id));
    
    // Update existing default categories to ensure they're marked as default
    const updatedDefaults = this.categories
      .filter(cat => defaultIds.has(cat.id))
      .map(cat => ({
        ...cat,
        isDefault: true
      }));
    
    // Add missing defaults
    const restoredDefaults = missingDefaults.map(defCat => ({
      ...defCat,
      visible: true,
      isDefault: true
    }));
    
    // Combine: all defaults (updated + restored) + custom categories
    this.categories = [...updatedDefaults, ...restoredDefaults, ...customCategories];
    
    // Save changes
    this.saveCategories();
    this.requestUpdate();
    
    alert(`Restored ${missingDefaults.length} default categor${missingDefaults.length === 1 ? 'y' : 'ies'}.`);
  }

  // master loader
  async loadAllData() {
    this.isLoading = true;
    this.currentPage = 1;
    try {
      // Load tenant names first (required for other calls)
      await this.loadTenantNames();
      
      // Load all metadata and active tab data in parallel for better performance
      await Promise.all([
        this.loadAllNames(),
        this.loadHeroAiData(),
        this.loadActiveTabData()
      ]);
    } catch (e) {
      console.error(e);
      this.rawApiResponse = `Failed to load data: ${e.message}`;
    } finally {
      this.isLoading = false;
      this.lastDataUpdate = Date.now();
    }
  }

  async loadActiveTabData() {
    this.isLoading = true;
    this.rawApiResponse = '';
    this.currentPage = 1;

    switch (this.activeTab) {
      case 'playbooks':
        await this.loadUsageData('playbooks');
        break;
      case 'actions':
        await this.loadUsageData('actions');
        break;
      case 'heroai':
        await this.loadHeroAiData();
        this.rawApiResponse = `Total HeroAI Prompts: ${this.heroAiTotal}`;
        break;
      case 'reporting':
        // Load both playbooks and actions for reporting
        const savedTab = this.activeTab;
        const savedCategory = this.selectedCategory;
        this.selectedCategory = ''; // Load all data without category filter
        
        await this.loadUsageData('playbooks');
        const playbooksData = [...this.apiData];
        await this.loadUsageData('actions');
        const actionsData = [...this.apiData];
        
        this.activeTab = savedTab;
        this.selectedCategory = savedCategory;
        this.generateReportingData(playbooksData, actionsData);
        break;
    }

    this.processData();
    this.isLoading = false;
  }

  async loadUsageData(type) {
    const { origin, accountId } = this['context-data'];
    const path = apiPaths[type](accountId);
    const url = origin + path;
    
    try {
      // For large lookback periods (>90 days), chunk the requests
      if (this.lookbackDays > 90) {
        console.log(`📊 Loading ${this.lookbackDays} days in chunks...`);
        const allData = await this.loadUsageDataInChunks(type, url);
        this.apiData = allData;
        this.rawApiResponse = `Loaded ${allData.length} records across ${this.lookbackDays} days`;
      } else {
        // Normal single request for ≤90 days
        const body = this.buildDateBody();
        const data = await this.authenticatedPost(url, body);
        this.apiData = Array.isArray(data) ? data : [];
        this.rawApiResponse = JSON.stringify(data, null, 2);
      }
    } catch (e) {
      console.error(`❌ failed to load ${type}`, e);
      this.apiData = [];
      this.rawApiResponse = `Failed to load data: ${e.message}`;
    }
  }

  async loadUsageDataInChunks(type, url) {
    const CHUNK_SIZE = 90; // days per chunk
    const { startDate, endDate } = this.getDateRange();
    const chunks = [];
    
    // Calculate chunks
    let currentStart = new Date(startDate);
    while (currentStart < endDate) {
      const currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + CHUNK_SIZE);
      if (currentEnd > endDate) {
        currentEnd.setTime(endDate.getTime());
      }
      
      chunks.push({
        startDate: new Date(currentStart),
        endDate: new Date(currentEnd)
      });
      
      currentStart.setDate(currentStart.getDate() + CHUNK_SIZE + 1);
    }
    
    console.log(`📦 Splitting ${this.lookbackDays} days into ${chunks.length} chunks of ~${CHUNK_SIZE} days`);
    
    // Load chunks sequentially with progress updates
    const allData = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      this.rawApiResponse = `Loading chunk ${i + 1} of ${chunks.length}...`;
      this.requestUpdate();
      
      // Get all playbook IDs
      const playbookIds = Array.from(this.playbookMetadataMap.keys());
      
      const body = {
        startDate: chunk.startDate.toISOString(),
        endDate: chunk.endDate.toISOString(),
        tenantIds: this.selectedTenantId ? [this.selectedTenantId] : [],
        playbookTypes: [],
        triggerTypes: [],
        playbookIds: playbookIds
      };
      
      try {
        const data = await this.authenticatedPost(url, body);
        if (Array.isArray(data)) {
          allData.push(...data);
          console.log(`✓ Chunk ${i + 1}/${chunks.length}: ${data.length} records`);
        }
      } catch (e) {
        console.error(`❌ Chunk ${i + 1} failed:`, e);
        // Continue with other chunks even if one fails
      }
      
      // Small delay between chunks to avoid overwhelming the server
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`✅ Total records loaded: ${allData.length}`);
    return allData;
  }

  async authenticatedPost(url, body = {}, timeoutMs = 120000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs / 1000} seconds. Try reducing the lookback period.`);
      }
      throw error;
    }
  }

  async authenticatedGet(url, timeoutMs = 60000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`GET failed: ${res.statusText}`);
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
      }
      throw error;
    }
  }

  async authenticatedPut(url, body = {}) {
    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`PUT failed: ${res.statusText}`);
    return res.json();
  }

  async loadTenantNames() {
    try {
      const { origin, accountId } = this['context-data'];
      const data = await this.authenticatedGet(origin + apiPaths.tenantNames(accountId));
      if (data?.viewModels) {
        this.tenantNameMap = new Map(data.viewModels.map(t => [t.id, t.name]));
        this.tenantList = [{ id: '', name: 'All Tenants' }, ...data.viewModels.map(t => ({ id: t.id, name: t.name }))];
      }
    } catch (e) {
      console.error('tenant load error', e);
      this.tenantList = [{ id: '', name: 'All Tenants (Error loading)' }];
    }
  }

  normalizePlaybookName(name) {
    if (!name) return name;
    
    // Replace underscores and hyphens with spaces (except for hyphenated words)
    let normalized = name.replace(/_+/g, ' ');
    
    // Title case each word
    normalized = normalized.replace(/\b\w/g, char => char.toUpperCase());
    
    return normalized;
  }

  getParentPlaybookName(playbookId) {
    const metadata = this.playbookMetadataMap.get(playbookId);
    if (!metadata) {
      console.warn(`⚠️ No metadata found for playbookId: ${playbookId}`);
      return 'Unknown';
    }
    
    let result;
    switch (metadata.type) {
      case 'classic':
        result = 'Classic';
        break;
      case 'flow':
        // For flows, return the normalized parent playbook name (the 'name' field)
        result = this.normalizePlaybookName(metadata.name);
        break;
      case 'component':
        result = 'Component';
        break;
      default:
        result = metadata.type || 'Unknown';
    }
    
    return result;
  }

  async loadPlaybookMetadata() {
    const { origin, accountId } = this['context-data'];
    try {
      const url = origin + apiPaths.playbooksMeta(accountId);
      const data = await this.authenticatedGet(url);
      
      if (data && Array.isArray(data)) {
        data.forEach(playbook => {
          if (!playbook.playbookId || !playbook.name) {
            console.warn('⚠️ Skipping playbook with missing data:', playbook);
            return;
          }
          
          
          // Store full metadata
          this.playbookMetadataMap.set(playbook.playbookId, {
            type: playbook.type,
            name: playbook.name,
            flowName: playbook.flowName || '',
            tenantId: playbook.tenantId
          });
          
          let displayName;
          
          // Handle different playbook types
          switch (playbook.type) {
            case 'classic':
              // Classic playbooks: just use the normalized name
              displayName = this.normalizePlaybookName(playbook.name);
              break;
              
            case 'flow':
              // Flow playbooks: flowName is the actual flow name to display
              // name is the parent playbook name
              if (playbook.flowName && playbook.flowName.trim() !== '') {
                displayName = this.normalizePlaybookName(playbook.flowName);
              } else {
                displayName = this.normalizePlaybookName(playbook.name);
              }
              break;
              
            case 'component':
              // Component playbooks: use the normalized name
              displayName = this.normalizePlaybookName(playbook.name);
              break;
              
            default:
              // Unknown type: use normalized name
              displayName = this.normalizePlaybookName(playbook.name);
          }
          
          this.playbookNameMap.set(playbook.playbookId, displayName);
        });
      }
    } catch (e) {
      console.error('❌ Failed to load playbook metadata', e);
    }
  }

  async loadAllNames() {
    const { origin, accountId } = this['context-data'];
    const nameMap = new Map();
    const requests = [];

    // First load playbook metadata from the /playbooks endpoint
    await this.loadPlaybookMetadata();
    
    // Start with the playbook metadata
    for (const [key, value] of this.playbookNameMap.entries()) {
      nameMap.set(key, value);
    }

    // Then load solutions and components for additional names
    for (let i = 1; i < this.tenantList.length; i++) {
      const t = this.tenantList[i];
      if (!t.id) continue;
      requests.push(this.authenticatedPost(origin + apiPaths.solutions(accountId, t.id)));
      requests.push(this.authenticatedPost(origin + apiPaths.components(accountId, t.id)));
    }

    const results = await Promise.allSettled(requests);
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value?.items) {
        r.value.items.forEach(item => {
          // Only add if not already in the map (prioritize playbook metadata over solution/component names)
          if (item.playbookIds && item.name) {
            item.playbookIds.forEach(id => {
              if (!nameMap.has(id)) {
                nameMap.set(id, item.name);
              }
            });
          }
          if (item.playbookId && item.name && !nameMap.has(item.playbookId)) {
            nameMap.set(item.playbookId, item.name);
          }
        });
      }
    });

    this.playbookNameMap = nameMap;
  }

  getDateRange() {
    // Get current date in UTC
    const now = new Date();
    
    // End date: YESTERDAY at end of day in UTC (23:59:59.999)
    const endDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 1,  // Yesterday
      23, 59, 59, 999
    ));
    
    // Start date: lookbackDays before yesterday at beginning of that day in UTC (00:00:00.000)
    const startDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 1 - this.lookbackDays,  // Yesterday minus lookbackDays
      0, 0, 0, 0
    ));
    
    return { startDate, endDate };
  }

  buildDateBody() {
    const { startDate, endDate } = this.getDateRange();
    
    // Get all playbook IDs from the metadata map
    const playbookIds = Array.from(this.playbookMetadataMap.keys());
    
    if (playbookIds.length === 0) {
      console.warn('⚠️ Building payload with 0 playbook IDs - metadata may not be loaded yet!');
    } else {
    }
    
    const payload = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tenantIds: this.selectedTenantId ? [this.selectedTenantId] : [],
      playbookTypes: [],
      triggerTypes: [],
      playbookIds: playbookIds
    };
    
    return payload;
  }
  

  async loadHeroAiData() {
    const { origin, accountId } = this['context-data'];
    const { startDate, endDate } = this.getDateRange();
    
    // Build tenant IDs query parameter
    let tenantQuery = '';
    if (this.selectedTenantId) {
      // Single tenant selected
      tenantQuery = `&TenantIds=${this.selectedTenantId}`;
    } else {
      // "All Tenants" selected - need to pass all tenant IDs
      const tenantIds = this.tenantList
        .filter(t => t.id) // Filter out the "All Tenants" option which has empty id
        .map(t => t.id);
      
      if (tenantIds.length > 0) {
        tenantQuery = '&' + tenantIds.map(id => `TenantIds=${id}`).join('&');
      }
    }
    
    const url = `${origin}${apiPaths.heroai(accountId)}?FromDate=${startDate.toISOString()}&ToDate=${endDate.toISOString()}${tenantQuery}`;
    
    try {
      const data = await this.authenticatedGet(url);
      this.heroAiTotal = data.totalMetricCount || 0;
      this.heroAiDailyData = data.hitsPerDay || []; // Store daily data for sparklines
    } catch (e) {
      console.error('hero load error', e);
      this.heroAiTotal = 0;
      this.heroAiDailyData = [];
    }
  }

  async calculatePlaybookTotalsForHeroAI() {
    // Calculate total playbook savings for ROI bar on HeroAI tab
    try {
      const { origin, accountId } = this['context-data'];
      
      // Generate cache key based on relevant parameters
      const cacheKey = `${this.selectedTenantId}-${this.lookbackDays}-${this.defaultTimePerPlaybook}-${this.defaultHourlyRateForPlaybook}`;
      
      // Return cached value if still valid
      if (this._cacheKey === cacheKey && this._playbookTotalsCache !== null) {
        this.playbookTotalDollars = this._playbookTotalsCache;
        return;
      }
      
      const path = apiPaths.playbooks(accountId);
      const body = this.buildDateBody();
      const url = origin + path;
      
      const playbooksData = await this.authenticatedPost(url, body);
      if (!Array.isArray(playbooksData)) {
        this.playbookTotalDollars = 0;
        this._playbookTotalsCache = 0;
        this._cacheKey = cacheKey;
        return;
      }

      // Optimize: Use reduce instead of loop for better performance
      const totalHours = playbooksData.reduce((sum, item) => {
        const config = this.getEffectiveConfig(
          this.playbookConfigMap,
          item.playbookId,
          { time: this.defaultTimePerPlaybook, cost: this.defaultHourlyRateForPlaybook }
        );
        const count = item.count || 0;
        return sum + ((count * config.time) / 60);
      }, 0);
      
      const result = totalHours * this.defaultHourlyRateForPlaybook;
      
      // Cache the result
      this.playbookTotalDollars = result;
      this._playbookTotalsCache = result;
      this._cacheKey = cacheKey;
    } catch (e) {
      console.error('Failed to calculate playbook totals for HeroAI:', e);
      this.playbookTotalDollars = 0;
    }
  }

  // main process router
  async processData() {
    this.currentPage = 1;
    if (this.activeTab === 'heroai') {
      const h = (this.heroAiTotal * this.defaultTimePerHeroAI) / 60;
      this.grandTotal = {
        primaryMetric: this.heroAiTotal,
        hours: h,
        dollars: h * this.defaultHourlyRateForHeroAI
      };
      this.aggregatedData = [];
      
      // Calculate daily metrics for sparklines
      this.calculateDailyMetrics();
      
      // Calculate playbook savings for ROI bar (but not displayed in KPI cards)
      // Run asynchronously without blocking UI
      this.calculatePlaybookTotalsForHeroAI().then(() => this.requestUpdate());
      
      return;
    }

    // Reset playbook totals for non-HeroAI tabs
    this.playbookTotalDollars = 0;

    if (this.activeTab === 'reporting') {
      // Reporting tab doesn't use aggregatedData
      this.aggregatedData = [];
      this.grandTotal = {};
      return;
    }

    if (!this.apiData) {
      this.aggregatedData = [];
      this.grandTotal = {};
      return;
    }

    if (this.activeTab === 'playbooks') this.processPlaybookData();
    if (this.activeTab === 'actions') this.processActionData();

    this.sortAggregatedData();
    this.calculateDailyMetrics();
  }

  calculateDailyMetrics() {
    // Calculate daily metrics for sparklines
    const dailyData = new Map();
    
    // Handle HeroAI tab differently - it has its own daily data structure
    if (this.activeTab === 'heroai') {
      if (!this.heroAiDailyData || this.heroAiDailyData.length === 0) {
        this.dailyMetrics = {};
        return;
      }
      
      for (const item of this.heroAiDailyData) {
        const dateKey = item.date;
        const runs = item.runs || 0;
        const hours = (runs * this.defaultTimePerHeroAI) / 60;
        const dollars = hours * this.defaultHourlyRateForHeroAI;
        
        dailyData.set(dateKey, {
          primaryMetric: runs,
          hours: hours,
          dollars: dollars
        });
      }
    } else {
      // Handle playbooks and actions
      if (!this.apiData || this.apiData.length === 0) {
        this.dailyMetrics = {};
        return;
      }
      
      for (const item of this.apiData) {
        // Extract date from item (if available)
        let dateKey = item.date || item.day || item.runDate;
        
        // If no date field, distribute evenly across lookback period
        if (!dateKey) {
          // For now, aggregate all data (will be shown as flat line)
          dateKey = 'total';
        }
        
        const current = dailyData.get(dateKey) || { primaryMetric: 0, hours: 0, dollars: 0 };
        
        // Calculate metrics based on active tab
        if (this.activeTab === 'playbooks') {
          const config = this.getEffectiveConfig(
            this.playbookConfigMap,
            item.playbookId,
            { time: this.defaultTimePerPlaybook, cost: this.defaultHourlyRateForPlaybook }
          );
          const count = item.count || 0;
          const hours = (count * config.time) / 60;
          const dollars = hours * config.cost;
          
          current.primaryMetric += count;
          current.hours += hours;
          current.dollars += dollars;
        } else if (this.activeTab === 'actions') {
          const config = this.getEffectiveConfig(
            this.actionConfigMap,
            item.name,
            { time: this.defaultTimePerAction, cost: this.defaultHourlyRateForAction }
          );
          const count = item.count || 0;
          const hours = (count * config.time) / 60;
          const dollars = hours * config.cost;
          
          current.primaryMetric += count;
          current.hours += hours;
          current.dollars += dollars;
        }
        
        dailyData.set(dateKey, current);
      }
    }
    
    // Convert to sorted arrays by date
    const sortedDates = Array.from(dailyData.keys()).sort();
    const primaryMetricArray = sortedDates.map(d => dailyData.get(d).primaryMetric);
    const hoursArray = sortedDates.map(d => dailyData.get(d).hours);
    const dollarsArray = sortedDates.map(d => dailyData.get(d).dollars);
    
    // Calculate average (per day)
    const avgArray = primaryMetricArray.map(v => v); // For avg, we'll just use the daily count as-is
    
    this.dailyMetrics = {
      dates: sortedDates,
      primaryMetric: primaryMetricArray,
      hours: hoursArray,
      dollars: dollarsArray,
      avg: avgArray
    };
  }

  generateReportingData(playbooksData, actionsData) {
    // Process playbooks by category
    const playbooksByCat = new Map();
    let totalPlaybookRuns = 0;
    let totalPlaybookHours = 0;

    for (const item of playbooksData) {
      // Include all runs regardless of status
      
      const playbookId = item.playbookId;
      const category = this.playbookCategoryMap.get(playbookId) || '';
      const categoryName = category ? this.categories.find(c => c.id === category)?.name || 'No Category' : 'No Category';
      
      const config = this.getEffectiveConfig(
        this.playbookConfigMap,
        playbookId,
        { time: this.defaultTimePerPlaybook, cost: this.defaultHourlyRateForPlaybook }
      );

      const count = item.count || 0;
      const hours = (count * config.time) / 60;

      const current = playbooksByCat.get(categoryName) || { runs: 0, hours: 0 };
      current.runs += count;
      current.hours += hours;
      playbooksByCat.set(categoryName, current);

      totalPlaybookRuns += count;
      totalPlaybookHours += hours;
    }

    this.reportingData.playbooksByCategory = Array.from(playbooksByCat.entries())
      .filter(([name]) => {
        // Filter out hidden categories (but keep "No Category")
        if (name === 'No Category') return true;
        const category = this.categories.find(c => c.name === name);
        return !category || category.visible !== false;
      })
      .map(([name, data]) => ({
        category: name,
        runs: data.runs,
        hours: data.hours,
        percentage: totalPlaybookRuns > 0 ? (data.runs / totalPlaybookRuns) * 100 : 0
      }))
      .sort((a, b) => b.runs - a.runs);

    // Process actions by category - Calculate license cost allocation
    const actionsByCat = new Map();
    let totalActionCount = 0;
    
    // First pass: calculate total action count
    for (const item of actionsData) {
      // Include all actions regardless of status
      totalActionCount += item.count || 0;
    }
    
    // Calculate cost per action based on annual license cost
    const costPerAction = totalActionCount > 0 ? this.annualLicenseCost / totalActionCount : 0;
    let totalActionCost = 0;

    // Second pass: calculate costs by category
    for (const item of actionsData) {
      // Include all actions regardless of status

      const actionName = item.action
        ? `${item.connectorTitle || item.connector} - ${item.action}`
        : `${this.playbookNameMap.get(item.playbookId) || item.playbookId} - ${item.type}`;

      const category = this.actionCategoryMap.get(actionName) || '';
      const categoryName = category ? this.categories.find(c => c.id === category)?.name || 'No Category' : 'No Category';

      const count = item.count || 0;
      const cost = count * costPerAction; // License cost allocation for this action
      const hours = (count * this.defaultTimePerAction) / 60;

      const current = actionsByCat.get(categoryName) || { actions: 0, cost: 0, hours: 0 };
      current.actions += count;
      current.cost += cost;
      current.hours += hours;
      actionsByCat.set(categoryName, current);

      totalActionCost += cost;
    }

    this.reportingData.actionsByCategory = Array.from(actionsByCat.entries())
      .filter(([name]) => {
        // Filter out hidden categories (but keep "No Category")
        if (name === 'No Category') return true;
        const category = this.categories.find(c => c.name === name);
        return !category || category.visible !== false;
      })
      .map(([name, data]) => ({
        category: name,
        actions: data.actions,
        hours: data.hours,
        cost: data.cost, // License cost allocation
        percentage: totalActionCost > 0 ? (data.cost / totalActionCost) * 100 : 0
      }))
      .sort((a, b) => b.cost - a.cost);
  }

  // ---- processors (same logic as your original, but tighter) ----
  processPlaybookData() {
  const aggregationMap = new Map();
  let total = { primaryMetric: 0, hours: 0, dollars: 0 };

  for (const item of this.apiData) {
    // Include all runs regardless of status

    let key;
    if (this.groupBy === 'playbookId') key = item.playbookId || 'Unknown';
    else if (this.groupBy === 'fqn') key = item.fqn || 'Unknown';
    else key = item.tenantId || 'Unknown';

    let displayName = key;
    if (this.groupBy === 'playbookId') {
      displayName = this.playbookNameMap.get(key) || key;
    }
    else if (this.groupBy === 'tenantId') displayName = this.tenantNameMap.get(key) || key;

    const current = aggregationMap.get(key) || { 
      count: 0, 
      name: displayName, 
      playbookId: item.playbookId,
      tenantId: item.tenantId
    };
    current.count += (item.count || 0);
    aggregationMap.set(key, current);
  }

  const included = [];
  const excluded = [];

  for (const [key, data] of aggregationMap.entries()) {
    const config = this.getEffectiveConfig(
      this.playbookConfigMap,
      data.playbookId,
      {
        time: this.defaultTimePerPlaybook,
        cost: this.defaultHourlyRateForPlaybook
      }
    );

    const totalActions = data.count;
    const totalHoursSaved = (totalActions * config.time) / 60;
    const totalDollarsSaved = totalHoursSaved * config.cost;
    const isExcluded = this.excludedPlaybooks.has(key);
    const tenantId = data.tenantId;
    const tenantName = this.tenantNameMap.get(tenantId) || tenantId || 'Unknown';
    const hasCustomConfig = this.playbookConfigMap.has(data.playbookId);
    const category = this.playbookCategoryMap.get(data.playbookId) || '';
    const categoryName = category ? this.categories.find(c => c.id === category)?.name || '' : '';

    // Apply category filter
    if (this.selectedCategory && category !== this.selectedCategory) continue;

    const dataObject = {
      id: key,
      playbookId: data.playbookId,
      name: data.name,
      parentPlaybook: this.getParentPlaybookName(data.playbookId),
      tenantName: tenantName,
      category: category,
      categoryName: categoryName,
      totalActions: totalActions,
      totalHoursSaved: totalHoursSaved,
      totalDollarsSaved: totalDollarsSaved,
      isExcluded: isExcluded,
      hasCustomConfig: hasCustomConfig
    };

    if (isExcluded) excluded.push(dataObject);
    else included.push(dataObject);
  }

  total = included.reduce((acc, row) => {
    acc.primaryMetric += row.totalActions;
    acc.hours += row.totalHoursSaved;
    acc.dollars += row.totalDollarsSaved;
    return acc;
  }, { primaryMetric: 0, hours: 0, dollars: 0 });

  this.aggregatedData = [...included, ...excluded];
  this.grandTotal = total;
}
/**
 * Merges global defaults with any custom per-item config.
 */
getEffectiveConfig(configMap, id, defaults) {
  const custom = configMap.get(id) || {};
  return {
    time: custom.time ?? defaults.time,
    cost: custom.cost ?? defaults.cost
  };
}
  processActionData() {
    // collect filters
    const types = new Set();
    const connectors = new Set();
    this.apiData.forEach(i => {
      if (i.type) types.add(i.type);
      if (i.connectorTitle) connectors.add(i.connectorTitle);
    });
    this.actionTypes = [{ id: '', name: 'All Types' }, ...[...types].sort().map(t => ({ id: t, name: t }))];
    this.connectorNames = [{ id: '', name: 'All Connectors' }, ...[...connectors].sort().map(c => ({ id: c, name: c }))];

    const filtered = this.apiData.filter(i => {
      if (this.selectedActionType && i.type !== this.selectedActionType) return false;
      if (this.selectedConnectorName && i.connectorTitle !== this.selectedConnectorName) return false;
      return true; // Include all runs regardless of status
    });

    const map = new Map();
    for (const item of filtered) {
      const name = item.action
        ? `${item.connectorTitle || item.connector} - ${item.action}`
        : `${this.playbookNameMap.get(item.playbookId) || item.playbookId} - ${item.type}`;

      const entry = map.get(name) || { count: 0, tenantId: item.tenantId, name };
      entry.count += item.count || 0;
      map.set(name, entry);
    }

    const included = [];
    const excluded = [];
    for (const [key, data] of map.entries()) {
      const cfg = this.getEffectiveConfig(
        this.actionConfigMap,
        key,
        { time: this.defaultTimePerAction, cost: this.defaultHourlyRateForAction }
      );
      const hours = (data.count * cfg.time) / 60;
      const dollars = hours * cfg.cost;
      const isExcluded = this.excludedPlaybooks.has(key);
      const tenantName = this.tenantNameMap.get(data.tenantId) || data.tenantId || 'Unknown';
      const category = this.actionCategoryMap.get(key) || '';
      const categoryName = category ? this.categories.find(c => c.id === category)?.name || '' : '';
      const hasCustomConfig = this.actionConfigMap.has(key);

      // Apply category filter
      if (this.selectedCategory && category !== this.selectedCategory) continue;

      const row = {
        id: key,
        name: data.name,
        tenantName,
        category: category,
        categoryName: categoryName,
        totalActions: data.count,
        totalHoursSaved: hours,
        totalDollarsSaved: dollars,
        isExcluded,
        hasCustomConfig
      };
      (isExcluded ? excluded : included).push(row);
    }

    const total = included.reduce(
      (acc, r) => {
        acc.primaryMetric += r.totalActions;
        acc.hours += r.totalHoursSaved;
        acc.dollars += r.totalDollarsSaved;
        return acc;
      },
      { primaryMetric: 0, hours: 0, dollars: 0 }
    );

    this.aggregatedData = [...included, ...excluded];
    this.grandTotal = total;
  }

  // sorting
  handleSort(col) {
    if (this.sortColumn === col) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    else {
      this.sortColumn = col;
      this.sortDirection = 'desc';
    }
    this.sortAggregatedData();
  }
  sortAggregatedData() {
    if (!this.sortColumn) return;
    const included = this.aggregatedData.filter(r => !r.isExcluded);
    const excluded = this.aggregatedData.filter(r => r.isExcluded);
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    const sorter = (a, b) => {
      const va = a[this.sortColumn];
      const vb = b[this.sortColumn];
      if (typeof va === 'string') return va.toLowerCase().localeCompare(vb.toLowerCase()) * dir;
      return (va - vb) * dir;
    };
    included.sort(sorter);
    excluded.sort(sorter);
    this.aggregatedData = [...included, ...excluded];
  }

  // settings
  getCurrentSettings() {
    return {
      defaultTimePerPlaybook: this.defaultTimePerPlaybook,
      defaultHourlyRateForPlaybook: this.defaultHourlyRateForPlaybook,
      defaultTimePerAction: this.defaultTimePerAction,
      defaultHourlyRateForAction: this.defaultHourlyRateForAction,
      defaultTimePerHeroAI: this.defaultTimePerHeroAI,
      defaultHourlyRateForHeroAI: this.defaultHourlyRateForHeroAI,
      lookbackDays: this.lookbackDays,
      selectedTenantId: this.selectedTenantId,
      groupBy: this.groupBy,
      selectedActionType: this.selectedActionType,
      selectedConnectorName: this.selectedConnectorName,
      selectedCategory: this.selectedCategory,
      annualLicenseCost: this.annualLicenseCost,
      showValueMeter: this.showValueMeter,
      showSparklines: this.showSparklines,
      playbookColumnOrder: this.playbookColumnOrder,
      actionColumnOrder: this.actionColumnOrder
    };
  }

  handleConfigChange(e) {
  const { name, value, type, checked } = e.target;

  // Always update temporary settings
  this._tempSettings = {
    ...this._tempSettings,
    [name]: type === 'checkbox' ? checked : value
  };

  // 🔹 Add a visual cue for unsaved changes
  const applyBtn = this.shadowRoot?.querySelector('.apply-button');
  if (applyBtn) {
    applyBtn.classList.add('unsaved');
  }

  // 🔹 Debounce number/text changes (still won't apply until Apply is clicked)
  if (type === 'number' || type === 'text') {
    if (this._debounceTimeout) clearTimeout(this._debounceTimeout);
    this._debounceTimeout = setTimeout(() => {
      // Do nothing yet — only Apply triggers API or chart updates
    }, 500);
  }

  // 🔹 For checkboxes (like Value/Cost Meter), no immediate changes to charts
  // but reflect the switch position
  this.requestUpdate();
}

  resetToDefaults() {
    // Reset all settings to defaults
    this.defaultTimePerPlaybook = 5;
    this.defaultHourlyRateForPlaybook = 50;
    this.defaultTimePerAction = 2;
    this.defaultHourlyRateForAction = 50;
    this.defaultTimePerHeroAI = 5;
    this.defaultHourlyRateForHeroAI = 50;
    this.lookbackDays = 7;
    this.selectedTenantId = '';
    this.annualLicenseCost = 0;
    this.showValueMeter = false;
    this.showSparklines = false;
    this.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    this.playbookCategoryMap.clear();
    this.actionCategoryMap.clear();
    this.playbookConfigMap.clear();
    this.actionConfigMap.clear();
    this.playbookAiConfigured.clear();
    this.actionAiConfigured.clear();
    
    // Update temp settings
    this._tempSettings = {
      defaultTimePerPlaybook: this.defaultTimePerPlaybook,
      defaultHourlyRateForPlaybook: this.defaultHourlyRateForPlaybook,
      defaultTimePerAction: this.defaultTimePerAction,
      defaultHourlyRateForAction: this.defaultHourlyRateForAction,
      defaultTimePerHeroAI: this.defaultTimePerHeroAI,
      defaultHourlyRateForHeroAI: this.defaultHourlyRateForHeroAI,
      lookbackDays: this.lookbackDays,
      selectedTenantId: this.selectedTenantId,
      annualLicenseCost: this.annualLicenseCost,
      showValueMeter: this.showValueMeter,
      showSparklines: this.showSparklines
    };
    
    // Save and reload
    this.saveSettingsToAsset();
    this.loadAllData();
    this.requestUpdate();
  }

  applySettings() {
    if (this._debounceTimeout) clearTimeout(this._debounceTimeout);

    // remove glow once applied
    const applyBtn = this.shadowRoot?.querySelector('.apply-button');
    if (applyBtn) {
       applyBtn.classList.remove('unsaved');
}

    const s = this._tempSettings;
    let reloadAll = false;
    let reloadActive = false;

    if (this.lookbackDays !== +s.lookbackDays) {
      this.lookbackDays = +s.lookbackDays || 1;
      this.saveSettingToStorage('lookbackDays', this.lookbackDays);
      this._cacheKey = null; // Invalidate cache when lookback changes
      reloadAll = true;
    }
    if (this.selectedTenantId !== s.selectedTenantId) {
      this.selectedTenantId = s.selectedTenantId;
      this._cacheKey = null; // Invalidate cache when tenant changes
      reloadActive = true;
    }

    this.annualLicenseCost = +s.annualLicenseCost || 0;
    this.showValueMeter = !!s.showValueMeter;
    this.showSparklines = !!s.showSparklines;
    this.groupBy = s.groupBy;
    this.selectedActionType = s.selectedActionType;
    this.selectedConnectorName = s.selectedConnectorName;
    this.selectedCategory = s.selectedCategory;

// Safely read values only if provided; otherwise preserve current defaults
const parseOrKeep = (val, current) => {
  const num = parseFloat(val);
  return isNaN(num) ? current : num;
};

// Only update the current tab’s time/cost defaults if those fields were actually present
if (this.activeTab === 'playbooks') {
  const timeVal = parseOrKeep(this._tempSettings.defaultTimePerRun, this.defaultTimePerPlaybook);
  const costVal = parseOrKeep(this._tempSettings.defaultHourlyRate, this.defaultHourlyRateForPlaybook);
  this.defaultTimePerPlaybook = timeVal;
  this.defaultHourlyRateForPlaybook = costVal;
  this.saveSettingToStorage('defaultTimePerPlaybook', timeVal);
  this.saveSettingToStorage('defaultHourlyRateForPlaybook', costVal);
} else if (this.activeTab === 'actions') {
  const timeVal = parseOrKeep(this._tempSettings.defaultTimePerRun, this.defaultTimePerAction);
  const costVal = parseOrKeep(this._tempSettings.defaultHourlyRate, this.defaultHourlyRateForAction);
  this.defaultTimePerAction = timeVal;
  this.defaultHourlyRateForAction = costVal;
  this.saveSettingToStorage('defaultTimePerAction', timeVal);
  this.saveSettingToStorage('defaultHourlyRateForAction', costVal);
} else if (this.activeTab === 'heroai') {
  const timeVal = parseOrKeep(this._tempSettings.defaultTimePerRun, this.defaultTimePerHeroAI);
  const costVal = parseOrKeep(this._tempSettings.defaultHourlyRate, this.defaultHourlyRateForHeroAI);
  this.defaultTimePerHeroAI = timeVal;
  this.defaultHourlyRateForHeroAI = costVal;
  this.saveSettingToStorage('defaultTimePerHeroAI', timeVal);
  this.saveSettingToStorage('defaultHourlyRateForHeroAI', costVal);
}

    this.saveSettingToStorage('annualLicenseCost', this.annualLicenseCost);
    this.saveSettingToStorage('showValueMeter', this.showValueMeter);
    this.saveSettingToStorage('showSparklines', this.showSparklines);

    if (reloadAll) this.loadAllData();
    else if (reloadActive) this.loadActiveTabData();
    else {
      this.processData();
      this.requestUpdate();
    }
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
    this.saveSettingToStorage('isSettingsOpen', this.isSettingsOpen);
    if (!this.isSettingsOpen) this._tempSettings = this.getCurrentSettings();
  }

  // checkbox/exclude
  handleCheckboxClick(e, row) {
    e.stopPropagation();
    const set = this.excludedPlaybooks;
    if (set.has(row.id)) set.delete(row.id);
    else set.add(row.id);
    this.processData();
  }

  // row modal
  handleRowClick(row) {
    if (this.activeTab === 'heroai') return;
    if (this.activeTab === 'playbooks' && this.groupBy !== 'playbookId') return;
    
    let map, defTime, defCost;
    
    if (this.activeTab === 'actions') {
      map = this.actionConfigMap;
      defTime = this.defaultTimePerAction;
      defCost = this.defaultHourlyRateForAction;
    } else {
      map = this.playbookConfigMap;
      defTime = this.defaultTimePerPlaybook;
      defCost = this.defaultHourlyRateForPlaybook;
    }

    const cfg = map.get(row.id) || { time: defTime, cost: defCost };
    this.selectedItem = row;
    this.modalTime = cfg.time;
    this.modalCost = cfg.cost;
    
    // Load category
    if (this.activeTab === 'playbooks') {
      this.modalCategory = this.playbookCategoryMap.get(row.playbookId) || '';
    } else if (this.activeTab === 'actions') {
      this.modalCategory = this.actionCategoryMap.get(row.id) || '';
    }
    
    this.isSingleConfigOpen = true;
  }
  closeSingleConfig() {
    this.isSingleConfigOpen = false;
    this.selectedItem = null;
  }
  saveSingleConfig() {
    const id = this.selectedItem.id;
    
    // Save time/cost config
    if (this.activeTab === 'playbooks') {
      this.playbookConfigMap.set(id, { time: this.modalTime, cost: this.modalCost });
      // Clear AI time marker since user manually configured
      const aiConfig = this.playbookAiConfigured.get(id) || {};
      if (aiConfig.time) {
        this.playbookAiConfigured.set(id, { ...aiConfig, time: false });
      }
    } else if (this.activeTab === 'actions') {
      this.actionConfigMap.set(id, { time: this.modalTime, cost: this.modalCost });
      // Clear AI time marker since user manually configured
      const aiConfig = this.actionAiConfigured.get(id) || {};
      if (aiConfig.time) {
        this.actionAiConfigured.set(id, { ...aiConfig, time: false });
      }
    }
    
    // Save category
    if (this.activeTab === 'playbooks') {
      if (this.modalCategory) {
        this.playbookCategoryMap.set(this.selectedItem.playbookId, this.modalCategory);
        // Clear AI category marker since user manually configured
        const aiConfig = this.playbookAiConfigured.get(this.selectedItem.playbookId) || {};
        if (aiConfig.category) {
          this.playbookAiConfigured.set(this.selectedItem.playbookId, { ...aiConfig, category: false });
        }
      } else {
        this.playbookCategoryMap.delete(this.selectedItem.playbookId);
      }
      this.saveCategoryMappings();
    } else if (this.activeTab === 'actions') {
      if (this.modalCategory) {
        this.actionCategoryMap.set(id, this.modalCategory);
        // Clear AI category marker since user manually configured
        const aiConfig = this.actionAiConfigured.get(id) || {};
        if (aiConfig.category) {
          this.actionAiConfigured.set(id, { ...aiConfig, category: false });
        }
      } else {
        this.actionCategoryMap.delete(id);
      }
      this.saveActionCategoryMappings();
    }
    
    this.processData();
    this.closeSingleConfig();
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.saveSettingToStorage('theme', this.theme);
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.kpiCardOrder = ['primaryMetric', 'hours', 'dollars', 'avg'];
    this.saveSettingToStorage('activeTab', tab);
    this._tempSettings = this.getCurrentSettings();
    this.loadActiveTabData();
  }

  async handleRefresh() {
    this.isLoading = true;
    this.requestUpdate();
    
    try {
      // Refresh both the active tab data and HeroAI data in parallel
      await Promise.all([
        this.loadActiveTabData(),
        this.loadHeroAiData()
      ]);
    } catch (e) {
      console.error('Refresh failed:', e);
      this.rawApiResponse = `Failed to refresh data: ${e.message}`;
    } finally {
      this.isLoading = false;
      this.lastDataUpdate = Date.now();
      this.requestUpdate();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  goToNextPage() {
    const max = Math.ceil(this.aggregatedData.length / this.itemsPerPage);
    if (this.currentPage < max) this.currentPage++;
  }

  formatDollars(n) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  formatNumber(n, d = 2) {
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  
  formatLastUpdated() {
    if (!this.lastDataUpdate) return '';
    const now = Date.now();
    const diff = now - this.lastDataUpdate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  }

  getFormattedRawData() {
    try {
      return JSON.stringify(JSON.parse(this.rawApiResponse), null, 2);
    } catch {
      return this.rawApiResponse;
    }
  }

  // drag & drop
  handleDragStart(e, id) {
    e.dataTransfer.setData('text/plain', id);
    e.currentTarget.classList.add('dragging');
  }
  handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }
  handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }
  handleDrop(e, targetId) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const draggedId = e.dataTransfer.getData('text/plain');
    const cards = [...this.kpiCardOrder];
    const di = cards.indexOf(draggedId);
    const ti = cards.indexOf(targetId);
    if (di === -1 || ti === -1 || di === ti) return;
    cards.splice(di, 1);
    cards.splice(ti, 0, draggedId);
    this.kpiCardOrder = cards;
    this.saveSettingToStorage('kpiCardOrder', cards);
    this.shadowRoot.querySelector('.dragging')?.classList.remove('dragging');
  }

  // Column drag handlers
  handleColumnDragStart(e, columnId) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);
    e.currentTarget.classList.add('dragging');
  }

  handleColumnDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  }

  handleColumnDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }

  handleColumnDrop(e, targetId) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const draggedId = e.dataTransfer.getData('text/plain');
    
    // Determine which column order to update based on active tab
    let columns, storageKey;
    if (this.activeTab === 'playbooks') {
      columns = [...this.playbookColumnOrder];
      storageKey = 'playbookColumnOrder';
    } else if (this.activeTab === 'actions') {
      columns = [...this.actionColumnOrder];
      storageKey = 'actionColumnOrder';
    } else {
      return;
    }
    
    const di = columns.indexOf(draggedId);
    const ti = columns.indexOf(targetId);
    if (di === -1 || ti === -1 || di === ti) return;
    
    columns.splice(di, 1);
    columns.splice(ti, 0, draggedId);
    
    if (this.activeTab === 'playbooks') {
      this.playbookColumnOrder = columns;
    } else if (this.activeTab === 'actions') {
      this.actionColumnOrder = columns;
    }
    
    this.saveSettingToStorage(storageKey, columns);
    this.shadowRoot.querySelector('.dragging')?.classList.remove('dragging');
    this.requestUpdate();
  }

  // wizard
  async saveWizardSettings(e) {
    e?.preventDefault?.();
    this.defaultTimePerPlaybook = this._wizardTime;
    this.defaultHourlyRateForPlaybook = this._wizardCost;
    this.defaultTimePerAction = this._wizardTime;
    this.defaultHourlyRateForAction = this._wizardCost;
    this.defaultTimePerHeroAI = this._wizardTime;
    this.defaultHourlyRateForHeroAI = this._wizardCost;
    this.annualLicenseCost = this._wizardLicense;

    // Save wizard completion
    this.wizardCompleted = true;
    
    // If no asset exists yet, create it first
    if (!this.settingsAssetId) {
      const { origin, accountId, tenantId: contextTenantId } = this['context-data'];
      const tenantId = contextTenantId || this.tenantList[1]?.id;
      await this.createSettingsAsset(accountId, tenantId, origin);
    }
    
    await this.saveSettingsToAsset();

    this.shadowRoot.querySelector('.modal-backdrop')?.classList.add('fade-out');
    this.shadowRoot.querySelector('.modal-content.wizard')?.classList.add('fade-out');
    setTimeout(() => {
      this.wizardVisible = false;
      this.loadAllData();
    }, 300);
  }
  skipWizard() {
    this.saveWizardSettings(new Event('submit'));
  }

  // Version management
  checkVersionUpdate() {
    // Show release notes if this is a new version
    if (this.lastSeenVersion !== WIDGET_VERSION && this.wizardCompleted) {
      console.log(`📢 New version detected: ${WIDGET_VERSION} (last seen: ${this.lastSeenVersion || 'none'})`);
      this.releaseNotesVisible = true;
    }
  }

  dismissReleaseNotes() {
    // Hide modal immediately for responsive UI
    this.releaseNotesVisible = false;
    
    // Save in background without blocking
    this.lastSeenVersion = WIDGET_VERSION;
    this.saveSettingsToAsset().catch(err => {
      console.error('Failed to save release notes dismissal:', err);
    });
  }

  showReleaseNotes() {
    this.releaseNotesVisible = true;
  }

  showHelpModal() {
    this.helpModalVisible = true;
  }

  dismissHelpModal() {
    this.helpModalVisible = false;
  }

  // AI Time Estimation
  _generateUUID() {
    // Generate RFC4122 version 4 compliant UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async estimateBatch(itemsToEstimate, origin, accountId, tenantId) {
    // Build the prompt for this batch
    const itemType = this.activeTab === 'playbooks' ? 'playbook/automation' : 'action/integration';
    
    let prompt;
    if (itemType === 'playbook/automation') {
      prompt = `You are analyzing automation workflows to estimate execution times. Below is a list of playbook/automation names. For each one, estimate the typical time in MINUTES it would save a human analyst performing the same task manually.

Playbooks:
${itemsToEstimate.map((name, idx) => `${idx + 1}. ${name}`).join('\n')}

CRITICAL: Respond with ONLY raw JSON. Do NOT wrap in markdown code blocks. Do NOT add any explanatory text before or after the JSON.

Your response must be ONLY this JSON array format:
[{"name": "exact name from list", "minutes": number},{"name": "exact name from list", "minutes": number}]

Time estimation guidelines:
- Simple data lookups: 1-3 minutes
- API integrations: 2-5 minutes
- Complex analysis/enrichment: 5-15 minutes
- Multi-step workflows: 10-30 minutes
- Incident response workflows: 15-60 minutes

Return ONLY the JSON array, nothing else.`;
    } else {
      // Actions - distinguish between integrations and transformations
      prompt = `You are analyzing automation actions to estimate execution times. Below is a list of action names. For each one, estimate the typical time in MINUTES it would save a human analyst performing the same task manually.

IMPORTANT: 
- For ACTIONS (API calls, integrations with external services): Estimate at 5% of what it would take a human (actions execute extremely quickly)
- For TRANSFORMATIONS (data manipulation, parsing, formatting - typically "Core" or data processing actions): Estimate at 0.5% of what it would take a human (transformations are nearly instantaneous)
- Round all time estimates to the hundredths place (2 decimal places)

Actions:
${itemsToEstimate.map((name, idx) => `${idx + 1}. ${name}`).join('\n')}

CRITICAL: Respond with ONLY raw JSON. Do NOT wrap in markdown code blocks. Do NOT add any explanatory text before or after the JSON.

Your response must be ONLY this JSON array format:
[{"name": "exact name from list", "minutes": number},{"name": "exact name from list", "minutes": number}]

Estimation approach:
1. First, estimate how long it would take a human to perform the task manually
2. If it's an ACTION (API call, integration): multiply by 0.05 (5%)
3. If it's a TRANSFORMATION (data manipulation, Core action): multiply by 0.005 (0.5%)
4. Round the result to 2 decimal places (hundredths)

Examples:
- "ServiceNow - Create Incident" (ACTION): Human takes 8 minutes → Estimate 0.40 minutes (5%)
- "Core - Parse JSON" (TRANSFORMATION): Human takes 3 minutes → Estimate 0.02 minutes (0.5%, rounded)
- "VirusTotal - Get IP Report" (ACTION): Human takes 5 minutes → Estimate 0.25 minutes (5%)
- "Core - Format String" (TRANSFORMATION): Human takes 2 minutes → Estimate 0.01 minutes (0.5%)

Return ONLY the JSON array, nothing else.`;
    }

    // Create WebSocket connection
    const AI_CHAT_WS_URL = `${origin.replace('https://', 'wss://').replace('http://', 'ws://')}/hero-ai-chat/chatbot?accountId=${accountId}&tenantId=${tenantId}`;
    
    let fullResponse = '';
    const ws = new WebSocket(AI_CHAT_WS_URL);
    let hasReceivedData = false;

    const responsePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Request timed out after 60 seconds'));
      }, 60000);

      ws.onopen = () => {
        // Send SignalR handshake
        const handshake = { protocol: "json", version: 1 };
        ws.send(JSON.stringify(handshake) + '\x1e');
        
        // Send the prompt after a brief delay
        setTimeout(() => {
          const conversationId = this._generateUUID();
          const signalRMessage = {
            arguments: [{
              question: prompt,
              applicationId: "",
              id: "",
              trackingId: "roi-time-estimation-batch",
              conversationHistories: [],
              conversationId: conversationId
            }],
            invocationId: "0",
            target: "SendPrompt",
            type: 1
          };
          
          ws.send(JSON.stringify(signalRMessage) + '\x1e');
        }, 100);
      };

      ws.onmessage = (event) => {
        hasReceivedData = true;
        
        try {
          const messages = event.data.split('\x1e').filter(msg => msg.trim());
          
          for (const msgStr of messages) {
            if (!msgStr.trim()) continue;
            
            try {
              const data = JSON.parse(msgStr);
              
              if (data.type === undefined && data.error === undefined) {
                // Handshake acknowledged
              } else if (data.type === 1 && data.target === 'onPromptResponse' && data.arguments && data.arguments.length > 0) {
                const responseData = data.arguments[0];
                if (responseData.answer) {
                  fullResponse = responseData.answer;
                }
              } else if (data.type === 2 && data.item) {
                fullResponse += data.item;
              } else if (data.type === 3) {
                if (data.result) {
                  fullResponse = data.result;
                }
                setTimeout(() => ws.close(), 100);
              } else if (data.error) {
                reject(new Error(data.error));
              } else if (data.type === 6) {
                ws.send('{"type":6}\x1e');
              }
            } catch (parseErr) {
              console.error('Error parsing message:', parseErr);
            }
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        reject(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        
        if (fullResponse) {
          resolve(fullResponse);
        } else {
          reject(new Error(`Connection closed without response (code: ${event.code})`));
        }
      };
    });

    const response = await responsePromise;
    
    // Parse the response
    let jsonStr = response.trim();
    
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Extract JSON array
    const jsonMatch = jsonStr.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    // Check if JSON appears to be truncated
    let openBraces = (jsonStr.match(/\[/g) || []).length;
    let closeBraces = (jsonStr.match(/\]/g) || []).length;
    let openCurly = (jsonStr.match(/\{/g) || []).length;
    let closeCurly = (jsonStr.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces || openCurly !== closeCurly) {
      console.warn('JSON appears truncated in batch. Attempting to fix...');
      while (openCurly > closeCurly) {
        jsonStr += '}';
        closeCurly++;
      }
      while (openBraces > closeBraces) {
        jsonStr += ']';
        closeBraces++;
      }
    }
    
    const estimates = JSON.parse(jsonStr);
    
    if (!Array.isArray(estimates)) {
      throw new Error('AI response was not a valid array');
    }
    
    return estimates;
  }

  async estimateTimesWithAI() {
    if (this.aiEstimationInProgress) {
      console.log('AI estimation already in progress');
      return;
    }

    this.aiEstimationInProgress = true;
    this.aiEstimationStatus = 'Analyzing automation items...';
    this.requestUpdate();

    try {
      const { origin, accountId, tenantId } = this['context-data'] || {};
      if (!origin || !accountId || !tenantId) {
        throw new Error('Missing context data');
      }

      // Gather unique playbook and action names
      const playbookNames = new Set();
      const actionNames = new Set();

      // Collect from current data
      this.aggregatedData.forEach(item => {
        if (this.activeTab === 'playbooks' && item.name) {
          playbookNames.add(item.name);
        } else if (this.activeTab === 'actions' && item.name) {
          actionNames.add(item.name);
        }
      });

      const itemsToEstimate = this.activeTab === 'playbooks' 
        ? Array.from(playbookNames)
        : Array.from(actionNames);

      if (itemsToEstimate.length === 0) {
        this.aiEstimationStatus = 'No items to estimate';
        this.aiEstimationInProgress = false;
        this.requestUpdate();
        return;
      }

      // Break into batches of 30 items to avoid truncation
      const BATCH_SIZE = 30;
      const batches = [];
      for (let i = 0; i < itemsToEstimate.length; i += BATCH_SIZE) {
        batches.push(itemsToEstimate.slice(i, i + BATCH_SIZE));
      }

      console.log(`Processing ${itemsToEstimate.length} items in ${batches.length} batches of ~${BATCH_SIZE}`);
      
      // Process each batch
      const allEstimates = [];
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        this.aiEstimationStatus = `Processing batch ${batchIndex + 1} of ${batches.length} (${batch.length} items)...`;
        this.requestUpdate();
        
        try {
          const batchEstimates = await this.estimateBatch(batch, origin, accountId, tenantId);
          allEstimates.push(...batchEstimates);
          console.log(`✓ Batch ${batchIndex + 1}/${batches.length} complete: ${batchEstimates.length} estimates`);
        } catch (batchError) {
          console.error(`Error in batch ${batchIndex + 1}:`, batchError);
          // Continue with other batches even if one fails
        }
      }

      if (allEstimates.length === 0) {
        throw new Error('No estimates were generated from any batch');
      }

      console.log(`Total estimates received: ${allEstimates.length}`);
      
      // Apply all estimates
      this.aiEstimationStatus = 'Applying estimates...';
      this.requestUpdate();
      
      // Apply estimates to configurations
      let appliedCount = 0;
      let skippedCount = 0;
      
      allEstimates.forEach(estimate => {
        if (!estimate.name || !estimate.minutes) {
          console.warn('Skipping invalid estimate:', estimate);
          skippedCount++;
          return;
        }
        
        if (this.activeTab === 'playbooks') {
          // Find playbook ID by name
          // Playbook estimates are set to 25% as playbooks orchestrate multiple actions efficiently
          let found = false;
          for (const [playbookId, name] of this.playbookNameMap.entries()) {
            if (name === estimate.name) {
              this.playbookConfigMap.set(playbookId, {
                time: Math.round(estimate.minutes * 0.25 * 100) / 100,
                cost: this.defaultHourlyRateForPlaybook
              });
              // Mark as AI-configured for time
              const existing = this.playbookAiConfigured.get(playbookId) || {};
              this.playbookAiConfigured.set(playbookId, { ...existing, time: true });
              appliedCount++;
              found = true;
            }
          }
          if (!found) {
            console.warn('Could not find playbook:', estimate.name);
            skippedCount++;
          }
        } else if (this.activeTab === 'actions') {
          // Find action by name
          let found = false;
          this.aggregatedData.forEach(item => {
            if (item.name === estimate.name) {
              this.actionConfigMap.set(item.name, {
                time: Math.round(estimate.minutes * 100) / 100,
                cost: this.defaultHourlyRateForAction
              });
              // Mark as AI-configured for time
              const existing = this.actionAiConfigured.get(item.name) || {};
              this.actionAiConfigured.set(item.name, { ...existing, time: true });
              appliedCount++;
              found = true;
            }
          });
          if (!found) {
            console.warn('Could not find action:', estimate.name);
            skippedCount++;
          }
        }
      });
      
      console.log(`Applied ${appliedCount} estimates, skipped ${skippedCount}`);

      // Save configurations
      if (this.activeTab === 'playbooks') {
        await this.saveCategoryMappings();
      } else if (this.activeTab === 'actions') {
        await this.saveActionCategoryMappings();
      }

      // Recalculate with new estimates
      this.processData();
      
      const statusMsg = skippedCount > 0 
        ? `✓ Applied ${appliedCount} estimates (${skippedCount} skipped)`
        : `✓ Applied ${appliedCount} estimates`;
      
      this.aiEstimationStatus = statusMsg;
      setTimeout(() => {
        this.aiEstimationStatus = '';
        this.aiEstimationInProgress = false;
        this.requestUpdate();
      }, 4000);
      
      this.requestUpdate();

    } catch (error) {
      console.error('Error estimating times with AI:', error);
      
      let errorMsg = error.message;
      if (error instanceof SyntaxError) {
        errorMsg = 'AI response was not valid JSON. Try again or check console for details.';
      }
      
      this.aiEstimationStatus = `⚠️ Error: ${errorMsg}`;
      setTimeout(() => {
        this.aiEstimationStatus = '';
        this.aiEstimationInProgress = false;
        this.requestUpdate();
      }, 8000);
      this.requestUpdate();
    }
  }

  async categorizeBatch(itemsToCategorize, origin, accountId, tenantId) {
    // Build the prompt for this batch with available categories
    const itemType = this.activeTab === 'playbooks' ? 'playbook/automation' : 'action/integration';
    const visibleCategories = this.categories.filter(c => c.visible);
    const categoryList = visibleCategories.map(c => `- ${c.id}: ${c.name}`).join('\n');
    
    const prompt = `You are analyzing automation ${itemType}s to categorize them. Below is a list of ${itemType} names. For each one, assign the most appropriate category from the available options.

Available Categories:
${categoryList}

${itemType === 'playbook/automation' ? 'Playbooks' : 'Actions'} to categorize:
${itemsToCategorize.map((name, idx) => `${idx + 1}. ${name}`).join('\n')}

CRITICAL: Respond with ONLY raw JSON. Do NOT wrap in markdown code blocks. Do NOT add any explanatory text before or after the JSON.

Your response must be ONLY this JSON array format:
[{"name": "exact name from list", "category": "category-id"},{"name": "exact name from list", "category": "category-id"}]

Category Selection Guidelines:
- ai-assisted-analysis: AI/ML analysis, threat intelligence, automated decision making
- collaboration-notification: Messaging, ticketing, notifications, team coordination
- continuous-improvement-governance: Metrics, compliance, auditing, optimization
- detection-analysis: Threat detection, log analysis, pattern matching, security monitoring
- enrichment-context: Data enrichment, lookups, reputation checks, context gathering
- infrastructure-toolchain: Platform management, tool configuration, system operations
- ingestion-normalization: Data collection, parsing, formatting, standardization
- reporting-metrics: Dashboards, reports, KPIs, analytics
- response-remediation: Incident response, remediation actions, blocking, containment
- testing-validation: Testing workflows, validation checks, quality assurance
- uncategorized: When no other category fits

Return ONLY the JSON array with exact category IDs from the list above.`;

    // Create WebSocket connection
    const AI_CHAT_WS_URL = `${origin.replace('https://', 'wss://').replace('http://', 'ws://')}/hero-ai-chat/chatbot?accountId=${accountId}&tenantId=${tenantId}`;
    
    let fullResponse = '';
    const ws = new WebSocket(AI_CHAT_WS_URL);
    let hasReceivedData = false;

    const responsePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Request timed out after 60 seconds'));
      }, 60000);

      ws.onopen = () => {
        // Send SignalR handshake
        const handshake = { protocol: "json", version: 1 };
        ws.send(JSON.stringify(handshake) + '\x1e');
        
        // Send the prompt after a brief delay
        setTimeout(() => {
          const conversationId = this._generateUUID();
          const signalRMessage = {
            arguments: [{
              question: prompt,
              applicationId: "",
              id: "",
              trackingId: "roi-categorization-batch",
              conversationHistories: [],
              conversationId: conversationId
            }],
            invocationId: "0",
            target: "SendPrompt",
            type: 1
          };
          
          ws.send(JSON.stringify(signalRMessage) + '\x1e');
        }, 100);
      };

      ws.onmessage = (event) => {
        hasReceivedData = true;
        
        try {
          const messages = event.data.split('\x1e').filter(msg => msg.trim());
          
          for (const msgStr of messages) {
            if (!msgStr.trim()) continue;
            
            try {
              const data = JSON.parse(msgStr);
              
              if (data.type === undefined && data.error === undefined) {
                // Handshake acknowledged
              } else if (data.type === 1 && data.target === 'onPromptResponse' && data.arguments && data.arguments.length > 0) {
                const responseData = data.arguments[0];
                if (responseData.answer) {
                  fullResponse = responseData.answer;
                }
              } else if (data.type === 2 && data.item) {
                fullResponse += data.item;
              } else if (data.type === 3) {
                if (data.result) {
                  fullResponse = data.result;
                }
                setTimeout(() => ws.close(), 100);
              } else if (data.error) {
                reject(new Error(data.error));
              } else if (data.type === 6) {
                ws.send('{"type":6}\x1e');
              }
            } catch (parseErr) {
              console.error('Error parsing message:', parseErr);
            }
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        reject(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        
        if (fullResponse) {
          resolve(fullResponse);
        } else {
          reject(new Error(`Connection closed without response (code: ${event.code})`));
        }
      };
    });

    const response = await responsePromise;
    
    // Parse the response
    let jsonStr = response.trim();
    
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Extract JSON array
    const jsonMatch = jsonStr.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    // Check if JSON appears to be truncated
    let openBraces = (jsonStr.match(/\[/g) || []).length;
    let closeBraces = (jsonStr.match(/\]/g) || []).length;
    let openCurly = (jsonStr.match(/\{/g) || []).length;
    let closeCurly = (jsonStr.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces || openCurly !== closeCurly) {
      console.warn('JSON appears truncated in batch. Attempting to fix...');
      while (openCurly > closeCurly) {
        jsonStr += '}';
        closeCurly++;
      }
      while (openBraces > closeBraces) {
        jsonStr += ']';
        closeBraces++;
      }
    }
    
    const categorizations = JSON.parse(jsonStr);
    
    if (!Array.isArray(categorizations)) {
      throw new Error('AI response was not a valid array');
    }
    
    return categorizations;
  }

  async autoCategorizeWithAI() {
    if (this.aiCategorizationInProgress) {
      console.log('AI categorization already in progress');
      return;
    }

    this.aiCategorizationInProgress = true;
    this.aiCategorizationStatus = 'Analyzing items for categorization...';
    this.requestUpdate();

    try {
      const { origin, accountId, tenantId } = this['context-data'] || {};
      if (!origin || !accountId || !tenantId) {
        throw new Error('Missing context data');
      }

      // Gather unique playbook and action names
      const itemNames = new Set();
      this.aggregatedData.forEach(item => {
        if (item.name) {
          itemNames.add(item.name);
        }
      });

      const itemsToCategorize = Array.from(itemNames);

      if (itemsToCategorize.length === 0) {
        this.aiCategorizationStatus = 'No items to categorize';
        this.aiCategorizationInProgress = false;
        this.requestUpdate();
        return;
      }

      // Break into batches of 30 items
      const BATCH_SIZE = 30;
      const batches = [];
      for (let i = 0; i < itemsToCategorize.length; i += BATCH_SIZE) {
        batches.push(itemsToCategorize.slice(i, i + BATCH_SIZE));
      }

      console.log(`Categorizing ${itemsToCategorize.length} items in ${batches.length} batches of ~${BATCH_SIZE}`);
      
      // Process each batch
      const allCategorizations = [];
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        this.aiCategorizationStatus = `Categorizing batch ${batchIndex + 1} of ${batches.length} (${batch.length} items)...`;
        this.requestUpdate();
        
        try {
          const batchCategorizations = await this.categorizeBatch(batch, origin, accountId, tenantId);
          allCategorizations.push(...batchCategorizations);
          console.log(`✓ Batch ${batchIndex + 1}/${batches.length} complete: ${batchCategorizations.length} categorizations`);
        } catch (batchError) {
          console.error(`Error in batch ${batchIndex + 1}:`, batchError);
          // Continue with other batches even if one fails
        }
      }

      if (allCategorizations.length === 0) {
        throw new Error('No categorizations were generated from any batch');
      }

      console.log(`Total categorizations received: ${allCategorizations.length}`);
      
      // Apply all categorizations
      this.aiCategorizationStatus = 'Applying categories...';
      this.requestUpdate();
      
      let appliedCount = 0;
      let skippedCount = 0;
      
      allCategorizations.forEach(cat => {
        if (!cat.name || !cat.category) {
          console.warn('Skipping invalid categorization:', cat);
          skippedCount++;
          return;
        }
        
        // Verify the category ID exists
        const categoryExists = this.categories.find(c => c.id === cat.category);
        if (!categoryExists) {
          console.warn(`Unknown category ID: ${cat.category} for item: ${cat.name}`);
          skippedCount++;
          return;
        }
        
        if (this.activeTab === 'playbooks') {
          // Find playbook ID by name
          let found = false;
          for (const [playbookId, name] of this.playbookNameMap.entries()) {
            if (name === cat.name) {
              this.playbookCategoryMap.set(playbookId, cat.category);
              // Mark as AI-configured for category
              const existing = this.playbookAiConfigured.get(playbookId) || {};
              this.playbookAiConfigured.set(playbookId, { ...existing, category: true });
              appliedCount++;
              found = true;
            }
          }
          if (!found) {
            console.warn('Could not find playbook:', cat.name);
            skippedCount++;
          }
        } else if (this.activeTab === 'actions') {
          // Find action by name
          let found = false;
          this.aggregatedData.forEach(item => {
            if (item.name === cat.name) {
              this.actionCategoryMap.set(item.name, cat.category);
              // Mark as AI-configured for category
              const existing = this.actionAiConfigured.get(item.name) || {};
              this.actionAiConfigured.set(item.name, { ...existing, category: true });
              appliedCount++;
              found = true;
            }
          });
          if (!found) {
            console.warn('Could not find action:', cat.name);
            skippedCount++;
          }
        }
      });
      
      console.log(`Applied ${appliedCount} categorizations, skipped ${skippedCount}`);

      // Save configurations
      if (this.activeTab === 'playbooks') {
        await this.saveCategoryMappings();
      } else if (this.activeTab === 'actions') {
        await this.saveActionCategoryMappings();
      }

      // Recalculate with new categories
      this.processData();
      
      const statusMsg = skippedCount > 0 
        ? `✓ Applied ${appliedCount} categories (${skippedCount} skipped)`
        : `✓ Applied ${appliedCount} categories`;
      
      this.aiCategorizationStatus = statusMsg;
      setTimeout(() => {
        this.aiCategorizationStatus = '';
        this.aiCategorizationInProgress = false;
        this.requestUpdate();
      }, 4000);
      
      this.requestUpdate();

    } catch (error) {
      console.error('Error categorizing with AI:', error);
      
      let errorMsg = error.message;
      if (error instanceof SyntaxError) {
        errorMsg = 'AI response was not valid JSON. Try again or check console for details.';
      }
      
      this.aiCategorizationStatus = `⚠️ Error: ${errorMsg}`;
      setTimeout(() => {
        this.aiCategorizationStatus = '';
        this.aiCategorizationInProgress = false;
        this.requestUpdate();
      }, 8000);
      this.requestUpdate();
    }
  }

  // render helpers
  renderSingleConfigModal() {
  if (!this.isSingleConfigOpen || !this.selectedItem) {
    return html``;
  }

  // Position modal centered on screen to prevent cutoff
  const modalStyle = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  `;

  return html`
    <div 
      class="modal-backdrop fade-in" 
      @click=${this.closeSingleConfig}>
    </div>

    <div class="config-modal fade-in" style="${modalStyle}">
      <div class="config-modal-header">
        <span>Configure: ${this.selectedItem.name}</span>
        <button class="close-btn" @click=${this.closeSingleConfig}>×</button>
      </div>

      <div class="config-modal-content">
        <div class="config-modal-item">
          <label for="modalTime">${this.activeTab === 'actions' ? 'Minutes per Action' : 'Minutes per Run'}</label>
          <input
            id="modalTime"
            name="modalTime"
            type="number"
            .value=${this.modalTime}
            @input=${(e) => (this.modalTime = parseFloat(e.target.value) || 0)}
          />
        </div>
        <div class="config-modal-item">
          <label for="modalCost">Cost per Hour ($)</label>
          <input
            id="modalCost"
            name="modalCost"
            type="number"
            .value=${this.modalCost}
            @input=${(e) => (this.modalCost = parseFloat(e.target.value) || 0)}
          />
        </div>
        ${this.activeTab === 'playbooks' || this.activeTab === 'actions' ? html`
          <div class="config-modal-item">
            <label for="modalCategory">Category</label>
            <select
              id="modalCategory"
              name="modalCategory"
              .value=${this.modalCategory}
              @change=${(e) => (this.modalCategory = e.target.value)}
            >
              <option value="">No Category</option>
              ${this.categories.map(cat => html`
                <option value=${cat.id} ?selected=${this.modalCategory === cat.id}>
                  ${cat.name}
                </option>
              `)}
            </select>
          </div>
        ` : ''}
      </div>

      <div class="config-modal-footer">
        <button class="modal-button save-btn" @click=${this.saveSingleConfig}>
          Save
        </button>
      </div>
    </div>
  `;
}

  renderWizard() {
    if (!this.wizardVisible) return html``;
    return html`
      <div class="modal-backdrop"></div>
      <div class="modal-content wizard">
        <div class="wizard-header">
          <h2>ROI Widget Setup</h2>
        </div>
        <form class="wizard-body" @submit=${this.saveWizardSettings}>
          <p class="wizard-subtitle">Provide some defaults — you can change later in Settings.</p>
          
          <div class="wizard-field">
            <label for="wizard-time">Default Minutes Saved per Task</label>
            <input 
              id="wizard-time"
              type="number" 
              step="0.1"
              .value=${this._wizardTime} 
              @input=${e => (this._wizardTime = +e.target.value || 0)} 
            />
          </div>
          
          <div class="wizard-field">
            <label for="wizard-cost">Default Cost per Hour ($)</label>
            <input 
              id="wizard-cost"
              type="number" 
              step="0.1"
              .value=${this._wizardCost} 
              @input=${e => (this._wizardCost = +e.target.value || 0)} 
            />
          </div>
          
          <div class="wizard-field">
            <label for="wizard-license">Annual License Cost ($)</label>
            <input 
              id="wizard-license"
              type="number" 
              step="1"
              .value=${this._wizardLicense} 
              @input=${e => (this._wizardLicense = +e.target.value || 0)} 
            />
          </div>
          
          <div class="wizard-footer">
            <button class="wizard-button secondary" type="button" @click=${this.skipWizard}>Skip</button>
            <button class="wizard-button primary" type="submit">Save and Start</button>
          </div>
        </form>
      </div>
    `;
  }

  renderReleaseNotesModal() {
    if (!this.releaseNotesVisible) return html``;
    
    const currentRelease = RELEASE_NOTES[WIDGET_VERSION];
    if (!currentRelease) return html``;
    
    return html`
      <div class="modal-backdrop fade-in" @click=${this.dismissReleaseNotes}></div>
      <div class="modal-content release-notes fade-in">
        <div class="release-header">
          <div>
            <h2>🎉 What's New in v${WIDGET_VERSION}</h2>
            <p class="release-date">${currentRelease.date}</p>
          </div>
          <button class="close-btn" @click=${this.dismissReleaseNotes}>×</button>
        </div>
        
        <div class="release-body">
          <h3>${currentRelease.title}</h3>
          <ul class="release-changes">
            ${currentRelease.changes.map(change => html`
              <li>${change}</li>
            `)}
          </ul>
        </div>
        
        <div class="release-footer">
          <button class="release-button primary" @click=${this.dismissReleaseNotes}>Got it!</button>
        </div>
      </div>
    `;
  }

  renderHelpModal() {
    if (!this.helpModalVisible) return html``;
    
    return html`
      <div class="modal-backdrop fade-in" @click=${this.dismissHelpModal}></div>
      <div class="modal-content help-modal fade-in">
        <div class="help-header">
          <div>
            <h2>📚 Help & Documentation</h2>
            <p class="help-subtitle">ROI Calculator Widget v${WIDGET_VERSION}</p>
          </div>
          <button class="close-btn" @click=${this.dismissHelpModal}>×</button>
        </div>
        
        <div class="help-body">
          <div class="help-section">
            <h3>🎯 Overview</h3>
            <p>The ROI Calculator Widget helps you measure and visualize the return on investment from your Swimlane automation efforts. It tracks playbook runs, actions, and HeroAI prompts to calculate time saved, cost savings, and ROI metrics.</p>
          </div>

          <div class="help-section">
            <h3>✨ Key Features</h3>
            <ul class="help-list">
              <li><strong>Multi-Tab Analysis:</strong> View data by Playbook Runs, Actions, HeroAI Prompts, or Reporting categories</li>
              <li><strong>Real-Time Metrics:</strong> KPI cards showing total runs, hours saved, cost savings, and average daily usage</li>
              <li><strong>ROI Visualization:</strong> Progress bar displaying your ROI percentage with color-coded indicators</li>
              <li><strong>Sparkline Charts:</strong> Visual trend lines showing daily usage patterns (when enabled)</li>
              <li><strong>Category Management:</strong> Organize and categorize your playbooks and actions for better analysis</li>
              <li><strong>Custom Configuration:</strong> Set hourly rates, license costs, and time estimates per action type</li>
              <li><strong>Dark/Light Theme:</strong> Toggle between themes for comfortable viewing</li>
            </ul>
          </div>

          <div class="help-section">
            <h3>⚙️ Configuration</h3>
            <p>Access settings via the <strong>⚙️</strong> button in the header. Configure:</p>
            <ul class="help-list">
              <li><strong>Hourly Rate:</strong> Your organization's hourly cost (default: $50/hour)</li>
              <li><strong>Time Saved per Action:</strong> Average minutes saved per action type (default: 5 minutes)</li>
              <li><strong>Annual License Cost:</strong> Your Swimlane license cost for ROI calculations (default: $100,000)</li>
              <li><strong>Show Value Meter:</strong> Toggle the bottom row of metrics (Annualized Savings, Net vs License, % ROI)</li>
              <li><strong>Show Sparklines:</strong> Enable/disable trend charts on KPI cards</li>
            </ul>
          </div>

          <div class="help-section">
            <h3>📊 Tabs & Functionality</h3>
            <div class="help-tab-info">
              <h4>📋 Playbook Runs</h4>
              <p>View all playbook executions with metrics including:</p>
              <ul class="help-list">
                <li>Playbook name and parent playbook</li>
                <li>Tenant information</li>
                <li>Category classification</li>
                <li>Total actions executed</li>
                <li>Hours and dollars saved</li>
              </ul>
              <p><strong>Features:</strong> Sortable columns, pagination, category filtering, and custom configurations per playbook.</p>
            </div>

            <div class="help-tab-info">
              <h4>⚡ Actions</h4>
              <p>Detailed view of individual actions with:</p>
              <ul class="help-list">
                <li>Action name and type</li>
                <li>Connector information</li>
                <li>Tenant and category</li>
                <li>Execution counts and savings</li>
              </ul>
              <p><strong>Features:</strong> Filter by action type or connector, sort by any column, and configure custom time estimates.</p>
            </div>

            <div class="help-tab-info">
              <h4>🤖 HeroAI</h4>
              <p>Track HeroAI prompt usage and analyze AI-assisted automation impact.</p>
            </div>

            <div class="help-tab-info">
              <h4>📈 Reporting</h4>
              <p>Visual breakdown of usage by category with pie charts showing:</p>
              <ul class="help-list">
                <li>Category distribution</li>
                <li>Percentage of total usage</li>
                <li>Total runs and savings per category</li>
              </ul>
            </div>
          </div>

          <div class="help-section">
            <h3>🏷️ Category Management</h3>
            <p>Organize your playbooks and actions into categories for better analysis:</p>
            <ul class="help-list">
              <li><strong>Default Categories:</strong> Pre-configured categories like "AI Assisted Analysis", "Detection/Analysis", etc.</li>
              <li><strong>Custom Categories:</strong> Create your own categories with custom names and IDs</li>
              <li><strong>Visibility:</strong> Hide categories you don't use to keep the interface clean</li>
              <li><strong>Editing:</strong> Modify category names or delete unused categories</li>
            </ul>
            <p>Access via <strong>Settings → Manage Categories</strong> or the category dropdown in tables.</p>
          </div>

          <div class="help-section">
            <h3>💰 ROI Calculations</h3>
            <p>The widget calculates ROI using:</p>
            <ul class="help-list">
              <li><strong>Time Saved:</strong> (Total Actions × Minutes per Action) ÷ 60 = Hours Saved</li>
              <li><strong>Cost Savings:</strong> Hours Saved × Hourly Rate = Total Saved ($)</li>
              <li><strong>Annualized Savings:</strong> (Daily Average × 365) × Hourly Rate</li>
              <li><strong>Net vs License:</strong> Annualized Savings - Annual License Cost</li>
              <li><strong>% ROI:</strong> (Net vs License ÷ Annual License Cost) × 100</li>
            </ul>
            <p>The ROI bar color indicates performance:
              <span style="color: #4db8ff;">Blue</span> = Positive ROI,
              <span style="color: #ff3366;">Red</span> = Negative ROI,
              <span style="color: #39CCCC;">Green</span> = Excellent ROI
            </p>
          </div>

          <div class="help-section">
            <h3>💡 Tips & Best Practices</h3>
            <ul class="help-list">
              <li><strong>Accurate Configuration:</strong> Set realistic hourly rates and time estimates for accurate ROI calculations</li>
              <li><strong>Category Organization:</strong> Use consistent categories across playbooks for better reporting</li>
              <li><strong>Regular Updates:</strong> Click the refresh button to update data from the last 7 days</li>
              <li><strong>Custom Configurations:</strong> Override default time estimates for specific playbooks or actions that take longer</li>
              <li><strong>Export Data:</strong> Use browser tools to export table data if needed</li>
              <li><strong>Theme Preference:</strong> Your theme choice is saved automatically</li>
            </ul>
          </div>

          <div class="help-section">
            <h3>🔧 Troubleshooting</h3>
            <ul class="help-list">
              <li><strong>No Data Showing:</strong> Ensure you have playbook runs or actions in the last 7 days</li>
              <li><strong>Incorrect Calculations:</strong> Verify your hourly rate and time estimates in Settings</li>
              <li><strong>Missing Categories:</strong> Use "Manage Categories" to add or restore default categories</li>
              <li><strong>Slow Loading:</strong> Large datasets may take time; watch the progress indicator</li>
            </ul>
          </div>
        </div>
        
        <div class="help-footer">
          <button class="help-button-primary" @click=${this.dismissHelpModal}>Got it!</button>
        </div>
      </div>
    `;
  }

  renderCategoryModal() {
    if (!this.categoryModalOpen) return html``;
    
    return html`
      <div class="modal-backdrop fade-in" @click=${this.closeCategoryModal}></div>
      <div class="config-modal fade-in" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999; max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <div class="config-modal-header">
          <span>Manage Categories</span>
          <button class="close-btn" @click=${this.closeCategoryModal}>×</button>
        </div>

        <div class="config-modal-content">
          <!-- Add/Edit Form -->
          <div class="category-form">
            <h4>${this.editingCategory ? 'Edit Category' : 'Add New Category'}</h4>
              <input
                type="text"
                placeholder="Category Name"
                .value=${this.newCategoryName}
                @input=${(e) => (this.newCategoryName = e.target.value)}
              />
              <input
                type="text"
                placeholder="Category ID (optional - auto-generated)"
                .value=${this.newCategoryId}
                @input=${(e) => (this.newCategoryId = e.target.value)}
              />
            <div class="category-form-actions">
              ${this.editingCategory ? html`
                <button class="modal-button secondary" @click=${this.cancelEditCategory}>Cancel</button>
              ` : ''}
              <button class="modal-button" @click=${this.saveCategory}>
                ${this.editingCategory ? 'Update' : 'Add'}
              </button>
            </div>
          </div>

          <!-- Category List -->
          <div class="category-list">
            ${this.categories.length === 0 ? html`
              <p style="text-align: center; color: var(--sw-text-dim); padding: 2rem;">
                No categories yet. Add one above!
              </p>
            ` : this.categories.map(cat => html`
              <div class="category-item">
                <div style="flex: 1;">
                  <span class="category-item-name">${cat.name}</span>
                  <span class="category-item-id">(${cat.id})</span>
                  ${cat.isDefault ? html`
                    <span class="category-badge default">Default</span>
                  ` : html`
                    <span class="category-badge custom">Custom</span>
                  `}
                  ${cat.visible === false ? html`
                    <span class="category-badge hidden">Hidden</span>
                  ` : ''}
                </div>
                <div class="category-item-actions">
                  <button 
                    class="category-toggle-btn" 
                    @click=${() => this.toggleCategoryVisibility(cat)}
                    title="${cat.visible === false ? 'Show category' : 'Hide category'}"
                  >
                    ${cat.visible === false ? '👁️ Show' : '🙈 Hide'}
                  </button>
                  <button 
                    class="category-edit-btn" 
                    @click=${() => this.startEditCategory(cat)}
                    ?disabled=${cat.isDefault}
                    title="${cat.isDefault ? 'Default categories cannot be edited' : 'Edit category'}"
                  >
                    Edit
                  </button>
                  <button 
                    class="category-delete-btn" 
                    @click=${() => this.deleteCategory(cat)}
                    ?disabled=${cat.isDefault}
                    title="${cat.isDefault ? 'Default categories cannot be deleted' : 'Delete category'}"
                  >
                    Delete
                  </button>
                </div>
              </div>
            `)}
          </div>
        </div>

        <div class="config-modal-footer">
          <button class="modal-button secondary" @click=${this.restoreDefaultCategories} style="margin-right: auto;">
            🔄 Restore Default Categories
          </button>
          <button class="modal-button" @click=${this.closeCategoryModal}>Close</button>
        </div>
      </div>
    `;
  }

  renderSettingsModal() {
    if (!this.settingsModalOpen) return html``;

    return html`
      <div class="modal-backdrop fade-in" @click=${this.closeSettingsModal}></div>
      <div class="config-modal fade-in" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999; max-width: 800px; max-height: 90vh; overflow-y: auto;">
        <div class="config-modal-header">
          <span>⚙️ Settings - ${TAB_CONFIG[this.activeTab].title}</span>
          <button class="close-btn" @click=${this.closeSettingsModal}>×</button>
        </div>

        <div class="config-modal-content" style="padding: 1.5rem;">
          <div class="config-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
            <!-- Lookback Period -->
            <div class="config-item">
              <label for="lookbackDays">Lookback Period (Days)</label>
              <input
                id="lookbackDays"
                name="lookbackDays"
                type="number"
                .value=${this._tempSettings.lookbackDays}
                @input=${this.handleConfigChange}
                ?disabled=${!this.initialized}
              >
              ${(this._tempSettings.lookbackDays || 0) > 90 ? html`
                <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(255, 165, 0, 0.1); border-left: 3px solid #ffa500; font-size: 0.85rem; color: #ffa500;">
                  ⚠️ Large lookback periods (&gt;90 days) will load data in chunks. This may take longer.
                </div>
              ` : ''}
            </div>

            <!-- Filter by Tenant -->
            <div class="config-item">
              <label for="selectedTenantId">Filter by Tenant</label>
              <select
                id="selectedTenantId"
                name="selectedTenantId"
                .value=${this._tempSettings.selectedTenantId}
                @change=${this.handleConfigChange}
                ?disabled=${!this.initialized}
              >
                ${this.tenantList.map(tenant => html`
                  <option value=${tenant.id}>${tenant.name}</option>
                `)}
              </select>
            </div>

            <!-- Group By (Playbooks only) -->
            ${this.activeTab === 'playbooks' ? html`
              <div class="config-item">
                <label for="groupBy">Group By</label>
                <select
                  id="groupBy"
                  name="groupBy"
                  .value=${this._tempSettings.groupBy}
                  @change=${this.handleConfigChange}
                >
                  <option value="playbookId">Flow/Component Name</option>
                  <option value="fqn">Flow/Trigger (FQN)</option>
                  <option value="tenantId">Tenant ID</option>
                </select>
              </div>
            ` : ''}

            <!-- Tab-specific time/cost inputs -->
            ${this.renderConfigInputs()}
            
            <!-- Category filter -->
            ${this.renderPlaybookCategoryFilter()}
            
            <!-- Action filters -->
            ${this.renderActionFilters()}

            <!-- Annual License Cost -->
            <div class="config-item">
              <label for="annualLicenseCost">Annual License Cost ($)</label>
              <input
                id="annualLicenseCost"
                name="annualLicenseCost"
                type="number"
                .value=${this._tempSettings.annualLicenseCost}
                @input=${this.handleConfigChange}
              >
            </div>

            <!-- Show Value Meter Toggle -->
            <div class="config-item toggle">
              <label for="showValueMeter">Show Value/Cost Meter</label>
              <label class="switch">
                <input 
                  type="checkbox" 
                  id="showValueMeter"
                  name="showValueMeter"
                  .checked=${this._tempSettings.showValueMeter}
                  @change=${this.handleConfigChange}
                >
                <span class="slider"></span>
              </label>
            </div>

            <!-- Show Sparklines Toggle -->
            <div class="config-item toggle">
              <label for="showSparklines">Show Sparkline Trends</label>
              <label class="switch">
                <input 
                  type="checkbox" 
                  id="showSparklines"
                  name="showSparklines"
                  .checked=${this._tempSettings.showSparklines}
                  @change=${this.handleConfigChange}
                >
                <span class="slider"></span>
              </label>
            </div>

            <!-- Theme Toggle -->
            <div class="config-item toggle">
              <label for="themeToggle">Dark Mode</label>
              <label class="switch">
                <input 
                  type="checkbox" 
                  id="themeToggle"
                  name="themeToggle"
                  .checked=${this.theme === 'dark'}
                  @change=${this.toggleTheme}
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="config-modal-footer" style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            ${(this.activeTab === 'playbooks' || this.activeTab === 'actions') ? html`
              <button 
                class="modal-button ai-estimate-btn" 
                @click=${this.estimateTimesWithAI} 
                type="button"
                ?disabled=${this.aiEstimationInProgress}
                title="Use AI to estimate time savings for each ${this.activeTab === 'playbooks' ? 'playbook' : 'action'}"
              >
                ${this.aiEstimationInProgress ? html`
                  <span style="display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite;"></span>
                  Estimating...
                ` : html`
                  🤖 AI Time Estimate
                `}
              </button>
              <button 
                class="modal-button ai-estimate-btn" 
                @click=${this.autoCategorizeWithAI} 
                type="button"
                ?disabled=${this.aiCategorizationInProgress}
                title="Use AI to automatically categorize all ${this.activeTab === 'playbooks' ? 'playbooks' : 'actions'}"
              >
                ${this.aiCategorizationInProgress ? html`
                  <span style="display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite;"></span>
                  Categorizing...
                ` : html`
                  🏷️ AI Categorize
                `}
              </button>
              ${this.aiEstimationStatus ? html`
                <span style="font-size: 0.85rem; color: var(--sw-primary);">${this.aiEstimationStatus}</span>
              ` : ''}
              ${this.aiCategorizationStatus ? html`
                <span style="font-size: 0.85rem; color: var(--sw-primary);">${this.aiCategorizationStatus}</span>
              ` : ''}
            ` : ''}
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button 
              class="modal-button secondary" 
              @click=${() => { if (confirm('Reset all settings to defaults? This cannot be undone.')) { this.resetToDefaults(); this.closeSettingsModal(); } }} 
              type="button"
              title="Reset all settings to factory defaults"
            >
              🔄 Reset to Defaults
            </button>
            ${(this.activeTab === 'playbooks' || this.activeTab === 'actions') ? html`
              <button class="modal-button secondary" @click=${() => this.openCategoryModal(true)} type="button">
                Manage Categories
              </button>
            ` : ''}
            <button class="modal-button secondary" @click=${this.closeSettingsModal}>Cancel</button>
            <button class="modal-button" @click=${() => { this.applySettings(); this.closeSettingsModal(); }}>Apply</button>
          </div>
        </div>
      </div>
    `;
  }

  // Helper function to create smooth curve through points
  createSmoothPath(points) {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Calculate control points for smooth curve
      const controlPointX = current.x + (next.x - current.x) / 2;
      
      // Use quadratic bezier for smooth curves
      path += ` Q ${controlPointX} ${current.y}, ${controlPointX} ${(current.y + next.y) / 2}`;
      path += ` Q ${controlPointX} ${next.y}, ${next.x} ${next.y}`;
    }
    
    return path;
  }

  renderSparkline(dataKey) {
    // Get daily data for this metric
    if (!this.dailyMetrics || !this.dailyMetrics[dataKey] || this.dailyMetrics[dataKey].length === 0) {
      return ''; // No data to display
    }
    
    let data = this.dailyMetrics[dataKey];
    
    // Need at least 2 points for a line
    if (data.length < 2) {
      return '';
    }
    
    const width = 200;
    const height = 50;
    const padding = 4;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // Generate path points
    const points = data.map((value, i) => {
      const x = padding + (i * (width - 2 * padding) / (data.length - 1));
      const y = height - padding - ((value - min) / range) * (height - 2 * padding);
      return { x, y };
    });
    
    // Create smooth path string for line
    const pathData = this.createSmoothPath(points);
    
    // Create path string for area (using smooth path)
    const areaData = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    
    return html`
      <div class="sparkline-container">
        ${svg`
          <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparklineGradient-${dataKey}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#1a8cff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#4db8ff;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="sparklineAreaGradient-${dataKey}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#1a8cff;stop-opacity:0.4" />
                <stop offset="100%" style="stop-color:#1a8cff;stop-opacity:0.05" />
              </linearGradient>
              <linearGradient id="sparklineGlowGradient-${dataKey}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#1a8cff;stop-opacity:0.3" />
                <stop offset="30%" style="stop-color:#1a8cff;stop-opacity:0.3" />
                <stop offset="50%" style="stop-color:#fff;stop-opacity:1" />
                <stop offset="70%" style="stop-color:#1a8cff;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#1a8cff;stop-opacity:0.3" />
                <animate attributeName="x1" values="-50%;150%" dur="3s" repeatCount="indefinite" />
                <animate attributeName="x2" values="50%;250%" dur="3s" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            <path 
              class="sparkline-area" 
              d="${areaData}"
              fill="url(#sparklineAreaGradient-${dataKey})"
            />
            <!-- Base solid path -->
            <path 
              class="sparkline-path" 
              d="${pathData}"
              stroke="url(#sparklineGradient-${dataKey})"
            />
            <!-- Glowing highlight path -->
            <path 
              d="${pathData}"
              stroke="url(#sparklineGlowGradient-${dataKey})"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              style="filter: drop-shadow(0 0 8px rgba(255,255,255,0.6))"
            />
          </svg>
        `}
      </div>
    `;
  }

  renderKpiGrid() {
    const tab = TAB_CONFIG[this.activeTab];
    const avgPrimary = (this.grandTotal.primaryMetric || 0) / this.lookbackDays;
    const cards = {
      primaryMetric: { value: this.formatNumber(this.grandTotal.primaryMetric, 0), label: tab.metricLabel },
      hours: { value: this.formatNumber(this.grandTotal.hours), label: 'Hours Saved' },
      dollars: { value: this.formatDollars(this.grandTotal.dollars), label: 'Total Saved ($)' },
      avg: { value: this.formatNumber(avgPrimary), label: tab.avgLabel }
    };
    return html`
      <div class="kpi-grid">
        ${this.kpiCardOrder.map(id => {
          const card = cards[id];
          if (!card) return '';
          return html`
            <div
              class="kpi-box"
              draggable="true"
              @dragstart=${e => this.handleDragStart(e, id)}
              @dragover=${this.handleDragOver}
              @dragleave=${this.handleDragLeave}
              @drop=${e => this.handleDrop(e, id)}
            >
              <div class="value">${card.value}</div>
              <div class="label">${card.label}</div>
              ${this.showSparklines ? this.renderSparkline(id) : ''}
            </div>
          `;
        })}
      </div>
    `;
  }

  getRoiBarDetails(roi, net) {
    let cls = 'roi-bar ';
    if (net < 0) {
      // For negative ROI, show the loss as a percentage of license cost
      const lossRatio = Math.min(Math.abs(net) / (this.annualLicenseCost || 1), 1) * 100;
      return { cls: cls + 'c-negative', style: `width:${lossRatio}%;` };
    }
    cls += 'c-blue';
    // Show full bar (100% width) for any ROI of 100% or greater
    // For ROI below 100%, scale proportionally (e.g., 50% ROI = 50% width)
    const normalizedWidth = Math.min(roi, 100);
    return { cls, style: `width:${normalizedWidth}%;` };
  }

  renderValueMeter() {
    if (!this.showValueMeter || !this.initialized) return html``;
    
    // Calculate displayed KPI values (HeroAI only for HeroAI tab)
    const daily = (this.grandTotal.dollars || 0) / this.lookbackDays;
    const annual = daily * 365;
    
    // For ROI bar calculation on HeroAI tab, include playbook savings
    let roiAnnual = annual;
    if (this.activeTab === 'heroai') {
      const playbookDaily = this.playbookTotalDollars / this.lookbackDays;
      const playbookAnnual = playbookDaily * 365;
      roiAnnual = annual + playbookAnnual; // Combined savings for ROI bar
    }
    
    const net = roiAnnual - this.annualLicenseCost;
    const roi = this.annualLicenseCost > 0 ? (net / this.annualLicenseCost) * 100 : roiAnnual > 0 ? 100 : 0;
    const { cls, style } = this.getRoiBarDetails(roi, net);
    const netClass = net >= 0 ? 'positive' : 'negative';
    
    return html`
      <div class="value-meter">
        <div class="kpi-box"><div class="value">${this.formatDollars(annual)}</div><div class="label">Annualized Savings</div></div>
        <div class="kpi-box"><div class="value ${netClass}">${this.formatDollars(net)}</div><div class="label">Net vs License</div></div>
        <div class="kpi-box"><div class="value ${netClass}">${this.formatNumber(roi)}%</div><div class="label">% ROI</div></div>
      </div>
      <div class="roi-bar-container">
        <div class="${cls}" style="${style}"></div>
        <div class="roi-bar-text">${this.formatNumber(roi)}% ROI</div>
      </div>
    `;
  }

renderConfigInputs() {
  let timeLabel, costLabel, timeVal, costVal;

  // Keep the right values for the currently active tab
  switch (this.activeTab) {
    case 'playbooks':
      timeLabel = 'Default Minutes per Playbook Run';
      costLabel = 'Default Cost per Hour ($)';
      timeVal = this._tempSettings.defaultTimePerPlaybook ?? this.defaultTimePerPlaybook;
      costVal = this._tempSettings.defaultHourlyRateForPlaybook ?? this.defaultHourlyRateForPlaybook;
      break;
    case 'actions':
      timeLabel = 'Default Minutes per Action';
      costLabel = 'Default Cost per Hour ($)';
      timeVal = this._tempSettings.defaultTimePerAction ?? this.defaultTimePerAction;
      costVal = this._tempSettings.defaultHourlyRateForAction ?? this.defaultHourlyRateForAction;
      break;
    case 'heroai':
      timeLabel = 'Default Minutes per HeroAI Prompt';
      costLabel = 'Default Cost per Hour ($)';
      timeVal = this._tempSettings.defaultTimePerHeroAI ?? this.defaultTimePerHeroAI;
      costVal = this._tempSettings.defaultHourlyRateForHeroAI ?? this.defaultHourlyRateForHeroAI;
      break;
    default:
      return html``;
  }

  // Ensure no visual 0s (if not yet configured)
  timeVal = timeVal && timeVal > 0 ? timeVal : '';
  costVal = costVal && costVal > 0 ? costVal : '';

  return html`
  <div class="config-anim ${this.activeTab}">
    <div class="config-item">
      <label for="defaultTimePerRun">${timeLabel}</label>
      <input
        id="defaultTimePerRun"
        name="defaultTimePerRun"
        type="number"
        step="0.1"
        min="0"
        placeholder="e.g. 2.5"
        .value=${timeVal}
        @input=${this.handleConfigChange}
      >
    </div>
    <div class="config-item">
      <label for="defaultHourlyRate">${costLabel}</label>
      <input
        id="defaultHourlyRate"
        name="defaultHourlyRate"
        type="number"
        step="0.1"
        min="0"
        placeholder="e.g. 50"
        .value=${costVal}
        @input=${this.handleConfigChange}
      >
    </div>
  </div>
`;
}

  renderPlaybookCategoryFilter() {
    if (this.activeTab !== 'playbooks' && this.activeTab !== 'actions') return html``;
    return html`
      <div class="config-item">
        <label>Filter by Category</label>
        <select name="selectedCategory" .value=${this._tempSettings.selectedCategory} @change=${this.handleConfigChange}>
          ${this.getCategoriesWithAll().map(cat => html`<option value=${cat.id}>${cat.name}</option>`)}
        </select>
      </div>
    `;
  }

  renderActionFilters() {
    if (this.activeTab !== 'actions') return html``;
    return html`
      <div class="config-item">
        <label>Filter by Action Type</label>
        <select name="selectedActionType" .value=${this._tempSettings.selectedActionType} @change=${this.handleConfigChange}>
          ${this.actionTypes.map(t => html`<option value=${t.id}>${t.name}</option>`)}
        </select>
      </div>
      <div class="config-item">
        <label>Filter by Connector</label>
        <select name="selectedConnectorName" .value=${this._tempSettings.selectedConnectorName} @change=${this.handleConfigChange}>
          ${this.connectorNames.map(c => html`<option value=${c.id}>${c.name}</option>`)}
        </select>
      </div>
    `;
  }

  renderLoader() {
  // We use fade-in/fade-out based on this.isLoading
  const fadeClass = this.isLoading ? 'fade-in' : 'fade-out';
  
  // Show progress percentage if available
  const progressPercent = this.loadProgress > 0 ? `${Math.round(this.loadProgress)}%` : '';
  const statusMessage = this.loadStatus || 'LOADING...';
  
  return html`
    <div class="loading-container ${fadeClass}">
      <div class="ngx-preloader">
        ${Array.from({ length: 25 }, (_, i) => html`
          <div class="arc arc-${i}"></div>
        `)}
      </div>
      <div class="loading-text-container">
        ${progressPercent ? html`<div class="loading-progress">${progressPercent}</div>` : ''}
        <div class="loading-text">${statusMessage}</div>
      </div>
    </div>
  `;
}

  getPlaybookColumnDef() {
    const header = this.groupBy === 'playbookId'
      ? 'Flow/Component'
      : this.groupBy === 'fqn'
      ? 'Flow/Trigger (FQN)'
      : 'Tenant ID';
    
    return {
      name: { label: header, sortKey: 'name', render: (row) => row.name },
      parentPlaybook: { label: 'Playbook', sortKey: 'parentPlaybook', render: (row) => row.parentPlaybook },
      tenantName: { label: 'Tenant Name', sortKey: 'tenantName', render: (row) => row.tenantName },
      categoryName: { label: 'Category', sortKey: 'categoryName', render: (row) => row.categoryName },
      totalActions: { label: 'Total Playbook Runs', sortKey: 'totalActions', render: (row) => this.formatNumber(row.totalActions, 0) },
      totalHoursSaved: { label: 'Hours Saved', sortKey: 'totalHoursSaved', render: (row) => this.formatNumber(row.totalHoursSaved) },
      totalDollarsSaved: { label: 'Total Saved', sortKey: 'totalDollarsSaved', render: (row) => this.formatDollars(row.totalDollarsSaved) }
    };
  }

  renderTable() {
  if (!this.initialized || this.isLoading) {
    return this.renderLoader();
  }

  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = this.currentPage * this.itemsPerPage;
  const pagedData = this.aggregatedData.slice(startIndex, endIndex);

  // --- PLAYBOOKS TAB ---
  if (this.activeTab === 'playbooks') {
    const columnDef = this.getPlaybookColumnDef();

    return html`
      <table>
        <thead>
          <tr>
            <th class="col-check" title="Include in total">Incl.</th>
            ${this.playbookColumnOrder.map(colId => {
              const col = columnDef[colId];
              if (!col) return '';
              return html`
                <th
                  draggable="true"
                  @dragstart=${(e) => this.handleColumnDragStart(e, colId)}
                  @dragover=${this.handleColumnDragOver}
                  @dragleave=${this.handleColumnDragLeave}
                  @drop=${(e) => this.handleColumnDrop(e, colId)}
                  @click=${() => this.handleSort(col.sortKey)}
                  title="Drag to reorder"
                >
                  ${col.label}
                </th>
              `;
            })}
            <th class="col-ai-marker" title="AI Configured">AI</th>
          </tr>
        </thead>
        <tbody>
          ${pagedData.map(row => {
            const aiConfigured = this.isAiConfigured(row.playbookId || row.id);
            return html`
              <tr 
                class="${this.groupBy === 'playbookId' ? 'clickable' : ''} 
                       ${row.isExcluded ? 'excluded' : ''} 
                       ${row.hasCustomConfig ? 'custom-config' : ''}"
                @click=${(e) => this.handleRowClick(row, e)}
                title=${this.groupBy === 'playbookId' ? 'Click to configure' : row.id}
              >
                <td class="col-check">
                  <label 
                    class="sw-checkbox ${!row.isExcluded ? 'checked' : ''}" 
                    @click=${(e) => this.handleCheckboxClick(e, row)}
                  ></label>
                </td>
                ${this.playbookColumnOrder.map(colId => {
                  const col = columnDef[colId];
                  if (!col) return '';
                  return html`<td>${col.render(row)}</td>`;
                })}
                <td class="col-ai-marker">
                  ${aiConfigured ? html`<span class="ai-badge" title="Configured by AI">
                    <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M56.8478 41.9766C53.4164 47.7748 48.5241 54.0488 42.5107 60.066C26.6296 75.9471 8.92892 83.9915 2.97208 78.0347C-2.98476 72.0816 5.06339 54.3772 20.9407 38.4961C25.8104 33.6302 30.8461 29.5004 35.663 26.2842C36.9578 25.4197 38.2299 24.6232 39.4832 23.8984" stroke="#1a8cff" stroke-width="2" stroke-linejoin="round"/>
                      <path d="M20.9405 60.0677C36.8216 75.9489 54.5222 83.9932 60.4791 78.0364C66.4359 72.0833 58.3878 54.3789 42.5104 38.4978C26.6217 22.6167 8.9211 14.5723 2.96427 20.5292C-2.99257 26.4822 5.05558 44.1829 20.9329 60.064L20.9405 60.0677Z" stroke="#1a8cff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M47.0323 16.9872C54.5822 16.9872 64.0195 7.54985 64.0195 0C64.0195 7.54985 73.4568 16.9872 81.0067 16.9872C73.4568 16.9872 64.0195 26.4245 64.0195 33.9743C64.0195 26.4245 54.5822 16.9872 47.0323 16.9872Z" stroke="#1a8cff" stroke-width="2"/>
                    </svg>
                  </span>` : ''}
                </td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  // --- ACTIONS TAB ---
  if (this.activeTab === 'actions') {
    return html`
      <table>
        <thead>
          <tr>
            <th class="col-check" title="Include in total">Incl.</th>
            <th @click=${() => this.handleSort('name')}>Action</th>
            <th @click=${() => this.handleSort('tenantName')}>Tenant Name</th>
            <th @click=${() => this.handleSort('categoryName')}>Category</th>
            <th @click=${() => this.handleSort('totalActions')}>Total Actions</th>
            <th @click=${() => this.handleSort('totalHoursSaved')}>Hours Saved</th>
            <th @click=${() => this.handleSort('totalDollarsSaved')}>Total Saved</th>
            <th class="col-ai-marker" title="AI Configured">AI</th>
          </tr>
        </thead>
        <tbody>
          ${pagedData.map(row => {
            const aiConfigured = this.isAiConfigured(row.id);
            return html`
              <tr 
                class="clickable ${row.isExcluded ? 'excluded' : ''} ${row.hasCustomConfig ? 'custom-config' : ''}"
                @click=${(e) => this.handleRowClick(row, e)}
                title="Click to configure"
              >
                <td class="col-check">
                  <label 
                    class="sw-checkbox ${!row.isExcluded ? 'checked' : ''}" 
                    @click=${(e) => this.handleCheckboxClick(e, row)}
                  ></label>
                </td>
                <td title=${row.id}>${row.name}</td>
                <td title=${row.tenantName}>${row.tenantName}</td>
                <td title=${row.category}>${row.categoryName}</td>
                <td>${this.formatNumber(row.totalActions, 0)}</td>
                <td>${this.formatNumber(row.totalHoursSaved)}</td>
                <td>${this.formatDollars(row.totalDollarsSaved)}</td>
                <td class="col-ai-marker">
                  ${aiConfigured ? html`<span class="ai-badge" title="Configured by AI">
                    <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M56.8478 41.9766C53.4164 47.7748 48.5241 54.0488 42.5107 60.066C26.6296 75.9471 8.92892 83.9915 2.97208 78.0347C-2.98476 72.0816 5.06339 54.3772 20.9407 38.4961C25.8104 33.6302 30.8461 29.5004 35.663 26.2842C36.9578 25.4197 38.2299 24.6232 39.4832 23.8984" stroke="#1a8cff" stroke-width="2" stroke-linejoin="round"/>
                      <path d="M20.9405 60.0677C36.8216 75.9489 54.5222 83.9932 60.4791 78.0364C66.4359 72.0833 58.3878 54.3789 42.5104 38.4978C26.6217 22.6167 8.9211 14.5723 2.96427 20.5292C-2.99257 26.4822 5.05558 44.1829 20.9329 60.064L20.9405 60.0677Z" stroke="#1a8cff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M47.0323 16.9872C54.5822 16.9872 64.0195 7.54985 64.0195 0C64.0195 7.54985 73.4568 16.9872 81.0067 16.9872C73.4568 16.9872 64.0195 26.4245 64.0195 33.9743C64.0195 26.4245 54.5822 16.9872 47.0323 16.9872Z" stroke="#1a8cff" stroke-width="2"/>
                    </svg>
                  </span>` : ''}
                </td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  // --- EVENTS TAB ---
  if (this.activeTab === 'events') {
    return html`
      <table class="events-table">
        <thead>
          <tr>
            <th class="col-check" title="Include in total">Incl.</th>
            <th @click=${() => this.handleSort('name')}>Event FQN</th>
            <th @click=${() => this.handleSort('tenantName')}>Tenant Name</th>
            <th @click=${() => this.handleSort('totalEvents')}>Total Events</th>
            <th @click=${() => this.handleSort('totalHoursSaved')}>Hours Saved</th>
            <th @click=${() => this.handleSort('totalDollarsSaved')}>Total Saved</th>
          </tr>
        </thead>
        <tbody>
          ${pagedData.map(row => html`
            <tr 
              class="clickable 
                     ${row.isExcluded ? 'excluded' : ''} 
                     ${row.hasCustomConfig ? 'custom-config' : ''}"
              @click=${(e) => this.handleRowClick(row, e)}
              title="Click to configure"
            >
              <td class="col-check">
                <label 
                  class="sw-checkbox ${!row.isExcluded ? 'checked' : ''}" 
                  @click=${(e) => this.handleCheckboxClick(e, row)}
                ></label>
              </td>
              <td title=${row.id}>${row.name}</td>
              <td title=${row.tenantName}>${row.tenantName}</td>
              <td>${this.formatNumber(row.totalEvents, 0)}</td>
              <td>${this.formatNumber(row.totalHoursSaved)}</td>
              <td>${this.formatDollars(row.totalDollarsSaved)}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  // --- HEROAI TAB ---
  if (this.activeTab === 'heroai') {
    return html`
      <div class="heroai-summary">
        <p><strong>Total HeroAI Prompts:</strong> ${this.heroAiTotal}</p>
        <p><strong>Hours Saved:</strong> ${this.formatNumber(this.grandTotal.hours)}</p>
        <p><strong>Total Saved:</strong> ${this.formatDollars(this.grandTotal.dollars)}</p>
      </div>
    `;
  }

  return html``;
}

  renderPaginationControls() {
    if (this.activeTab === 'heroai' || this.activeTab === 'reporting') return html``;
    const total = this.aggregatedData.length;
    const max = Math.ceil(total / this.itemsPerPage);
    if (max <= 1) return html``;
    return html`
      <div class="pagination-controls">
        <button class="pagination-button" ?disabled=${this.currentPage === 1} @click=${this.goToPreviousPage}>Previous</button>
        <span>Page ${this.currentPage} of ${max}</span>
        <button class="pagination-button" ?disabled=${this.currentPage === max} @click=${this.goToNextPage}>Next</button>
      </div>
    `;
  }

  getChartColors() {
    // Swimlane brand-inspired color palette
    return [
      '#02AAFF', // Swimlane primary blue
      '#00D9FF', // bright cyan
      '#5B9AFF', // medium blue
      '#FF6B6B', // coral accent (from CTA button)
      '#7B61FF', // purple accent
      '#00C9C9', // teal
      '#4ECDC4', // turquoise
      '#A78BFA', // light purple
      '#3B82F6', // vibrant blue
      '#06B6D4', // cyan-blue
      '#8B5CF6', // violet
      '#10B981', // emerald accent
    ];
  }

  getSlicePath(percentage, startAngle) {
    const cx = 100;
    const cy = 100;
    const outerRadius = 88;
    const innerRadius = 58; // Creates donut hole
    
    // Start from top (subtract 90 to rotate from 3 o'clock to 12 o'clock)
    const adjustedStart = startAngle - 90;
    
    // Convert percentages to angles (in degrees)
    const angle = (percentage / 100) * 360;
    const adjustedEnd = adjustedStart + angle;
    
    // Convert to radians for calculations
    const startRad = (adjustedStart * Math.PI) / 180;
    const endRad = (adjustedEnd * Math.PI) / 180;
    
    // Calculate the start and end points on outer circle
    const x1Outer = cx + outerRadius * Math.cos(startRad);
    const y1Outer = cy + outerRadius * Math.sin(startRad);
    const x2Outer = cx + outerRadius * Math.cos(endRad);
    const y2Outer = cy + outerRadius * Math.sin(endRad);
    
    // Calculate the start and end points on inner circle
    const x1Inner = cx + innerRadius * Math.cos(startRad);
    const y1Inner = cy + innerRadius * Math.sin(startRad);
    const x2Inner = cx + innerRadius * Math.cos(endRad);
    const y2Inner = cy + innerRadius * Math.sin(endRad);
    
    // Determine if arc should be large (> 180 degrees)
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Build the donut path
    return `
      M ${x1Outer},${y1Outer}
      A ${outerRadius},${outerRadius} 0 ${largeArcFlag},1 ${x2Outer},${y2Outer}
      L ${x2Inner},${y2Inner}
      A ${innerRadius},${innerRadius} 0 ${largeArcFlag},0 ${x1Inner},${y1Inner}
      Z
    `.trim();
  }

  renderPieChart(data, type) {
    if (!data || data.length === 0) {
      return html`<div class="no-data-message">No ${type} data with categories assigned</div>`;
    }

    const colors = this.getChartColors();
    const centerX = 100;
    const centerY = 100;
    const radius = 85;

    // Calculate totals for center display
    const totalRuns = data.reduce((sum, item) => sum + (item.runs || 0), 0);
    const totalCost = data.reduce((sum, item) => sum + (item.cost || 0), 0);
    const centerValue = type === 'playbook' ? this.formatNumber(totalRuns, 0) : this.formatDollars(totalCost);
    const centerLabel = type === 'playbook' ? 'Total Runs' : 'License Cost';

    // Generate paths for each slice
    let cumulativeAngle = 0;
    const slices = data.map((item, index) => {
      const pathData = this.getSlicePath(item.percentage, cumulativeAngle);
      const color = colors[index % colors.length];
      cumulativeAngle += (item.percentage / 100) * 360;
      return { pathData, color, item, index };
    });

    return html`
      <div class="chart-content">
        <div class="pie-chart-container">
          <svg class="pie-chart" width="400" height="400" viewBox="0 0 200 200">
            <defs>
              ${slices.map(
                (s) => svg`
                  <linearGradient id="grad-${s.index}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${s.color}" stop-opacity="0.9" />
                    <stop offset="100%" stop-color="${s.color}" stop-opacity="0.7" />
                  </linearGradient>
                `
              )}
            </defs>
            ${slices.map(
              (slice) => svg`
                <path
                  d="${slice.pathData}"
                  fill="url(#grad-${slice.index})"
                  stroke="rgba(255,255,255,0.1)"
                  stroke-width="1.5"
                />
              `
            )}
          </svg>
          <div class="pie-chart-center-text">
            <div class="center-value">${centerValue}</div>
            <div class="center-label">${centerLabel}</div>
          </div>
        </div>
        <div class="chart-legend">
          ${data.map((item, index) => html`
            <div class="legend-item">
              <div class="legend-color" style="background-color: ${colors[index % colors.length]}"></div>
              <div class="legend-text">
                <div class="legend-label">${item.category}</div>
                <div class="legend-value">
                  ${type === 'playbook' 
                    ? `${this.formatNumber(item.runs, 0)} runs • ${this.formatNumber(item.hours, 1)} hrs`
                    : `${this.formatDollars(item.cost)} • ${this.formatNumber(item.actions, 0)} actions`
                  }
                </div>
              </div>
              <div class="legend-percentage">${item.percentage.toFixed(1)}%</div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  renderReportingCharts() {
    if (!this.reportingData) {
      return html`<div class="no-data-message">No reporting data available</div>`;
    }

    const playbooksChart = this.reportingData.playbooksByCategory || [];
    const actionsChart = this.reportingData.actionsByCategory || [];

    return html`
      <div class="reporting-container">
        <!-- Playbook Runs by Category -->
        <div class="chart-section">
          <div class="chart-title">📊 Playbook Runs by Category</div>
          <div class="chart-subtitle">Distribution of runs and time saved across categories</div>
          ${this.renderPieChart(playbooksChart, 'playbook')}
        </div>

        <!-- Actions by Category -->
        <div class="chart-section">
          <div class="chart-title">💰 Actions by Category - License Cost Allocation</div>
          <div class="chart-subtitle">Where your license cost is being spent by category</div>
          ${this.renderPieChart(actionsChart, 'action')}
        </div>
      </div>
    `;
  }

    render() {
    this.setAttribute('theme', this.theme);

    let kpiContent;
    if (this.activeTab === 'reporting') {
      // No KPI grid for reporting tab
      kpiContent = html``;
    } else if (!this.initialized) {
      kpiContent = html`<div class="loading-container">Waiting for context-data...</div>`;
    } else if (this.isLoading && !this.grandTotal.primaryMetric) {
      kpiContent = this.renderLoader();
    } else {
      kpiContent = this.renderKpiGrid();
    }

    return html`
      ${this.renderSingleConfigModal()}
      ${this.renderWizard()}
      ${this.renderReleaseNotesModal()}
      ${this.renderHelpModal()}
      ${this.renderCategoryModal()}
      ${this.renderSettingsModal()}

      <div class="widget-container">
        <div class="header">
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <span>Hello ${this['context-data']?.currentUser?.displayName || 'there'}! This is your ROI based on the last ${this.lookbackDays} days of data.</span>
            ${this.lastDataUpdate ? html`
              <div class="last-updated" style="margin-top: 0;">Last updated ${this.formatLastUpdated()}</div>
            ` : ''}
          </div>
          ${this.activeTab !== 'reporting' ? html`
            <div class="header-buttons">
              <button 
                class="refresh-button ${this.isLoading ? 'refreshing' : ''}"
                @click=${() => this.handleRefresh()}
                ?disabled=${this.isLoading}
                title="Refresh data">
                ${svg`
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                `}
              </button>
              <button 
                class="release-notes-button" 
                @click=${this.showReleaseNotes}
                title="What's New - v${WIDGET_VERSION}"
              >
                🎉
              </button>
              <button 
                class="help-button" 
                @click=${this.showHelpModal}
                title="Help & Documentation"
              >
                ?
              </button>
              <button 
                class="settings-button" 
                @click=${this.openSettingsModal}
                title="Open Settings"
              >
                ⚙️
              </button>
            </div>
          ` : ''}
        </div>

        <!-- ─── Tabs ────────────────────────────── -->
        <div class="tab-nav">
          <button 
            class="tab-button ${this.activeTab === 'playbooks' ? 'active' : ''}"
            @click=${() => this.setActiveTab('playbooks')}>
            Playbook Runs
          </button>
          <button 
            class="tab-button ${this.activeTab === 'actions' ? 'active' : ''}"
            @click=${() => this.setActiveTab('actions')}>
            Actions
          </button>
          <button 
            class="tab-button ${this.activeTab === 'heroai' ? 'active' : ''}"
            @click=${() => this.setActiveTab('heroai')}>
            HeroAI
          </button>
          <button 
            class="tab-button ${this.activeTab === 'reporting' ? 'active' : ''}"
            @click=${() => this.setActiveTab('reporting')}>
            Reporting
          </button>
        </div>

        <div class="tab-content-wrapper" key="tab-${this.activeTab}">
          ${kpiContent}
          ${this.activeTab !== 'reporting' ? this.renderValueMeter() : ''}

          ${this.activeTab !== 'reporting' ? html`
            <div class="results-header" @click=${() => (this.tableCollapsed = !this.tableCollapsed)}>
              <span>
                ${this.activeTab === 'playbooks'
                  ? 'Flow / Component Results'
                  : this.activeTab === 'actions'
                  ? 'Actions Results'
                  : this.activeTab === 'events'
                  ? 'Event Results'
                  : 'HeroAI Summary'}
              </span>
              <span class="caret">
                ${this.tableCollapsed ? '▶' : '▼'}
              </span>
            </div>

            <div class="results-container ${this.tableCollapsed ? 'collapsed' : 'expanded'}">
              ${!this.tableCollapsed
                ? (this.isLoading ? this.renderLoader() : this.renderTable())
                : ''}
            </div>
          ` : html`
            ${this.isLoading ? this.renderLoader() : this.renderReportingCharts()}
          `}
        </div>

        ${this.renderPaginationControls()}

        <div class="debug-toggle" @click=${() => this.showRawData = !this.showRawData}>
          ${this.showRawData ? 'Hide' : 'Show'} Raw Data
        </div>

        ${this.showRawData ? html`
          <pre>
<strong>Context Data:</strong>
${JSON.stringify(this['context-data'], null, 2)}

<strong>Last API Response:</strong>
${this.getFormattedRawData()}
          </pre>
        ` : ''}
      </div>
    `;
  }
}
