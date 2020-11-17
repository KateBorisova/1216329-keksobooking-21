"use strict";
(function () {

  let debounce = function (callback, timeoutMs) {
    let lastTimeout = null;

    return function (param) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback(param);
      }, timeoutMs);
    };
  };
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

  let adFormReset = document.querySelector(`.ad-form__reset`);
  adFormReset.addEventListener(`click`, function () {
    disablePage();
  });
  adFormReset.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Enter`) {
      disablePage();
    }
  });

  window.form.initFormValidation();

  let mapFilers = document.querySelector(`.map__filters`);
  let addEventListersOnFilters = function (pins) {
    let debounceAddPinsToMapByFilters = debounce(window.map.addPinsToMapByFilters, 500);
    Array.from(mapFilers.elements).forEach((element) => {
      element.addEventListener(`change`, function () {
        window.map.removeAd();
        debounceAddPinsToMapByFilters(pins);
      });
    });
  };

  let fetchedPins = [];
  let onPinsFetchSuccess = function (pins) {
    window.map.addPinsToMap(pins);
    fetchedPins = pins;
    addEventListersOnFilters(fetchedPins);
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


  let onFormSubmitSuccess = function () {
    disablePage();
    window.form.addSuccessMessage();
    let onSuccessMessageClick = function () {
      window.form.removeSuccessMessage();
      document.removeEventListener(`click`, onSuccessMessageClick);
      document.removeEventListener(`keydown`, onSuccessMessageKeydown);
    };
    document.addEventListener(`click`, onSuccessMessageClick);

    let onSuccessMessageKeydown = function (evt) {
      if (evt.key === `Escape`) {
        window.form.removeSuccessMessage();
        document.removeEventListener(`keydown`, onSuccessMessageKeydown);
        document.removeEventListener(`click`, onSuccessMessageClick);
      }
    };
    document.addEventListener(`keydown`, onSuccessMessageKeydown);
  };

  let onFormSubmitError = function () {
    window.form.addErrorMessage();
    let onErrorMessageClick = function () {
      window.form.removeErrorMessage();
      document.removeEventListener(`click`, onErrorMessageClick);
      document.removeEventListener(`keydown`, onErrorMessageKeydown);
    };
    document.addEventListener(`click`, onErrorMessageClick);

    let onErrorMessageKeydown = function (evt) {
      if (evt.key === `Esc`) {
        window.form.removeErrorMessage();
        document.removeEventListener(`keydown`, onErrorMessageKeydown);
        document.removeEventListener(`click`, onErrorMessageClick);
      }
    };
    document.addEventListener(`keydown`, onErrorMessageKeydown);
  };

  window.form.subscribeOnSubmit(function (formData) {
    window.ajax.submitForm(formData, onFormSubmitSuccess, onFormSubmitError);
  });
})();
