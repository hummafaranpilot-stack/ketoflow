(function () {
  var STORAGE_KEY = 'ketoflow_changes';

  function readState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function isOn(state, id) {
    return state[id] === true;
  }

  function apply(state) {
    var nodes = document.querySelectorAll('[data-change-id]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var id = el.getAttribute('data-change-id');
      var variant = el.getAttribute('data-change-variant') || 'new';
      var on = isOn(state, id);
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

  window.KetoflowChanges = {
    get: readState,
    set: function (id, value) {
      var s = readState();
      s[id] = !!value;
      writeState(s);
      apply(s);
    },
    toggle: function (id) {
      var s = readState();
      s[id] = !s[id];
      writeState(s);
      apply(s);
      return s[id];
    },
    reset: function () {
      writeState({});
      apply({});
    },
    apply: function () { apply(readState()); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { apply(readState()); });
  } else {
    apply(readState());
  }

  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) apply(readState());
  });
})();
