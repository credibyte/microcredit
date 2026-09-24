// JavaScript Document
	$(function(){	
			var viewportTop   = 80,
			scrollTime      = 1000,
			openTime      = 600,
			completeTime  = 1200,
			scrollElement = "html,body";
		// Initialize waypoints
		//$("#wrapper > div").waypoint({ offset: viewportTop });
		// Detect iOS and Android*/
		if((!navigator.userAgent.match(/iPhone/i)) && (!navigator.userAgent.match(/iPod/i)) && (!navigator.userAgent.match(/iPad/i)) && (!navigator.userAgent.match(/Android/i))) {
			// Sticky nav for desktop
			//$("#bigmenu").stickyPanel();
			// Do stuff when waypoints are reached
		  $("body").delegate("#wrapper > div", "waypoint.reached", function (event, direction) {
		  var $active = $(this);
		  if (direction === 'up') {
			$active = $active.prev();
		  }
		  if (!$active.length) { $active.end(); }
		  $(".section-active").removeClass("section-active");
		  $active.addClass("section-active");
		  $(".selected").removeClass("selected");
		  $("a[href=#"+$active.attr("id")+"]").addClass("selected");
		});
	  }
	
	// Smooth scrolling for internal links
		$("a[href^='#']").click(function (event) {
			event.preventDefault();
			var $this   = $(this),
				target  = this.hash,
				$target = $(target);
				if ($target.offset()!=null)
				{
					$(scrollElement).stop().animate({
						"scrollTop": $target.offset().top
					}, scrollTime, "swing", function () {
						window.location.hash = target;
					});
				}
		});
	});