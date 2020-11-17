"use strict";

(function () {
  const PIN_HEIGHT = 70;
  const PIN_WIDTH = 50;

  let map = document.querySelector(`.map`);
  let pinTemplate = document.querySelector(`#pin`);
  let mapPins = document.querySelector(`.map__pins`);

  let removePins = function () {
    let pinsToRemove = mapPins.querySelectorAll(
        `.map__pin:not(.map__pin--main)`
    );
    pinsToRemove.forEach((pinToRemove) => {
      mapPins.removeChild(pinToRemove);
    });
  };

  window.map = {
    removePins,
    createNewPin(ad) {
      let pinElement = pinTemplate
        .cloneNode(true)
        .content.querySelector(`.map__pin`);
      pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + `px`;
      pinElement.style.top = ad.location.y - PIN_HEIGHT + `px`;
      pinElement.querySelector(`img`).src = ad.author.avatar;
      pinElement.querySelector(`img`).alt = ad.offer.title;

      let openCard = function () {
        let mapCardRemovable = map.querySelector(`.map__card`);
        if (mapCardRemovable) {
          mapCardRemovable.remove();
        }
        window.card.createAd(ad);
        pinElement.classList.add(`.map__pin--active`);
      };
      pinElement.addEventListener(`click`, openCard);
      pinElement.addEventListener(`keydown`, function (evt) {
        if (evt.key === `Enter`) {
          openCard();
        }
      });
      return pinElement;
    },

    addPinsToMap(pins) {
      removePins();
      let pinsFragment = document.createDocumentFragment();
      pins.slice(0, 5).forEach((ad) => {
        pinsFragment.appendChild(window.map.createNewPin(ad));
      });
      mapPins.appendChild(pinsFragment);
    },


    addPinsToMapByFilters(pins) {
      let filteredPins = window.filter.filterPins(pins);
      window.map.addPinsToMap(filteredPins);
    },
  };
})();
