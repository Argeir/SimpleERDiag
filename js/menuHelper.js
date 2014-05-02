$("#main-controls-holder li").click(function(ev){
	ev.preventDefault();
	$("#main-controls-holder li").removeClass("selected");
	$(this).addClass("selected");
});
