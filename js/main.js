'use strict';
const offerTypes = [`palace`, `flat`, `house`, `bungalow`];
const offerCheckInOptions = [`12:00`, `13:00`, `14:00`];
const offerCheckOutOptions = [`12:00`, `13:00`, `14:00`];
const offerFeatureOptions = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const offerPhotos = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];

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
        type: offerTypes[getRandomNumber(0, offerTypes.length - 1)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 10),
        checkin: getRandomArrayElement(offerCheckInOptions),
        checkout: getRandomArrayElement(offerCheckOutOptions),
        features: getRandomSubArray(offerFeatureOptions),
        description: `Description` + (i + 1),
        photos: getRandomSubArray(offerPhotos),
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
  let pinHeight = pinElement.clientHeight;
  let pinWidth = pinElement.clientWidth;
  pinElement.style.left = ad.location.x - pinWidth / 2 + `px`;
  pinElement.style.top = ad.location.y - pinHeight + `px`;
  pinElement.querySelector(`img`).src = ad.author.avatar;
  pinElement.querySelector(`img`).alt = ad.offer.title;

  return pinElement;
};

let pinsFragment = document.createDocumentFragment();
for (const ad of getSimilarAdsMocks()) {
  pinsFragment.appendChild(createPinElement(ad));
}

let mapPins = document.querySelector(`.map__pins`);
mapPins.appendChild(pinsFragment);

