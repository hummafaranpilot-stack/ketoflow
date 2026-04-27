(function () {
  var STATE = {};
  var JSON_URL = 'changes.json';

  function apply() {
    var nodes = document.querySelectorAll('[data-change-id]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var id = el.getAttribute('data-change-id');
      var variant = el.getAttribute('data-change-variant') || 'new';
      var on = STATE[id] === true;
      var show = (variant === 'new') ? on : !on;
      if (show) {
        el.removeAttribute('hidden');
        el.style.removeProperty('display');
      } else {
        el.setAttribute('hidden', '');
        el.style.display = 'none';
      }
    }
  }

  function fetchState() {
    return fetch(JSON_URL + '?v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (json) {
        STATE = json || {};
        apply();
        document.dispatchEvent(new CustomEvent('ketoflow:changes-loaded', { detail: STATE }));
        return STATE;
      })
      .catch(function () {
        STATE = {};
        apply();
        return STATE;
      });
  }

  window.KetoflowChanges = {
    get: function () { return JSON.parse(JSON.stringify(STATE)); },
    reload: fetchState,
    apply: apply
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchState);
  } else {
    fetchState();
  }
})();
