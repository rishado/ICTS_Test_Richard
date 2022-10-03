"use strict";

// Format options (Country Select)
var optionFormat = function (item) {
  if (!item.id) {
    return item.text;
  }

  var span = document.createElement('span');
  var imgUrl = item.element.getAttribute('value');
  var template = '';

  template += '<img src="assets/media/flags-circle/' + imgUrl + '.svg" class="rounded-circle h-20px me-2" alt="image"/>';
  template += item.text;
  span.innerHTML = template;
  return $(span);
}

// Init Country Select2 
$('#select2_country').select2({
  templateSelection: optionFormat,
  templateResult: optionFormat
});

// Country select2 change 
$('#select2_country').on('select2:select', function (e) {
  var data = e.params.data;
  if(data.id == 'arab_region') {
    $('#aside_tab_country').hide();
    $('#aside_tab_regional').show();
    $('[href="#smt_regional"]').tab('show');
  }
  else {
    $('#aside_tab_regional').hide();
    $('#aside_tab_country').show();
    $('#aside_tab_country a').click();
    $('[href="#smt_country"]').tab('show');
  }
});



// Close buttons for Aside and Menu
$('#kt_aside_close').on('click',function(e){
  $(".drawer-overlay").click();
});
$('#kt_menu_close').click(function () {
  $(".drawer-overlay").click();
});


// Aside buttons highlight
$("#myTabContent a.btn").on('click',function(e){
  $("#myTabContent a.btn").attr("aria-expanded", false)
  $(this).attr("aria-expanded", true)
})


//Charts show
$("a.charts_open").on('click',function(e){
  e.preventDefault(); 
  $('#chart_container').slideDown();

  $('html, body').animate({
    scrollTop: $('#chart_container').offset().top
  }, 500, function(){
    window.location.hash = '#chart_container';
  });
})

//charts hide
$("#kt_chart_container_close a").on('click',function(e){
  e.preventDefault(); 
  $('#chart_container').slideUp();
  $('html, body').animate({
    scrollTop: 0
  }, 500, function(){
    window.location.hash = '';
  });
  
  
});
