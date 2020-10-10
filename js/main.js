'use strict';
const OFFER_TYPES = [`palace`, `flat`, `house`, `bungalow`];
const OFFER_CHECK_IN_OPTIONS = [`12:00`, `13:00`, `14:00`];
const OFFER_CHECK_OUT_OPTIONS = [`12:00`, `13:00`, `14:00`];
const OFFER_FEATURE_OPTIONS = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const OFFER_PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const PIN_HEIGHT = 70;
const PIN_WIDTH = 50;

let getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let getRandomSubArray = function (inputArray) {
  let result = [];
  for (let i = 0; i < inputArray.length; i++) {
    if (Math.random() > 0.5) {
      result.push(inputArray[i]);
    }
  }
  return result;
};

let getRandomArrayElement = function (inputArray) {
  return inputArray[getRandomNumber(0, inputArray.length - 1)];
};

let getSimilarAdsMocks = function () {
  let similarAdsArray = [];
  let mapWidthPx = document.querySelector(`.map__overlay`).clientWidth;
  for (let i = 0; i < 8; i++) {
    let locationX = getRandomNumber(0, mapWidthPx);
    let locationY = getRandomNumber(130, 630);
    similarAdsArray.push({
      author: {
        avatar: `img/avatars/user0` + (i + 1) + `.png`,
      },
      offer: {
        title: `Title` + (i + 1),
        address: locationX + `, ` + locationY,
        price: getRandomNumber(50, 150),
        type: OFFER_TYPES[getRandomNumber(0, OFFER_TYPES.length - 1)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 10),
        checkin: getRandomArrayElement(OFFER_CHECK_IN_OPTIONS),
        checkout: getRandomArrayElement(OFFER_CHECK_OUT_OPTIONS),
        features: getRandomSubArray(OFFER_FEATURE_OPTIONS),
        description: `Description` + (i + 1),
        photos: getRandomSubArray(OFFER_PHOTOS),
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
  return similarAdsArray;
};

let mapElement = document.querySelector(`.map`);
mapElement.classList.remove(`map--faded`);

let pinTemplate = document.querySelector(`#pin`);

let createPinElement = function (ad) {
  let pinElement = pinTemplate.cloneNode(true).content.querySelector(`.map__pin`);
  pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + `px`;
  pinElement.style.top = ad.location.y - PIN_HEIGHT + `px`;
  pinElement.querySelector(`img`).src = ad.author.avatar;
  pinElement.querySelector(`img`).alt = ad.offer.title;

  return pinElement;
};

let pinsFragment = document.createDocumentFragment();
for (let ad of getSimilarAdsMocks()) {
  pinsFragment.appendChild(createPinElement(ad));
}

let mapPins = document.querySelector(`.map__pins`);
mapPins.appendChild(pinsFragment);

