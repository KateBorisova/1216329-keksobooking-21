"use strict";
(function () {
  window.map.addPinsToMap(window.data.getSimilarAdsMocks());

  window.form.disablePage();

  window.form.initFormValidation();

  let startMainPinCoordinates = window.pin.getStartMainPinCoordinates();
  window.form.setAddressInputValue(
      startMainPinCoordinates.x,
      startMainPinCoordinates.y
  );

  let enablePage = function () {
    let mainPinCoordinates = window.pin.getMainPinCoordinates();
    window.form.enablePage(mainPinCoordinates.x, mainPinCoordinates.y);
  };

  let onMouseDown = function (evt) {
    if (evt.button === 0) {
      enablePage();
    }
  };
  let onKeyDown = function (evt) {
    if (evt.key === `Enter`) {
      enablePage();
    }
  };
  window.pin.initMainPin(onMouseDown, onKeyDown);
})();
