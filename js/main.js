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

  let mainMap = document.querySelector(`.map`);
  let mapPinMain = document.querySelector(`.map__pin--main`);


  // window.pin.initPinDragAndDrop();
  // window.pin.onPinDrop(() => {
  //   enablePage();
  // });
  // window.pin.onPinMove((x, y) => {
  //   window.form.setAddressInputValue(x, y);
  // });

  const MAIN_PIN_HEIGHT = 65;
  const MAIN_PIN_POINTER_HEIGHT = 22;
  const MAIN_PIN_WIDTH = 65;
  const DRAG_LIMIT = {
    X: {
      MIN: 0,
      MAX: mainMap.clientWidth
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };

  let pinClickCoordinates = {};

  let onMouseMove = function (evt) {
    evt.preventDefault();

    let mainPinPosition = {
      x: evt.pageX - pinClickCoordinates.x - mainMap.offsetLeft,
      y: evt.pageY - pinClickCoordinates.y - mainMap.offsetTop
    };
    let Border = {
      TOP: DRAG_LIMIT.Y.MIN - mapPinMain.offsetHeight - MAIN_PIN_POINTER_HEIGHT,
      BOTTOM: DRAG_LIMIT.Y.MAX - mapPinMain.offsetHeight - MAIN_PIN_POINTER_HEIGHT,
      LEFT: DRAG_LIMIT.X.MIN,
      RIGHT: DRAG_LIMIT.X.MAX - mapPinMain.offsetWidth
    };

    if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
      mapPinMain.style.left = mainPinPosition.x + `px`;
    }
    if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
      mapPinMain.style.top = mainPinPosition.y + `px`;
    }
    let pinTailCoords = {
      x: mainPinPosition.x + Math.ceil(MAIN_PIN_WIDTH / 2),
      y: mainPinPosition.y + MAIN_PIN_HEIGHT + MAIN_PIN_POINTER_HEIGHT
    };

    window.form.setAddressInputValue(
        pinTailCoords.x,
        pinTailCoords.y
    );
  };

  let onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    mainMap.removeEventListener(`mousemove`, onMouseMove);
    mainMap.removeEventListener(`mouseup`, onMouseUp);
    enablePage();
  };

  let onMouseDown = function (evt) {
    evt.preventDefault();
    if (evt.button === 0) {
      pinClickCoordinates = {
        x: evt.offsetX,
        y: evt.offsetY
      };
      mainMap.addEventListener(`mousemove`, onMouseMove);
      mainMap.addEventListener(`mouseup`, onMouseUp);
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
    window.map.addPinsToMapByType(fetchedPins, houseType);
  });

})();
