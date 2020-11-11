"use strict";

(function () {
  let adForm = document.querySelector(`.ad-form`);
  let adFormFieldsets = adForm.querySelectorAll(`fieldset`);
  let mapFiltersForm = document.querySelector(`.map__filters`);
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
        input.setCustomValidity(`Заголовок должен состоять из 30-ти символов минимум`);
      } else if (input.validity.tooLong) {
        input.setCustomValidity(`Заголовок не должен состоять из 100 символов максимум`);
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

  window.form = {
    disablePage() {
      adFormFieldsets.forEach((element) => {
        element.setAttribute(`disabled`, `disabled`);
      });

      mapFiltersFieldsetsAndSelects.forEach((element) => {
        element.setAttribute(`disabled`, `disabled`);
      });
    },
    enablePage(addressX, addressY) {
      mainMap.classList.remove(`map--faded`);

      adForm.classList.remove(`ad-form--disabled`);

      adFormFieldsets.forEach((element) => {
        element.removeAttribute(`disabled`);
      });

      mapFiltersFieldsetsAndSelects.forEach((element) => {
        element.removeAttribute(`disabled`);
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
    },

    onFormSubmit(callback) {
      adForm.addEventListener(`submit`, function (evt) {
        evt.preventDefault();
        let formData = new FormData(adForm);
        callback(formData);
      });

    }

  };
})();
