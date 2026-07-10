// Zaptick Interactive Scripting

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSandboxAnimation();
  initDevEditor();
  initWebhookSimulator();
  initStatCounters();
  highlightActiveNavLink();
  initNavDropdowns();
});

// 1. Mobile Responsive Menu
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-menu');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const isOpen = navLinks.classList.contains('mobile-open');
      toggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }
}

// Interactive Dropdown Toggles for Mobile
function initNavDropdowns() {
  const dropdownLinks = document.querySelectorAll('.nav-item-dropdown > .nav-link');
  
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Toggle dropdown overlay state on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = link.parentElement;
        const overlay = parent.querySelector('.dropdown-overlay');
        if (overlay) {
          overlay.classList.toggle('active');
        }
      }
    });
  });
}

// 2. Sandbox Step Simulation Animation with Synchronized Terminal Logs
const sandboxLogs = [
  // Card 0: TRIGGER
  `{
  "event": "webhook.incoming_message",
  "source": "click_to_whatsapp_ad",
  "payload": {
    "from": "+14155552671",
    "profile_name": "Sarah Jenkins",
    "text": "Hey! I saw your summer collection ad. Do you have sizes in medium?"
  }
}`,
  // Card 1: STEP
  `{
  "event": "ai.intent_classified",
  "results": {
    "intent": "Catalog_Browse",
    "confidence": 0.982,
    "language": "en_US",
    "variables": {
      "product_type": "Shirt",
      "size": "Medium"
    }
  }
}`,
  // Card 2: ACTION
  `{
  "event": "api.send_message",
  "method": "zap.whatsapp.sendTemplate",
  "response": {
    "recipient": "+14155552671",
    "template": "summer_collection_catalog",
    "components": [
      {
        "type": "body",
        "parameters": [
          {"type": "text", "text": "Sarah"},
          {"type": "text", "text": "Medium"}
        ]
      }
    ],
    "meta_message_id": "wamid.HBgLMTQxNTU1NTI2NzINTI2NzEvAGIGFDRDNDQzM0M1Q="
  }
}`
];

function initSandboxAnimation() {
  const cards = document.querySelectorAll('.sandbox-card');
  const terminalContent = document.querySelector('.sandbox-terminal-content');
  if (cards.length === 0) return;

  let currentIdx = 0;

  function rotateCards() {
    cards.forEach(card => card.classList.remove('active-card'));
    cards[currentIdx].classList.add('active-card');
    
    // Update live terminal logs in split-screen sandbox
    if (terminalContent) {
      const rawLog = sandboxLogs[currentIdx];
      // Basic styling highlights for key, string, number
      let highlightedLog = rawLog
        .replace(/"(.*?)"(?=:)/g, '"<span class="code-property">$1</span>"')
        .replace(/:\s*"(.*?)"/g, ': "<span class="code-string">$1</span>"')
        .replace(/:\s*(\d+(\.\d+)?)/g, ': <span class="code-builtin">$1</span>');
      terminalContent.innerHTML = `<pre>${highlightedLog}</pre>`;
    }
    
    currentIdx = (currentIdx + 1) % cards.length;
  }

  rotateCards();
  setInterval(rotateCards, 3200);
}

// 3. Developer Page Code Editor Tabs
const codeSnippets = {
  typescript: `import { Zaptick } from '@zaptick/sdk';

// Initialize the client
const zap = new Zaptick({
  apiKey: 'zt_live_83b19f0ea8a287b320',
  phoneNumberId: '109384918237910'
});

// Dispatch official template with variables
await zap.whatsapp.sendTemplate({
  to: '+14155552671',
  templateName: 'abandoned_cart_recovery_v2',
  language: 'en_US',
  components: [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'Sarah' },
        { type: 'text', text: 'Cart #8291' }
      ]
    },
    {
      type: 'button',
      sub_type: 'url',
      index: 0,
      parameters: [
        { type: 'text', text: 'checkout/cart-token-8291' }
      ]
    }
  ]
});`,
  curl: `curl -X POST "https://api.zaptick.io/v1/messages" \\
  -H "Authorization: Bearer zt_live_83b19f0ea8a287b320" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+14155552671",
    "type": "template",
    "template": {
      "name": "abandoned_cart_recovery_v2",
      "language": {
        "code": "en_US"
      },
      "components": [
        {
          "type": "body",
          "parameters": [
            {"type": "text", "text": "Sarah"},
            {"type": "text", "text": "Cart #8291"}
          ]
        }
      ]
    }
  }'`
};

function initDevEditor() {
  switchTab('typescript');
}

window.switchTab = function(lang) {
  const tabTs = document.getElementById('tab-ts');
  const tabCurl = document.getElementById('tab-curl');
  const codePane = document.getElementById('editor-code-pane');

  if (!codePane) return;

  if (tabTs && tabCurl) {
    if (lang === 'typescript') {
      tabTs.classList.add('active');
      tabCurl.classList.remove('active');
    } else {
      tabCurl.classList.add('active');
      tabTs.classList.remove('active');
    }
  }

  const rawCode = codeSnippets[lang] || '';
  
  // Highlighting regex rules
  let highlighted = rawCode
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\b(import|from|const|await|new|let|return|function)\b/g, '<span class="code-keyword">$1</span>')
    .replace(/(['"`])(.*?)\1/g, '<span class="code-string">\'$2\'</span>')
    .replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>')
    .replace(/\b(Zaptick|body|button|url|Authorization|Bearer|POST|templateName|template)\b/g, '<span class="code-type">$1</span>');

  codePane.innerHTML = highlighted;
};

// 4. Webhook Simulator Logic
function initWebhookSimulator() {
  // Simulator triggers are bound globally via window helper
}

window.simulateWebhook = function(type) {
  const logsContainer = document.getElementById('logs-panel');
  if (!logsContainer) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const wamid = `wamid.HBgLMTQxNTU1NTI2NzEVAgIGFDRDNDQzM0M${Math.floor(Math.random() * 9)}R5=`;

  if (type === 'message') {
    const payload = {
      event: "message.received",
      phone: "+14155552671",
      profile_name: "Sarah Jenkins",
      text: "Hey! I saw your summer collection ad. Do you have sizes in medium?"
    };

    const line = document.createElement('div');
    line.className = "webhook-log-line sent";
    line.innerHTML = `
      <div class="log-meta">
        <span class="log-time">[${timeStr}]</span>
        <span class="log-status sent">RECEIVED</span>
      </div>
      <div class="log-payload">${JSON.stringify(payload, null, 2)}</div>
    `;
    logsContainer.appendChild(line);
  } else {
    // Simulate multi-step status dispatch
    const statuses = ['sent', 'delivered', 'read'];
    statuses.forEach((statusName, idx) => {
      setTimeout(() => {
        const payload = {
          event: `message.${statusName}`,
          phone: "+14155552671",
          wamid: wamid,
          timestamp: Math.floor(Date.now() / 1000)
        };

        const line = document.createElement('div');
        line.className = `webhook-log-line ${statusName}`;
        line.innerHTML = `
          <div class="log-meta">
            <span class="log-time">[${timeStr}]</span>
            <span class="log-status ${statusName}">${statusName.toUpperCase()}</span>
          </div>
          <div class="log-payload">${JSON.stringify(payload, null, 2)}</div>
        `;
        logsContainer.appendChild(line);
        logsContainer.scrollTop = logsContainer.scrollHeight;
      }, idx * 800);
    });
  }

  setTimeout(() => {
    logsContainer.scrollTop = logsContainer.scrollHeight;
  }, 100);
};

// 5. Stat Counter Animation
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const valStr = target.getAttribute('data-target');
        const numericVal = parseFloat(valStr.replace(/[^0-9.]/g, ''));
        const suffix = valStr.replace(/[0-9.]/g, '');
        
        let start = 0;
        const duration = 2000;
        const steps = 60;
        const increment = numericVal / steps;
        const stepTime = duration / steps;
        
        let count = 0;
        const interval = setInterval(() => {
          count += increment;
          if (count >= numericVal) {
            target.innerText = valStr;
            clearInterval(interval);
          } else {
            const currentFormatted = valStr.includes('.') 
              ? count.toFixed(1) 
              : Math.floor(count);
            target.innerText = currentFormatted + suffix;
          }
        }, stepTime);
        
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}

// 6. Highlight Active Nav state based on URL
function highlightActiveNavLink() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (page === href || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
