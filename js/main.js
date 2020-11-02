"use strict";
(function () {
  window.form.disablePage();

  window.form.initFormValidation();

  let startMainPinCoordinates = window.pin.getStartMainPinCoordinates();
  window.form.setAddressInputValue(
      startMainPinCoordinates.x,
      startMainPinCoordinates.y
  );
  let fetchedPins = [];
  let onPinsFetchSuccess = function (pins) {
    window.map.addPinsToMap(pins);
    fetchedPins = pins;
  };
  let onPinsFetchError = function () {
    let errorMessage = document.createElement(`div`);
    errorMessage.innerHTML = `Произошла ошибка загрузки`;
    errorMessage.classList.add(`network-error`);
    document.body.appendChild(errorMessage);

    setTimeout(() => {
      document.body.removeChild(errorMessage);
    }, 3000);
  };

  let enablePage = function () {
    let mainPinCoordinates = window.pin.getMainPinCoordinates();
    window.form.enablePage(mainPinCoordinates.x, mainPinCoordinates.y);
    window.ajax.getPins(onPinsFetchSuccess, onPinsFetchError);
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

  let houseTypeSelect = document.querySelector(`#housing-type`);
  houseTypeSelect.addEventListener(`change`, function (evt) {
    let houseType = evt.currentTarget.value;
    let filteredPins = [];
    fetchedPins.forEach((pin) => {
      if (pin.offer.type === houseType || houseType === `any`) {
        filteredPins.push(pin);
      }
    });
    window.map.addPinsToMap(filteredPins);
  });

})();
