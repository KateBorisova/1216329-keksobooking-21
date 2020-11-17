"use strict";

(function () {
  const TYPES_MAP = {
    PALACE: `Дворец`,
    FLAT: `Квартира`,
    HOUSE: `Дом`,
    BUNGALO: `Бунгало`,
  };
  let template = document.querySelector(`template`);
  let adTemplate = template.content.querySelector(`.map__card`);
  let popupPhoto = template.content.querySelector(`.popup__photo`);
  let mapFiltersContainer = document.querySelector(`.map__filters-container`);

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
    ad.querySelector(`.popup__text--price`).textContent =
      adData.offer.price + ` ₽/ночь`;
    ad.querySelector(`.popup__type`).textContent =
      TYPES_MAP[adData.offer.type.toUpperCase()];
    ad.querySelector(`.popup__text--capacity`).textContent =
      adData.offer.rooms + ` комнаты для ` + adData.offer.guests + ` гостей`;
    ad.querySelector(`.popup__text--time`).textContent =
      `Заезд после ` +
      adData.offer.checkin +
      `, выезд до ` +
      adData.offer.checkout;
    ad.querySelector(`.popup__features`).innerHTML = ``;
    ad.querySelector(`.popup__features`).appendChild(
        createFeatureFragment(adData)
    );
    ad.querySelector(`.popup__description`).textContent =
      adData.offer.description;
    ad.querySelector(`.popup__photos`).removeChild(
        ad.querySelector(`.popup__photo`)
    );
    ad.querySelector(`.popup__photos`).appendChild(
        createPhotosFragment(adData)
    );
    mapFiltersContainer.insertAdjacentElement(`beforebegin`, ad);

    let closeAdBtn = ad.querySelector(`.popup__close`);
    let closeAd = function () {
      ad.remove();
      closeAdBtn.removeEventListener(`click`, onCloseAdBtnClick);
      document.removeEventListener(`keydown`, onDocumentKeydown);
    };

    let onCloseAdBtnClick = function () {
      closeAd();
    };
    closeAdBtn.addEventListener(`click`, onCloseAdBtnClick);

    let onDocumentKeydown = function (evt) {
      if (evt.key === `Escape`) {
        closeAd();
      }
    };
    document.addEventListener(`keydown`, onDocumentKeydown);
    return ad;
  };

  let removeAd = function () {
    let adCard = document.querySelector(`.map__card`);
    if (adCard !== null) {
      adCard.remove();
    }
  };

  window.card = {
    createAd,
    removeAd,
  };
})();
