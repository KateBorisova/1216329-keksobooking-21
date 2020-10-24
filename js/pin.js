"use strict";

(function () {
  const MAIN_PIN_HEIGHT = 65;
  const MAIN_PIN_POINTER_HEIGHT = 22;
  const MAIN_PIN_WIDTH = 65;

  let mapPinMain = document.querySelector(`.map__pin--main`);

  window.pin = {
    getMainPinCoordinates() {
      let mainPinPointerX = mapPinMain.offsetLeft + (MAIN_PIN_WIDTH - 1) / 2;
      let mainPinPointerY =
        mapPinMain.offsetTop + MAIN_PIN_HEIGHT + MAIN_PIN_POINTER_HEIGHT - 1;

      return {
        x: mainPinPointerX,
        y: mainPinPointerY,
      };
    },
    getStartMainPinCoordinates() {
      let mainPinCenterX = mapPinMain.offsetLeft + (MAIN_PIN_WIDTH - 1) / 2;
      let mainPinCenterY = mapPinMain.offsetTop + (MAIN_PIN_HEIGHT - 1) / 2;

      return {
        x: mainPinCenterX,
        y: mainPinCenterY,
      };
    },
    initMainPin(onMouseDown, onKeyDown) {
      mapPinMain.addEventListener(`mousedown`, onMouseDown);
      mapPinMain.addEventListener(`keydown`, onKeyDown);
    },
  };
})();
