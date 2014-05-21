$("#main-controls-holder li").click(function(ev){
	ev.preventDefault();
	$("#main-controls-holder li").removeClass("selected");
	$(this).addClass("selected");
});

var lowerMenuManager = (function(){
	return{
		getSelectedItem: function(){
			return $("#main-controls-holder li.selected").attr('data-item');
		}
	};
})();
