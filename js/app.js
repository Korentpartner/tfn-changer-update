/**
 * AdyOrbit — Smart Documents. Global Reach.
 * SEO PDF Suite: TFN Changer + Bulk PDF Maker
 * Flawless Vector Document Generation, Multi-Number TFN Rotation & Native Icon/Emoji Fidelity
 */

function initApp() {
    // Detect HTTPS / Vercel deployment
    const isHttps = window.location.protocol === 'https:';
    const BACKEND_URL = isHttps ? null : 'http://localhost:8000';

    // ── 1. THEME PERSISTENCE ─────────────────────────────────────────────────
    const savedTheme = localStorage.getItem('adyorbit-theme') || 'light-theme';
    document.body.className = savedTheme;

    // ── 2. APPLICATION STATE (100% EMPTY BY DEFAULT) ─────────────────────────
    const AppState = {
        currentWorkspace: 'tfn-changer', // 'tfn-changer' | 'bulk-maker'
        targetTfnsList: [], // Chip tags list: ['+1 (987) 654-3210', ...]
        document: {
            title: '',
            pdfFilename: '',
            originalHtml: '',
            hasOriginalBackup: false,
            sourceAirline: '',
            targetTfn1: '',
            targetTfn2: '',
            stats: { detected: 0, replaced: 0, target1: 0, target2: 0 }
        },
        bulk: {
            masterTemplateHtml: '',
            masterTemplateTitle: '',
            headlineTag: 'h1',
            customHeadlineTag: '',
            headlineText: '',
            currentTab: 'visual',
            seoDocTitle: '{headline} | Official Guide & Bookings',
            seoSubject: 'Complete travel guide, reservations and 24/7 customer support for {airline} flights.',
            seoAuthor: 'AdyOrbit Travel Guides',
            seoKeywords: '{airline}, flight booking, reservations, customer service, support number',
            sourceAirline: '',
            targetAirlinesText: '',
            targetAirlinesList: [],
            duplicatesList: [],
            namingPattern: 'delta-air',
            headlineMode: 'auto', // 'auto' | 'custom'
            tfnEnabled: true,
            tfn1: '',
            tfn2: '',
            queue: [], // array of { id, airline, headline, filename, status, error, pdfBlob }
            isGenerating: false,
            generatedCount: 0
        }
    };

    // ── 3. DOM ELEMENT REFERENCES ────────────────────────────────────────────
    // Workspaces Navigation
    const navTfnChanger = document.getElementById('navTfnChanger');
    const navBulkMaker = document.getElementById('navBulkMaker');
    const tfnChangerView = document.getElementById('tfnChangerView');
    const bulkMakerView = document.getElementById('bulkMakerView');

    // TFN Changer Top Toolbar
    const pdfFilenameInput = document.getElementById('pdfFilenameInput');
    const moveToBulkBtn = document.getElementById('moveToBulkBtn');
    const exportVectorPdfBtn = document.getElementById('exportVectorPdfBtn');
    const bannerDownloadPdf = document.getElementById('bannerDownloadPdf');
    const bannerMoveToBulk = document.getElementById('bannerMoveToBulk');

    // TFN Changer Editor & Counters
    const docTitleInput = document.getElementById('docTitleInput');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const saveStatusText = document.getElementById('saveStatusText');

    // TFN Replacement Inspector Panel
    const tfnNumbersCountBadge = document.getElementById('tfnNumbersCountBadge');
    const sourceAirlineInput = document.getElementById('sourceAirlineInput');
    const tfnChipsList = document.getElementById('tfnChipsList');
    const targetTfn1Input = document.getElementById('targetTfn1Input');
    const btnAddChip1 = document.getElementById('btnAddChip1');
    const targetTfn2Input = document.getElementById('targetTfn2Input');
    const alternateTfnSwitch = document.getElementById('alternateTfnSwitch');
    const originalPreviewVal = document.getElementById('originalPreviewVal');
    const outputPreviewVal = document.getElementById('outputPreviewVal');
    const viewDetailsModalBtn = document.getElementById('viewDetailsModalBtn');

    // Stats
    const statDetected = document.getElementById('statDetected');
    const statReplaced = document.getElementById('statReplaced');
    const statTarget1 = document.getElementById('statTarget1');
    const statTarget2 = document.getElementById('statTarget2');
    const applySmartTfnBtn = document.getElementById('applySmartTfnBtn');
    const undoTfnBtn = document.getElementById('undoTfnBtn');

    // Advanced Settings
    const toggleAdvancedSettings = document.getElementById('toggleAdvancedSettings');
    const advancedSettingsContent = document.getElementById('advancedSettingsContent');
    const accArrow = document.getElementById('accArrow');

    // Quick Actions
    const qaImportDoc = document.getElementById('qaImportDoc');
    const qaUseTemplate = document.getElementById('qaUseTemplate');
    const qaViewHistory = document.getElementById('qaViewHistory');
    const qaSettings = document.getElementById('qaSettings');

    // Bulk PDF Maker
    const bulkUseTemplateBtn = document.getElementById('bulkUseTemplateBtn');
    const templateThumbnailCard = document.getElementById('templateThumbnailCard');
    const bulkTemplateTitleLabel = document.getElementById('bulkTemplateTitleLabel');
    const bulkTemplateStatus = document.getElementById('bulkTemplateStatus');
    const syncFromTfnBtn = document.getElementById('syncFromTfnBtn');
    const bulkLoadSampleBtn = document.getElementById('bulkLoadSampleBtn');
    const bulkClearTemplateBtn = document.getElementById('bulkClearTemplateBtn');
    const bulkHeadlineTagSelect = document.getElementById('bulkHeadlineTagSelect');
    const bulkCustomHeadlineTag = document.getElementById('bulkCustomHeadlineTag');
    const bulkDetectedHeadlineBadge = document.getElementById('bulkDetectedHeadlineBadge');
    const bulkHeadlineTagPillText = document.getElementById('bulkHeadlineTagPillText');
    const bulkHeadlineContentInput = document.getElementById('bulkHeadlineContentInput');
    const bulkSetSelectionAsHeadlineBtn = document.getElementById('bulkSetSelectionAsHeadlineBtn');
    const tabVisualEditor = document.getElementById('tabVisualEditor');
    const tabCodeEditor = document.getElementById('tabCodeEditor');
    const tabLivePreview = document.getElementById('tabLivePreview');
    const bulkVisualEditorContainer = document.getElementById('bulkVisualEditorContainer');
    const bulkCodeEditorContainer = document.getElementById('bulkCodeEditorContainer');
    const bulkLivePreviewContainer = document.getElementById('bulkLivePreviewContainer');
    const bulkMasterQuillEditor = document.getElementById('bulkMasterQuillEditor');
    const bulkMasterCodeTextarea = document.getElementById('bulkMasterCodeTextarea');
    const btnFormatMasterHtml = document.getElementById('btnFormatMasterHtml');
    const bulkSeoToggleBtn = document.getElementById('bulkSeoToggleBtn');
    const bulkSeoChevron = document.getElementById('bulkSeoChevron');
    const bulkSeoBody = document.getElementById('bulkSeoBody');
    const bulkSeoDocTitle = document.getElementById('bulkSeoDocTitle');
    const bulkSeoSubject = document.getElementById('bulkSeoSubject');
    const bulkSeoAuthor = document.getElementById('bulkSeoAuthor');
    const bulkSeoKeywords = document.getElementById('bulkSeoKeywords');
    const step4HeadlineTagNotice = document.getElementById('step4HeadlineTagNotice');
    const bulkMasterPreview = document.getElementById('bulkMasterPreview');
    const bulkTemplateReadyTag = document.getElementById('bulkTemplateReadyTag');
    const bulkTemplateMetrics = document.getElementById('bulkTemplateMetrics');
    const bulkSourceAirline = document.getElementById('bulkSourceAirline');
    const loadSampleAirlinesBtn = document.getElementById('loadSampleAirlinesBtn');
    const bulkTargetAirlines = document.getElementById('bulkTargetAirlines');
    const bulkAirlinesCount = document.getElementById('bulkAirlinesCount');
    const bulkDuplicatesWarning = document.getElementById('bulkDuplicatesWarning');
    const bulkInvalidCount = document.getElementById('bulkInvalidCount');
    const optHeadlineAuto = document.getElementById('optHeadlineAuto');
    const optHeadlineCustom = document.getElementById('optHeadlineCustom');
    const bulkFilenamePattern = document.getElementById('bulkFilenamePattern');
    const filenamePreviewPills = document.getElementById('filenamePreviewPills');
    const bulkTfnToggle = document.getElementById('bulkTfnToggle');
    const bulkTfnInputsArea = document.getElementById('bulkTfnInputsArea');
    const bulkTfn1 = document.getElementById('bulkTfn1');
    const bulkTfn2 = document.getElementById('bulkTfn2');

    // Bulk Generation Preview
    const tableRowCountBadge = document.getElementById('tableRowCountBadge');
    const metricTotal = document.getElementById('metricTotal');
    const metricReady = document.getElementById('metricReady');
    const metricWarnings = document.getElementById('metricWarnings');
    const metricErrors = document.getElementById('metricErrors');
    const bulkTableBody = document.getElementById('bulkTableBody');
    const bulkGenerateBtn = document.getElementById('bulkGenerateBtn');
    const bulkDownloadZipBtn = document.getElementById('bulkDownloadZipBtn');

    // Global Topbar & Modals
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const navNotificationBtn = document.getElementById('navNotificationBtn');
    const navHistoryBtn = document.getElementById('navHistoryBtn');
    const userProfileBtn = document.getElementById('userProfileBtn');
    const appModalOverlay = document.getElementById('appModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBody = document.getElementById('modalBody');
    const toastContainer = document.getElementById('toast-container');

    // Mobile Navigation Drawer
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const leftSidebar = document.getElementById('leftSidebar');

    // ── 4. MODALS & TOAST UTILITIES ──────────────────────────────────────────
    const openModal = (html) => {
        if (modalBody && appModalOverlay) {
            modalBody.innerHTML = html;
            appModalOverlay.style.display = 'flex';
        }
    };
    const closeModal = () => {
        if (appModalOverlay) appModalOverlay.style.display = 'none';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (appModalOverlay) {
        appModalOverlay.addEventListener('click', (e) => {
            if (e.target === appModalOverlay) closeModal();
        });
    }

    function showToast(message, type = 'info', durationMs = 3500) {
        if (!toastContainer) { console.log(`[Toast ${type}]`, message); return; }
        const icons = {
            success: 'fa-circle-check',
            warning: 'fa-triangle-exclamation',
            error: 'fa-circle-xmark',
            info: 'fa-circle-info'
        };
        const icon = icons[type] || icons.info;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('toast-hide');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        }, durationMs);
    }
    window.showToastGlobal = showToast;

    function showConfirm(message, confirmLabel = 'Confirm', cancelLabel = 'Cancel') {
        return new Promise((resolve) => {
            openModal(`
                <div style="text-align: center; padding: 10px 0;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.2rem; color: #f59e0b; margin-bottom: 14px; display: block;"></i>
                    <p style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 22px;">${message}</p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="confirmNo" style="padding: 10px 22px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-secondary); font-size: 0.88rem; cursor: pointer; font-weight: 500;">${cancelLabel}</button>
                        <button id="confirmYes" style="padding: 10px 22px; border-radius: 8px; border: none; background: linear-gradient(135deg, #4f46e5, #4338ca); color: #fff; font-size: 0.88rem; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(79,70,229,0.35);">${confirmLabel}</button>
                    </div>
                </div>
            `);
            const yes = document.getElementById('confirmYes');
            const no = document.getElementById('confirmNo');
            const finish = (val) => { closeModal(); resolve(val); };
            if (yes) yes.addEventListener('click', () => finish(true), { once: true });
            if (no) no.addEventListener('click', () => finish(false), { once: true });
        });
    }

    // Mobile Drawers
    const closeDrawers = () => {
        if (leftSidebar) leftSidebar.classList.remove('mobile-open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    };
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (leftSidebar) leftSidebar.classList.toggle('mobile-open');
            if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active');
        });
    }
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeDrawers);

    // ── 5. QUILL EDITOR (STARTS 100% EMPTY) ──────────────────────────────────
    const sourceQuill = new Quill('#sourceEditor', {
        theme: 'snow',
        placeholder: 'Type or paste your document content here. Emojis (📞, ✈, ★, ✔) and custom layouts are fully supported...',
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                ['link', 'image', 'clean']
            ],
            clipboard: { matchVisual: false }
        }
    });

    // Ensure completely empty on start (khali box)
    sourceQuill.root.innerHTML = '';
    if (docTitleInput) docTitleInput.value = '';
    if (pdfFilenameInput) pdfFilenameInput.value = '';
    if (sourceAirlineInput) sourceAirlineInput.value = '';
    if (targetTfn1Input) targetTfn1Input.value = '';
    if (targetTfn2Input) targetTfn2Input.value = '';

    // Live Word & Character Counter
    function updateEditorStats() {
        const text = sourceQuill.getText().trim();
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        const chars = text.length;
        if (wordCount) wordCount.innerText = words.toLocaleString();
        if (charCount) charCount.innerText = chars.toLocaleString();
        if (saveStatusText) {
            saveStatusText.innerText = chars > 0 ? 'Saved just now' : 'Ready for input';
        }
    }
    sourceQuill.on('text-change', () => {
        updateEditorStats();
        updateLivePreview();
    });
    updateEditorStats();

    // ── 6. STRICT TFN REGEX & DIGIT REPLACEMENT ENGINE ───────────────────────
    /**
     * Strict phone number extraction regex.
     * Matches numbers like: +1-888-830-8592, (855) 123-4567, +180-055-501-99, +44 20 7946 0958
     * NEVER consumes emojis (📞, ✈), ampersands (&), or surrogate pair characters.
     */
    function extractAllTfnsFromText(text) {
        if (!text) return [];
        const pattern = /(?:\+\d{1,3}[\s.\-]?)?(?:\(\s*\d{2,4}\s*\)[\s.\-]?|\b\d{2,4}[\s.\-])\d{2,4}[\s.\-]\d{2,4}(?:[\s.\-]\d{1,5})?\b/g;
        const matches = [];
        let m;
        while ((m = pattern.exec(text)) !== null) {
            const raw = m[0].replace(/^[\s.,;:/\-]+|[\s.,;:/\-]+$/g, '');
            const digits = raw.replace(/\D/g, '');
            if (digits.length >= 10 && digits.length <= 15) {
                matches.push({
                    index: m.index + m[0].indexOf(raw),
                    length: raw.length,
                    text: raw
                });
            }
        }
        return matches;
    }

    /**
     * Maps target digits onto competitor's exact formatting template.
     * Prevents duplicate '+' signs and preserves delimiters strictly.
     */
    function formatDigitsToCompetitorPattern(competitorStr, userInputStr) {
        if (!competitorStr || !userInputStr) return competitorStr || '';

        // Clean any accidental duplicate plus signs from input
        let cleanComp = competitorStr.trim().replace(/^\++/, '+');
        let cleanUser = userInputStr.trim().replace(/^\++/, '+');

        const compHasPlus = cleanComp.startsWith('+');
        const userHasPlus = cleanUser.startsWith('+');

        if (compHasPlus || userHasPlus) {
            let compCcLength = 0;
            let compBodyStr = cleanComp;

            if (compHasPlus) {
                const compDigits = cleanComp.replace(/\D/g, '');
                if (cleanComp.startsWith('+1')) {
                    compCcLength = 1;
                } else {
                    const cc3 = compDigits.substring(0, 3);
                    const known3Digit = ['351', '380', '971', '506', '502', '503', '504', '505', '507', '591', '592', '593', '595', '598'];
                    compCcLength = known3Digit.includes(cc3) ? 3 : 2;
                }

                let digitsSeen = 0;
                let ccEndIdx = 0;
                for (let i = 0; i < cleanComp.length; i++) {
                    if (/\d/.test(cleanComp[i])) {
                        digitsSeen++;
                        if (digitsSeen === compCcLength) {
                            ccEndIdx = i + 1;
                            break;
                        }
                    }
                }
                compBodyStr = cleanComp.substring(ccEndIdx);
            }

            const userDigits = cleanUser.replace(/\D/g, '');
            let userCcStr = '';
            let userBodyDigits = userDigits;

            if (userHasPlus) {
                let userCcLen = 1;
                if (cleanUser.startsWith('+1')) {
                    userCcLen = 1;
                } else {
                    const cc3 = userDigits.substring(0, 3);
                    const known3Digit = ['351', '380', '971', '506', '502', '503', '504', '505', '507', '591', '592', '593', '595', '598'];
                    userCcLen = known3Digit.includes(cc3) ? 3 : 2;
                }
                userCcStr = '+' + userDigits.substring(0, userCcLen);
                userBodyDigits = userDigits.substring(userCcLen);
            } else if (compHasPlus) {
                if (userDigits.length > 10) {
                    const userCcLen = userDigits.length - 10;
                    userCcStr = '+' + userDigits.substring(0, userCcLen);
                    userBodyDigits = userDigits.substring(userCcLen);
                } else {
                    const compDigits = cleanComp.replace(/\D/g, '');
                    userCcStr = '+' + compDigits.substring(0, compCcLength || 1);
                    userBodyDigits = userDigits;
                }
            }

            let resultBody = '';
            let bIdx = 0;
            for (const ch of compBodyStr) {
                if (/\d/.test(ch)) {
                    if (bIdx < userBodyDigits.length) {
                        resultBody += userBodyDigits[bIdx++];
                    }
                } else {
                    resultBody += ch;
                }
            }
            while (bIdx < userBodyDigits.length) {
                resultBody += userBodyDigits[bIdx++];
            }

            const combined = userCcStr + resultBody;
            return combined.replace(/^\++/, '+');
        }

        const targetDigits = cleanUser.replace(/\D/g, '');
        if (!targetDigits) return competitorStr;
        let result = '', idx = 0;
        for (const ch of competitorStr) {
            result += /\d/.test(ch)
                ? (idx < targetDigits.length ? targetDigits[idx++] : '')
                : ch;
        }
        while (idx < targetDigits.length) result += targetDigits[idx++];
        return result;
    }

    function sanitizeFilename(name, defaultName = 'document') {
        const clean = (name || defaultName)
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        let filename = clean.toLowerCase();
        if (filename.endsWith('.pdf')) {
            filename = filename.substring(0, filename.length - 4);
        }
        return (filename || defaultName) + '.pdf';
    }

    function escapeRegExp(s) {
        return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ── 7. TARGET TFN CHIP SYSTEM ────────────────────────────────────────────
    function renderTfnChips() {
        if (!tfnChipsList) return;
        tfnChipsList.innerHTML = AppState.targetTfnsList.map((num, i) => `
            <div class="tfn-chip">
                <span>${num}</span>
                <button type="button" class="btn-remove-chip" data-idx="${i}" title="Remove number">&times;</button>
            </div>
        `).join('');

        const totalChips = AppState.targetTfnsList.length;
        if (tfnNumbersCountBadge) {
            tfnNumbersCountBadge.innerText = totalChips === 1 ? '1 Number' : `${totalChips} Numbers`;
        }

        tfnChipsList.querySelectorAll('.btn-remove-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.idx, 10);
                AppState.targetTfnsList.splice(idx, 1);
                renderTfnChips();
                updateLivePreview();
            });
        });
    }

    function addTargetTfnChip(val) {
        const clean = (val || '').trim();
        if (!clean) return;
        if (!AppState.targetTfnsList.includes(clean)) {
            AppState.targetTfnsList.push(clean);
            renderTfnChips();
            updateLivePreview();
        }
    }

    if (btnAddChip1) {
        btnAddChip1.addEventListener('click', () => {
            if (targetTfn1Input && targetTfn1Input.value.trim()) {
                addTargetTfnChip(targetTfn1Input.value);
                targetTfn1Input.value = '';
            }
        });
    }

    if (targetTfn1Input) {
        targetTfn1Input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (targetTfn1Input.value.trim()) {
                    addTargetTfnChip(targetTfn1Input.value);
                    targetTfn1Input.value = '';
                }
            }
        });
    }

    // ── 8. LIVE PREVIEW IN INSPECTOR PANEL ────────────────────────────────────
    function getActiveTargetTfns() {
        if (AppState.targetTfnsList.length > 0) {
            return AppState.targetTfnsList;
        }
        const t1 = (targetTfn1Input?.value || '').trim();
        const t2 = (targetTfn2Input?.value || '').trim();
        const list = [];
        if (t1) list.push(t1);
        if (t2) list.push(t2);
        return list;
    }

    function updateLivePreview() {
        const text = sourceQuill.getText();
        const matches = extractAllTfnsFromText(text);
        const uniqueCompetitors = [...new Set(matches.map(m => m.text))];

        const targets = getActiveTargetTfns();
        const sampleTarget = targets[0] || '';
        const sampleComp = uniqueCompetitors[0] || '';

        if (originalPreviewVal) {
            originalPreviewVal.innerText = sampleComp || '--';
        }

        if (outputPreviewVal) {
            if (sampleComp && sampleTarget) {
                outputPreviewVal.innerText = formatDigitsToCompetitorPattern(sampleComp, sampleTarget);
            } else if (sampleTarget) {
                outputPreviewVal.innerText = sampleTarget;
            } else {
                outputPreviewVal.innerText = '--';
            }
        }

        if (statDetected) statDetected.innerText = matches.length;
    }

    if (targetTfn1Input) targetTfn1Input.addEventListener('input', updateLivePreview);
    if (targetTfn2Input) targetTfn2Input.addEventListener('input', updateLivePreview);

    // ── 9. APPLY REPLACEMENT & RESET ─────────────────────────────────────────
    if (applySmartTfnBtn) {
        applySmartTfnBtn.addEventListener('click', () => {
            const targets = getActiveTargetTfns();
            if (!targets.length) {
                showToast('Please enter at least one Target TFN!', 'warning');
                return;
            }

            const text = sourceQuill.getText();
            const found = extractAllTfnsFromText(text);
            if (!found.length) {
                showToast('No competitor phone numbers detected in document.', 'warning');
                return;
            }

            // Save backup for Reset
            if (!AppState.document.hasOriginalBackup) {
                AppState.document.originalHtml = sourceQuill.root.innerHTML;
                AppState.document.hasOriginalBackup = true;
            }

            let t1Count = 0;
            let t2Count = 0;
            const alternate = alternateTfnSwitch ? alternateTfnSwitch.checked : true;

            for (let i = found.length - 1; i >= 0; i--) {
                const mv = found[i];
                const targetIdx = alternate ? (i % targets.length) : 0;
                const targetNumber = targets[targetIdx];

                if (targetIdx === 0) t1Count++;
                else t2Count++;

                const replacement = formatDigitsToCompetitorPattern(mv.text, targetNumber);
                const fmt = sourceQuill.getFormat(mv.index, 1);
                sourceQuill.deleteText(mv.index, mv.length);
                if (replacement) sourceQuill.insertText(mv.index, replacement, fmt);
            }

            AppState.document.stats = {
                detected: found.length,
                replaced: found.length,
                target1: t1Count,
                target2: t2Count
            };

            if (statDetected) statDetected.innerText = found.length;
            if (statReplaced) statReplaced.innerText = found.length;
            if (statTarget1) statTarget1.innerText = t1Count;
            if (statTarget2) statTarget2.innerText = t2Count;

            showToast(`Replaced ${found.length} phone numbers while keeping original formats!`, 'success');
            updateLivePreview();
        });
    }

    if (undoTfnBtn) {
        undoTfnBtn.addEventListener('click', () => {
            if (!AppState.document.hasOriginalBackup || !AppState.document.originalHtml) {
                showToast('No previous replacement to reset.', 'warning');
                return;
            }
            sourceQuill.root.innerHTML = AppState.document.originalHtml;
            AppState.document.hasOriginalBackup = false;
            AppState.document.stats = { detected: 0, replaced: 0, target1: 0, target2: 0 };

            if (statReplaced) statReplaced.innerText = 0;
            if (statTarget1) statTarget1.innerText = 0;
            if (statTarget2) statTarget2.innerText = 0;

            showToast('Document reverted to original.', 'info');
            updateLivePreview();
        });
    }

    // Collapsible Advanced Settings
    if (toggleAdvancedSettings && advancedSettingsContent) {
        toggleAdvancedSettings.addEventListener('click', () => {
            const isHidden = advancedSettingsContent.style.display === 'none';
            advancedSettingsContent.style.display = isHidden ? 'block' : 'none';
            if (accArrow) {
                accArrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    // View Details Modal
    if (viewDetailsModalBtn) {
        viewDetailsModalBtn.addEventListener('click', () => {
            const text = sourceQuill.getText();
            const found = extractAllTfnsFromText(text);
            const targets = getActiveTargetTfns();

            let rows = '';
            if (found.length === 0) {
                rows = `<tr><td colspan="4" style="text-align:center; padding: 24px; color: var(--text-muted);">No phone numbers currently detected.</td></tr>`;
            } else {
                found.forEach((m, i) => {
                    const target = targets[i % (targets.length || 1)] || '--';
                    const repl = target !== '--' ? formatDigitsToCompetitorPattern(m.text, target) : '--';
                    rows += `
                        <tr>
                            <td style="color: var(--text-muted); font-size: 0.8rem;">${i + 1}</td>
                            <td><code>${m.text}</code></td>
                            <td><span style="color: var(--brand-purple); font-weight: 500;">${target}</span></td>
                            <td><strong style="color: var(--brand-green);">${repl}</strong></td>
                        </tr>
                    `;
                });
            }

            openModal(`
                <h3 style="margin-bottom: 14px; color: var(--text-primary);"><i class="fa-solid fa-list-check" style="color: var(--brand-purple);"></i> Detailed TFN Audit Matrix</h3>
                <div style="max-height: 420px; overflow-y: auto;">
                    <table class="bulk-table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Detected In Document</th>
                                <th>Target Assigned</th>
                                <th>Formatted Replacement</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 18px; display: flex; justify-content: flex-end;">
                    <button class="btn-primary-green" onclick="document.getElementById('appModalOverlay').style.display='none'">Close</button>
                </div>
            `);
        });
    }

    // ── 10. CLIENT-SIDE PDF GENERATOR (FLAWLESS EMOJIS & ZERO BOXES) ─────────
    /**
     * Client-side PDF generator using html2pdf.js + jsPDF vector text injection.
     * Generates 100% Google-Indexable, searchable, selectable text-based PDFs with
     * document metadata (Title, Subject, Author, Keywords) and active crawlable hyperlinks.
     */
    /**
    /**
     * Client-side PDF generator using html2pdf.js + jsPDF.
     * Renders crisp, high-resolution document with explicit white background,
     * beautiful typography, emoji support, and Google SEO Document Metadata.
     * Works seamlessly regardless of host dark mode or window scroll position.
     */
    async function generatePdfClientSide(htmlContent, title, seoOptions = {}) {
        const safeTitle = sanitizeFilename(title);

        let mount = document.getElementById('pdf-mount-container');
        if (!mount) {
            mount = document.createElement('div');
            mount.id = 'pdf-mount-container';
            mount.style.cssText = 'position: absolute; left: 0; top: 0; pointer-events: none; z-index: -99999; opacity: 1;';
            document.body.appendChild(mount);
        }
        mount.innerHTML = '';

        // Save scroll position and reset to (0, 0) for html2canvas so it never crops or renders blank
        const prevScrollX = window.scrollX || window.pageXOffset || 0;
        const prevScrollY = window.scrollY || window.pageYOffset || 0;
        window.scrollTo(0, 0);

        const stage = document.createElement('div');
        stage.className = 'pdf-isolated-render-sheet';
        stage.style.cssText = `
            width: 794px;
            min-height: 1123px;
            padding: 44px 48px;
            box-sizing: border-box;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.65;
            display: block;
            position: relative;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .pdf-isolated-render-sheet, .pdf-isolated-render-sheet * {
                box-sizing: border-box !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .pdf-isolated-render-sheet {
                background: #ffffff !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
            }
            .pdf-isolated-render-sheet h1 {
                font-size: 26px !important;
                font-weight: 800 !important;
                margin: 0 0 16px 0 !important;
                color: #0f172a !important;
                line-height: 1.25 !important;
            }
            .pdf-isolated-render-sheet h2 {
                font-size: 20px !important;
                font-weight: 700 !important;
                margin: 22px 0 10px 0 !important;
                color: #1e293b !important;
                line-height: 1.3 !important;
            }
            .pdf-isolated-render-sheet h3 {
                font-size: 17px !important;
                font-weight: 600 !important;
                margin: 18px 0 8px 0 !important;
                color: #334155 !important;
                line-height: 1.35 !important;
            }
            .pdf-isolated-render-sheet h4 {
                font-size: 15px !important;
                font-weight: 600 !important;
                margin: 14px 0 6px 0 !important;
                color: #475569 !important;
            }
            .pdf-isolated-render-sheet p {
                margin: 0 0 12px 0 !important;
                color: #1e293b !important;
                line-height: 1.65 !important;
                word-break: break-word !important;
            }
            .pdf-isolated-render-sheet ul, .pdf-isolated-render-sheet ol {
                margin: 0 0 12px 0 !important;
                padding-left: 24px !important;
                color: #1e293b !important;
            }
            .pdf-isolated-render-sheet li {
                margin-bottom: 5px !important;
                color: #1e293b !important;
            }
            .pdf-isolated-render-sheet strong, .pdf-isolated-render-sheet b {
                font-weight: 700 !important;
                color: #0f172a !important;
            }
            .pdf-isolated-render-sheet em, .pdf-isolated-render-sheet i {
                font-style: italic !important;
            }
            .pdf-isolated-render-sheet u {
                text-decoration: underline !important;
            }
            .pdf-isolated-render-sheet s {
                text-decoration: line-through !important;
            }
            .pdf-isolated-render-sheet a {
                color: #2563eb !important;
                text-decoration: underline !important;
            }
            .pdf-isolated-render-sheet blockquote {
                border-left: 4px solid #6366f1 !important;
                padding-left: 14px !important;
                margin: 14px 0 !important;
                color: #64748b !important;
                font-style: italic !important;
            }
            .pdf-isolated-render-sheet table {
                border-collapse: collapse !important;
                width: 100% !important;
                margin: 14px 0 !important;
            }
            .pdf-isolated-render-sheet th, .pdf-isolated-render-sheet td {
                border: 1px solid #cbd5e1 !important;
                padding: 8px 12px !important;
                font-size: 13px !important;
                color: #1e293b !important;
            }
            .pdf-isolated-render-sheet th {
                background: #f8fafc !important;
                font-weight: 600 !important;
            }
            .pdf-isolated-render-sheet img {
                max-width: 100% !important;
                height: auto !important;
                display: block !important;
            }
            .pdf-isolated-render-sheet .ql-align-center { text-align: center !important; }
            .pdf-isolated-render-sheet .ql-align-right  { text-align: right !important; }
            .pdf-isolated-render-sheet .ql-align-justify { text-align: justify !important; }
            .pdf-isolated-render-sheet .page-break { page-break-after: always !important; }
        `;
        stage.appendChild(style);

        const bodyWrap = document.createElement('div');
        bodyWrap.innerHTML = htmlContent;
        stage.appendChild(bodyWrap);

        mount.appendChild(stage);

        try {
            try { await document.fonts.ready; } catch (_) {}
            await new Promise(r => setTimeout(r, 60));

            const opt = {
                margin: [10, 10, 10, 10],
                filename: safeTitle,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    letterRendering: true,
                    backgroundColor: '#ffffff',
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 794,
                    logging: false
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { mode: ['css', 'legacy'] }
            };

            const worker = html2pdf().set(opt).from(stage).toPdf();
            const pdf = await worker.get('pdf');

            // Set Google SEO Document Information
            if (pdf && typeof pdf.setProperties === 'function') {
                pdf.setProperties({
                    title: (seoOptions && seoOptions.title) || safeTitle || 'SEO Document',
                    subject: (seoOptions && seoOptions.subject) || 'Complete flight guide and customer support phone numbers.',
                    author: (seoOptions && seoOptions.author) || 'AdyOrbit Travel Guides',
                    keywords: (seoOptions && seoOptions.keywords) || 'airlines, travel guide, reservations, customer support, phone number',
                    creator: 'AdyOrbit Google-Indexable Vector Engine'
                });
            }

            const pdfBlob = await worker.outputPdf('blob');
            return pdfBlob;
        } finally {
            mount.innerHTML = '';
            window.scrollTo(prevScrollX, prevScrollY);
        }
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    }

    // ── 11. SINGLE PDF DOWNLOAD FLOW ─────────────────────────────────────────
    async function triggerSinglePdfDownload() {
        const html = sourceQuill.root.innerHTML;
        if (!html || html === '<p><br></p>') {
            showToast('Document is empty! Type or paste content into the editor.', 'warning');
            return;
        }

        let userFilename = (pdfFilenameInput?.value || '').trim();
        if (!userFilename) {
            userFilename = (docTitleInput?.value || '').trim() || 'AdyOrbit_Document';
        }
        const cleanFilename = sanitizeFilename(userFilename);

        const origHtml = exportVectorPdfBtn ? exportVectorPdfBtn.innerHTML : '';
        if (exportVectorPdfBtn) {
            exportVectorPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
            exportVectorPdfBtn.disabled = true;
        }

        try {
            const docTitle = (docTitleInput?.value || '').trim() || cleanFilename;
            const blob = await generatePdfClientSide(html, cleanFilename, {
                title: docTitle,
                subject: `${docTitle} - Generated by AdyOrbit SEO Suite`,
                author: 'AdyOrbit Travel Guides',
                keywords: 'airline, travel guide, booking, reservations, customer support, phone number'
            });
            downloadBlob(blob, cleanFilename);
            showToast(`Downloaded ${cleanFilename} successfully!`, 'success');
        } catch (err) {
            console.error('PDF Export Error:', err);
            showToast(`PDF Export Failed: ${err.message}`, 'error', 6000);
        }

        if (exportVectorPdfBtn) {
            exportVectorPdfBtn.innerHTML = origHtml;
            exportVectorPdfBtn.disabled = false;
        }
    }

    if (exportVectorPdfBtn) exportVectorPdfBtn.addEventListener('click', triggerSinglePdfDownload);
    if (bannerDownloadPdf) bannerDownloadPdf.addEventListener('click', triggerSinglePdfDownload);

    // ── 12. WORKSPACE SWITCHING & TRANSFER ────────────────────────────────────
    function switchWorkspace(target) {
        if (target === 'tfn-changer') {
            AppState.currentWorkspace = 'tfn-changer';
            navTfnChanger?.classList.add('active');
            navBulkMaker?.classList.remove('active');
            if (tfnChangerView) tfnChangerView.style.display = 'block';
            if (bulkMakerView) bulkMakerView.style.display = 'none';
        } else if (target === 'bulk-maker') {
            AppState.currentWorkspace = 'bulk-maker';
            navBulkMaker?.classList.add('active');
            navTfnChanger?.classList.remove('active');
            if (tfnChangerView) tfnChangerView.style.display = 'none';
            if (bulkMakerView) bulkMakerView.style.display = 'block';
            updateBulkPreviewTable();
        }
        closeDrawers();
    }

    if (navTfnChanger) navTfnChanger.addEventListener('click', () => switchWorkspace('tfn-changer'));
    if (navBulkMaker) navBulkMaker.addEventListener('click', () => switchWorkspace('bulk-maker'));

    async function transferToBulkMaker() {
        const currentHtml = sourceQuill.root.innerHTML;
        if (!currentHtml || currentHtml === '<p><br></p>') {
            showToast('Document editor is empty! Enter content before moving to Bulk PDF Maker.', 'warning');
            return;
        }

        if (AppState.bulk.masterTemplateHtml && AppState.bulk.masterTemplateHtml !== currentHtml) {
            const proceed = await showConfirm('Bulk PDF Maker already has a master template.<br><br>Do you want to overwrite it with current document?', 'Overwrite', 'Keep Existing');
            if (!proceed) return;
        }

        AppState.bulk.masterTemplateHtml = currentHtml;
        AppState.bulk.masterTemplateTitle = (docTitleInput?.value || '').trim() || 'Master Airline Document';

        const srcAir = (sourceAirlineInput?.value || '').trim();
        if (srcAir) {
            AppState.bulk.sourceAirline = srcAir;
            if (bulkSourceAirline) bulkSourceAirline.value = srcAir;
        }

        const targets = getActiveTargetTfns();
        if (targets[0] && bulkTfn1) bulkTfn1.value = targets[0];
        if (targets[1] && bulkTfn2) bulkTfn2.value = targets[1];

        syncMasterTemplate('transfer', currentHtml);
        switchWorkspace('bulk-maker');
        showToast('Document successfully transferred to Bulk PDF Maker!', 'success');
    }

    if (moveToBulkBtn) moveToBulkBtn.addEventListener('click', transferToBulkMaker);
    if (bannerMoveToBulk) bannerMoveToBulk.addEventListener('click', transferToBulkMaker);

    // ── MASTER TEMPLATE QUILL & CODE EDITORS ─────────────────────────────────
    const bulkMasterQuill = new Quill('#bulkMasterQuillEditor', {
        theme: 'snow',
        placeholder: 'Type or edit your Master Template here. All formatting options and headline tags are fully supported...',
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, false] }],
                [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                ['blockquote', 'code-block'],
                ['link', 'clean']
            ],
            clipboard: { matchVisual: false }
        }
    });

    // Helper: Formatter for HTML code
    function formatHtmlCode(html) {
        if (!html) return '';
        let formatted = '';
        const reg = /(>)(<)(\/*)/g;
        let xml = html.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        xml.split('\r\n').forEach(node => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad !== 0) pad -= 1;
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }
            formatted += '  '.repeat(pad) + node + '\n';
            pad += indent;
        });
        return formatted.trim();
    }

    // Helper: Effective Headline Tag ('h1', 'h2', 'h3', 'h4', or custom selector)
    function getEffectiveHeadlineTag() {
        if (bulkHeadlineTagSelect && bulkHeadlineTagSelect.value === 'custom') {
            const val = (bulkCustomHeadlineTag?.value || '').trim();
            return val || 'h1';
        }
        return bulkHeadlineTagSelect ? bulkHeadlineTagSelect.value : 'h1';
    }

    // Helper: Extract headline text from HTML using tag/selector
    function extractHeadlineFromHtml(html, tag) {
        if (!html) return '';
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const targetTag = (tag || 'h1').toLowerCase().trim();
            let el = null;
            if (/^[a-z0-9]+$/i.test(targetTag)) {
                el = doc.querySelector(targetTag);
            } else {
                try { el = doc.querySelector(targetTag); } catch (_) {}
            }
            if (el) return el.textContent.trim();
            const anyHead = doc.querySelector('h1, h2, h3, h4');
            return anyHead ? anyHead.textContent.trim() : '';
        } catch (_) {
            return '';
        }
    }

    // Helper: Apply headline to HTML honoring the designated headline tag
    function applyHeadlineToHtml(docHtml, targetHeadline, tag) {
        if (!docHtml) return `<${tag}>${targetHeadline}</${tag}>`;
        const targetTag = (tag || 'h1').toLowerCase().trim();
        
        if (/^[a-z0-9]+$/i.test(targetTag)) {
            const regex = new RegExp(`<${targetTag}[^>]*>[\\s\\S]*?<\\/${targetTag}>`, 'i');
            if (regex.test(docHtml)) {
                return docHtml.replace(regex, `<${targetTag}>${targetHeadline}</${targetTag}>`);
            } else {
                return `<${targetTag}>${targetHeadline}</${targetTag}>\n` + docHtml;
            }
        } else {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(docHtml, 'text/html');
                let el = doc.querySelector(targetTag);
                if (el) {
                    el.textContent = targetHeadline;
                    return doc.body.innerHTML;
                } else {
                    return `<h1>${targetHeadline}</h1>\n` + docHtml;
                }
            } catch (_) {
                return `<h1>${targetHeadline}</h1>\n` + docHtml;
            }
        }
    }

    // Helper: Variable resolver for Google SEO strings
    function resolveSeoVariables(templateStr, airline, headline, tfn) {
        if (!templateStr) return '';
        return templateStr
            .replace(/\{airline\}/gi, airline || 'Airline')
            .replace(/\{headline\}/gi, headline || `${airline || 'Airline'} Flight Guide`)
            .replace(/\{tfn1\}/gi, tfn || '')
            .replace(/\{tfn\}/gi, tfn || '')
            .replace(/\{phone\}/gi, tfn || '');
    }

    // Master template synchronization across Visual, Code, and Preview
    function syncMasterTemplate(source, newHtml) {
        const cleanHtml = newHtml || '';
        AppState.bulk.masterTemplateHtml = cleanHtml;
        const currentTag = getEffectiveHeadlineTag();
        const detectedHeadline = extractHeadlineFromHtml(cleanHtml, currentTag);
        AppState.bulk.headlineText = detectedHeadline;

        if (source !== 'quill' && bulkMasterQuill) {
            if (bulkMasterQuill.root.innerHTML !== cleanHtml) {
                bulkMasterQuill.root.innerHTML = cleanHtml;
            }
        }

        if (source !== 'code' && bulkMasterCodeTextarea) {
            bulkMasterCodeTextarea.value = cleanHtml ? formatHtmlCode(cleanHtml) : '';
        }

        if (bulkMasterPreview) {
            bulkMasterPreview.innerHTML = cleanHtml && cleanHtml !== '<p><br></p>'
                ? cleanHtml
                : '<p class="placeholder-text-muted">Master template is currently empty. Enter content in Visual Editor or paste HTML code in Code Editor.</p>';
        }

        if (bulkHeadlineContentInput && source !== 'headline-input') {
            bulkHeadlineContentInput.value = detectedHeadline;
        }

        if (bulkHeadlineTagPillText) {
            bulkHeadlineTagPillText.innerText = `Tag: <${currentTag}>`;
        }

        if (step4HeadlineTagNotice) {
            step4HeadlineTagNotice.innerText = `<${currentTag}>`;
        }

        // Metrics & Readiness Tags
        const hasTemplate = Boolean(cleanHtml && cleanHtml !== '<p><br></p>');
        if (bulkTemplateStatus) {
            bulkTemplateStatus.innerHTML = hasTemplate
                ? '<i class="fa-solid fa-check"></i> Template Loaded'
                : '<i class="fa-solid fa-circle-exclamation"></i> No Template Loaded';
        }
        if (bulkTemplateReadyTag) {
            bulkTemplateReadyTag.innerHTML = hasTemplate
                ? '<i class="fa-solid fa-circle-check"></i> Template is ready'
                : '<i class="fa-solid fa-circle-info"></i> Template is empty';
        }
        if (bulkTemplateMetrics) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(cleanHtml, 'text/html');
            const text = (doc.body.textContent || '').trim();
            const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
            const chars = text.length;
            const headingsCount = doc.querySelectorAll('h1, h2, h3, h4').length;
            bulkTemplateMetrics.innerText = `Words: ${words} | Characters: ${chars} | Headings: ${headingsCount}`;
        }

        // Pre-fill default SEO document title if empty
        if (detectedHeadline && bulkSeoDocTitle && !bulkSeoDocTitle.value) {
            bulkSeoDocTitle.value = `{headline} | Official Guide & Bookings`;
        }

        updateBulkPreviewTable();
    }

    // Switch between Visual Editor, HTML/Code Editor, and Live Preview
    function switchBulkEditorTab(tabName) {
        AppState.bulk.currentTab = tabName;

        [tabVisualEditor, tabCodeEditor, tabLivePreview].forEach(tab => tab?.classList.remove('active'));
        [bulkVisualEditorContainer, bulkCodeEditorContainer, bulkLivePreviewContainer].forEach(panel => {
            if (panel) panel.style.display = 'none';
        });

        if (tabName === 'visual') {
            tabVisualEditor?.classList.add('active');
            if (bulkVisualEditorContainer) bulkVisualEditorContainer.style.display = 'block';
            if (bulkMasterQuill && AppState.bulk.masterTemplateHtml) {
                if (bulkMasterQuill.root.innerHTML !== AppState.bulk.masterTemplateHtml) {
                    bulkMasterQuill.root.innerHTML = AppState.bulk.masterTemplateHtml;
                }
            }
        } else if (tabName === 'code') {
            tabCodeEditor?.classList.add('active');
            if (bulkCodeEditorContainer) bulkCodeEditorContainer.style.display = 'block';
            if (bulkMasterCodeTextarea) {
                bulkMasterCodeTextarea.value = formatHtmlCode(AppState.bulk.masterTemplateHtml || '');
            }
        } else if (tabName === 'preview') {
            tabLivePreview?.classList.add('active');
            if (bulkLivePreviewContainer) bulkLivePreviewContainer.style.display = 'block';
            if (bulkMasterPreview) {
                bulkMasterPreview.innerHTML = AppState.bulk.masterTemplateHtml || '<p class="placeholder-text-muted">Master template is currently empty.</p>';
            }
        }
    }

    // Tab switcher events
    if (tabVisualEditor) tabVisualEditor.addEventListener('click', () => switchBulkEditorTab('visual'));
    if (tabCodeEditor) tabCodeEditor.addEventListener('click', () => switchBulkEditorTab('code'));
    if (tabLivePreview) tabLivePreview.addEventListener('click', () => switchBulkEditorTab('preview'));

    // Quill visual change listener
    bulkMasterQuill.on('text-change', () => {
        syncMasterTemplate('quill', bulkMasterQuill.root.innerHTML);
    });

    // Code textarea change listener
    if (bulkMasterCodeTextarea) {
        bulkMasterCodeTextarea.addEventListener('input', () => {
            syncMasterTemplate('code', bulkMasterCodeTextarea.value);
        });
    }

    // Format HTML button
    if (btnFormatMasterHtml) {
        btnFormatMasterHtml.addEventListener('click', () => {
            if (bulkMasterCodeTextarea) {
                bulkMasterCodeTextarea.value = formatHtmlCode(bulkMasterCodeTextarea.value);
                showToast('HTML code formatted successfully!', 'info');
            }
        });
    }

    // Quick Insert Tag buttons inside Code Editor
    document.querySelectorAll('.btn-code-insert').forEach(btn => {
        btn.addEventListener('click', () => {
            const snippet = btn.getAttribute('data-insert');
            if (!snippet || !bulkMasterCodeTextarea) return;

            const start = bulkMasterCodeTextarea.selectionStart;
            const end = bulkMasterCodeTextarea.selectionEnd;
            const text = bulkMasterCodeTextarea.value;
            bulkMasterCodeTextarea.value = text.substring(0, start) + snippet + text.substring(end);
            bulkMasterCodeTextarea.selectionStart = bulkMasterCodeTextarea.selectionEnd = start + snippet.length;
            bulkMasterCodeTextarea.focus();
            syncMasterTemplate('code', bulkMasterCodeTextarea.value);
        });
    });

    // Headline Tag Selector dropdown
    if (bulkHeadlineTagSelect) {
        bulkHeadlineTagSelect.addEventListener('change', () => {
            const val = bulkHeadlineTagSelect.value;
            AppState.bulk.headlineTag = val;
            if (bulkCustomHeadlineTag) {
                bulkCustomHeadlineTag.style.display = val === 'custom' ? 'block' : 'none';
            }
            syncMasterTemplate('tag-change', AppState.bulk.masterTemplateHtml);
        });
    }

    if (bulkCustomHeadlineTag) {
        bulkCustomHeadlineTag.addEventListener('input', () => {
            AppState.bulk.customHeadlineTag = bulkCustomHeadlineTag.value.trim();
            syncMasterTemplate('tag-change', AppState.bulk.masterTemplateHtml);
        });
    }

    // Headline input field (user types headline directly)
    if (bulkHeadlineContentInput) {
        bulkHeadlineContentInput.addEventListener('input', () => {
            const newHead = bulkHeadlineContentInput.value;
            const currentTag = getEffectiveHeadlineTag();
            const updatedHtml = applyHeadlineToHtml(AppState.bulk.masterTemplateHtml, newHead, currentTag);
            syncMasterTemplate('headline-input', updatedHtml);
        });
    }

    // "Set Selected as Headline" button
    if (bulkSetSelectionAsHeadlineBtn) {
        bulkSetSelectionAsHeadlineBtn.addEventListener('click', () => {
            const currentTag = getEffectiveHeadlineTag();
            if (AppState.bulk.currentTab === 'code' && bulkMasterCodeTextarea) {
                const start = bulkMasterCodeTextarea.selectionStart;
                const end = bulkMasterCodeTextarea.selectionEnd;
                const selected = bulkMasterCodeTextarea.value.substring(start, end).trim();
                if (selected) {
                    const wrapped = `<${currentTag}>${selected}</${currentTag}>`;
                    bulkMasterCodeTextarea.value = bulkMasterCodeTextarea.value.substring(0, start) + wrapped + bulkMasterCodeTextarea.value.substring(end);
                    syncMasterTemplate('code', bulkMasterCodeTextarea.value);
                    showToast(`Wrapped selection with <${currentTag}>!`, 'success');
                } else {
                    showToast('Select text in the Code Editor first to tag it as headline.', 'info');
                }
            } else {
                // Visual Editor
                const range = bulkMasterQuill.getSelection();
                if (range && range.length > 0) {
                    const headerLevel = currentTag === 'h1' ? 1 : currentTag === 'h2' ? 2 : currentTag === 'h3' ? 3 : currentTag === 'h4' ? 4 : 1;
                    bulkMasterQuill.format('header', headerLevel);
                    syncMasterTemplate('quill', bulkMasterQuill.root.innerHTML);
                    showToast(`Marked selection as <${currentTag}> in Visual Editor!`, 'success');
                } else {
                    showToast('Select text in the editor first to mark it as headline.', 'info');
                }
            }
        });
    }

    // Sample Airline Template loader for Master Template
    function loadSampleIntoMasterTemplate() {
        syncMasterTemplate('sample', sampleAirlineTemplate);
        if (bulkSourceAirline) bulkSourceAirline.value = 'Delta';
        AppState.bulk.sourceAirline = 'Delta';
        if (bulkFilenamePattern) bulkFilenamePattern.value = 'delta-air';
        AppState.bulk.namingPattern = 'delta-air';
        if (bulkHeadlineTagSelect) bulkHeadlineTagSelect.value = 'h1';
        if (bulkSeoDocTitle) bulkSeoDocTitle.value = '{headline} | Official Guide & Bookings';
        if (bulkSeoSubject) bulkSeoSubject.value = 'Complete flight guide, travel reservations and 24/7 customer support for {airline} flights.';
        if (bulkSeoKeywords) bulkSeoKeywords.value = '{airline}, flight booking, reservations, airline support, customer service';
        showToast('High-ranking SEO Airline Guide template loaded into Master Template!', 'success');
    }

    if (bulkLoadSampleBtn) bulkLoadSampleBtn.addEventListener('click', loadSampleIntoMasterTemplate);

    // Clear Master Template
    if (bulkClearTemplateBtn) {
        bulkClearTemplateBtn.addEventListener('click', async () => {
            const proceed = await showConfirm('Are you sure you want to clear the Master Template?', 'Clear Template', 'Cancel');
            if (proceed) {
                syncMasterTemplate('clear', '');
                showToast('Master Template cleared.', 'info');
            }
        });
    }

    // Sync from TFN Changer button
    if (syncFromTfnBtn) {
        syncFromTfnBtn.addEventListener('click', () => {
            const html = sourceQuill.root.innerHTML;
            if (!html || html === '<p><br></p>') {
                showToast('TFN Changer document is empty!', 'warning');
                return;
            }
            AppState.bulk.masterTemplateTitle = (docTitleInput?.value || '').trim() || 'Master Airline Document';
            syncMasterTemplate('sync-tfn', html);
            showToast('Synchronized from TFN Changer!', 'success');
        });
    }

    // Google SEO Accordion toggle
    if (bulkSeoToggleBtn) {
        bulkSeoToggleBtn.addEventListener('click', () => {
            const isHidden = !bulkSeoBody || bulkSeoBody.style.display === 'none';
            if (bulkSeoBody) bulkSeoBody.style.display = isHidden ? 'block' : 'none';
            if (bulkSeoChevron) bulkSeoChevron.classList.toggle('rotated', isHidden);
        });
    }

    // SEO inputs listeners
    if (bulkSeoDocTitle) bulkSeoDocTitle.addEventListener('input', () => AppState.bulk.seoDocTitle = bulkSeoDocTitle.value.trim());
    if (bulkSeoSubject) bulkSeoSubject.addEventListener('input', () => AppState.bulk.seoSubject = bulkSeoSubject.value.trim());
    if (bulkSeoAuthor) bulkSeoAuthor.addEventListener('input', () => AppState.bulk.seoAuthor = bulkSeoAuthor.value.trim());
    if (bulkSeoKeywords) bulkSeoKeywords.addEventListener('input', () => AppState.bulk.seoKeywords = bulkSeoKeywords.value.trim());

    // ── 13. BULK PDF MAKER CONFIGURATION ─────────────────────────────────────
    function generateAirlineFilename(airlineName, patternOrExample, sourceAirline) {
        if (!airlineName) return 'document.pdf';
        const cleanAirline = airlineName.trim();
        const slugAirline = cleanAirline.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        let rawPattern = (patternOrExample || '').trim();
        if (!rawPattern) return `${slugAirline}.pdf`;

        if (rawPattern.toLowerCase().endsWith('.pdf')) {
            rawPattern = rawPattern.substring(0, rawPattern.length - 4);
        }

        let outputFilename = '';
        if (/\{airline\}/i.test(rawPattern) || /\[airline\]/i.test(rawPattern)) {
            outputFilename = rawPattern.replace(/\{airline\}/gi, slugAirline).replace(/\[airline\]/gi, slugAirline);
        } else if (sourceAirline && sourceAirline.trim()) {
            const srcSlug = sourceAirline.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            const srcRegex = new RegExp(escapeRegExp(srcSlug), 'i');
            if (srcRegex.test(rawPattern)) {
                outputFilename = rawPattern.replace(srcRegex, slugAirline);
            }
        }

        if (!outputFilename) {
            const known = ['delta', 'alaska', 'copa', 'united', 'southwest', 'american', 'jetblue'];
            let matched = null;
            for (const k of known) {
                if (rawPattern.toLowerCase().includes(k)) { matched = k; break; }
            }
            if (matched) {
                outputFilename = rawPattern.replace(new RegExp(escapeRegExp(matched), 'i'), slugAirline);
            } else {
                outputFilename = `${slugAirline}-${rawPattern.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            }
        }

        outputFilename = outputFilename.toLowerCase().replace(/[^a-z0-9\-_.]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
        if (!outputFilename) outputFilename = slugAirline;
        if (!outputFilename.endsWith('.pdf')) outputFilename += '.pdf';
        return outputFilename;
    }

    function parseTargetAirlines(text) {
        if (!text) return { valid: [], duplicates: [] };
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const seen = new Set();
        const valid = [];
        const duplicates = [];

        for (const line of lines) {
            const lower = line.toLowerCase();
            if (seen.has(lower)) {
                duplicates.push(line);
            } else {
                seen.add(lower);
                valid.push(line);
            }
        }
        return { valid, duplicates };
    }

    function onAirlinesInputChanged() {
        const text = bulkTargetAirlines?.value || '';
        AppState.bulk.targetAirlinesText = text;
        const { valid, duplicates } = parseTargetAirlines(text);
        AppState.bulk.targetAirlinesList = valid;
        AppState.bulk.duplicatesList = duplicates;

        if (bulkAirlinesCount) {
            bulkAirlinesCount.innerHTML = `<i class="fa-solid fa-check"></i> ${valid.length} valid airlines`;
        }
        if (bulkDuplicatesWarning) {
            bulkDuplicatesWarning.innerText = `${duplicates.length} duplicates`;
        }
        if (bulkInvalidCount) {
            bulkInvalidCount.innerText = '0 invalid';
        }

        updateFilenamePills();
        updateBulkPreviewTable();
    }

    if (bulkTargetAirlines) bulkTargetAirlines.addEventListener('input', onAirlinesInputChanged);

    // Load 5 Sample Airlines on demand
    if (loadSampleAirlinesBtn) {
        loadSampleAirlinesBtn.addEventListener('click', () => {
            const sampleAirlines = ['Alaska', 'Copa', 'Delta', 'United', 'Southwest', 'JetBlue'];
            if (bulkTargetAirlines) bulkTargetAirlines.value = sampleAirlines.join('\n');
            if (bulkSourceAirline && !bulkSourceAirline.value.trim()) bulkSourceAirline.value = 'Alaska';
            onAirlinesInputChanged();
            showToast('Loaded sample airline list.', 'info');
        });
    }

    // Headline Mode Cards
    if (optHeadlineAuto && optHeadlineCustom) {
        optHeadlineAuto.addEventListener('click', () => {
            AppState.bulk.headlineMode = 'auto';
            optHeadlineAuto.classList.add('selected');
            optHeadlineCustom.classList.remove('selected');
            updateBulkPreviewTable();
        });
        optHeadlineCustom.addEventListener('click', () => {
            AppState.bulk.headlineMode = 'custom';
            optHeadlineCustom.classList.add('selected');
            optHeadlineAuto.classList.remove('selected');
            updateBulkPreviewTable();
        });
    }

    if (bulkSourceAirline) {
        bulkSourceAirline.addEventListener('input', () => {
            AppState.bulk.sourceAirline = bulkSourceAirline.value.trim();
            updateFilenamePills();
            updateBulkPreviewTable();
        });
    }

    if (bulkFilenamePattern) {
        bulkFilenamePattern.addEventListener('input', () => {
            AppState.bulk.namingPattern = bulkFilenamePattern.value.trim();
            updateFilenamePills();
            updateBulkPreviewTable();
        });
    }

    function updateFilenamePills() {
        if (!filenamePreviewPills) return;
        const pattern = (bulkFilenamePattern?.value || 'delta-air').trim();
        const srcAirline = (bulkSourceAirline?.value || '').trim();
        const airlines = AppState.bulk.targetAirlinesList.length
            ? AppState.bulk.targetAirlinesList.slice(0, 4)
            : ['Alaska', 'Copa', 'Delta'];

        filenamePreviewPills.innerHTML = airlines.map(airline => {
            const fname = generateAirlineFilename(airline, pattern, srcAirline);
            return `<span class="filename-preview-pill">${fname}</span>`;
        }).join('');
    }

    if (bulkTfnToggle) {
        bulkTfnToggle.addEventListener('change', () => {
            AppState.bulk.tfnEnabled = bulkTfnToggle.checked;
            if (bulkTfnInputsArea) {
                bulkTfnInputsArea.style.opacity = bulkTfnToggle.checked ? '1' : '0.4';
                bulkTfnInputsArea.style.pointerEvents = bulkTfnToggle.checked ? 'auto' : 'none';
            }
        });
    }

    // ── 14. GENERATION PREVIEW TABLE ─────────────────────────────────────────
    function updateBulkPreviewTable() {
        if (!bulkTableBody) return;
        const airlines = AppState.bulk.targetAirlinesList;
        const pattern = (bulkFilenamePattern?.value || 'delta-air').trim();
        const srcAirline = (bulkSourceAirline?.value || '').trim();
        const baseTitle = AppState.bulk.headlineText || AppState.bulk.masterTemplateTitle || 'Flight Guide';

        if (!airlines.length) {
            bulkTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-table-state">
                        <i class="fa-solid fa-plane-slash"></i>
                        <p>No airlines in queue. Enter target airlines on the left or click "Load 5 Samples" to populate.</p>
                    </td>
                </tr>
            `;
            if (tableRowCountBadge) tableRowCountBadge.innerText = '0 Ready';
            if (metricTotal) metricTotal.innerText = '0';
            if (metricReady) metricReady.innerText = '0';
            if (metricWarnings) metricWarnings.innerText = '0';
            if (metricErrors) metricErrors.innerText = '0';
            if (bulkDownloadZipBtn) bulkDownloadZipBtn.disabled = true;
            return;
        }

        const newQueue = airlines.map((airline, idx) => {
            const existing = AppState.bulk.queue.find(q => q.airline === airline);
            const autoHeadline = srcAirline
                ? baseTitle.replace(new RegExp(escapeRegExp(srcAirline), 'gi'), airline)
                : `${airline} Flight Guide`;
            const inferredFilename = generateAirlineFilename(airline, pattern, srcAirline);

            return {
                id: idx + 1,
                airline,
                headline: existing && AppState.bulk.headlineMode === 'custom' ? existing.headline : autoHeadline,
                filename: existing ? existing.filename : inferredFilename,
                status: existing ? existing.status : 'Ready',
                pdfBlob: existing ? existing.pdfBlob : null
            };
        });

        AppState.bulk.queue = newQueue;

        const readyCount = newQueue.filter(q => q.status === 'Ready' || q.status === 'Success').length;
        if (tableRowCountBadge) tableRowCountBadge.innerText = `${readyCount} Ready`;
        if (metricTotal) metricTotal.innerText = newQueue.length;
        if (metricReady) metricReady.innerText = readyCount;
        if (metricWarnings) metricWarnings.innerText = '0';
        if (metricErrors) metricErrors.innerText = '0';

        bulkTableBody.innerHTML = newQueue.map((item, idx) => `
            <tr data-row-id="${item.id}">
                <td style="color: var(--text-muted); font-size: 0.8rem; font-weight: 600;">${idx + 1}</td>
                <td><strong style="color: var(--text-primary); font-size: 0.88rem;">${item.airline}</strong></td>
                <td>
                    <input type="text" class="table-cell-input table-headline-input" data-id="${item.id}" value="${item.headline}">
                </td>
                <td>
                    <input type="text" class="table-cell-input table-filename-input" data-id="${item.id}" value="${item.filename}">
                </td>
                <td>
                    <span class="status-pill ${item.status.toLowerCase()}" id="pillStatus-${item.id}">
                        ${item.status === 'Success' ? '<i class="fa-solid fa-check"></i> Success' :
                          item.status === 'Generating' ? '<i class="fa-solid fa-spinner fa-spin"></i> Generating' :
                          '<i class="fa-solid fa-circle-dot"></i> Ready'}
                    </span>
                </td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 4px; justify-content: center;">
                        <button class="table-action-btn btn-preview-row" data-id="${item.id}" title="Preview document for ${item.airline}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="table-action-btn btn-download-row" data-id="${item.id}" title="Download PDF" ${item.pdfBlob ? '' : 'disabled style="opacity: 0.4;"'}>
                            <i class="fa-solid fa-download"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        bulkTableBody.querySelectorAll('.table-headline-input').forEach(input => {
            input.addEventListener('change', e => {
                const id = parseInt(e.target.dataset.id, 10);
                const item = AppState.bulk.queue.find(q => q.id === id);
                if (item) item.headline = e.target.value.trim();
            });
        });

        bulkTableBody.querySelectorAll('.table-filename-input').forEach(input => {
            input.addEventListener('change', e => {
                const id = parseInt(e.target.dataset.id, 10);
                const item = AppState.bulk.queue.find(q => q.id === id);
                if (item) item.filename = sanitizeFilename(e.target.value.trim());
            });
        });

        bulkTableBody.querySelectorAll('.btn-preview-row').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = parseInt(e.currentTarget.dataset.id, 10);
                previewSingleQueueItem(id);
            });
        });

        bulkTableBody.querySelectorAll('.btn-download-row').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = parseInt(e.currentTarget.dataset.id, 10);
                const item = AppState.bulk.queue.find(q => q.id === id);
                if (item && item.pdfBlob) downloadBlob(item.pdfBlob, item.filename);
            });
        });
    }

    function replaceAirlineToHtml(htmlString, sourceAirline, targetAirline) {
        if (!htmlString || !sourceAirline || !targetAirline) return htmlString;
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        const escapedSource = escapeRegExp(sourceAirline.trim());
        const regex = new RegExp(`(?<![a-zA-Z0-9])${escapedSource}(?![a-zA-Z0-9])`, 'gi');

        function walk(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent && regex.test(node.textContent)) {
                    node.textContent = node.textContent.replace(regex, targetAirline);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                if (tag !== 'script' && tag !== 'style') [...node.childNodes].forEach(walk);
            }
        }
        walk(div);
        return div.innerHTML;
    }

    function applyTfnReplacementToHtml(htmlString, tfnLines) {
        if (!htmlString || !tfnLines || !tfnLines.length) return htmlString;
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        let counter = 0;

        function walk(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const matches = extractAllTfnsFromText(node.textContent);
                if (matches.length > 0) {
                    let text = node.textContent;
                    for (let i = matches.length - 1; i >= 0; i--) {
                        const m = matches[i];
                        const replacement = formatDigitsToCompetitorPattern(m.text, tfnLines[counter++ % tfnLines.length]);
                        text = text.substring(0, m.index) + replacement + text.substring(m.index + m.length);
                    }
                    node.textContent = text;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                if (tag !== 'script' && tag !== 'style') [...node.childNodes].forEach(walk);
            }
        }
        walk(div);
        return div.innerHTML;
    }

    function previewSingleQueueItem(id) {
        const item = AppState.bulk.queue.find(q => q.id === id);
        if (!item) return;

        const templateHtml = AppState.bulk.masterTemplateHtml || sourceQuill.root.innerHTML;
        const srcAirline = (bulkSourceAirline?.value || '').trim();
        let docHtml = templateHtml;

        if (srcAirline) docHtml = replaceAirlineToHtml(docHtml, srcAirline, item.airline);
        if (item.headline) {
            docHtml = applyHeadlineToHtml(docHtml, item.headline, getEffectiveHeadlineTag());
        }

        if (bulkTfnToggle?.checked) {
            const t1 = (bulkTfn1?.value || '').trim();
            const t2 = (bulkTfn2?.value || '').trim();
            const tfnList = [t1, t2].filter(Boolean);
            if (tfnList.length > 0) docHtml = applyTfnReplacementToHtml(docHtml, tfnList);
        }

        openModal(`
            <h3 style="margin-bottom: 8px; color: var(--text-primary);"><i class="fa-solid fa-plane" style="color: var(--brand-purple);"></i> Document Preview: ${item.airline}</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Filename: <strong>${item.filename}</strong></p>
            <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 8px; padding: 18px; max-height: 420px; overflow-y: auto; font-size: 0.9rem; line-height: 1.6;">
                ${docHtml}
            </div>
            <div style="margin-top: 14px; display: flex; justify-content: flex-end;">
                <button class="btn-primary-green" onclick="document.getElementById('appModalOverlay').style.display='none'">Close</button>
            </div>
        `);
    }

    // ── 15. BATCH GENERATE ALL PDFS & ZIP EXPORT ─────────────────────────────
    if (bulkGenerateBtn) {
        bulkGenerateBtn.addEventListener('click', async () => {
            const templateHtml = AppState.bulk.masterTemplateHtml || sourceQuill.root.innerHTML;
            if (!templateHtml || templateHtml === '<p><br></p>') {
                showToast('Master Template is empty! Sync from TFN Changer or paste content.', 'warning');
                return;
            }

            const queue = AppState.bulk.queue;
            if (!queue || !queue.length) {
                showToast('Target Airlines list is empty! Enter one airline per line.', 'warning');
                return;
            }

            bulkGenerateBtn.disabled = true;
            const origText = bulkGenerateBtn.innerHTML;
            bulkGenerateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Batch...';

            const srcAirline = (bulkSourceAirline?.value || '').trim();
            const t1 = (bulkTfn1?.value || '').trim();
            const t2 = (bulkTfn2?.value || '').trim();
            const tfnList = [t1, t2].filter(Boolean);
            const enableTfn = Boolean(bulkTfnToggle?.checked && tfnList.length > 0);

            let successCount = 0;

            for (let i = 0; i < queue.length; i++) {
                const item = queue[i];
                const pill = document.getElementById(`pillStatus-${item.id}`);
                if (pill) {
                    pill.className = 'status-pill generating';
                    pill.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating';
                }

                try {
                    let docHtml = templateHtml;
                    if (srcAirline) docHtml = replaceAirlineToHtml(docHtml, srcAirline, item.airline);
                    if (item.headline) {
                        docHtml = applyHeadlineToHtml(docHtml, item.headline, getEffectiveHeadlineTag());
                    }
                    if (enableTfn) docHtml = applyTfnReplacementToHtml(docHtml, tfnList);

                    const seoTitle = resolveSeoVariables(AppState.bulk.seoDocTitle || '{headline} | Official Guide & Bookings', item.airline, item.headline, tfnList[0]);
                    const seoSubject = resolveSeoVariables(AppState.bulk.seoSubject || 'Complete travel guide, reservations and 24/7 customer support for {airline} flights.', item.airline, item.headline, tfnList[0]);
                    const seoKeywords = resolveSeoVariables(AppState.bulk.seoKeywords || '{airline}, flight booking, reservations, customer service, support number', item.airline, item.headline, tfnList[0]);
                    const seoAuthor = AppState.bulk.seoAuthor || 'AdyOrbit Travel Guides';

                    const pdfBlob = await generatePdfClientSide(docHtml, item.filename, {
                        title: seoTitle,
                        subject: seoSubject,
                        author: seoAuthor,
                        keywords: seoKeywords
                    });
                    item.pdfBlob = pdfBlob;
                    item.status = 'Success';
                    successCount++;

                    if (pill) {
                        pill.className = 'status-pill success';
                        pill.innerHTML = '<i class="fa-solid fa-check"></i> Success';
                    }

                    const rowElem = document.querySelector(`tr[data-row-id="${item.id}"]`);
                    const dlBtn = rowElem?.querySelector('.btn-download-row');
                    if (dlBtn) { dlBtn.disabled = false; dlBtn.style.opacity = '1'; }
                } catch (err) {
                    console.error(`Batch PDF error on ${item.airline}:`, err);
                    item.status = 'Failed';
                    if (pill) {
                        pill.className = 'status-pill failed';
                        pill.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Failed';
                    }
                }
            }

            bulkGenerateBtn.disabled = false;
            bulkGenerateBtn.innerHTML = origText;

            if (successCount > 0 && bulkDownloadZipBtn) {
                bulkDownloadZipBtn.disabled = false;
            }

            showToast(`Batch completed: ${successCount} of ${queue.length} PDFs ready!`, 'success');
        });
    }

    if (bulkDownloadZipBtn) {
        bulkDownloadZipBtn.addEventListener('click', async () => {
            const queue = AppState.bulk.queue.filter(q => q.pdfBlob);
            if (!queue.length) {
                showToast('No generated PDFs available to download.', 'warning');
                return;
            }

            const origHtml = bulkDownloadZipBtn.innerHTML;
            bulkDownloadZipBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating ZIP...';
            bulkDownloadZipBtn.disabled = true;

            try {
                const zip = new JSZip();
                for (const item of queue) {
                    zip.file(item.filename, item.pdfBlob);
                }
                const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
                const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                downloadBlob(zipBlob, `AdyOrbit_Airlines_PDFs_${dateTag}.zip`);
                showToast('ZIP file downloaded successfully!', 'success');
            } catch (err) {
                console.error('ZIP Error:', err);
                showToast(`ZIP generation failed: ${err.message}`, 'error');
            }

            bulkDownloadZipBtn.innerHTML = origHtml;
            bulkDownloadZipBtn.disabled = false;
        });
    }

    // ── 16. SECONDARY ACTIONS, MODALS & THEME TOGGLE ─────────────────────────
    const sampleAirlineTemplate = `<h1>Delta Airlines Flight Booking Guide</h1>
<p>Your Complete Guide to Booking Delta Flights</p>
<p>Delta Airlines is one of the most trusted and popular airlines in the world, offering a wide range of domestic and international flights. Whether you're planning a business trip or a family vacation, Delta provides a comfortable and reliable travel experience.</p>
<h2>Why Choose Delta Airlines?</h2>
<ul>
<li>Wide network of domestic and international routes</li>
<li>Comfortable seating and premium services</li>
<li>Flexible booking and cancellation policies</li>
<li>Excellent customer support</li>
</ul>
<p>Need Help? Call us at <strong>(855) 123-4567</strong> or <strong>(800) 987-6543</strong> for 24/7 priority support.</p>`;

    function loadTemplateIntoEditor() {
        sourceQuill.root.innerHTML = sampleAirlineTemplate;
        if (docTitleInput) docTitleInput.value = 'Delta Airlines Flight Booking Guide';
        if (pdfFilenameInput) pdfFilenameInput.value = 'delta-air';
        if (sourceAirlineInput) sourceAirlineInput.value = 'Delta';
        updateEditorStats();
        updateLivePreview();
        syncMasterTemplate('transfer', sampleAirlineTemplate);
        showToast('Sample template loaded into editor & Master Template.', 'info');
    }

    if (qaUseTemplate) qaUseTemplate.addEventListener('click', loadTemplateIntoEditor);
    if (bulkUseTemplateBtn) bulkUseTemplateBtn.addEventListener('click', loadSampleIntoMasterTemplate);

    // Auto-populate default sample airline template if editors are empty on startup
    if (!sourceQuill.getText().trim()) {
        sourceQuill.root.innerHTML = sampleAirlineTemplate;
        if (docTitleInput && !docTitleInput.value) docTitleInput.value = 'Delta Airlines Flight Booking Guide';
        if (pdfFilenameInput && !pdfFilenameInput.value) pdfFilenameInput.value = 'delta-air';
        if (sourceAirlineInput && !sourceAirlineInput.value) sourceAirlineInput.value = 'Delta';
        updateEditorStats();
        updateLivePreview();
    }
    if (!AppState.bulk.masterTemplateHtml) {
        syncMasterTemplate('initial', sampleAirlineTemplate);
        if (bulkSourceAirline && !bulkSourceAirline.value) bulkSourceAirline.value = 'Delta';
        AppState.bulk.sourceAirline = 'Delta';
        if (bulkFilenamePattern && !bulkFilenamePattern.value) bulkFilenamePattern.value = 'delta-air';
        AppState.bulk.namingPattern = 'delta-air';
    }

    if (qaImportDoc) {
        qaImportDoc.addEventListener('click', () => {
            openModal(`
                <h3 style="margin-bottom: 12px; color: var(--text-primary);"><i class="fa-solid fa-file-import" style="color: var(--brand-purple);"></i> Import Document</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Paste your document HTML or plain text below:</p>
                <textarea id="importDocTextarea" style="width: 100%; height: 200px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-input); color: var(--text-primary); font-family: inherit; font-size: 0.88rem; box-sizing: border-box;"></textarea>
                <div style="margin-top: 14px; display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="btn-panel-outline" onclick="document.getElementById('appModalOverlay').style.display='none'">Cancel</button>
                    <button class="btn-primary-green" id="btnConfirmImport">Import to Editor</button>
                </div>
            `);
            const btn = document.getElementById('btnConfirmImport');
            if (btn) {
                btn.addEventListener('click', () => {
                    const text = document.getElementById('importDocTextarea')?.value || '';
                    if (text.trim()) {
                        sourceQuill.root.innerHTML = text.includes('<p>') ? text : text.split('\n').map(l => `<p>${l}</p>`).join('');
                        updateEditorStats();
                        updateLivePreview();
                        closeModal();
                        showToast('Document imported into editor!', 'success');
                    }
                });
            }
        });
    }

    const bindSimpleModal = (btnId, title, content) => {
        const el = document.getElementById(btnId);
        if (el) {
            el.addEventListener('click', () => {
                openModal(`
                    <h3 style="margin-bottom: 12px; color: var(--text-primary);">${title}</h3>
                    <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">${content}</div>
                    <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
                        <button class="btn-primary-green" onclick="document.getElementById('appModalOverlay').style.display='none'">Close</button>
                    </div>
                `);
            });
        }
    };

    bindSimpleModal('navHistoryBtn', '<i class="fa-solid fa-clock-rotate-left" style="color: var(--brand-purple);"></i> Document History', '<p>Session active. All PDF documents are rendered client-side with native vector precision and saved directly to your device.</p>');
    bindSimpleModal('qaViewHistory', '<i class="fa-solid fa-clock-rotate-left" style="color: var(--brand-purple);"></i> Document History', '<p>Session active. All PDF documents are rendered client-side with native vector precision and saved directly to your device.</p>');
    bindSimpleModal('navSettings', '<i class="fa-solid fa-gear" style="color: var(--brand-purple);"></i> Application Settings', '<p><strong>PDF Engine:</strong> High-Resolution In-Browser Vector Engine (100% Vercel &amp; GitHub Pages compatible)<br><strong>Emoji Fidelity:</strong> System Color Emoji Engine Enabled<br><strong>Status:</strong> All systems operational</p>');
    bindSimpleModal('qaSettings', '<i class="fa-solid fa-gear" style="color: var(--brand-purple);"></i> Application Settings', '<p><strong>PDF Engine:</strong> High-Resolution In-Browser Vector Engine (100% Vercel &amp; GitHub Pages compatible)<br><strong>Emoji Fidelity:</strong> System Color Emoji Engine Enabled<br><strong>Status:</strong> All systems operational</p>');
    bindSimpleModal('userProfileBtn', '<i class="fa-solid fa-user-circle" style="color: var(--brand-purple);"></i> AdyOrbit Workspace', '<p><strong>Organization:</strong> AdyOrbit<br><strong>Plan:</strong> Enterprise Document Suite<br><strong>Status:</strong> Active</p>');
    bindSimpleModal('navNotificationBtn', '<i class="fa-regular fa-bell" style="color: var(--brand-purple);"></i> Notifications', '<p>No pending alerts. All PDF generation engines are active and ready.</p>');
    bindSimpleModal('contactSupportBtn', '<i class="fa-solid fa-headset" style="color: var(--brand-purple);"></i> AdyOrbit Support', '<p>Need help? Our document automation engineering team is available 24/7.<br><br>Email: <code>support@adyorbit.com</code></p>');

    // Theme Toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-theme');
            document.body.classList.toggle('dark-theme', !isDark);
            document.body.classList.toggle('light-theme', isDark);
            localStorage.setItem('adyorbit-theme', isDark ? 'light-theme' : 'dark-theme');
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
