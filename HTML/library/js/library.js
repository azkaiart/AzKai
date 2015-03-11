(function($){
    "use strict";

/* -----------------------------------------------------------------------------

	PLUGINS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		ACCORDION
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrAccordion ) {
		$.fn.lsvrAccordion = function(){

			var $this = $(this),
			isToggle = $this.hasClass( 'm-toggle' ) ? true : false,
			items = $this.find( '> li' );
			items.filter( '.m-active' ).find( '.accordion-content' ).slideDown( 300 );

			$this.find( '.accordion-title' ).click(function(){
				if ( ! $(this).parent().hasClass( 'm-active' ) ) {
					if ( ! isToggle ) {
						items.filter( '.m-active' ).find( '.accordion-content' ).slideUp(300);
						items.filter( '.m-active' ).removeClass( 'm-active' );
					}
					$(this).parent().find( '.accordion-content' ).slideDown(300);
					$(this).parent().addClass( 'm-active' );
				}
				else {
					$(this).parent().find( '.accordion-content' ).slideUp(300);
					$(this).parent().removeClass( 'm-active' );
				}
			});

		};
	}

	/* -------------------------------------------------------------------------
		AJAX FORM
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrAjaxForm ) {
		$.fn.lsvrAjaxForm = function(){
		// REQUIRED PLUGINS
		if ( $.fn.lsvrIsFormValid ) {

			var form = $(this),
			submitBtn = form.find( '.submit-btn' );

			form.submit(function(e){
				e.preventDefault();

				if ( ! submitBtn.hasClass( 'm-loading' ) ) {

					// CLEAN OLD MESSAGES
					form.find( '.c-alert-message.m-success, .c-alert-message.m-phpvalidation-error' ).slideUp( 300, function(){
						$(this).remove();
					});

					// FORM NOT VALID
					if ( ! form.lsvrIsFormValid() ) {
						form.find( 'p.c-alert-message.m-warning.m-validation-error' ).slideDown(300);
						return false;
					}
					// FORM VALID
					else {

						submitBtn.addClass( 'm-loading' ).attr( 'data-label', submitBtn.text() ).text( submitBtn.data( 'loading-label' ) );

						// AJAX REQUEST
						$.ajax({
							type: 'POST',
							url: form.attr( 'action' ),
							data: form.serialize(),
							success: function( data ){

								form.find( '.c-alert-message.m-validation-error' ).hide();
								form.prepend( data );
								form.find( '.c-alert-message.m-success, .c-alert-message.m-phpvalidation-error' ).slideDown(300);
								submitBtn.removeClass( 'm-loading' ).text( submitBtn.attr( 'data-label' ) );

								// RESET ALL INPUTS
								if ( data.indexOf( 'success' ) > 0 ) {
									form.find( 'input, textarea' ).each( function() {
										$(this).val( '' );
									});
								}

							},
							error: function(){
								form.find( '.c-alert-message.m-validation-error' ).slideUp(300);
								form.find( '.c-alert-message.m-request-error' ).slideDown(300);
								submitBtn.removeClass( 'm-loading' ).text( submitBtn.attr( 'data-label' ) );
							}
						});

					}

				}
			});

		}};
	}

	/* -------------------------------------------------------------------------
		AJAX MODAL
	------------------------------------------------------------------------- */

	// OBJECT PLUGIN
	if ( ! $.fn.lsvrAjaxModal ) {
		$.fn.lsvrAjaxModal = function(){
		// REQUIRED PLUGINS
		if ( $.fn.lsvrImagesLoaded ) {

			var lsvrAjaxModalObject = {

				index: false,
				url: false,
				ajaxSelector: false,
				callback: false,
				navigationObject: false,
				modal: false,

				// CREATE MODAL
				modalCreate: function() {

					var object = this,
						modalHtml = '<div class="c-modal" style="display: none;">';
					modalHtml += '<div class="modal-loading"><span class="c-loading-anim"><span></span></span></div>';
					modalHtml += '<div class="modal-box" style="display: none;">';
					modalHtml += '<div class="modal-header"><div class="modal-title"></div><div class="modal-tools">';
					modalHtml += '<button class="modal-prev c-button m-outline" type="button" style="display: none;"><i class="fa fa-chevron-left"></i></button><button class="modal-next c-button m-outline" type="button" style="display: none;"><i class="fa fa-chevron-right"></i></button>';
					modalHtml += '<button class="modal-close c-button m-outline" type="button"><i class="fa fa-times"></i></button>';
					modalHtml += '</div></div><div class="modal-box-inner"></div></div>';
					modalHtml += '</div>';
					$( 'body' ).append( modalHtml );
					object.modal = $( '.c-modal' );

					// MODAL NAVIGATION
					if ( typeof object.navigationObject !== 'undefined' ) {

						// CLICK PREV
						object.modal.find( '.modal-prev' ).click(function(){
							if ( ! $(this).hasClass( 'm-disabled' ) && ! $(this).hasClass( 'm-loading' ) ) {
								object.modalChange( 'prev' );
							}
						});

						// CLICK NEXT
						object.modal.find( '.modal-next' ).click(function(){
							if ( ! $(this).hasClass( 'm-disabled' ) && ! $(this).hasClass( 'm-loading' ) ) {
								object.modalChange( 'next' );
							}
						});

					}

					// CLICK ON CLOSE
					$( '.c-modal .modal-close' ).click(function(){
						object.modalClose();
					});

					// iOS & CHROME BODY SCROLLING FIX
					$( 'body' ).on( 'touchmove', function (e) {
						if ( object.modal.is( ':visible' ) ) {
							if ( ! object.modal.has( $( e.target ) ).length ) {
								e.preventDefault();
							}
						}
					});
					$( 'body' ).on( 'mousewheel DOMMouseScroll', function (e) {
						if ( object.modal.is( ':visible' ) ) {
							if ( ! object.modal.has( $( e.target ) ).length ) {
								e.preventDefault();
							}
						}
					});

				},

				// OPEN MODAL
				modalOpen: function(){

					var object = this;

					// CREATE MODAL
					if ( ! object.modal ) {
						object.modalCreate();
					}

					// SHOW MODAL
					object.modal.fadeIn( 300 );
					$( 'html' ).addClass( 'm-modal-active' );

					// LOAD MODAL CONTENT
					object.modalLoadContent( object.modal.find( '.modal-box-inner' ), object.url, object.ajaxSelector, function(){
						object.modal.find( '.modal-loading' ).fadeOut( 300 );
						object.modal.find( '.modal-box' ).fadeIn( 150 );
						if ( object.callback ) {
							object.callback.call();
						}
					});

					// PERMALINK
					if ( object.navigationObject ) {
						object.modal.find( '.modal-permalink' ).attr( 'href', object.url );
					}

					// MODAL NAVIGATION
					if ( object.navigationObject ) {
						object.index = object.navigationObject.index;
						object.modal.find( '.modal-prev, .modal-next' ).show();
						if ( object.index === 0 ) {
							object.modal.find( '.modal-prev' ).addClass( 'm-disabled' );
						}
						else {
							object.modal.find( '.modal-prev' ).removeClass( 'm-disabled' );
						}
						if ( object.index === object.navigationObject.galleryItems.length - 1 ) {
							object.modal.find( '.modal-next' ).addClass( 'm-disabled' );
						}
						else {
							object.modal.find( '.modal-next' ).removeClass( 'm-disabled' );
						}
					}
					else {
						object.modal.find( '.modal-prev, .modal-next' ).hide();
					}

					// CLICK OUTSIDE TO CLOSE
					/*
					object.modal.find( '.modal-box' ).unbind( 'clickoutside' ).bind( 'clickoutside', function(){
						object.modalClose();
					});
					*/

					// TRIGGER modalOpened EVENT
					$.event.trigger({
						type: 'modalOpened',
						message: 'Modal is opened.',
						time: new Date()
					});

				},

				// LOAD CONTENT
				modalLoadContent: function( element, url, ajaxSelector, callback ){

					var object = this;

					// LOAD TITLE
					object.modal.find( '.modal-title' ).load( url + ' #page-header h1', function( response, status, xhr ){
						object.modal.find( '.modal-title h1' ).wrapInner( '<a href="' + url + '"></a>' );
					});

					// LOAD CONTENT
					element.load( url + ajaxSelector, function( response, status, xhr ){
						element.last().lsvrImagesLoaded(function(){

							// ERROR LOADING CONTENT
							if ( status === 'error' ) {
								this.modalBoxInner.html( '' ).append( '<p class="c-alert-message m-warning"><i class="ico fa fa-exclamation-circle"></i> Failed to load reservation form, please try again later.</p>' );
							}
							// CALLBACK FUNCTION
							else if ( typeof callback == 'function' ) {
								callback.call();
							}

						});
					});

				},

				// CHANGE CONTENT
				modalChange: function( dir ){

					var object = this,
						index = object.index,
						galleryItems = object.navigationObject.galleryItems,
						linkSelector = object.navigationObject.linkSelector,
						prevBtn = object.modal.find( '.modal-prev' ),
						nextBtn = object.modal.find( '.modal-next' ),
						itemCount = galleryItems.length,
						prevLink = index > 0 ? galleryItems.eq( index - 1 ).find( linkSelector ).first() : false,
						nextLink = index < itemCount - 1 ? galleryItems.eq( index + 1 ).find( linkSelector ).first() : false;

					prevBtn.addClass( 'm-loading' );
					nextBtn.addClass( 'm-loading' );

					object.modal.find( '.modal-box-inner' ).after( '<div class="modal-box-inner" style="display: none;"></div>' );
					var	activeModalBoxInner = object.modal.find( '.modal-box-inner' ).first(),
						newModalBoxInner = activeModalBoxInner.next( '.modal-box-inner' ),
						url = false,
						ajaxSelector = false;

					// GET DIRECTION
					if ( dir === 'prev' && prevLink ) {
						object.index = object.index - 1;
						url = prevLink.attr( 'href' );
						ajaxSelector = prevLink.data( 'ajax-selector' ) ? ' ' + prevLink.data( 'ajax-selector' ) : '';
					}
					else if ( nextLink ) {
						object.index = object.index + 1;
						url = nextLink.attr( 'href' );
						ajaxSelector = nextLink.data( 'ajax-selector' ) ? ' ' + nextLink.data( 'ajax-selector' ) : '';
					}

					// LOAD NEW CONTENT
					if ( url && ajaxSelector ) {
						activeModalBoxInner.fadeTo( 150, 0.2 );
						object.modalLoadContent( newModalBoxInner, url, ajaxSelector, function(){
							activeModalBoxInner.fadeOut( 150, function(){

								// REMOVE OLD / SHOW NEW
								activeModalBoxInner.remove();
								newModalBoxInner.fadeIn( 150 );

								prevBtn.removeClass( 'm-loading' );
								nextBtn.removeClass( 'm-loading' );

								if ( object.index === 0 ) {
									prevBtn.addClass( 'm-disabled' );
								}
								else {
									prevBtn.removeClass( 'm-disabled' );
								}
								if ( object.index === itemCount - 1 ) {
									nextBtn.addClass( 'm-disabled' );
								}
								else {
									nextBtn.removeClass( 'm-disabled' );
								}

								// CALLBACK
								if ( object.callback ) {
									object.callback.call();
								}

							});
						});
					}

				},

				// CLOSE MODAL
				modalClose: function(){

					var object = this;

					object.modal.fadeOut( 300, function(){
						object.modal.find( '.modal-loading' ).show();
						object.modal.find( '.modal-box' ).removeClass( 'animated fadeInDown' ).unbind( 'clickoutside' ).hide();
						$( 'html' ).removeClass( 'm-modal-active' );
					});
					// TRIGGER modalClosed EVENT
					$.event.trigger({
						type: 'modalClosed',
						message: 'Modal is closed.',
						time: new Date()
					});

				},

			};
			$( 'body' ).data( 'lsvrAjaxModalObject', lsvrAjaxModalObject );

		}};
	}
	$(document).ready(function(){
		$.fn.lsvrAjaxModal();
	});

	// ACTION PLUGIN
	if ( ! $.fn.lsvrOpenAjaxModal ) {
		$.fn.lsvrOpenAjaxModal = function( callback, navigationObject ){
		// REQUIRED PLUGINS
		if ( $.fn.lsvrAjaxModal && $.fn.lsvrImagesLoaded ) {

			var	$this = $(this),
				url = $this.attr( 'href' ),
				ajaxSelector = $this.data( 'ajax-selector' ) ? ' ' + $this.data( 'ajax-selector' ) : '',
				callback = typeof callback == 'function' ? callback : false,
				modalObj = $( 'body' ).data( 'lsvrAjaxModalObject' ) ? $( 'body' ).data( 'lsvrAjaxModalObject' ) : false,
				navigationObject = typeof navigationObject !== 'undefined' ? navigationObject : false;

			if ( modalObj ) {

				// OPEN MODAL ON CLICK
				$this.unbind( 'click' );
				$this.click(function(){

					modalObj.navigationObject = navigationObject;
					modalObj.url = url;
					modalObj.ajaxSelector = ajaxSelector;
					modalObj.callback = callback;
					modalObj.modalOpen();
					return false;

				});

			}

		}};
	}

	/* -------------------------------------------------------------------------
		COUNTER
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrCounter ) {
		$.fn.lsvrCounter = function() {
			if ( mediaQueryBreakpoint > 1199 ) {

				var $this = $(this),
					duration = $this.data( 'duration' ) ? parseInt( $this.data( 'duration' ) ) : 1000,
					valueEl = $this.find( '.counter-value' ),
					value = parseInt( valueEl.text() ),
					speed = duration / value;

				if ( ! isNaN( duration ) && ! isNaN( value ) ) {

					// RESET
					valueEl.text(0);

					// START AT IN VIEW
					$this.one( 'inview', function(){
						var currentVal = 0,
						counterAction = function(){
							currentVal++;
							valueEl.text( currentVal );
						};
						for ( var i = 0; i < value; i++ ) {
							setTimeout( counterAction, speed * i );
						}
					});

				}

			}
		};
	}

	/* -------------------------------------------------------------------------
		DRIBBBLE FEED
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrDribbbleFeed ) {
		$.fn.lsvrDribbbleFeed = function() {
		// REQUIRED PLUGINS
		if ( $.fn.lsvrImagesLoaded && $.jribbble ) {

			if ( $(this).find( '.widget-feed' ).length < 1 ) {
				$(this).append( '<div class="widget-feed"></div>' );
			}
			var $self = $(this),
			feed = $(this).find( '.widget-feed' ),
			feedId = $(this).data( 'id' ),
			feedLimit = $(this).data( 'limit' );

			if ( isNaN( feedLimit ) || feedLimit < 1 ) {
				feedLimit = 1;
			}
			feed.html( '<ul class="image-list clearfix"></ul>' );

			// GET THE FEED
			$.jribbble.getShotsByPlayerId( feedId, function ( playerShots ) {

				// get number of images to be shown
				var numberOfImages = feedLimit;
				if ( playerShots.shots.length < feedLimit ){
					numberOfImages = playerShots.shots.length;
				}

				// INSERT ITEMS
				var i;
				for( i = 0; i < numberOfImages; i++ ) {
					feed.find( 'ul' ).append( '<li class="image-list-item"><a href="' + playerShots.shots[i].url + '" style="background-image: url(' + playerShots.shots[i].image_teaser_url + ');" title="' + playerShots.shots[i].title + '" rel="external"><img src="' + playerShots.shots[i].image_teaser_url + '" alt="' + playerShots.shots[i].title + '"></a></li>' );
				}
				// IMAGES LOADED
				$self.lsvrImagesLoaded(function(){
					$self.find( '.c-loading-anim' ).fadeOut( 300, function(){
						$self.find( '.widget-feed' ).fadeIn( 300, function(){
							$self.removeClass( 'loading' );
							$self.find( '.image-list > li' ).each(function(){
								var item = $(this),
								itemIndex = $(this).index();
								setTimeout( function(){
									item.fadeIn( 300 );
								}, itemIndex * 100 );
							});
						});
					});
				});

			}, { page: 1, per_page: feedLimit } );

		}};
	}

	/* -------------------------------------------------------------------------
		FIELD VALIDATION
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrIsFieldValid ) {
		$.fn.lsvrIsFieldValid = function(){

			var field = $(this),
			value = field.val(),
			placeholder = field.data( 'placeholder' ) ? field.data( 'placeholder' ) : false,
			valid = false,
			emailValid = function( email ) {
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			};

			if ( value.trim() !== '' && ! ( placeholder && value === placeholder ) ) {

				// EMAIL FIELDS
				if ( field.hasClass( 'm-email' ) ) {
					if ( ! emailValid( value ) ) {
						field.addClass( 'm-error' );
					}
					else {
						field.removeClass( 'm-error' );
						valid = true;
					}
				}

				// SELECT FIELD
				else if ( field.prop( 'tagName' ).toLowerCase() === 'select' ) {
					if ( value === null ) {
						field.addClass( 'm-error' );
					}
					else {
						field.removeClass( 'm-error' );
						valid = true;
					}
				}

				// DEFAULT FIELD
				else {
					field.removeClass( 'm-error' );
					valid = true;
				}

			}
			else {

				field.addClass( 'm-error' );

				// REVALIDATE ON CHANGE
				field.change(function(){
					field.lsvrIsFieldValid();
				});

			}

			return valid;

		};
	}

	/* -------------------------------------------------------------------------
		FLICKR FEED
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrFlickrFeed ) {
		$.fn.lsvrFlickrFeed = function() {
		// REQUIRED PLUGINS
		if ( $.fn.lsvrImagesLoaded ) {

			if ( $(this).find( '.widget-feed' ).length < 1 ) {
				$(this).append( '<div class="widget-feed"></div>' );
			}
			var $self = $(this),
			feed = $(this).find( '.widget-feed' ),
			feedId = $(this).data( 'id' ),
			feedLimit = $(this).data( 'limit' );

			if ( isNaN( feedLimit ) || feedLimit < 1 ) {
				feedLimit = 1;
			}
			feed.html( '<ul class="image-list clearfix"></ul>' );

			// GET THE FEED
			$.getJSON( 'http://api.flickr.com/services/feeds/photos_public.gne?id=' + feedId + '&lang=en-us&format=json&jsoncallback=?', function(data){

				// get number of images to be shown
				var numberOfImages = feedLimit;
				if ( data.items.length < feedLimit ) {
					numberOfImages = data.items.length;
				}

				// INSERT ITEMS
				var i;
				for ( i = 0; i < numberOfImages; i++ ){
					feed.find( 'ul' ).append( '<li class="image-list-item"><a href="' + data.items[i].link + '" style="background-image: url(' + data.items[i].media.m + ');" rel="external"><img class="image-list-thumb" src="' + data.items[i].media.m + '" alt="' + data.items[i].title + '" style="display: none;"></a></li>' );
				}

				// IMAGES LOADED
				$self.lsvrImagesLoaded(function(){
					$self.find( '.c-loading-anim' ).fadeOut( 300, function(){
						$self.find( '.widget-feed' ).fadeIn( 300, function(){
							$self.removeClass( 'loading' );
							$self.find( '.image-list > li' ).each(function(){
								var item = $(this),
								itemIndex = $(this).index();
								setTimeout( function(){
									item.fadeIn( 300 );
								}, itemIndex * 100 );
							});
						});
					});
				});

			});

		}};
	}

	/* -------------------------------------------------------------------------
		FLUID VIDEOS
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrFluidEmbedVideo ) {
		$.fn.lsvrFluidEmbedVideo = function(){

			var $self = $(this),
			allVideos;

			var reloadFluidVideos = function(){
				// Resize all videos according to their own aspect ratio
				allVideos.each(function() {
					var el = $(this);
					var elContainer = el.parents( '.embed-video' );
					var newWidth = elContainer.width();
					el.width( newWidth ).height( newWidth * el.data( 'aspectRatio' ) );
				});
				$.event.trigger({
					type: 'fluidVideosReloaded',
					message: 'Fluid videos reloaded.',
					time: new Date()
				});
			};

			var generateFluidVideos = function(){
				// Find all videos
				allVideos = $self.find( '.embed-video iframe' );
				// The element that is fluid width
				//$fluidEl = $('.embed-video').first();
				// Figure out and save aspect ratio for each video
				allVideos.each(function() {
					$(this).data( 'aspectRatio', this.height / this.width )
						// and remove the hard coded width/height
						.removeAttr( 'height' )
						.removeAttr( 'width' );
				});
				reloadFluidVideos();
			};

			if ( $self.find( '.embed-video' ).length > 0 ) {
				generateFluidVideos();
				$(window).resize(function(){
					reloadFluidVideos();
				});
			}

		};
	}

	/* -------------------------------------------------------------------------
		FORM VALIDATION
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrIsFormValid ) {
		$.fn.lsvrIsFormValid = function() {
		// REQUIRED PLUGINS
		if ( $.fn.lsvrIsFieldValid ) {

			// TRIM FIX FOR IE
			if ( typeof String.prototype.trim !== 'function' ) {
				String.prototype.trim = function() {
					return this.replace(/^\s+|\s+$/g, '');
				};
			}

			var form = $(this),
			formValid = true;

			// CHECK REQUIRED FIELDS
			form.find( 'input.m-required, textarea.m-required, select.m-required' ).each(function(){
				formValid = ! $(this).lsvrIsFieldValid() ? false : formValid;
			});

			// CHECK REQUIRED ONE FIELDS
			var requireOneValid = false;
			form.find( 'input.m-required-one, textarea.m-required-one, select.m-required-one' ).each(function(){
				if ( $(this).lsvrIsFieldValid() ) {
					requireOneValid = true;
					form.find( 'input.m-required-one, textarea.m-required-one, select.m-required-one' ).removeClass( 'm-error' );
				}
			});
			if ( form.find( '.m-require-one' ).length > 0 && ! requireOneValid ) {
				formValid = false;
			}
			if ( formValid ) {
				form.find( 'input.m-required-one, textarea.m-required-one, select.m-required-one' ).removeClass( 'm-error' );
			}

			form.find( '.m-error' ).first().focus();

			return formValid;

		}};
	}

	/* -------------------------------------------------------------------------
		IMAGES LOADED
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrImagesLoaded ) {
		$.fn.lsvrImagesLoaded = function( func ) {
			if ( $.isFunction( func ) ) {

				var images = $(this).find( 'img' ),
				loadedImages = 0,
				count = images.length;

				if ( count > 0 ) {
					images.one( 'load', function(){
						loadedImages++;
						if ( loadedImages === count ){
							func.call();
						}
					}).each(function() {
						if ( this.complete ) { $(this).load(); }
					});
				}
				else {
					func.call();
				}

			}
		};
	}

	/* -------------------------------------------------------------------------
		INPUT PLACEHOLDER
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrInputPlaceholder ) {
		$.fn.lsvrInputPlaceholder = function() {

			var $this = $(this),
			placeholder = $this.data( 'placeholder' );

			// RESET
			if ( $this.val() === '' ) {
				$this.val( placeholder );
			}
			if ( $this.val() === placeholder ) {
				$this.addClass( 'm-has-placeholder' );
			}
			// FOCUS
			$this.focus(function(){
				if ( $this.val() === placeholder ) {
					$this.val( '' ).removeClass( 'm-has-placeholder' );
				}
			});
			// BLUR
			$this.blur(function(){
				if ( $this.val() === '' ) {
					$this.val( placeholder ).addClass( 'm-has-placeholder' );
				}
			});

		};
	}

	/* -------------------------------------------------------------------------
		INSTAGRAM FEED
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrInstagramFeed ) {
		$.fn.lsvrInstagramFeed = function() {
		// REQUIRED PLUGINS
		if ( $.fn.lsvrImagesLoaded && $.fn.embedagram ) {

			if ( $(this).find( '.widget-feed' ).length < 1 ) {
				$(this).append( '<div class="widget-feed"></div>' );
			}
			var $self = $(this),
			feed = $(this).find( '.widget-feed' ),
			feedId = $(this).data( 'id' ),
			feedLimit = $(this).data( 'limit' );

			if ( isNaN( feedLimit ) || feedLimit < 1 ) {
				feedLimit = 1;
			}
			feed.html( '<ul class="image-list clearfix"></ul>' );

			// GET THE FEED
			feed.find( 'ul.image-list' ).embedagram({
				instagram_id: feedId,
				limit: feedLimit,
				success: function(){
					feed.find( 'a' ).each(function(){
						$(this).css( 'background-image', 'url(' + $(this).find( 'img' ).attr( 'src' ) + ')' );
						if ( $(this).find( 'img' ).attr( 'title' ) ) {
							$(this).find( 'img' ).removeAttr( 'title' );
						}
					});

					// IMAGES LOADED
					$self.lsvrImagesLoaded(function(){
						$self.find( '.c-loading-anim' ).fadeOut( 300, function(){
							$self.find( '.widget-feed' ).fadeIn( 300, function(){
								$self.removeClass( 'loading' );
								$self.find( '.image-list > li' ).each(function(){
									var item = $(this),
									itemIndex = $(this).index();
									setTimeout( function(){
										item.fadeIn( 300 );
									}, itemIndex * 100 );
								});
							});
						});
					});

				}
			});

		}};
	}

	/* ---------------------------------------------------------------------
		INVIEW ANIMATION
	--------------------------------------------------------------------- */

	if ( ! $.fn.lsvrInviewAnimation ) {
		$.fn.lsvrInviewAnimation = function() {

			var $this = $(this),
				animation = $(this).data( 'inview-anim' );
			$this.one( 'inview', function(){
				setTimeout(function(){
					$this.removeClass( 'visibility-hidden' );
					$this.addClass( 'animated ' + animation );
				}, 300);
			});

		};
	}

	/* -------------------------------------------------------------------------
		LIGHTBOX
	------------------------------------------------------------------------- */

	// LIGHTBOX SETUP
	if ( ! $.fn.magnificPopupSetup ) {
		$.fn.magnificPopupSetup = function(){
		// REQUIRED PLUGINS
		if ( $.fn.magnificPopup ) {

			$.extend( true, $.magnificPopup.defaults, {
				tClose: 'Close (Esc)',
				tLoading: 'Loading...',
				gallery: {
					tPrev: 'Previous (Left arrow key)', // Alt text on left arrow
					tNext: 'Next (Right arrow key)', // Alt text on right arrow
					tCounter: '%curr% / %total%' // Markup for "1 of 7" counter
				},
				image: {
					tError: '<a href="%url%">The image</a> could not be loaded.' // Error message when image could not be loaded
				},
				ajax: {
					tError: '<a href="%url%">The content</a> could not be loaded.' // Error message when ajax request failed
				}
			});

		}};
	}
	if ( $.fn.magnificPopupSetup ) {
		$.fn.magnificPopupSetup();
	}

	if ( ! $.fn.lsvrInitLightboxes ) {
		$.fn.lsvrInitLightboxes = function(){
		// REQUIRED PLUGINS
		if ( $.fn.magnificPopup ) {

			// IMAGES
			$(this).find( 'a.lightbox' ).magnificPopup({
				type: 'image',
				removalDelay: 300,
				mainClass: 'mfp-fade',
				gallery: {
					enabled: true
				}
			});

			// VIDEOS
			$(this).find( 'a.lightbox-video' ).magnificPopup({
				type: 'iframe',
				removalDelay: 300,
				mainClass: 'mfp-fade',
				gallery: {
					enabled: true
				}
			});

		}};
	}

	/* -------------------------------------------------------------------------
		LOAD HIRES IMAGES
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrLoadHiresImages ) {
		$.fn.lsvrLoadHiresImages = function() {
			if ( window.devicePixelRatio > 1 ) {
				$(this).find( 'img[data-hires]' ).each(function(){
					$(this).attr( 'src', $(this).data( 'hires' ) );
				});
			}
		};
	}

	/* -------------------------------------------------------------------------
		GOOGLE MAP
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrGoogleMap ) {
		$.fn.lsvrGoogleMap = function( latitude, longitude ) {

			var $this = $(this),
				zoom = $this.data( 'zoom' ) ? $this.data( 'zoom' ) : 10,
				enableMouseWheel = $this.data( 'enable-mousewheel' ) && String( $this.data( 'enable-mousewheel' ) ) === 'true' ? true : false,
				mapType = $this.data( 'maptype' ) ? $this.data( 'maptype' ) : 'SATELLITE';

			switch ( mapType ) {
				case 'ROADMAP':
					mapType = google.maps.MapTypeId.ROADMAP;
					break;
				case 'TERRAIN':
					mapType = google.maps.MapTypeId.TERRAIN;
					break;
				case 'HYBRID':
					mapType = google.maps.MapTypeId.HYBRID;
					break;
				default:
					mapType = google.maps.MapTypeId.SATELLITE;
			}

			$(this).gmap3({
				map: {
					options: {
						center: [latitude, longitude],
						zoom: zoom,
						mapTypeId: mapType,
						mapTypeControl: true,
						navigationControl: true,
						zoomControl: true,
						panControl: true,
						scrollwheel: enableMouseWheel,
						streetViewControl: true
					}
				},
				marker: {
					latLng:[latitude, longitude]
				}
			});

		};
	}

	if ( ! $.fn.lsvrGoogleMapsLoaded ) {
		$.fn.lsvrGoogleMapsLoaded = function() {
			$( '.c-gmap' ).each(function(){

				// OPTIONS
				var $this = $(this),
					latitude = $this.data( 'latitude' ) ? $this.data( 'latitude' ) : false,
					longitude = $this.data( 'longitude' ) ? $this.data( 'longitude' ) : false,
					address = $this.data( 'address' ) ? $this.data( 'address' ) : false;

				// GET LATITUDE AND LONGITUDE FROM ADDRESS
				if ( address ) {

					var geocoder = new google.maps.Geocoder();
					geocoder.geocode( { 'address': address }, function(results, status) {
						if ( status == google.maps.GeocoderStatus.OK ) {
							latitude = results[0].geometry.location.lat();
							longitude = results[0].geometry.location.lng();
							$this.lsvrGoogleMap( latitude, longitude );
						}
						else if ( latitude && longitude ) {
							$this.lsvrGoogleMap( latitude, longitude );
						}
					});

				}
				// OR USE LATITUDE & LANGITUDE FROM ATTRIBUTES
				else if ( latitude && longitude ) {
					$this.lsvrGoogleMap( latitude, longitude );
				}

			});
		};
	}

	if ( ! $.fn.lsvrLoadGoogleMaps ) {
		// REQUIRED PLUGINS
		if ( $.fn.lsvrGoogleMapsLoaded && $.fn.lsvrGoogleMap && $.fn.gmap3 ) {
			$.fn.lsvrLoadGoogleMaps = function() {

				// INSERT GOOGLE API JS
				var script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=$.fn.lsvrGoogleMapsLoaded';
				document.body.appendChild( script );

			};
		}
	}

	/* -------------------------------------------------------------------------
		CHECKBOX INPUT
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrCheckboxInput ) {
		$.fn.lsvrCheckboxInput = function(){

			var input = $(this).removeClass( 'checkbox-input' ).hide(),
				wrapped = false,
				$this, label;

			if ( input.parent().is( 'label' ) ) {
				label = input.parent();
				label.wrap( '<span class="checkbox-input"></span>' );
				$this = label.parent();
			}
			else {
				input.wrap( '<span class="checkbox-input"></span>' );
				$this = input.parent();
				label = $this.next( 'label' ).length > 0 ? $this.next( 'label' ) : $this.prev( 'label' );
				label.appendTo( $this );
			}

			// INIT
			if ( input.is( ':checked' ) ) {
				$this.addClass( 'm-checked' );
			}

			// CLICK
			input.click(function(){
				$this.toggleClass( 'm-checked' );
				input.trigger( 'change' );
			});

		};
	}

	/* -------------------------------------------------------------------------
		MAILCHIMP SUBSCRIBE FORM
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrMailchimpSubscribeForm ) {
		$.fn.lsvrMailchimpSubscribeForm = function(){
		// REQUIRED PLUGINS
		if ( $.fn.lsvrIsFormValid ) {

			var form = $(this),
			submitBtn = form.find( '.submit-btn' );

			form.submit(function(e){
				e.preventDefault();
				if ( ! form.hasClass( 'm-loading' ) ) {

					// FORM IS VALID
					if ( form.lsvrIsFormValid() ) {

						form.find( 'p.c-alert-message.m-warning.m-validation-error' ).slideUp(300);
						form.addClass( 'm-loading' );
						submitBtn.attr( 'data-label', submitBtn.text() ).text( submitBtn.data( 'loading-label' ) );

						// SEND AJAX REQUEST
						$.ajax({
							type: form.attr( 'method' ),
							url: form.attr( 'action' ),
							data: form.serialize(),
							cache : false,
							dataType : 'json',
							contentType: "application/json; charset=utf-8",
							// WAIT FOR RESPONSE
							success: function( data ){

								if ( data.result === 'success' ) {
									form.find( '.c-alert-message' ).hide();
									form.find( '.c-alert-message.m-success' ).append( '<br>' + data.msg ).slideDown(300);
									form.find( '.form-fields' ).slideUp(300);
								}
								else {
									form.find( '.c-alert-message.m-validation-error' ).slideUp(300);
									form.find( '.c-alert-message.m-request-error' ).slideDown(300);
								}

								form.removeClass( 'm-loading' );
								submitBtn.text( submitBtn.attr( 'data-label' ) );

							},
							error: function(){

								form.find( '.m-alert-message.m-validation-error' ).slideUp(300);
								form.find( '.m-alert-message.m-request-error' ).slideDown(300);
								form.removeClass( 'loading' );
								submitBtn.text( submitBtn.attr( 'data-label' ) );

							}
						});

					}

					//  FORM IS INVALID
					else {
						form.find( 'p.c-alert-message.m-warning.m-validation-error' ).slideDown(300);
						return false;
					}

				}
			});

		}};
	}

	/* -------------------------------------------------------------------------
		MEDIA QUERY BREAKPOINT
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrGetMediaQueryBreakpoint ) {
		$.fn.lsvrGetMediaQueryBreakpoint = function() {

			if ( $( '#media-query-breakpoint' ).length < 1 ) {
				$( 'body' ).append( '<span id="media-query-breakpoint" style="display: none;"></span>' );
			}
			var value = $( '#media-query-breakpoint' ).css( 'font-family' );
			if ( typeof value !== 'undefined' ) {
				value = value.replace( "\"", "" ).replace( "\"", "" ).replace( "\'", "" ).replace( "\'", "" );
			}
			if ( isNaN( value ) ) {
				return $(window).width();
			}
			else {
				return parseInt( value );
			}

		};
	}

	/* -------------------------------------------------------------------------
		PROGRESS BAR
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrProgressBar ) {
		$.fn.lsvrProgressBar = function(){

			var $this = $(this),
			percentage = $this.data( 'percentage' ) ? parseInt( $this.data( 'percentage' ) ) : 100,
			inner = $this.find( '> span' );

			$this.one( 'inview', function(){
				inner.css( 'width', percentage + '%' );
			});

		};
	}

	/* -------------------------------------------------------------------------
		RADIO INPUT
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrRadioInput ) {
		$.fn.lsvrRadioInput = function(){

			var input = $(this).removeClass( 'radio-input' ).hide(),
				wrapped = false,
				$this, label;

			if ( input.parent().is( 'label' ) ) {
				label = input.parent();
				label.wrap( '<span class="radio-input"></span>' );
				$this = label.parent();
			}
			else {
				input.wrap( '<span class="radio-input"></span>' );
				$this = input.parent();
				label = $this.next( 'label' ).length > 0 ? $this.next( 'label' ) : $this.prev( 'label' );
				label.appendTo( $this );
			}

			// INIT
			if ( input.is( ':checked' ) ) {
				$this.addClass( 'm-checked' );
			}

			// CLICK
			input.click(function(){

				// RADIO
				$( 'input[name="' + input.attr( 'name' ) + '"]' ).each(function(){
					$(this).parents( '.radio-input' ).removeClass( 'm-checked' );
				});
				$this.addClass( 'm-checked' );

			});

		};
	}

	/* -------------------------------------------------------------------------
		SCROLLSPY
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrScrollspy ) {
		$.fn.lsvrScrollspy = function( options ){

			var $this = $(this),
				defaults = {
					tolerance: 0,
					onEnter: false
				};
			options = $.extend( defaults, options );

			$( window ).scroll(function(){

				var documentTop = $(window).scrollTop(),
					elementTop = $this.offset().top,
					elementBottom = elementTop + $this.height();

				if ( ( elementTop <= documentTop + options.tolerance ) && ( elementBottom >= documentTop + options.tolerance ) ) {
					if ( ! $this.hasClass( 'scrolledin' ) ) {

						$( '.scrolledin' ).removeClass( 'scrolledin' );
						$this.addClass( 'scrolledin' );
						if ( options.onEnter && $.isFunction( options.onEnter ) ) {
							options.onEnter.call();
						}

					}
				}
				else {
					$this.removeClass( 'scrolledin' );
				}

			});

		};
	}

	/* -------------------------------------------------------------------------
		SELECTBOX INPUT
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrSelectboxInput ) {
		$.fn.lsvrSelectboxInput = function(){

			var $this = $(this);
			$this.wrap( '<div class="selectbox-input"></div>' );
			$this = $this.parent();
			var input = $this.find( 'select' ),
				fakeSelectHtml = '';
			input.removeClass( 'selectbox-input' );
			var value = input.val(),
				defaultValue = input.find( 'option[value="' + value + '"]' ).text() ? input.find( 'option[value="' + value + '"]' ).text() : input.find( 'option' ).first().text();

			// COPY CLASSES
			if ( input.hasClass( 'm-small' ) ) {
				$this.addClass( 'm-small' );
			}
			if ( input.hasClass( 'm-type-2' ) ) {
				$this.addClass( 'm-type-2' );
			}

			// CREATE ELEMENTS
			input.hide();
			$this.append( '<button type="button" class="toggle"><span>' + defaultValue + '</span></button>' );
			fakeSelectHtml = '<ul class="fake-selectbox" style="display: none;">';
			input.find( 'option' ).each(function(){
				fakeSelectHtml += '<li data-value="' + $(this).attr( 'value' ) + '">' + $(this).text() + '</li>';
			});
			fakeSelectHtml += '</ul>';
			$this.append( fakeSelectHtml );
			var toggle = $this.find( '.toggle' ),
			fakeSelect = $this.find( '.fake-selectbox' );

			// TOGGLE
			toggle.click(function(){
				fakeSelect.slideToggle(150);
				toggle.toggleClass( 'm-active' );
				$this.unbind( 'clickoutside' );
				if ( toggle.hasClass( 'm-active' ) ) {
					$this.bind( 'clickoutside', function(event){
						fakeSelect.slideUp(150);
						toggle.removeClass( 'm-active' );
						$this.unbind( 'clickoutside' );
					});
				}
			});

			// FAKE SELECTBOX CLICK
			fakeSelect.find( 'li' ).each(function(){
				$(this).click(function(){
					toggle.removeClass( 'm-active' ).find( 'span' ).text( $(this).text() );
					fakeSelect.slideUp(150);
					input.val( $(this).attr( 'data-value' ) );
					input.trigger( 'change' );
				});
			});

		};
	}
	/* -------------------------------------------------------------------------
		SLIDER
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrSlider ) {
		$.fn.lsvrSlider = function(){
		// REQUIRED PLUGINS
		if ( $.fn.owlCarousel ) {

			var slider = $(this),
			slideList = slider.find( '.slide-list' ),
			slideCount = slideList.find( '> .slide' ).length,
			slides = slideList.find( '> .slide' ),
			interval = slider.data( 'interval' ) ? parseInt( slider.data( 'interval' ) ) : false;

			if ( slideCount > 1 ) {

				// CREATE CAROUSEL
				slideList.owlCarousel({
					autoPlay: interval,
					slideSpeed: 300,
					pagination: false,
					paginationSpeed : 400,
					singleItem: true,
					addClassActive: true,
					autoHeight: false,
					beforeMove: function(){
						// REFRESH INDICATOR
						if ( interval ) {
							slider.find( '.slider-indicator > span' ).stop( 0, 0 );
						}
					},
					afterMove: function(){
						// REFRESH INDICATOR
						if ( interval && mediaQueryBreakpoint > 991 ) {
							slider.find( '.slider-indicator > span' ).css( 'width', 0 );
							if ( ! slider.hasClass( 'm-paused' ) ) {
								slider.find( '.slider-indicator > span' ).stop( 0, 0 ).animate({ width : "100%" }, interval );
							}
						}
					}
				});

				// CREATE NAVIGATION
				slider.append( '<button type="button" class="nav-prev"><i class="fa fa-chevron-left"></i></button><button type="button" class="nav-next"><i class="fa fa-chevron-right"></i></button>' );
				var btnPrev = slider.find( '.nav-prev' ),
					btnNext = slider.find( '.nav-next' );

				btnPrev.click(function(){
					slideList.trigger( 'owl.prev' );
				});
				btnNext.click(function(){
					slideList.trigger( 'owl.next' );
				});

				// AUTO SLIDE INDICATOR
				if ( interval ) {

					// CREATE
					slider.addClass( 'm-has-indicator' );
					slider.append( '<div class="slider-indicator"><span></span></div>' );

					// INITIAL ANIMATION
					slider.find( '.slider-indicator > span' ).animate({
						width : "100%"
					}, interval, 'linear' );

					// PAUSE
					var sliderPause = function(){
						slider.addClass( 'm-paused' );
						slideList.trigger( 'owl.stop' );
						slider.find( '.slider-indicator > span' ).stop( 0, 0 );
					};
					var sliderResume = function(){
						slider.removeClass( 'm-paused' );
						slideList.trigger( 'owl.play', interval );
						slider.find( '.slider-indicator > span' ).stop( 0, 0 ).animate({
							width : "100%"
						}, interval, 'linear' );
					};

					slider.hover(function(){
						sliderPause();
					}, function(){
						sliderResume();
					});

					// STOP ON SMALLER RESOLUTIONS
					$( document ).on( 'screenTransition', function(){
						if ( mediaQueryBreakpoint <= 991 ) {
							sliderPause();
						}
					});
					if ( mediaQueryBreakpoint <= 991 ) {
						sliderPause();
					}

				}

			}

		}};
	}

	/* -------------------------------------------------------------------------
		TABS
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrTabs ) {
		$.fn.lsvrTabs = function(){

			var $this = $(this),
			tabs = $this.find( '.tab-list > li' ),
			contents = $this.find( '.content-list > li' );

			tabs.click(function(){
				if ( ! $(this).hasClass( 'm-active' ) ) {
					var index = $(this).index();
					tabs.filter( '.m-active' ).removeClass( 'm-active' );
					$(this).addClass( 'm-active' );
					contents.filter( ':visible' ).slideUp( 300, function(){
						$(this).removeClass( 'm-active' );
					});
					contents.filter( ':eq(' + index + ')' ).slideDown(300).addClass( 'm-active' );
				}
			});

		};
	}

	/* -------------------------------------------------------------------------
		TWITTER FEED
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrTwitterFeed ) {
		$.fn.lsvrTwitterFeed = function() {
		// REQUIRED PLUGINS
		if ( $.fn.tweet ) {

			var $this = $(this),
			feedId = $this.data( 'id' ),
			feedLimit = parseInt( $this.data( 'limit' ) ),
			feedEl = $this.find( '.twitter-feed' );

			// TWEETS LOADED
			feedEl.bind( 'loaded', function(){
				if ( feedLimit > 1 && $this.hasClass( 'm-paginated' ) && $.fn.owlCarousel ) {

					var interval = $this.data( 'interval' ) ? parseInt( $this.data( 'interval' ) ) > 0 : false;
					$this.find( '.tweet_list' ).owlCarousel({
						autoPlay: interval,
						slideSpeed: 300,
						pagination: false,
						paginationSpeed : 400,
						singleItem: true,
						autoHeight: true,
						addClassActive: true
					});
					var carousel = $this.find( '.tweet_list' ).data( 'owlCarousel' );
					$this.append( '<div class="clearfix"><div class="nav-buttons"><button class="btn-prev" type="button"><i class="fa fa-angle-left"></i></button><button class="btn-next" type="button"><i class="fa fa-angle-right"></i></button></div></div>' );

					// PREV TWEET
					$this.find( '.btn-prev' ).click(function(){
						$this.find( '.tweet_list' ).trigger( 'owl.prev' );
					});

					// NEXT TWEET
					$this.find( '.btn-next' ).click(function(){
						$this.find( '.tweet_list' ).trigger( 'owl.next' );
					});

				}
			});

			// INIT TWEET JS
			feedEl.tweet({
				username: feedId,
				modpath: './library/twitter/',
				count: feedLimit,
				loading_text: '<span class="c-loading-anim"><span></span></span>'
			});

		}};
	}


/* -----------------------------------------------------------------------------

	EVENTS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		SCREEN SIZE TRANSITION
	------------------------------------------------------------------------- */

	var mediaQueryBreakpoint;
	if ( $.fn.lsvrGetMediaQueryBreakpoint ) {
		mediaQueryBreakpoint = $.fn.lsvrGetMediaQueryBreakpoint();
		$(window).resize(function(){
			if ( $.fn.lsvrGetMediaQueryBreakpoint() !== mediaQueryBreakpoint ) {
				mediaQueryBreakpoint = $.fn.lsvrGetMediaQueryBreakpoint();
				$.event.trigger({
					type: 'screenTransition',
					message: 'Screen transition completed.',
					time: new Date()
				});
			}
		});
	}
	else {
		mediaQueryBreakpoint = $(document).width();
	}

})(jQuery);