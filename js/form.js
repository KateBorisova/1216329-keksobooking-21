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
  let addressInput = document.querySelector(`#address`);

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
  let setAddressInputValue = function (addressX, addressY) {
    addressInput.value = addressX + `, ` + addressY;
  };

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
    },
  };
})();
