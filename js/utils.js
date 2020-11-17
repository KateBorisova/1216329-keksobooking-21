"use strict";

(function () {

  window.utils = {
    debounce(callback, timeoutMs) {
      let lastTimeout = null;

      return function (param) {
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          callback(param);
        }, timeoutMs);
      };
    },

  };
})();
