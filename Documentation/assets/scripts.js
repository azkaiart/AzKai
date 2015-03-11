$(document).ready(function(){

// AFFIX

var offset = $( 'nav.main' ).offset().top;

$( 'nav.main' ).affix({
    offset: {
      top: offset,
      bottom: 0
    }
});
$( 'body' ).scrollspy({ target: 'nav.main' })


// LIGHTBOX

function mp_lightbox_set( selector, enable_gallery ){

    selector.magnificPopup({
        type: 'image',
        gallery: {
            enabled: enable_gallery
        }
    });

}

if ( $.fn.magnificPopup ) {

    $( 'a.lightbox' ).magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

}


// TABLES

$('table tr:nth-child(2n)').addClass('even');



});