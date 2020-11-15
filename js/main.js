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
    Array.from(mapFilers.elements).forEach((element) => {
      element.addEventListener(`change`, function () {
        window.map.addPinsToMapByType(pins);
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
      document.removeEventListener(`keydown`, onSuccessMessageEsc);
    };
    document.addEventListener(`click`, onSuccessMessageClick);

    let onSuccessMessageEsc = function (evt) {
      if (evt.key === `Escape`) {
        window.form.removeSuccessMessage();
        document.removeEventListener(`keydown`, onSuccessMessageEsc);
        document.removeEventListener(`click`, onSuccessMessageClick);
      }
    };
    document.addEventListener(`keydown`, onSuccessMessageEsc);
  };

  let onFormSubmitError = function () {
    window.form.addErrorMessage();
    let onErrorMessageClick = function () {
      window.form.removeErrorMessage();
      document.removeEventListener(`click`, onErrorMessageClick);
      document.removeEventListener(`keydown`, onErrorMessageEsc);
    };
    document.addEventListener(`click`, onErrorMessageClick);

    let onErrorMessageEsc = function (evt) {
      if (evt.key === `Esc`) {
        window.form.removeErrorMessage();
        document.removeEventListener(`keydown`, onErrorMessageEsc);
        document.removeEventListener(`click`, onErrorMessageClick);
      }
    };
    document.addEventListener(`keydown`, onErrorMessageEsc);
  };

  window.form.onFormSubmit(function (formData) {
    window.ajax.submitForm(formData, onFormSubmitSuccess, onFormSubmitError);
  });


})();
