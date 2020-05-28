jQuery(function ($) {
	"use strict";

	/* ========================================================================= */
	/*	Page Preloader
	/* ========================================================================= */

	// Preloader js
	$(window).on('load', function () {
		$('#preloader').fadeOut(700);
	});
  $(document).keypress(function(e) {
    $('.error').hide();
    });
	$(document).ready(function () {
    const grant_type = 'client_credentials';
    const client_id = 'd2c7aa99-4f9d-bc81-e7d2-5d89aeed8c64';
    const client_secret = 'hi0%4mhVD3E^';
    const api_url = 'https://crm.netspective.com';
    const account_id = '9fa0a9d4-369e-0ff8-4e09-5d89ac987120';

    /*const grant_type = 'client_credentials';
      const client_id = 'f07aba24-7d5b-6854-fb00-5ebd239bb5b0';
      const client_secret = 'Xv6fTeR6NdqTF6EG';
      const api_url = 'https://crm-test.netspective.org';
      const account_id = '52fe7a95-c745-372b-d531-5ebd21523d63';*/

    function uniqueIDGet() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  var uniqueID = uniqueIDGet();
	$('#contactsubmit').click(function(e){
    	var full_name = $('#firstname').val();
        var email = $('#emailaddress').val();
        var subject = $('#subject').val();
        var message  = $('#message').val();
        var validator = true;
        
         var description_json = {};
         description_json["Subject"] = subject;
         description_json["Message"] = message;
         var description = JSON.stringify(description_json);

	       var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	        if (full_name == '') {
			     $('#name').css('display', 'block');
	      	     validator = false;
	    	}
	    	else {
	    	   $('#name').css('display', 'none');
	    	}
            if (subject == '') {
                $('#subject_error').css('display', 'block');
                validator = false;
            }
            else {
              $('#subject_error').css('display', 'none');
            }
	    	 if (email == '' || email.search(o) == -1 ) {
	      		$('#email').css('display', 'block');
	      		validator = false;
	    	 }
			 else {
	          $('#email').css('display', 'none');
	           
 		    }
        if(validator == false){
          return false;
        }
        var contact_form_object = {};
        if (full_name !== '')
            contact_form_object['first_name'] = full_name;
        if (email != '')
            contact_form_object['email1'] = email;
        if (subject !== '' && message !== '')
            contact_form_object['description'] = description;

        if (!jQuery.isEmptyObject(contact_form_object)) {
            var data = {};
            data['type'] = 'Contacts';
            data['id'] = uniqueID;
            data['attributes'] = contact_form_object;
            var main_data = {};
            main_data['data'] = data;
            main_data = JSON.stringify(main_data);
            
        }
        if (full_name != '' && email != '' && ValidateEmail(email)) {
            suite_crm_api_calls(main_data, 'quickcontact', 'contactsubmit', 'sh-btn-loader', 'thankyou_message', 'contactsubmit');

        } // close if no name or email
                    


    });

function suite_crm_api_calls(data, form_id, btn_id, loader_class, success_div_id, btn_text_id) {

    $('#' + btn_id).prop('disabled', true);
    $('.' + loader_class).removeClass('sh-hide-element');
    $('#' + btn_text_id).val('Please Wait...');
    var form = new FormData();
    form.append("grant_type", grant_type);
    form.append("client_id", client_id);
    form.append("client_secret", client_secret);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": api_url + "/Api/access_token",
        "method": "POST",
        "headers": {
            "Accept": "application/vnd.api+json"
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }
    $.ajax(settings).done(function(response) {

        var obj = $.parseJSON(response);
        var access_token = obj.access_token;
        var settings = {
            "url": api_url + "/Api/V8/module",
            "method": "POST",
            "headers": {
                "Accept": "application/vnd.api+json",
                "Authorization": "Bearer " + access_token + "",
                "Content-Type": "application/json"
            },
            "processData": false,
            "data": data
        }

        $.ajax(settings).done(function(response) {
            //console.log(response);
            var contactid = response.data.id;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": api_url + "/Api/V8/module/Accounts/" + account_id + "/relationships",
                "method": "POST",
                "headers": {
                    "Accept": "application/vnd.api+json",
                    "Authorization": "Bearer " + access_token + "",
                    "Content-Type": "application/json"
                },
                "processData": false,
                "data": "{  \r\n   \"data\":{  \r\n         \"type\":\"Contacts\",\r\n         \"id\":\"" + contactid + "\"\r\n\t    \r\n      }\r\n}"
            }

            $.ajax(settings).done(function(response) {
                //console.log(response);
                if (response.meta.message != "") {
                    $('#' + form_id)[0].submit();
                    $('#' + form_id)[0].reset();
                    $('#' + btn_id).prop('disabled', false);
                    $('#' + btn_text_id).val('Send');
                }
            });
        });
    });
}
function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true;
    }
    return false;
}
  });
});