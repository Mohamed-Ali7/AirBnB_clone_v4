$(document).ready(function () {
  getPlaces({});

  const amenities = {};
  const states = {};
  const cities = {};
  const statesAndCities = {};

  $('.amenity_checkbox').click((event) => {
    const check = event.target;
    const amenityId = $(check).data('id');
    const amenityName = $(check).data('name');
    if (check.checked) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }

    $('.amenities h4').text(Object.values(amenities).join(', '));
  });

  $('.state_checkbox').click((event) => {
    const stateCheck = event.target;
    const stateId = $(stateCheck).data('id');
    const stateName = $(stateCheck).data('name');

    if (stateCheck.checked) {
      states[stateId] = stateName;
      statesAndCities[stateId] = stateName;
    } else {
      delete states[stateId];
      delete statesAndCities[stateId];
    }
    $('.locations h4').text(Object.values(statesAndCities).join(', '));
  });

  $('.city_checkbox').click((event) => {
    const cityCheck = event.target;
    const cityId = $(cityCheck).data('id');
    const cityName = $(cityCheck).data('name');

    if (cityCheck.checked) {
      cities[cityId] = cityName;
      statesAndCities[cityId] = cityName;
    } else {
      delete cities[cityId];
      delete statesAndCities[cityId];
    }

    $('.locations h4').text(Object.values(statesAndCities).join(', '));
  });

  $.get('http://localhost:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $('.filters button').click(() => {
    const filterObject = {
      states: Object.keys(states),
      cities: Object.keys(cities),
      amenities: Object.keys(amenities)
    };
    $('.places').empty();
    getPlaces(filterObject);
  });
});

function getPlaces (filterObject) {
  $.post({
    url: 'http://localhost:5001/api/v1/places_search',
    contentType: 'application/json',
    data: JSON.stringify(filterObject),
    success: function (places) {
      places.sort((a, b) => {
        return (a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0);
      });

      for (const place of places) {
        const article = $('<article></article>');
        const titleBox = $('<div></div>');

        const placeName = $('<h2></h2>').text(place.name);
        const princeByNight = $('<div></div>');

        const information = $('<div></div>');
        const maxGuest = $('<div></div>');
        const numberRooms = $('<div></div>');
        const numberBathrooms = $('<div></div>');

        const description = $('<div></div>');

        princeByNight.addClass('price_by_night').text(`$${place.price_by_night}`);
        titleBox.addClass('title_box').append(placeName, princeByNight);

        maxGuest.addClass('max_guest').text(`${place.max_guest} Guests`);
        numberRooms.addClass('number_rooms').text(`${place.number_rooms} Bedrooms`);
        numberBathrooms.addClass('number_bathrooms').text(`${place.number_bathrooms} Bathroom`);

        information.addClass('information').append(maxGuest, numberRooms, numberBathrooms);

        description.addClass('description').html(place.description);

        article.append(titleBox, information, description);
        $('.places').append(article);
      }
    }
  });
}
