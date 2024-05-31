$(document).ready(function () {
  const amenities = {};

  $('.amenity_checkbox').click((event) => {
    const check = event.target;
    const amenityId = $(check).data('id');
    const amenityName = $(check).data('name');
    if (check.checked) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }

    $('div.amenities h4').text(Object.values(amenities).join(', '));
  });

  $.get('http://localhost:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $.post({
    url: 'http://localhost:5001/api/v1/places_search',
    contentType: 'application/json',
    data: JSON.stringify({}),
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
});
