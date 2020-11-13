"use strict";

(function () {
  const MAIN_PIN_HEIGHT = 65;
  const MAIN_PIN_POINTER_HEIGHT = 22;
  const MAIN_PIN_WIDTH = 65;
  let mapPinMain = document.querySelector(`.map__pin--main`);
  const MAIN_PIN_INITIAL_COORDINATES = {
    X: mapPinMain.offsetLeft,
    Y: mapPinMain.offsetTop
  };

  let mainMap = document.querySelector(`.map`);
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
      let mainPinCenterX = MAIN_PIN_INITIAL_COORDINATES.X + (MAIN_PIN_WIDTH - 1) / 2;
      let mainPinCenterY = MAIN_PIN_INITIAL_COORDINATES.Y + (MAIN_PIN_HEIGHT - 1) / 2;

      return {
        x: mainPinCenterX,
        y: mainPinCenterY,
      };
    },

    resetMainPin() {
      mapPinMain.style.left = MAIN_PIN_INITIAL_COORDINATES.X + `px`;
      mapPinMain.style.top = MAIN_PIN_INITIAL_COORDINATES.Y + `px`;
    },

    initPinDragAndDrop(onPinMove, onPinMouseDown, onEnter) {
      let onMouseMove = function (evt) {
        evt.preventDefault();

        let mainPinPosition = {
          x: evt.pageX - pinClickCoordinates.x - mainMap.offsetLeft,
          y: evt.pageY - pinClickCoordinates.y - mainMap.offsetTop
        };
        let Border = {
          TOP: DRAG_LIMIT.Y.MIN - mapPinMain.offsetHeight - MAIN_PIN_POINTER_HEIGHT,
          BOTTOM: DRAG_LIMIT.Y.MAX - mapPinMain.offsetHeight - MAIN_PIN_POINTER_HEIGHT,
          LEFT: DRAG_LIMIT.X.MIN - MAIN_PIN_WIDTH / 2,
          RIGHT: DRAG_LIMIT.X.MAX - MAIN_PIN_WIDTH / 2
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
        onPinMove(pinTailCoords.x, pinTailCoords.y);
      };

      let onMouseUp = function (evt) {
        evt.preventDefault();
        document.removeEventListener(`mousemove`, onMouseMove);
        document.removeEventListener(`mouseup`, onMouseUp);
      };

      let onMouseDown = function (evt) {
        evt.preventDefault();
        if (evt.button === 0) {
          pinClickCoordinates = {
            x: evt.offsetX,
            y: evt.offsetY
          };
          document.addEventListener(`mousemove`, onMouseMove);
          document.addEventListener(`mouseup`, onMouseUp);
          onPinMouseDown();
        }
      };

      let onKeyDown = function (evt) {
        if (evt.key === `Enter`) {
          onEnter();
        }
      };
      mapPinMain.addEventListener(`mousedown`, onMouseDown);
      mapPinMain.addEventListener(`keydown`, onKeyDown);

    },

  };
})();
