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
  $('.places').on('click', '.reviews_header span', function (event) {
    const show = event.target;
    const placeId = $(show).data('place_id');
    const reviewsList = $('<ul></ul>');
    if (!$(show).hasClass('loaded')) {
      $.get(`http://localhost:5001/api/v1/places/${placeId}/reviews`).done(function (reviews) {
        for (const review of reviews) {
          const reviewMetaData = $('<h3></h3>');
          const reviewText = $('<p></p>');
          const reviewElement = $('<li></li>');
          const reviewFormatedDate = formatDate(review.created_at);

          const userRequest = $.get(`http://localhost:5001/api/v1/users/${review.user_id}`);

          userRequest.done(function (user) {
            reviewText.text(review.text);
            const userName = `${user.first_name} ${user.last_name}`;
            reviewMetaData.text(`From ${userName} the ${reviewFormatedDate}`);
            reviewElement.append(reviewMetaData, reviewText);
            reviewsList.append(reviewElement);
          });
        }
        $(show).closest('article').find('.reviews').append(reviewsList);
        $(show).addClass('loaded');
        $(show).closest('article').find('.reviews ul');
        $(show).text('Hide');
      });
    } else {
      const loadedReviews = $(show).closest('article').find('.reviews ul');
      if (loadedReviews.hasClass('hide')) {
        loadedReviews.removeClass('hide');
        $(show).text('Hide');
      } else {
        loadedReviews.addClass('hide');
        $(show).text('show');
      }
    }
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
        const reviews = $('<div></div>');
        const reviewsHeader = $('<div></div>');
        const reviewsTitle = $('<h2></h2>').text('Reviews');

        const showReviews = $('<span></span>').data('place_id', place.id).text('show');
        princeByNight.addClass('price_by_night').text(`$${place.price_by_night}`);
        titleBox.addClass('title_box').append(placeName, princeByNight);

        maxGuest.addClass('max_guest').text(`${place.max_guest} Guests`);
        numberRooms.addClass('number_rooms').text(`${place.number_rooms} Bedrooms`);
        numberBathrooms.addClass('number_bathrooms').text(`${place.number_bathrooms} Bathroom`);

        information.addClass('information').append(maxGuest, numberRooms, numberBathrooms);

        description.addClass('description').html(place.description);

        reviewsHeader.addClass('reviews_header').append(reviewsTitle, showReviews);
        reviews.addClass('reviews').append(reviewsHeader);

        article.append(titleBox, information, description, reviews);
        $('.places').append(article);
      }
    }
  });
}

function formatDate (inputDate) {
  const date = new Date(inputDate);

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const formattedDate = date.toLocaleDateString('en-GB', options);

  const day = date.getDate();
  let daySuffix;
  if (day % 10 === 1 && day !== 11) {
    daySuffix = 'st';
  } else if (day % 10 === 2 && day !== 12) {
    daySuffix = 'nd';
  } else if (day % 10 === 3 && day !== 13) {
    daySuffix = 'rd';
  } else {
    daySuffix = 'th';
  }

  return formattedDate.replace(/\d+/, day + daySuffix);
}
