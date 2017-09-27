/* global $*/
/* global Stripe*/
// views/devise/registrations/new.html.erb

// function to get params from URL (SECTION 10, L265)
function GetURLParameter(sParam) { //generic method for getting URL
    var sPageURL = window.location.search.substring(1); //grabing th URL =
    var sURLVariables = sPageURL.split('&'); //we dont need coz the URL have = but somtimes URL have eg. &id
    
    for (var i = 0; i < sURLVariables.length; i++){
    var sParameterName = sURLVariables[i].split('='); //split an array based on =
    if (sParameterName[0] == sParam){ //plan=premiun (plan = 0 and premium = 1)
    return sParameterName[1]; //plan= (its either free or premium)
   }
  }
};

$(document).ready(function () {
var show_error, stripeResponseHandler, submitHandler;

// function to handle the submit of the form and intercept the default event
  submitHandler = function (event) {
    var $form = $(event.target);
    $form.find("input[type=submit]").prop("disabled", true); //button cannot click multiple times
    
    if(Stripe){
    Stripe.card.createToken($form, stripeResponseHandler); //generic stripe code
    
    } else {
      
    show_error("Failed to load credit card processing functionality. Please reload the page")
    }
  return false; //disable default action (dissabld submit form & create account)
  };

// Initiate submit handler listener for any form with class cc_form

 $(".cc_form").on('submit', submitHandler);

// handle event of plan drop down changing (free or premium)

var handlePlanChange = function(plan_type, form) {
  var $form = $(form);
  
  if(plan_type == undefined) {
  plan_type = $('#tenant_plan :selected').val(); //whatever selected tenant_plan in the id
  }
  
  if( plan_type === 'premium') {
  $('[data-stripe]').prop('required', true); //stripe data is required coz we need to handle payment
  $form.off('submit'); //removed eventhandler which attached currently
  $form.on('submit', submitHandler); //then turn it on and call submitHandler
  $('[data-stripe]').show();
  
  } else { //if its not premium
  
  $('[data-stripe]').hide(); //we dont need the stripe data if the plan is not premium, coz no payments involve
  $form.off('submit');
  $('[data-stripe]').removeProp('required'); //removing the requiremnt for having stripe data
  }
}

// Set up plan change event listener #tenant_plan id in the forms for class cc_form

$("#tenant_plan").on('change', function(event) {
handlePlanChange($('#tenant_plan :selected').val(), ".cc_form");
});

// call plan change handler so that the plan is set correctly in the drop down when the page loads

handlePlanChange(GetURLParameter('plan'), ".cc_form"); //getting the plan=premium in URL

// function to handle the token received from Stripe and remove credit card fields

stripeResponseHandler = function (status, response) {

var token, $form;
$form = $('.cc_form');

if (response.error) {
  console.log(response.error.message); //loging the error
  show_error(response.error.message); //custom method to display error
  $form.find("input[type=submit]").prop("disabled", false); //button become enabled again

 } else {
  //stripe documentation
  token = response.id;
  $form.append($("<input type=\"hidden\" name=\"payment[token]\" />").val(token));
  $("[data-stripe=number]").remove(); //remove the cc info
  $("[data-stripe=cvv]").remove();
  $("[data-stripe=exp-year]").remove();
  $("[data-stripe=exp-month]").remove();
  $("[data-stripe=label]").remove();
  $form.get(0).submit();
}

return false;

};

// function to show errors when Stripe functionality returns an error

show_error = function (message) {

if($("#flash-messages").size() < 1){
$('div.container.main div:first').prepend("<div id='flash-messages'></div>")
}

$("#flash-messages").html('<div class="alert alert-warning"><a class="close" data-dismiss="alert">×</a><div id="flash_alert">' + message + '</div></div>');
$('.alert').delay(5000).fadeOut(3000);
return false;
};

});