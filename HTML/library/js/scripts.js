/* -----------------------------------------------------------------------------

	TABLE OF CONTENTS

	1.) General
	2.) Components
	3.) Header
	4.) Core
	5.) Widgets
	6.) Main Sidebar
	7.) Other
	8.) Style Switcher

----------------------------------------------------------------------------- */

(function($){ "use strict";
$(document).ready(function(){

/* -----------------------------------------------------------------------------

	1.) GENERAL

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		AJAX FORMS
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrAjaxForm ) {
		$( 'form.m-ajax-form' ).each(function(){
			$(this).lsvrAjaxForm();
		});
	}

	/* -------------------------------------------------------------------------
		AJAX MODAL
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrOpenAjaxModal ) {
		$( '.c-gallery a.m-open-ajax-modal' ).each(function(){
			$(this).lsvrOpenAjaxModal();
		});
	}

	/* -------------------------------------------------------------------------
		FLUID VIDEOS
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrFluidEmbedVideo ){
		$( 'body' ).lsvrFluidEmbedVideo();
	}

	/* -------------------------------------------------------------------------
		FORMS
	------------------------------------------------------------------------- */

	// CHECKBOX INPUTS
	if ( $.fn.lsvrCheckboxInput ) {
		$( '.checkbox-input' ).each(function(){
			$(this).lsvrCheckboxInput();
		});
	}

	// RADIO INPUTS
	if ( $.fn.lsvrRadioInput ) {
		$( '.radio-input' ).each(function(){
			$(this).lsvrRadioInput();
		});
	}

	// SELECTBOX INPUTS
	if ( $.fn.lsvrSelectboxInput ) {
		$( '.selectbox-input' ).each(function(){
			$(this).lsvrSelectboxInput();
		});
	}

	// VALIDATE FORMS
	if ( $.fn.lsvrIsFormValid ) {
		$( 'form.m-validate' ).each(function(){
			var $this = $(this);
			$this.submit(function(){
				if ( ! $this.lsvrIsFormValid() ) {
					$this.find( '.m-validation-error' ).slideDown( 300 );
					return false;
				}
			});
		});
	}

	/* -------------------------------------------------------------------------
		INPUT PLACEHOLDERS
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrInputPlaceholder ) {
		$( '*[data-placeholder]' ).each(function(){
			$(this).lsvrInputPlaceholder();
		});
	}

	/* -------------------------------------------------------------------------
		INVIEW ANIMATION
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrInviewAnimation ) {
		$( '[data-inview-anim]' ).each( function(){
			$(this).addClass( 'visibility-hidden' );
			$(this).lsvrInviewAnimation();
		});
	}

	/* -------------------------------------------------------------------------
		LIGHTBOXES
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrInitLightboxes ) {
		$( 'body' ).lsvrInitLightboxes();
	}

	/* -------------------------------------------------------------------------
		LOAD HIRES IMAGES FOR HiDPI SCREENS
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrLoadHiresImages ) {
		$( 'body' ).lsvrLoadHiresImages();
	}

	/* -------------------------------------------------------------------------
		MEDIA QUERY BREAKPOINT
	------------------------------------------------------------------------- */

	var mediaQueryBreakpoint;
	if ( $.fn.lsvrGetMediaQueryBreakpoint ) {
		mediaQueryBreakpoint = $.fn.lsvrGetMediaQueryBreakpoint();
		$( document ).on( 'screenTransition', function(){
			mediaQueryBreakpoint = $.fn.lsvrGetMediaQueryBreakpoint();
		});
	}
	else {
		mediaQueryBreakpoint = $(window).width();
	}


/* -----------------------------------------------------------------------------

	2.) COMPONENTS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		ACCORDION
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrAccordion ) {
		$( '.c-accordion' ).each(function(){
			$(this).lsvrAccordion();
		});
	}

	/* -------------------------------------------------------------------------
		BLOG
	------------------------------------------------------------------------- */

	// ISOTOPE
	if ( $.fn.isotope && $.fn.lsvrImagesLoaded ) {
		$( '.c-blog' ).each(function(){

			var $this = $(this),
				itemList = $this.find( '.item-list' ).first(),
				filter = $this.find( '.blog-filter' ).first(),
				pagination = $this.find( '.c-pagination.m-ajaxed' ),
				loadBtn = pagination.find( 'a' );

			// LOAD IMAGES
			itemList.lsvrImagesLoaded(function(){

				// INIT ISOTOPE
				itemList.isotope({
					itemSelector: 'article',
					layoutMode: 'masonry',
				});

				// INIT FILTER
				filter.fadeIn( 300, function(){
					$(this).removeAttr( 'style' ).addClass( 'm-active' );
				});
				filter.on( 'click', 'button', function() {
					var filterValue = $(this).attr( 'data-filter' ) ? $(this).attr( 'data-filter' ) : '*';
					itemList.isotope({ filter: filterValue });
					filter.find( '.m-active' ).removeClass( 'm-active' );
					filter.find( '*[data-filter="' + filterValue + '"]' ).addClass( 'm-active' );
				});

				pagination.fadeIn( 300 );
				$this.addClass( 'm-images-loaded' );

			});

			// AJAXED PAGINATION
			loadBtn.click(function(){
				if ( ! loadBtn.hasClass( 'm-loading' ) ) {

					var url = loadBtn.attr( 'href' ) + ' #page-content',
						label = loadBtn.html(),
						loadingLabel = loadBtn.data( 'loading-label' ) ? loadBtn.data( 'loading-label' ) : 'Loading',
						noMoreLabel = loadBtn.data( 'no-more-label' ) ? loadBtn.data( 'no-more-label' ) : 'No more posts';

					loadBtn.addClass( 'm-loading' );
					loadBtn.html( loadingLabel );

					// LOAD
					$( 'body' ).append( '<div class="c-loading-container" style="display: none;"></div>' );
					var loadingContainer = $( '.c-loading-container' ).last();
					loadingContainer.load( url, function( response, status, xhr ){
						loadingContainer.lsvrImagesLoaded(function(){

							// ADD NEW ITEMS
							var newItems = loadingContainer.find( '.blog-list > article' );
							itemList.append( newItems ).isotope( 'appended', newItems );

							// CHECK FOR PAGINATION
							if ( loadingContainer.find( '.c-pagination .pagination-next' ).length > 0 || loadingContainer.find( '.c-pagination ul > li:last-child:not( .m-active )' ).length > 0 ) {

								loadBtn.removeClass( 'm-loading' ).html( label );
								var newPagination;
								if ( loadingContainer.find( '.c-pagination .pagination-next' ).length > 0 ) {
									newPagination = loadingContainer.find( '.c-pagination .pagination-next' );
								}
								else {
									newPagination = loadingContainer.find( '.c-pagination ul > li:last-child:not( .m-active )' );
								}
								if ( newPagination.length > 0 ) {
									loadBtn.attr( 'href', newPagination.find( 'a' ).first().attr( 'href' ) );
								}

							}
							else {
								loadBtn.html( noMoreLabel );
							}

							// REMOVE LOADING CONTAINER
							loadingContainer.remove();

							// INIT LIGHTBOXES & FLUID VIDEOS
							if ( $.fn.lsvrInitLightboxes ) {
								itemList.lsvrInitLightboxes();
							}
							if ( $.fn.lsvrFluidEmbedVideo ){
								itemList.lsvrFluidEmbedVideo();
							}

							// UPDATE ISOTOPE LAYOUT
							itemList.isotope( 'layout' );

						});
					});

				}
				return false;
			});

		});
	};

	/* -------------------------------------------------------------------------
		COUNTER
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrCounter ) {
		$( '.c-counter' ).each(function(){
			$(this).lsvrCounter();
		});
	}

	/* -------------------------------------------------------------------------
		GALLERY
	------------------------------------------------------------------------- */

	// OPEN MODAL WINDOW
	var lsvrInitGalleryAjaxModals = function(){
		if ( $.fn.lsvrOpenAjaxModal ) {
			$( '.c-gallery' ).each(function(){

				var	$this = $(this),
					galleryItems = $this.find( '.item-list > .item' );

				galleryItems.each(function(){

					var item = $(this),
						index = item.index();

					item.find( 'a.m-open-ajax-modal-project' ).each(function(){

						var navigationObject = {
							index: index,
							galleryItems: galleryItems,
							linkSelector: 'a.m-open-ajax-modal-project'
						};

						$(this).lsvrOpenAjaxModal(function(){

							// CALLBACK FUNCTION FOR INIT PROJECT DETAILS
							if ( typeof lsvrInitProjectDetail == 'function' ) {
								lsvrInitProjectDetail();
							}

							// INIT LIGHTBOXES
							if ( $.fn.lsvrInitLightboxes ) {
								$( '.c-modal' ).lsvrInitLightboxes();
							}

							// INIT FLUID VIDEO
							if ( $.fn.lsvrFluidEmbedVideo ){
								$( '.c-modal' ).lsvrFluidEmbedVideo();
							}

						}, navigationObject );
					});

				});

			});

		}
	};
	lsvrInitGalleryAjaxModals();

	// ISOTOPE
	if ( $.fn.isotope && $.fn.lsvrImagesLoaded ) {
		$( '.c-gallery' ).each(function(){

			var	$this = $(this),
				itemList = $this.find( '.item-list' ),
				filter = $this.find( '.gallery-filter' ),
				layout = $this.data( 'layout' ) ? $this.data( 'layout' ) : 'fitRows';

			// CREATE FILTER COPY
			if ( itemList.prev( '.gallery-tools' ).length < 1 ) {
				filter.clone().prependTo( $this ).wrap( '<div class="gallery-tools-top"><div class="container"></div></div>' );
				filter = $this.find( '.gallery-filter' );
				$this.addClass( 'm-has-gallery-tools-top' );
			}

			// LOAD IMAGES
			itemList.lsvrImagesLoaded(function(){

				// INIT ISOTOPE
				itemList.isotope({
					itemSelector: '.item',
					layoutMode: layout,
				});

				// INIT FILTER
				filter.fadeIn( 300, function(){
					$(this).removeAttr( 'style' ).addClass( 'm-active' );
				});
				filter.on( 'click', 'button', function() {
					var filterValue = $(this).attr( 'data-filter' ) ? $(this).attr( 'data-filter' ) : '*';
					itemList.isotope({ filter: filterValue });
					filter.find( '.m-active' ).removeClass( 'm-active' );
					filter.find( '*[data-filter="' + filterValue + '"]' ).addClass( 'm-active' );
				});

				$this.addClass( 'm-images-loaded' );

			});

			// AJAXED PAGINATION
			var loadBtn = $this.find( '.c-pagination.m-ajaxed a' );
			loadBtn.click(function(){
				if ( ! loadBtn.hasClass( 'm-loading' ) ) {

					var url = loadBtn.attr( 'href' ) + ' .c-gallery',
						label = loadBtn.html(),
						loadingLabel = loadBtn.data( 'loading-label' ) ? loadBtn.data( 'loading-label' ) : 'Loading',
						noMoreLabel = loadBtn.data( 'no-more-label' ) ? loadBtn.data( 'no-more-label' ) : 'No more items';

					loadBtn.addClass( 'm-loading' );
					loadBtn.html( loadingLabel );

					// LOAD
					$( 'body' ).append( '<div class="c-loading-container" style="display: none;"></div>' );
					var loadingContainer = $( '.c-loading-container' ).last();
					loadingContainer.load( url, function( response, status, xhr ){
						loadingContainer.lsvrImagesLoaded(function(){

							// ADD NEW ITEMS
							var newItems = loadingContainer.find( '.item-list > .item' );
							itemList.append( newItems ).isotope( 'appended', newItems );

							// CHECK FOR PAGINATION
							if ( loadingContainer.find( '.c-pagination.m-ajaxed' ).length > 0 || loadingContainer.find( '.c-pagination ul > li:last-child:not( .m-active )' ).length > 0 ) {

								loadBtn.removeClass( 'm-loading' ).html( label );
								var nextLink = loadingContainer.find( '.c-pagination a' ).last().attr( 'href' );
								loadBtn.attr( 'href', nextLink );

							}
							else {

								loadBtn.html( noMoreLabel );
								/*
								$this.find( '.c-pagination' ).one( 'inview', function(){
									setTimeout(function(){
										$this.find( '.c-pagination' ).slideUp(300, function(){
											$(this).remove();
										});
									}, 3000);
								});
								*/

							}

							// REMOVE LOADING CONTAINER
							loadingContainer.remove();

							// INIT LIGHTBOXES
							if ( $.fn.lsvrInitLightboxes ) {
								itemList.lsvrInitLightboxes();
							}

							// INIT AJAX MODALS
							lsvrInitGalleryAjaxModals();

						});
					});

				}
				return false;
			});

		});
	}

	/* -------------------------------------------------------------------------
		GOOGLE MAP
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrLoadGoogleMaps && $( '.c-gmap' ).length > 0 ) {
		$.fn.lsvrLoadGoogleMaps();
	}

	/* -------------------------------------------------------------------------
		PARALLAX SECTION
	------------------------------------------------------------------------- */

	if ( $.fn.parallax ) {

		// Webkit background-attachment:fixed bug fix
		if ( 'WebkitAppearance' in document.documentElement.style ) {
			$( '.c-parallax-section' ).each(function(){
				$(this).fadeOut(1).fadeIn(1);
			});
		}

		// DYNAMIC
		$( '.c-parallax-section.m-dynamic' ).each(function(){
			if ( mediaQueryBreakpoint > 1199 ) {
				$(this).parallax( '50%', 0.3 );
			}
		});

		// VIDEO
		if ( $.fn.okvideo ) {
			$( '.c-parallax-section[data-videobg-id]' ).each(function(){

				var	$this = $(this),
					videoId = $this.data( 'videobg-id' );

				$this.addClass( 'videobg-parent' );
				$this.prepend( '<div class="videobg-holder"><div class="videobg-holder-inner"></div></div>' );

				var	videoInner = $this.find( '.videobg-holder-inner' );
				videoInner.okvideo({ source: videoId,
					volume: 0,
					loop: true,
					hd: true,
					adproof: true,
					annotations: false
				});

			});
		}

	}

	/* -------------------------------------------------------------------------
		PROGRESS BAR
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrProgressBar ) {
		$( '.c-progress-bar' ).each(function(){
			$(this).lsvrProgressBar();
		});
	}

	/* -------------------------------------------------------------------------
		SLIDER
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrSlider ) {
		$( '.c-slider' ).each(function(){
			$(this).lsvrSlider();
		});
	}

	/* -------------------------------------------------------------------------
		TABS
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrTabs ) {
		$( '.c-tabs' ).each(function(){
			$(this).lsvrTabs();
		});
	}


/* -----------------------------------------------------------------------------

	3.) HEADER

----------------------------------------------------------------------------- */

var $header = $( '#header' );

	/* -------------------------------------------------------------------------
		HEADER MENU
	------------------------------------------------------------------------- */

	// SUBMENU
	$.fn.headerSubmenu = function(){

		var	$this = $(this),
			parent = $this.parent();

		parent.addClass( 'm-has-submenu' );

		// CREATE TOGGLES
		parent.append( '<button class="toggle" type="button"><i class="fa"></i></button>' );
		var toggle = parent.find( '> .toggle' );

		// HOVER
		parent.hover(function(){
			if ( mediaQueryBreakpoint > 1199 ) {
				parent.addClass( 'm-hover' );
				$this.show().addClass( 'animated fadeInDown' );
			}
		}, function(){
			if ( mediaQueryBreakpoint > 1199 ) {
				parent.removeClass( 'm-hover' );
				$this.hide().removeClass( 'animated fadeInDown' );
			}
		});

		// TOGGLE
		toggle.click( function(){
			toggle.toggleClass( 'm-active' );
			$this.slideToggle( 300 );
		});

	};
	$header.find( '.header-menu ul > li > ul' ).each(function(){
		$(this).headerSubmenu();
	});

	/* -------------------------------------------------------------------------
		FIXED HEADER
	------------------------------------------------------------------------- */

	if ( $header.hasClass( 'm-enable-fixed' ) ) {

		// CREATE CLONE
		$header.clone( true ).prependTo( 'body' );
		$( 'body' ).find( '#header' ).first().attr( 'id', 'header-fixed' );
		var	headerClone = $( '#header-fixed' );

		// SET LOGO
		headerClone.find( '.header-branding img' ).each(function(){
			var img = $(this);
			if ( window.devicePixelRatio > 1 && img.attr( 'data-fixed-hires' )) {
				img.attr( 'src', img.attr( 'data-fixed-hires' ) );
			}
			else if ( img.attr( 'data-fixed' ) ) {
				img.attr( 'src', img.attr( 'data-fixed' ) );
			}
			if ( img.attr( 'data-fixed-width' ) ) {
				img.attr( 'width', img.attr( 'data-fixed-width' ) );
			}
			else {
				img.removeAttr( 'width' );
			}
			if ( img.attr( 'data-fixed-height' ) ) {
				img.attr( 'height', img.attr( 'data-fixed-height' ) );
			}
			else {
				img.removeAttr( 'height' );
			}
		});

		// SHOW
		$( document ).on( 'headerScrolledOut', function(){
			headerClone.show().addClass( 'm-active' );
		});

		// HIDE
		$( document ).on( 'headerScrolledIn', function(){
			headerClone.show().removeClass( 'm-active' );
		});

		// SUBMENU
		headerClone.find( '.header-menu ul > li > ul' ).each(function(){
			$(this).headerSubmenu();
		});

	}

	/* -------------------------------------------------------------------------
		SCROLLSPY
	------------------------------------------------------------------------- */

	$( '#header .header-menu > ul a[href^="#"]' ).each(function(){

		var $this = $(this),
			link = $this.attr( 'href' ),
			anchor;

		// SCROLLSPY
		if ( $.fn.lsvrScrollspy && $( link ).length > 0 && ! $( link ).hasClass( 'scrollspied' ) ) {

			$( link ).addClass( 'scrollspied' );
			$( link ).lsvrScrollspy({
				tolerance: 200,
				onEnter: function(){
					$( '.header-menu > ul > li.m-active, .sidebar-menu.m-header-menu-copy > ul > li.m-active' ).removeClass( 'm-active' );
					$( '.header-menu a[href="' + link + '"], .sidebar-menu.m-header-menu-copy a[href="' + link + '"]' ).parent().addClass( 'm-active' );
				}
			});

		}

	});

	// DEAL WITH DEFAULT ACTIVE
	$( '.header-menu .m-active' ).addClass( 'm-active-default' );
	if ( $( '.scrollspied' ).length > 0 ) {
		$( '#header .header-content' ).lsvrScrollspy({
			tolerance: 0,
			onEnter: function(){
				$( '.header-menu > ul li.m-active' ).removeClass( 'm-active' );
				$( '.header-menu .m-active-default, .sidebar-menu .m-active-default' ).addClass( 'm-active' );
			}
		});
	}

	/* -------------------------------------------------------------------------
		HEADER SCROLLED OUT
	------------------------------------------------------------------------- */

	var isHeaderScrolledOut = function(){
		//if ( mediaQueryBreakpoint > 1199 ) {

			var	scrollTop = $(window).scrollTop();
			$header.each(function() {
				var bottomDistance = $(this).offset().top + $(this).height();
				if ( ( bottomDistance ) < scrollTop ) {

					$( 'body' ).addClass( 'm-header-scrolled-out' );

					// TRIGGER EVENT
					$.event.trigger({
						type: 'headerScrolledOut',
						message: 'Header scrolled off screen.',
						time: new Date()
					});

				}
				else if ( $( 'body' ).hasClass( 'm-header-scrolled-out' ) ) {

					$( 'body' ).removeClass( 'm-header-scrolled-out' );

					// TRIGGER EVENT
					$.event.trigger({
						type: 'headerScrolledIn',
						message: 'Header scrolled to screen.',
						time: new Date()
					});

				}
			});

		//}
	};
	isHeaderScrolledOut();
	$(window).on( 'scroll', function() {
		isHeaderScrolledOut();
	});

	/* -------------------------------------------------------------------------
		VIDEO HEADER
	------------------------------------------------------------------------- */

	if ( $.fn.okvideo && $header.data( 'videobg-id' ) ) {

		var	videoId = $header.data( 'videobg-id' );
		$header.prepend( '<div class="videobg-holder"><div class="videobg-holder-inner"></div></div>' );
		var	videoInner = $header.find( '.videobg-holder-inner' );

		videoInner.okvideo({ source: videoId,
			volume: 0,
			loop: true,
			hd: true,
			adproof: true,
			annotations: false
		});

	}


/* -----------------------------------------------------------------------------

	4.) CORE

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		BLOG LIST
	------------------------------------------------------------------------- */

	$( '.blog-list.m-masonry' ).each(function(){

		var $this = $(this);
		$this.lsvrImagesLoaded(function(){
			$this.isotope({
				itemSelector: 'article',
				layoutMode: 'masonry',
			});
		});

	});

	/* -------------------------------------------------------------------------
		PORTFOLIO DETAIL
	------------------------------------------------------------------------- */

	var lsvrInitProjectDetail = function(){

		// PROJECT IMAGES AS SLIDER
		if ( $.fn.owlCarousel ) {
			$( '.portfolio-detail .project-images.m-paginated' ).each(function(){

				var	$this = $(this),
					activeIndex = 0,
					imageTitles = [];

				if ( $this.find( 'img' ) ) {

					// GET LIST OF IMAGE TITLES
					$this.find( 'img' ).each(function(){
						if ( $(this).attr( 'title' ) && $(this).attr( 'title' ) !== '' ) {
							imageTitles.push( $(this).attr( 'title' ) );
							$(this).removeAttr( 'title' );
						}
						else {
							imageTitles.push( '' );
						}
					});

					if ( $this.children().length > 1 ) {

						// INIT CAROUSEL
						$this.owlCarousel({
							autoPlay: false,
							slideSpeed: 300,
							pagination: false,
							paginationSpeed : 400,
							singleItem: true,
							autoHeight: true,
							addClassActive: true,
							afterMove: function(){

								// CHANGE IMAGE TITLE AFTER MOVE
								activeIndex = $this.find( '.owl-item.active' ).index();
								$this.find( '.image-info h2' ).fadeOut( 300, function(){
									if ( imageTitles[ activeIndex ] !== '' ) {
										$this.find( '.image-info h2' ).html( imageTitles[ activeIndex ] );
										$this.find( '.image-info h2' ).fadeIn(300);
									}
								});

							}
						});

					}

					// CREATE IMAGE INFO
					if ( $this.children().length > 1 || imageTitles[0] !== '' ) {

						$this.append( '<div class="image-info"><div class="container"><div class="images-nav"><button class="c-button m-outline nav-prev" type="button"><i class="fa fa-chevron-left"></i></button><button class="c-button m-outline nav-next" type="button"><i class="fa fa-chevron-right"></i></button></div></div></div>' );
						var	imageInfo = $this.find( '.image-info' ),
							navPrev = imageInfo.find( '.nav-prev' ),
							navNext = imageInfo.find( '.nav-next' );

						// INITIAL IMAGE TITLE
						if ( imageTitles[0] !== '' ) {
							imageInfo.find( '.container' ).prepend( '<h2>' + imageTitles[0] + '</h2>' );
						}

						// NAVIGATION
						navPrev.click(function(){
							$this.trigger( 'owl.prev' );
						});
						navNext.click(function(){
							$this.trigger( 'owl.next' );
						});

					}

				}

			});
		}

	};
	lsvrInitProjectDetail();

/* -----------------------------------------------------------------------------

	5.) WIDGETS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		DRIBBBLE WIDGET
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrDribbbleFeed ) {
		$( '.dribbble-widget' ).each(function(){
			$(this).lsvrDribbbleFeed();
		});
	}

	/* -------------------------------------------------------------------------
		FLICKR WIDGET
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrFlickrFeed ) {
		$( '.flickr-widget' ).each(function(){
			$(this).lsvrFlickrFeed();
		});
	}

	/* -------------------------------------------------------------------------
		INSTAGRAM WIDGET
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrInstagramFeed ) {
		$( '.instagram-widget' ).each(function(){
			$(this).lsvrInstagramFeed();
		});
	}

	/* -------------------------------------------------------------------------
		SUBSCRIBE WIDGET
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrMailchimpSubscribeForm ) {
		$( '.subscribe-widget-form' ).each(function(){
			$(this).lsvrMailchimpSubscribeForm();
		});
	}

	/* -------------------------------------------------------------------------
		TWITTER WIDGET
	------------------------------------------------------------------------- */

	if ( $.fn.lsvrTwitterFeed ) {
		$( '.twitter-widget' ).each(function(){
			$(this).lsvrTwitterFeed();
		});
	}


/* -----------------------------------------------------------------------------

	6.) MAIN SIDEBAR

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		TOGGLE
	------------------------------------------------------------------------- */

	$( '#main-sidebar' ).each(function(){

		var	$this = $(this);

		// TOGGLE BTN CLICK
		$( '.main-sidebar-toggle' ).click(function(){
			if ( $this.hasClass( 'm-active' ) ){

				// TRIGGER CLOSE EVENT
				$.event.trigger({
					type: 'mainSidebarClosed',
					message: 'Main sidebar closed.',
					time: new Date()
				});

			}
			else {

				// TRIGGER OPEN EVENT
				$.event.trigger({
					type: 'mainSidebarOpened',
					message: 'Main sidebar opened.',
					time: new Date()
				});

			}
		});

		// CLOSE BTN CLICK
		$this.find( '.sidebar-close' ).click(function(){

			// TRIGGER CLOSE EVENT
			$.event.trigger({
				type: 'mainSidebarClosed',
				message: 'Main sidebar closed.',
				time: new Date()
			});

		});

		// OPEN ACTIONS
		$( document ).on( 'mainSidebarOpened', function(){

			$( '.main-sidebar-toggle' ).addClass( 'm-active' );
			$this.toggleClass( 'm-active' );
			$( 'body' ).toggleClass( 'm-main-sidebar-active' );

		});

		// CLOSE ACTIONS
		$( document ).on( 'mainSidebarClosed', function(){
			$( '.main-sidebar-toggle' ).removeClass( 'm-active' );
			$this.removeClass( 'm-active' );
			$( 'body' ).removeClass( 'm-main-sidebar-active' );
		});

		// iOS & CHROME BODY SCROLLING FIX
		if ( mediaQueryBreakpoint < 1200 ) {
			$( 'body' ).on( 'touchmove', function (e) {
				if ( $this.hasClass( 'm-active' ) ) {
					if ( ! $this.has( $( e.target ) ).length ) {
						e.preventDefault();
					}
				}
			});
			$( 'body' ).on( 'mousewheel DOMMouseScroll', function (e) {
				if ( $this.hasClass( 'm-active' ) ) {
					if ( ! $this.has( $( e.target ) ).length ) {
						e.preventDefault();
					}
				}
			});
		}

	});

	/* -------------------------------------------------------------------------
		SIDEBAR MENU
	------------------------------------------------------------------------- */

	$( '#main-sidebar .sidebar-menu' ).each(function(){

		var	sidebarMenu = $(this);

		// COPY HEADER MENU
		if ( sidebarMenu.hasClass( 'm-header-menu-copy' ) ) {

			// CLONE
			$( '#header .header-menu > ul' ).clone().prependTo( sidebarMenu );

			// TOGGLE
			sidebarMenu.find( 'ul > li > ul' ).each(function(){

				var	$this = $(this),
					parent = $this.parent(),
					toggle = parent.find( '> .toggle' );

				toggle.click( function(){
					toggle.toggleClass( 'm-active' );
					$this.slideToggle( 300 );
				});

			});

			// SCROLL TO
			sidebarMenu.find( 'a' ).each(function(){

				var $this = $(this),
					link = $this.attr( 'href' ),
					anchor;

				if ( link.charAt(0) === '#' ) {

					anchor = link.substring(1);
					$this.click(function(){
						$( 'html, body' ).animate({
							'scrollTop' : $( link ).offset().top - 100
						}, 300);
						return false;
					});

				}

			});

		}

	});


/* -----------------------------------------------------------------------------

	7.) OTHER

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		SCROLL ANIMATION
	------------------------------------------------------------------------- */

	$( 'a[href^="#"]' ).each(function(){

		var $this = $(this),
			element = $this.attr( 'href' );

		if ( $( element ).length > 0 ) {
			$this.click(function(e){
				$( 'html, body' ).animate({
					'scrollTop' : $( element ).offset().top - 95
				}, 500);
				return false;
			});
		}

	});

});
})(jQuery);

/* -----------------------------------------------------------------------------

	8.) STYLE SWITCHER

----------------------------------------------------------------------------- */

(function($){ "use strict";
$(document).ready(function(){

	var enableStyleSwitcher = false;

	if ( typeof enableStyleSwitcher !== 'undefined' && enableStyleSwitcher ) {

		// CREATE STYLE SWITCHER
		var styleSwitcherHtml = '<div id="style-switcher"><button class="style-switcher-toggle"><i class="ico fa fa-tint"></i></button>';
			styleSwitcherHtml += '<div class="style-switcher-content"><ul class="skin-list">';
			styleSwitcherHtml += '<li><button class="skin-default m-active" data-skin="default"><span>Default</span></button></li>';
			styleSwitcherHtml += '<li><button class="skin-turquoise" data-skin="turquoise"><span>Turquoise</span></button></li>';
			styleSwitcherHtml += '<li><button class="skin-lime" data-skin="lime"><span>Lime</span></button></li>';
			styleSwitcherHtml += '<li><button class="skin-violet" data-skin="violet"><span>Violet</span></button></li>';
			styleSwitcherHtml += '</ul><ul class="switch-list">';
			styleSwitcherHtml += '<li><button class="switch-fullsize"><i class="ico fa fa-square-o"></i> Fullsize</button></li>';
			styleSwitcherHtml += '</ul></div></div>';
		$( 'body' ).append( styleSwitcherHtml );

		// INIT SWITCHER
		$( '#style-switcher' ).each(function(){

			var switcher = $(this),
				toggle = switcher.find( '.style-switcher-toggle' ),
				skins = switcher.find( '.skin-list button' ),
				switches = switcher.find( '.switch-list button' ),
				vibeshtmlStyleSwitcher = {};

			//localStorage.clear();

			// SAVE SETTINGS
			var styleSwitcherSave = function(){
				if ( $( 'html' ).hasClass( 'localstorage' ) ) {
					localStorage.vibeshtmlStyleSwitcher = JSON.stringify( vibeshtmlStyleSwitcher );
				}
			};

			// LOAD SETTINGS
			if ( $( 'html' ).hasClass( 'localstorage' ) && localStorage.vibeshtmlStyleSwitcher ) {

				vibeshtmlStyleSwitcher = JSON.parse( localStorage.vibeshtmlStyleSwitcher );

				// LOAD SAVED SKIN
				if ( typeof vibeshtmlStyleSwitcher.skin !== 'undefined' ) {
					skins.filter( '.m-active' ).removeClass( 'm-active' );
					skins.filter( '[data-skin="' + vibeshtmlStyleSwitcher.skin + '"]' ).addClass( 'm-active' );
					if ( $( 'head #skin-temp' ).length < 1 ) {
						$( 'head' ).append( '<link id="skin-temp" rel="stylesheet" type="text/css" href="library/css/skin/' + vibeshtmlStyleSwitcher.skin + '.css">' );
					}
				}
				// LOAD BOXED SWITCH
				if ( typeof vibeshtmlStyleSwitcher.fullsize !== 'undefined' ) {

					if ( vibeshtmlStyleSwitcher.fullsize ) {
						switches.filter( '.switch-fullsize' ).addClass( 'm-active' );
						switches.filter( '.switch-fullsize' ).find( '.ico' ).removeClass( 'fa-square-o' ).addClass( 'fa-check-square-o' );
						$( 'body' ).addClass( 'm-fullsize' );
					}
					else {
						switches.filter( '.switch-fullsize' ).removeClass( 'm-active' );
						switches.filter( '.switch-fullsize' ).find( '.ico' ).removeClass( 'fa-check-square-o' ).addClass( 'fa-square-o' );
						$( 'body' ).removeClass( 'm-fullsize' );
					}

					// REINIT ISOTOPS AND CAROUSELS
					$(window).trigger( 'resize' );
					window.dispatchEvent( new Event( 'resize' ) );
					$( '.c-slider' ).each(function(){
						if ( $(this).find( '.slide-list' ).data( 'owlCarousel' ) ) {
							$(this).find( '.slide-list' ).data( 'owlCarousel' ).reinit();
						}
					});

				}

			}
			// TOGGLE SWITCHER
			toggle.click(function(){
				switcher.toggleClass( 'm-active' );
			});

			// SET SKIN
			skins.click(function(){
				skins.filter( '.m-active' ).removeClass( 'm-active' );
				$(this).toggleClass( 'm-active' );
				vibeshtmlStyleSwitcher.skin = $(this).data( 'skin' );
				styleSwitcherSave();
				if ( $( 'head #skin-temp' ).length < 1 ) {
					$( 'head' ).append( '<link id="skin-temp" rel="stylesheet" type="text/css" href="library/css/skin/' + $(this).data( 'skin' ) + '.css">' );
				}
				else {
					$( '#skin-temp' ).attr( 'href', 'library/css/skin/' + $(this).data( 'skin' ) + '.css' );
				}

			});

			// SET SWITCHES
			switches.click(function(){

				var self = $(this),
					ico = self.find( '.ico' );
					self.toggleClass( 'm-active' );
					ico.toggleClass( 'fa-check-square-o fa-square-o' );

				// ANIMATED HEADER
				if ( self.hasClass( 'switch-fullsize' ) ) {

					$( 'body' ).toggleClass( 'm-fullsize' );
					vibeshtmlStyleSwitcher.fullsize = self.hasClass( 'm-active' ) ? true : false;

					// REINIT ISOTOPS AND CAROUSELS
					$(window).trigger( 'resize' );
					window.dispatchEvent( new Event( 'resize' ) );
					$( '.c-slider' ).each(function(){
						if ( $(this).find( '.slide-list' ).data( 'owlCarousel' ) ) {
							$(this).find( '.slide-list' ).data( 'owlCarousel' ).reinit();
						}
					});

				}

				styleSwitcherSave();

			});

		});


	}

});
})(jQuery);