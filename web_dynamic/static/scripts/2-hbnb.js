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
});
