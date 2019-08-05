jQuery(function ($) {
	"use strict";

	/* ========================================================================= */
	/*	Page Preloader
	/* ========================================================================= */

	// Preloader js
	$(window).on('load', function () {
		$('#preloader').fadeOut(700);
	});
	$(document).ready(function () {
	$('#contactsubmit').click(function(e){
    	var first_name = $('#firstname').val();
         var email = $('#emailaddress').val();
	     var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	         if (first_name == '') {
				$('#name').css('display', 'block');
	      		return  false;
	      		e.preventDefault();
	    	 }
	    	 else {
	    	  $('#name').css('display', 'none');
	    	 }
	    	 if (email == '' || email.search(o) == -1 ) {
	      		$('#email').css('display', 'block');
	      		return  false;
	      		e.preventDefault();
	    	 }
			 else {
	          $('#email').css('display', 'none');
	           
 		    }
			var response = grecaptcha.getResponse();
              if(response.length == 0)
              {
              	$('#captcaha').css('display', 'block');
                return false;
                e.preventDefault();
              }
              else {
              	$('#captcaha').css('display', 'none');
                	return  true;  
              }               


    });
	});

});