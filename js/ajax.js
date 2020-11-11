"use strict";

(function () {
  const STATUS_CODE = {
    OK: 200
  };
  window.ajax = {
    getPins(onSuccess, onError) {
      let xhr = new XMLHttpRequest();

      xhr.responseType = `json`;

      xhr.addEventListener(`load`, function () {
        if (xhr.status === STATUS_CODE.OK) {
          onSuccess(xhr.response);
        } else {
          onError();
        }
      });
      xhr.addEventListener(`error`, function () {
        onError();
      });
      xhr.open(`GET`, `https://21.javascript.pages.academy/keksobooking/data`);

      xhr.send();
    },

    submitForm(formData, onSuccess, onError) {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener(`load`, function () {
        if (xhr.status === STATUS_CODE.OK) {
          onSuccess(xhr.response);
        } else {
          onError();
        }
      });
      xhr.addEventListener(`error`, function () {
        onError();
      });
      xhr.open(`POST`, `https://21.javascript.pages.academy/keksobooking`);
      xhr.send(formData);
    }
  };
})();
