"use strict";

(function () {
  const INVALID_ELEMENT_CLASS_NAME = `invalid-element`;
  let adForm = document.querySelector(`.ad-form`);
  let adFormFieldsets = adForm.querySelectorAll(`fieldset`);
  let mapFiltersForm = document.querySelector(`.map__filters`);
  let submitButton = document.querySelector(`.ad-form__submit`);
  let mapFiltersFieldsetsAndSelects = mapFiltersForm.querySelectorAll(
      `:scope > select, :scope > fieldset`
  );
  let mainMap = document.querySelector(`.map`);
  let roomsNumberSelect = document.querySelector(`#room_number`);
  let guestsNumberSelect = document.querySelector(`#capacity`);
  let addressInput = document.getElementById(`address`);
  let headInput = document.getElementById(`title`);
  let priceInput = document.getElementById(`price`);
  let typeOfHouse = document.getElementById(`type`);
  let checkInTime = document.getElementById(`timein`);
  let checkOutTime = document.getElementById(`timeout`);
  let main = document.querySelector(`main`);
  let successMessageTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
  let errorMessageTemplate = document.querySelector(`#error`).content.querySelector(`.error`);

  function validateRoomsAndGuests() {
    let roomsNumberValue = roomsNumberSelect.value;
    let guestsNumberValue = guestsNumberSelect.value;
    let roomsMatchGuests =
      (roomsNumberValue === `1` && guestsNumberValue === `1`) ||
      (roomsNumberValue === `2` &&
        (guestsNumberValue === `1` || guestsNumberValue === `2`)) ||
      (roomsNumberValue === `3` &&
        (guestsNumberValue === `1` ||
          guestsNumberValue === `2` ||
          guestsNumberValue === `3`)) ||
      (roomsNumberValue === `100` && guestsNumberValue === `0`);

    guestsNumberSelect.setCustomValidity(
        roomsMatchGuests
          ? ``
          : `Количество гостей не соответствует количеству комнат`
    );
  }

  function setAddressInputValue(addressX, addressY) {
    addressInput.value = addressX + `, ` + addressY;
  }

  function validateHeadInput(input) {
    input.addEventListener(`change`, function () {
      if (input.validity.tooShort) {
        input.setCustomValidity(`Заголовок слишком короткий`);
      } else if (input.validity.tooLong) {
        input.setCustomValidity(`Заголовок слишком длинный`);
      } else if (input.validity.valueMissing) {
        input.setCustomValidity(`Обязательное поле`);
      } else {
        input.setCustomValidity(``);
      }
    });
  }

  function priceInputValidation(newPriceInput, maxValue, minValue) {
    newPriceInput.max = maxValue;
    newPriceInput.min = minValue;
    newPriceInput.placeholder = minValue;
  }

  function validateTypeAndPrice(typeOfHousing, newPriceInput) {
    let onChangeEvent = function (newTypeValue) {
      let checkTypeMap = new Map();
      checkTypeMap.set(`bungalow`, 0);
      checkTypeMap.set(`flat`, 1000);
      checkTypeMap.set(`house`, 5000);
      checkTypeMap.set(`palace`, 10000);
      let minValue = checkTypeMap.get(newTypeValue);
      priceInputValidation(newPriceInput, 1000000, minValue);
    };
    typeOfHousing.addEventListener(`change`, (event) => {
      let type = event.target.value;
      onChangeEvent(type);
    });
    onChangeEvent(typeOfHousing.value);
  }

  function validateTime(checkInSelect, checkOutSelect) {
    let onCheckInChangeEvent = function (newTimesValue) {
      checkOutSelect.value = newTimesValue;
    };
    checkInSelect.addEventListener(`change`, (event) => {
      onCheckInChangeEvent(event.target.value);
    });

    let onCheckOutChangeEvent = function (newTimesValue) {
      checkInSelect.value = newTimesValue;
    };
    checkOutSelect.addEventListener(`change`, (event) => {
      onCheckOutChangeEvent(event.target.value);
    });

    onCheckInChangeEvent(checkOutSelect.value);
  }

  let highlightInvalidElement = function (item) {
    item.classList.add(INVALID_ELEMENT_CLASS_NAME);
  };

  let unhighlightInvalidElement = function (item) {
    item.classList.remove(INVALID_ELEMENT_CLASS_NAME);
  };

  let addSuccessMessage = function () {
    let successMessage = successMessageTemplate.cloneNode(true);
    main.appendChild(successMessage);
  };

  let removeSuccessMessage = function () {
    let successMessageToRemove = document.querySelector(`.success`);
    if (successMessageToRemove !== null) {
      successMessageToRemove.remove();
    }
  };

  let addErrorMessage = function () {
    let errorMessage = errorMessageTemplate.cloneNode(true);
    main.appendChild(errorMessage);
  };

  let removeErrorMessage = function () {
    let errorMessageToRemove = document.querySelector(`.error`);
    if (errorMessageToRemove !== null) {
      errorMessageToRemove.remove();
    }
  };

  window.form = {
    disablePage() {
      mainMap.classList.add(`map--faded`);
      adForm.reset();
      adForm.classList.add(`ad-form--disabled`);
      adFormFieldsets.forEach((element) => {
        element.disabled = true;
      });

      mapFiltersFieldsetsAndSelects.forEach((element) => {
        element.disabled = true;
      });
    },
    enablePage(addressX, addressY) {
      mainMap.classList.remove(`map--faded`);

      adForm.classList.remove(`ad-form--disabled`);

      adFormFieldsets.forEach((element) => {
        element.disabled = false;
      });

      mapFiltersFieldsetsAndSelects.forEach((element) => {
        element.disabled = false;
      });

      setAddressInputValue(addressX, addressY);
    },
    setAddressInputValue,

    initFormValidation() {
      roomsNumberSelect.addEventListener(`change`, validateRoomsAndGuests);
      guestsNumberSelect.addEventListener(`change`, validateRoomsAndGuests);
      validateRoomsAndGuests();
      validateHeadInput(headInput);
      validateTypeAndPrice(typeOfHouse, priceInput);
      validateTime(checkInTime, checkOutTime);
      Array.from(adForm.elements).forEach((element) => {
        element.addEventListener(`change`, function () {
          unhighlightInvalidElement(element);
        });
      });
      submitButton.addEventListener(`click`, function () {
        Array.from(adForm.elements).forEach((element) => {
          if (!element.checkValidity()) {
            highlightInvalidElement(element);
          }
        });
      });
    },

    onFormSubmit(callback) {
      adForm.addEventListener(`submit`, function (evt) {
        evt.preventDefault();
        let formData = new FormData(adForm);
        callback(formData);
      });
    },
    addSuccessMessage,
    removeSuccessMessage,
    addErrorMessage,
    removeErrorMessage,
  };
})();
