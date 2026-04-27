(function () {
  // Section order must match the sidebar nav-list order on every page
  const SECTIONS = [
    { prefix: 'ct_survey_',    doneKey: 'ct_survey_done'    }, // Formation & Purpose
    { prefix: 'ct_cofounders', doneKey: 'ct_cofounder_done' }, // Cofounder Info
    { prefix: null,            doneKey: null                 }, // Equity Allocation (not yet built)
    { prefix: 'ct_vest_',      doneKey: 'ct_vest_done'      }, // Vesting Schedule
    { prefix: 'ct_dec_',       doneKey: 'ct_dec_done'       }, // Decision-Making
    { prefix: 'ct_ip_',        doneKey: 'ct_ip_done'        }, // IP & Ownership
    { prefix: 'ct_comp_',      doneKey: 'ct_comp_done'      }, // Compensation
    { prefix: 'ct_perf_',      doneKey: 'ct_perf_done'      }, // Performance
    { prefix: 'ct_nc_',        doneKey: 'ct_nc_done'        }, // Non-Competition
    { prefix: 'ct_gen_',       doneKey: 'ct_gen_done'       }, // General Provisions
  ];

  const PAGE_DONE_KEYS = {
    'survey.html':       'ct_survey_done',
    'cofounder.html':    'ct_cofounder_done',
    'vesting.html':      'ct_vest_done',
    'decision.html':     'ct_dec_done',
    'ip.html':           'ct_ip_done',
    'compensation.html': 'ct_comp_done',
    'performance.html':  'ct_perf_done',
    'noncompete.html':   'ct_nc_done',
    'general.html':      'ct_gen_done',
  };

  // Returns true if any non-empty value exists in localStorage for the given prefix
  function hasData(prefix) {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      const v = localStorage.getItem(k);
      if (v && v !== '' && v !== '[]') return true;
    }
    return false;
  }

  // Update all non-active nav dots based on localStorage state
  function updateSidebar() {
    const items = document.querySelectorAll('.nav-list > li');
    items.forEach((li, i) => {
      if (li.classList.contains('active')) return;
      const section = SECTIONS[i];
      if (!section || (!section.prefix && !section.doneKey)) return;

      const dot = li.querySelector('.nav-dot');
      if (!dot) return;

      const isDone    = section.doneKey && localStorage.getItem(section.doneKey) === '1';
      const isStarted = section.prefix  && hasData(section.prefix);

      dot.className = 'nav-dot';
      li.classList.remove('done', 'pending', 'notstarted');

      if (isDone) {
        dot.classList.add('done');
        li.classList.add('done');
      } else if (isStarted) {
        dot.classList.add('pending');
      } else {
        dot.classList.add('notstarted');
      }
    });
  }

  // Mark section complete when the Continue button is clicked
  const continueBtn = document.querySelector('.next-section-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', function () {
      const page = (window.location.pathname.split('/').pop() || 'survey.html').replace(/\?.*/, '');
      const key = PAGE_DONE_KEYS[page];
      if (key) localStorage.setItem(key, '1');
    });
  }

  // ── Ctrl+Shift+0 — reset all saved survey data ──
  // (Use Cmd+Shift+0 on Mac — metaKey works too)
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '0') {
      e.preventDefault();
      if (confirm('Reset all saved survey data and start over?')) {
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('ct_')) toRemove.push(k);
        }
        toRemove.forEach(k => localStorage.removeItem(k));
        window.location.reload();
      }
    }
  });

  // Run immediately (script is at bottom of body, DOM is ready)
  updateSidebar();
})();
