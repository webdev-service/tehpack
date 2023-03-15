

/*
  1. preloader
  2. timeout function
    2.1. show fadeIn element
	2.2. show elements
  3. forms
    3.1. contact form
	3.2. newsletter form
  4. YouTube player
  5. slick slider
    5.1. slick fullscreen slideshow ZOOM/FADE
  6. swiper slider
    6.1. swiper parallax slider
  7. panels
    7.1. panels expand
    7.2. panels collapse
  8. countdown
    8.1. countdown SETUP
	8.2. countdown script
  9. menu active state
*/


$(function() {
    "use strict";
	
	
    $(window).on("load", function() {
        // 1. preloader
        $("#preloader").fadeOut(600);
        $(".preloader-bg").delay(400).fadeOut(600);
		
        // 2. timeout function
        // 2.1. show fadeIn element
        setTimeout(function() {
            $(".fadeIn-element").delay(1600).css({
                display: "none"
            }).fadeIn(2400);
        }, 0);
        // 2.2. show elements
        setTimeout(function() {
            $(".top-element").removeClass("top-position");
        }, 600);
        setTimeout(function() {
            $(".bottom-element, .bottom-element-menu").removeClass("bottom-position");
        }, 600);
        setTimeout(function() {
            $(".left-element").removeClass("left-position");
        }, 600);
        setTimeout(function() {
            $(".right-element").removeClass("right-position");
        }, 600);
    });
	
    // 3. forms
    // 3.1. contact form
    $("form#form").on("submit", function() {
        $("form#form .error").remove();
        var s = !1;
        if ($(".requiredField").each(function() {
                if ("" === jQuery.trim($(this).val())) $(this).prev("label").text(), $(this).parent().append('<span class="error">This field is required</span>'), $(this).addClass(
                    "inputError"), s = !0;
                else if ($(this).hasClass("email")) {
                    var r = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    r.test(jQuery.trim($(this).val())) || ($(this).prev("label").text(), $(this).parent().append('<span class="error">Invalid email address</span>'), $(this).addClass(
                        "inputError"), s = !0);
                }
            }), !s) {
            $("form#form input.submit").fadeOut("normal", function() {
                $(this).parent().append("");
            });
            var r = $(this).serialize();
            $.post($(this).attr("action"), r, function() {
                $("form#form").slideUp("fast", function() {
                    $(this).before('<div class="success">Your email was sent successfully.</div>');
                });
            });
        }
        return !1;
    });
    // 3.2. newsletter form
    $("form#subscribe").on("submit", function() {
        $("form#subscribe .subscribe-error").remove();
        $.post("subscribe.php");
        var s = !1;
        if ($(".subscribe-requiredField").each(function() {
                if ("" === jQuery.trim($(this).val())) $(this).prev("label").text(), $(this).parent().append('<span class="subscribe-error">Please enter your Email</span>'),
                    $(this).addClass("inputError"), s = !0;
                else if ($(this).hasClass("subscribe-email")) {
                    var r = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    r.test(jQuery.trim($(this).val())) || ($(this).prev("label").text(), $(this).parent().append('<span class="subscribe-error">Please enter a valid Email</span>'),
                        $(this).addClass("inputError"), s = !0);
                }
            }), !s) {
            $("form#subscribe input.submit").fadeOut("normal", function() {
                $(this).parent().append("");
            });
            var r = $(this).serialize();
            $.post($(this).attr("action"), r, function() {
                $("form#subscribe").slideUp("fast", function() {
                    $(this).before('<div class="subscribe-success">Thank you for subscribing.</div>');
                });
            });
        }
        return !1;
    });
	
    // 4. YouTube player
    $("#bgndVideo").YTPlayer();
	
    // 5. slick slider
    // 5.1. slick fullscreen slideshow ZOOM/FADE
    $(".slick-fullscreen-slideshow-zoom-fade").slick({
        arrows: false,
        initialSlide: 0,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
        speed: 1600,
        draggable: true,
        dots: false,
        pauseOnDotsHover: true,
        pauseOnFocus: false,
        pauseOnHover: false
    });
	
    // 6. swiper slider
    // 6.1. swiper parallax slider
    var swiper = new Swiper(".parallax .swiper-container", {
        autoplay: true,
        speed: 800,
        parallax: true,
        mousewheelControl: false,
        keyboardControl: false,
        navigation: false,
        paginationClickable: true
    });
	
    // 7. panels
    // 7.1. panels expand
    $("#open-newsletter").on("click", function() {
        $("#panel-newsletter").slideDown({
            duration: 600,
            easing: "easeInOutQuad"
        });
        $("#overlay").fadeIn({
            duration: 600,
            easing: "easeInOutQuad"
        });
    });
    // 7.2. panels collapse
    $("#overlay, .right-element-newsletter").on("click", function() {
        $("#panel-newsletter").slideUp({
            duration: 600,
            easing: "easeInOutQuad"
        });
        $("#overlay").fadeOut(600, "easeInOutQuad", function() {});
    });
	
    
	
    // 9. menu active state
    $("a.menu, .menu-trigger").on("click", function() {
        $("a.menu").removeClass("active");
        $(this).addClass("active");
    });
	
	
});