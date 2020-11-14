"use strict";
(function () {
  let disablePage = function () {
    window.form.disablePage();
    window.pin.resetMainPin();
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
    window.form.addSuccessMessage();
    let onSuccessMessageClick = function () {
      window.form.removeSuccessMessage();
      document.removeEventListener(`click`, onSuccessMessageClick);
    };
    document.addEventListener(`click`, onSuccessMessageClick);

    let onSuccessMessageEsc = function () {
      window.form.removeSuccessMessage();
      document.removeEventListener(`keydown`, onSuccessMessageEsc);
    };
    document.addEventListener(`keydown`, onSuccessMessageEsc);
  };

  let onFormSubmitError = function () {
    window.form.addErrorMessage();
    let onErrorMessageClick = function () {
      window.form.removeErrorMessage();
      document.removeEventListener(`click`, onErrorMessageClick);
    };
    document.addEventListener(`click`, onErrorMessageClick);

    let onErrorMessageEsc = function () {
      window.form.removeErrorMessage();
      document.removeEventListener(`keydown`, onErrorMessageEsc);
    };
    document.addEventListener(`keydown`, onErrorMessageEsc);
  };

  window.form.onFormSubmit(function (formData) {
    window.ajax.submitForm(formData, onFormSubmitSuccess, onFormSubmitError);
  });


})();
