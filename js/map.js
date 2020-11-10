"use strict";

(function () {
  const PIN_HEIGHT = 70;
  const PIN_WIDTH = 50;

  let pinTemplate = document.querySelector(`#pin`);
  let mapPins = document.querySelector(`.map__pins`);

  window.map = {
    createNewPin(ad) {
      let pinElement = pinTemplate
        .cloneNode(true)
        .content.querySelector(`.map__pin`);
      pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + `px`;
      pinElement.style.top = ad.location.y - PIN_HEIGHT + `px`;
      pinElement.querySelector(`img`).src = ad.author.avatar;
      pinElement.querySelector(`img`).alt = ad.offer.title;

      return pinElement;
    },
    addPinsToMap(pins) {
      let pinsToRemove = mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`);
      pinsToRemove.forEach((pinToRemove) => {
        mapPins.removeChild(pinToRemove);
      });
      let pinsFragment = document.createDocumentFragment();
      pins.slice(0, 5).forEach((ad) => {
        pinsFragment.appendChild(window.map.createNewPin(ad));
      });

      mapPins.appendChild(pinsFragment);
    },

    addPinsToMapByType(pins, houseType) {
      let filteredPins = [];
      pins.forEach((pin) => {
        if (pin.offer.type === houseType || houseType === `any`) {
          filteredPins.push(pin);
        }
      });
      window.map.addPinsToMap(filteredPins);
    },
  };
})();
