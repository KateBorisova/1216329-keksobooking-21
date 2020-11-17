"use strict";

(function () {
  const STATUS_CODE = {
    OK: 200
  };
  let request = (url, method, formData, onSuccess, onError) => {
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
    xhr.open(method, url);
    xhr.send(formData);
  };

  window.ajax = {
    getPins(onSuccess, onError) {
      request(`https://21.javascript.pages.academy/keksobooking/data`, `GET`, undefined, onSuccess, onError);
    },

    submitForm(formData, onSuccess, onError) {
      request(`https://21.javascript.pages.academy/keksobooking`, `POST`, formData, onSuccess, onError);
    }
  };
})();
