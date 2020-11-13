"use strict";
(function () {
  let disablePage = function () {
    window.form.disablePage();
    let startMainPinCoordinates = window.pin.getStartMainPinCoordinates();
    window.form.setAddressInputValue(
        startMainPinCoordinates.x,
        startMainPinCoordinates.y
    );
    window.map.removePins();
    window.map.removeAd();
  };

  window.form.initFormValidation();

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

  window.pin.initPinDragAndDrop(
      // onPinMove
      (x, y) => {
        window.form.setAddressInputValue(x, y);
      },
      // onPinMouseDown
      () => {
        enablePage();
      },
      // onEnter
      () => {
        enablePage();
      }
  );

  let houseTypeSelect = document.querySelector(`#housing-type`);
  houseTypeSelect.addEventListener(`change`, function (evt) {
    let houseType = evt.currentTarget.value;
    window.map.addPinsToMapByType(fetchedPins, houseType);
  });

  let onFormSubmitSuccess = function () {
    disablePage();
  };

  let onFormSubmitError = function () {
  };

  window.form.onFormSubmit(function (formData) {
    window.ajax.submitForm(formData, onFormSubmitSuccess, onFormSubmitError);
  });


})();
