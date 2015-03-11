<?php

/* -----------------------------------------------------------------------------

    VARIABLES

----------------------------------------------------------------------------- */

// email where the contact form messages will be sent
$email_to = 'example@example.com';

// sucess message
$success_msg = 'Message sent successfully!';

// connection error message
$connection_error_msg = 'There was a connection problem. Try again later.';

// required fields message
$required_fields_error_msg = 'Fields with (*) are required!';

// spam detected error message
$spam_error_message = 'Leave the field after the email field blank please.';

// errors in form message
$multiple_errors_msg = 'Fix the following errors, please:';

// name error message
$name_error_msg = 'The Name you entered does not appear to be valid.';

// email error message
$email_error_msg = 'The Email Address you entered does not appear to be valid.';

// message error message
$message_error_msg = 'The message you entered do not appear to be valid.';

// default email subject (if the sender leaves subject field blank)
$default_email_subject = 'Contact form message';

// email text
$email_text = 'Form details below:';


/* -----------------------------------------------------------------------------

    FORM

----------------------------------------------------------------------------- */

if( isset( $_REQUEST['contact-form'] ) ) {

    function died( $error ) {
        echo '<p class="c-alert-message m-warning m-phpvalidation-error" style="display: none;"><i class="ico fa fa-exclamation-circle"></i><strong>' . $multiple_errors_msg . '</strong>' . $error . '</p>';
        die();
    }

	function secure_string( $string ) {
		$string = strip_tags( $string );
		$string = htmlspecialchars( $string, ENT_QUOTES );
		$string = trim( $string );
		return $string;
	}

	/* -------------------------------------------------------------------------
        CHECK IF REQUIRED FIELDS EXISTS
    ------------------------------------------------------------------------- */

    if( !isset( $_REQUEST['contact-name'] ) ||
        !isset( $_REQUEST['contact-email'] ) ||
        !isset( $_REQUEST['contact-message'] ) ) {
        died( $required_fields_error_msg );
    }
	// honeypot
	if ( isset( $_REQUEST['contact-email-hp'] ) && $_REQUEST['contact-email-hp'] !== '' ) {
		died( $spam_error_message );
	}

	/* -------------------------------------------------------------------------
        VALIDATE / PROCESS FIELDS
    ------------------------------------------------------------------------- */

	$error_message = '';

	// NAME
    $field_name = secure_string( $_REQUEST['contact-name'] );
    if ( strlen( $field_name ) < 1 ) {
        $error_message .= '<br>' . name_error_msg;
    }

	// EMAIL
    $field_email = secure_string( $_REQUEST['contact-email'] );
	$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
    if ( !preg_match( $email_exp, $field_email ) ) {
        $error_message .= '<br>' . $email_error_msg;
    }

	// PHONE
    if ( isset( $_REQUEST['contact-phone'] ) ) {
        $field_phone = secure_string( $_REQUEST['contact-phone'] );
    }

	// SUBJECT
    if ( isset( $_REQUEST['contact-subject'] ) && strlen( $_REQUEST['contact-subject'] ) > 0 ) {
        $field_subject = secure_string( $_REQUEST['contact-subject'] );
    }
    else {
        $field_subject = $default_email_subject;
    }

	// MESSAGE
    $field_message = secure_string( $_REQUEST['contact-message'] );
    if ( strlen( $field_message ) < 2 ) {
        $error_message .= '<br>' . $message_error_msg;
    }

	// END IF THERE IS AT LEAST ONE ERROR MESSAGE
    if ( strlen( $error_message ) > 0 ) {
        died( $error_message );
    }

	/* -------------------------------------------------------------------------
        SEND EMAIL
    ------------------------------------------------------------------------- */

    function clean_string( $string ) {
        $bad = array( 'content-type', 'bcc:', 'to:', 'cc:', 'href' );
        return str_replace( $bad, '', $string );
    }
    $email_message = $email_text . "\n\n";
    $email_message .= 'Name: ' . clean_string( $field_name ) . "\n";
    $email_message .= 'Email: ' . clean_string( $field_email ) . "\n";
    if ( isset( $field_phone ) ) {
        $email_message .= 'Phone: ' . clean_string( $field_phone ) . "\n";
    }
    $email_message .= "\n" . clean_string( $field_message ) . "\n";
    $headers = 'MIME-Version: 1.0' . "\r\n" . 'Content-type: text/plain; charset=UTF-8' . "\r\n" .
	'From: ' . $field_email . "\r\n" .
    'Reply-To: ' . $field_email . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

	@mail( $email_to, '=?utf-8?B?' . base64_encode( $field_subject ) . '?=', $email_message, $headers );

	/* -------------------------------------------------------------------------
        OUTPUT SUCCESS MESSAGE
    ------------------------------------------------------------------------- */

    echo '<p class="c-alert-message m-success" style="display: none;"><i class="ico fa fa-check-circle"></i>' . $success_msg . '</p>';

}
else {

	/* -------------------------------------------------------------------------
        CONNECTION PROBLEM MESSAGE
    ------------------------------------------------------------------------- */

	echo '<p class="c-alert-message m-warning m-request-error" style="display: none;"><i class="ico fa fa-exclamation-circle"></i>' . $connection_error_msg . '</p>';

}

?>