// === KI_AGENTS_LIST — script.js ===

const MODEL_CONFIG = {
    opus:    { color: '#ff3366', badge: 'badge-opus',    glow: '#ff3366', label: 'Opus' },
    sonnet:  { color: '#00fff2', badge: 'badge-sonnet',  glow: '#00fff2', label: 'Sonnet' },
    haiku:   { color: '#39ff14', badge: 'badge-haiku',   glow: '#39ff14', label: 'Haiku' },
    inherit: { color: '#a0a0b0', badge: 'badge-inherit', glow: '#a0a0b0', label: 'Inherit' },
};

function getModelConfig(model) {
    const key = (model || 'inherit').toLowerCase().trim();
    return MODEL_CONFIG[key] || MODEL_CONFIG.inherit;
}

// --- Markdown Parser ---

function parseAgents(mdText) {
    const blocks = mdText.split(/^## Agent\s*$/m).slice(1);
    return blocks.map(parseAgentBlock).filter(Boolean);
}

function parseAgentBlock(block) {
    const lines = block.trim().split('\n');
    const agent = { name: '', funktion: '', quelle: '', model: '', beschreibung: '', systemPrompt: '' };

    let i = 0;
    // Parse metadata lines with length validation
    while (i < lines.length) {
        const line = lines[i].trim();
        if (line.startsWith('- **Name:**')) {
            agent.name = line.replace('- **Name:**', '').trim().substring(0, 200);
            i++;
            continue;
        }
        if (line.startsWith('- **Funktion:**')) {
            agent.funktion = line.replace('- **Funktion:**', '').trim().substring(0, 500);
            i++;
            continue;
        }
        if (line.startsWith('- **Quelle:**')) {
            agent.quelle = line.replace('- **Quelle:**', '').trim().substring(0, 200);
            i++;
            continue;
        }
        if (line.startsWith('- **Model:**')) {
            agent.model = line.replace('- **Model:**', '').trim().substring(0, 50);
            i++;
            continue;
        }
        break;
    }

    // Collect description (everything before the code block) with size limit
    const descLines = [];
    let descCharCount = 0;
    const maxDescLength = 5000;

    while (i < lines.length && !lines[i].trim().startsWith('```')) {
        const line = lines[i];
        if (descCharCount + line.length > maxDescLength) break;
        descLines.push(line);
        descCharCount += line.length;
        i++;
    }
    agent.beschreibung = descLines.join('\n').trim();

    // Extract system prompt (inside code block) with size limit
    if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++; // skip opening ```
        const promptLines = [];
        let promptCharCount = 0;
        const maxPromptLength = 20000;

        while (i < lines.length && !lines[i].trim().startsWith('```')) {
            const line = lines[i];
            if (promptCharCount + line.length > maxPromptLength) break;
            promptLines.push(line);
            promptCharCount += line.length;
            i++;
        }
        agent.systemPrompt = promptLines.join('\n');
    }

    // Validate agent has required fields
    if (!agent.name || agent.name.length === 0) return null;

    return agent;
}

// --- Card Rendering ---

function createCard(agent, index) {
    const mc = getModelConfig(agent.model);
    const card = document.createElement('div');
    card.className = 'agent-card';
    card.style.setProperty('--glow-color', mc.glow);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Details zu ${agent.name} anzeigen`);

    // Truncate description for card preview
    const shortDesc = agent.beschreibung.length > 120
        ? agent.beschreibung.substring(0, 120) + '...'
        : agent.beschreibung;

    card.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase tracking-wider ${mc.badge}">
                ${mc.label}
            </span>
            <span class="text-[10px] font-mono text-gray-600">#${String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 class="text-base font-mono font-semibold text-white mb-1 tracking-tight">${escapeHtml(agent.name)}</h3>
        <p class="text-xs font-mono mb-3" style="color: ${mc.color}">${escapeHtml(agent.funktion)}</p>
        <p class="text-xs text-gray-500 leading-relaxed mb-3">${escapeHtml(shortDesc)}</p>
        <div class="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-40">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <span>${escapeHtml(agent.quelle)}</span>
        </div>
    `;

    card.addEventListener('click', () => openModal(agent));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(agent);
        }
    });

    return card;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- Modal ---

function openModal(agent) {
    const mc = getModelConfig(agent.model);
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const badge = document.getElementById('modal-model-badge');
    const meta = document.getElementById('modal-meta');
    const body = document.getElementById('modal-body');

    title.textContent = agent.name;
    badge.textContent = mc.label;
    badge.className = `text-xs font-mono font-semibold px-2.5 py-1 border rounded-full uppercase tracking-wider ${mc.badge}`;

    meta.innerHTML = `
        <span><span class="text-gray-600">Funktion:</span> <span class="text-gray-400">${escapeHtml(agent.funktion)}</span></span>
        <span><span class="text-gray-600">Quelle:</span> <span class="text-gray-400">${escapeHtml(agent.quelle)}</span></span>
        <span><span class="text-gray-600">Model:</span> <span style="color:${mc.color}">${escapeHtml(agent.model)}</span></span>
    `;

    // Render description as sanitized HTML with strict config
    const sanitizeConfig = {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li', 'h3', 'h4', 'a', 'blockquote'],
        ALLOWED_ATTR: ['href', 'class'],
        ALLOWED_URI_REGEXP: /^(?:(?:https?):\/\/)/i,
        ALLOW_DATA_ATTR: false,
        ALLOW_UNKNOWN_PROTOCOLS: false
    };
    const descHtml = DOMPurify.sanitize(marked.parse(agent.beschreibung), sanitizeConfig);

    // Render system prompt
    const promptHtml = `
        <h3 class="text-sm font-mono font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-60">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            System Prompt
        </h3>
        <pre><code>${escapeHtml(agent.systemPrompt)}</code></pre>
    `;

    body.innerHTML = descHtml + promptHtml;

    // Set header border color
    document.getElementById('modal-header').style.borderBottomColor = mc.glow + '33';

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus trap
    document.getElementById('modal-close').focus();
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// --- Event Listeners ---

document.getElementById('modal-close').addEventListener('click', closeModal);

document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// --- Init ---

// Simple rate limiting for init function
let initAttempts = 0;
const maxInitAttempts = 3;
const initTimeout = 10000; // 10 seconds

async function init() {
    // Prevent excessive init calls
    initAttempts++;
    if (initAttempts > maxInitAttempts) {
        console.error('Maximum initialization attempts exceeded');
        document.getElementById('loading').innerHTML = `
            <p class="text-red-400 font-mono text-sm">Zu viele Ladeversuche</p>
            <p class="text-gray-600 font-mono text-xs mt-2">Bitte warte einen Moment und lade dann die Seite neu.</p>
        `;
        return;
    }
    try {
        // Validate file path to prevent path traversal
        const filePath = 'agents.md';
        if (!/^[a-zA-Z0-9_-]+\.md$/.test(filePath)) {
            throw new Error('Invalid file path');
        }

        // Fetch with timeout protection
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(filePath, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/plain'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // Validate content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text')) {
            throw new Error('Invalid content type');
        }

        const mdText = await response.text();

        // Validate response size (prevent DoS via large files)
        if (mdText.length > 1000000) { // 1MB limit
            throw new Error('Response too large');
        }
        const agents = parseAgents(mdText);

        const grid = document.getElementById('agent-grid');
        agents.forEach((agent, i) => {
            const card = createCard(agent, i);
            // Stagger animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            grid.appendChild(card);
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 60 * i);
        });

        document.getElementById('loading').classList.add('hidden');
        document.getElementById('grid-container').classList.remove('hidden');
    } catch (err) {
        // Log minimal error info to console (production-safe)
        console.error('Failed to load agents data');
        document.getElementById('loading').innerHTML = `
            <p class="text-red-400 font-mono text-sm">Fehler beim Laden der Agentendaten</p>
            <p class="text-gray-600 font-mono text-xs mt-2">Bitte lade die Seite neu.</p>
        `;
    }
}

init();
