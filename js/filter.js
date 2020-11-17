"use strict";

(function () {
  let mapFilers = document.querySelector(`.map__filters`);
  const PRICE_RANGES = {
    LOW_MAX: 10000,
    HIGH_MIN: 50000,
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

  window.filter = {
    filterPins(pins) {
      let selectedFilters = getSelectedFilters();
      let filteredPins = pins.filter((pin) => {
        let houseTypeMatched =
          pin.offer.type === selectedFilters.houseType ||
          selectedFilters.houseType === `any`;

        let priceMatched =
          (pin.offer.price < PRICE_RANGES.LOW_MAX && selectedFilters.price === `low`) ||
          (pin.offer.price >= PRICE_RANGES.LOW_MAX && pin.offer.price < PRICE_RANGES.HIGH_MIN && selectedFilters.price === `middle`) ||
          (pin.offer.price >= PRICE_RANGES.HIGH_MIN && selectedFilters.price === `high`) ||
          selectedFilters.price === `any`;

        let roomsMatched =
          pin.offer.rooms === Number(selectedFilters.roomsNumber) ||
          selectedFilters.roomsNumber === `any`;

        let guestsNumberMatched =
          pin.offer.guests === Number(selectedFilters.guestsNumber) ||
          selectedFilters.guestsNumber === `any`;

        let featuresMatched =
          (pin.offer.features.includes(`wifi`) || !selectedFilters.withWiFi) &&
          (pin.offer.features.includes(`dishwasher`) || !selectedFilters.withDishwasher) &&
          (pin.offer.features.includes(`parking`) || !selectedFilters.withParking) &&
          (pin.offer.features.includes(`washer`) || !selectedFilters.withWasher) &&
          (pin.offer.features.includes(`elevator`) || !selectedFilters.withElevator) &&
          (pin.offer.features.includes(`conditioner`) || !selectedFilters.withConditioner);

        return (
          houseTypeMatched &&
          priceMatched &&
          roomsMatched &&
          guestsNumberMatched &&
          featuresMatched
        );
      });
      return filteredPins;
    },
  };
})();
