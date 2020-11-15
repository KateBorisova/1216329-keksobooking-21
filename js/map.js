"use strict";

(function () {
  const PIN_HEIGHT = 70;
  const PIN_WIDTH = 50;
  const TYPES_MAP = {
    PALACE: `Дворец`,
    FLAT: `Квартира`,
    HOUSE: `Дом`,
    BUNGALO: `Бунгало`
  };

  let map = document.querySelector(`.map`);
  let pinTemplate = document.querySelector(`#pin`);
  let mapPins = document.querySelector(`.map__pins`);
  let template = document.querySelector(`template`);
  let adTemplate = template.content.querySelector(`.map__card`);
  let adCard = document.querySelector(`.map__card`);
  let popupPhoto = template.content.querySelector(`.popup__photo`);
  let mapFiltersContainer = document.querySelector(`.map__filters-container`);
  let mapFilers = document.querySelector(`.map__filters`);


  let onEscDown = function (evt, callback) {
    if (evt.key === `Escape`) {
      callback();
    }
  };

  let createFeatureFragment = function (adData) {
    let featureFragment = document.createDocumentFragment();
    adData.offer.features.forEach(function (it) {
      let featureItem = document.createElement(`li`);
      featureItem.className = `popup__feature popup__feature--` + it;
      featureFragment.appendChild(featureItem);
    });
    return featureFragment;
  };

  let createPhotosFragment = function (adData) {
    let photosFragment = document.createDocumentFragment();
    adData.offer.photos.forEach(function (it) {
      let popupPhotoItem = popupPhoto.cloneNode(true);
      popupPhotoItem.src = it;
      photosFragment.appendChild(popupPhotoItem);
    });
    return photosFragment;
  };

  let createAd = function (adData) {
    let ad = adTemplate.cloneNode(true);

    ad.querySelector(`.map__card img`).src = adData.author.avatar;
    ad.querySelector(`.popup__title`).textContent = adData.offer.title;
    ad.querySelector(`.popup__text--price`).textContent = adData.offer.price + ` ₽/ночь`;
    ad.querySelector(`.popup__type`).textContent = TYPES_MAP[adData.offer.type.toUpperCase()];
    ad.querySelector(`.popup__text--capacity`).textContent = adData.offer.rooms + ` комнаты для ` + adData.offer.guests + ` гостей`;
    ad.querySelector(`.popup__text--time`).textContent = `Заезд после ` + adData.offer.checkin + `, выезд до ` + adData.offer.checkout;
    ad.querySelector(`.popup__features`).innerHTML = ``;
    ad.querySelector(`.popup__features`).appendChild(createFeatureFragment(adData));
    ad.querySelector(`.popup__description`).textContent = adData.offer.description;
    ad.querySelector(`.popup__photos`).removeChild(ad.querySelector(`.popup__photo`));
    ad.querySelector(`.popup__photos`).appendChild(createPhotosFragment(adData));
    mapFiltersContainer.insertAdjacentElement(`beforebegin`, ad);

    let closeAdBtn = ad.querySelector(`.popup__close`);
    let closeAd = function () {
      ad.remove();
      closeAdBtn.removeEventListener(`click`, onCloseAdBtnClick);
      document.removeEventListener(`keydown`, onAdEscDown);
    };

    let onCloseAdBtnClick = function () {
      closeAd();
    };
    closeAdBtn.addEventListener(`click`, onCloseAdBtnClick);

    let onAdEscDown = function (evt) {
      onEscDown(evt, closeAd);
    };
    document.addEventListener(`keydown`, onAdEscDown);
    return ad;
  };

  let removeAd = function () {
    if (adCard !== null) {
      adCard.remove();
    }
  };

  let removePins = function () {
    let pinsToRemove = mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`);
    pinsToRemove.forEach((pinToRemove) => {
      mapPins.removeChild(pinToRemove);
    });
  };

  let getSelectedFilters = function () {
    return {
      houseType: mapFilers.elements[`housing-type`].value,
      price: mapFilers.elements[`housing-price`].value,
      roomsNumber: mapFilers.elements[`housing-rooms`].value,
      guestsNumber: mapFilers.elements[`housing-guests`].value,
      withWiFi: mapFilers.elements[`filter-wifi`].checked,
      withDishwasher: mapFilers.elements[`filter-dishwasher`].checked,
      withParking: mapFilers.elements[`filter-parking`].checked,
      withWasher: mapFilers.elements[`filter-washer`].checked,
      withElevator: mapFilers.elements[`filter-elevator`].checked,
      withConditioner: mapFilers.elements[`filter-conditioner`].checked,
    };
  };
  getSelectedFilters();


  window.map = {
    removePins,
    removeAd,
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
        createAd(ad);
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

    // A || (!A && B)
    // A || B

    addPinsToMapByType(pins) {
      let filteredPins = [];
      let selectedFilters = getSelectedFilters();
      pins.forEach((pin) => {
        if (
          (pin.offer.type === selectedFilters.houseType || selectedFilters.houseType === `any`) &&
          (pin.offer.price < 10000 && selectedFilters.price === `low` ||
          pin.offer.price >= 10000 && pin.offer.price < 50000 && selectedFilters.price === `middle` ||
          pin.offer.price >= 50000 && selectedFilters.price === `high` ||
          selectedFilters.price === `any`) &&
          (pin.offer.rooms === Number(selectedFilters.roomsNumber) || selectedFilters.roomsNumber === `any`) &&
          (pin.offer.guests === Number(selectedFilters.guestsNumber) || selectedFilters.guestsNumber === `any`) &&
          (pin.offer.features.includes(`wifi`) || !selectedFilters.withWiFi) &&
          (pin.offer.features.includes(`dishwasher`) || !selectedFilters.withDishwasher) &&
          (pin.offer.features.includes(`parking`) || !selectedFilters.withParking) &&
          (pin.offer.features.includes(`washer`) || !selectedFilters.withWasher) &&
          (pin.offer.features.includes(`elevator`) || !selectedFilters.withElevator) &&
          (pin.offer.features.includes(`conditioner`) || !selectedFilters.withConditioner)
        ) {
          filteredPins.push(pin);
        }
      });
      window.map.addPinsToMap(filteredPins);
    },
  };
})();
