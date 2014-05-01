const ENTITY_DEFAULT_WIDTH = 100;
const ENTITY_DEFAULT_HEIGHT = 70;
const ENTITY_BORDER_WIDTH = 2;
const ENTITY_FILL_COLOR = "rgb(240,240,240)";
const ENTITY_BORDER_COLOR = "rgb(10,10,10)";
const ENTITY_SELECTED_BORDER_COLOR = "rgb(61,145,64)";
const CAPTION_FONT = "14px Arial";
const CAPTION_FONT_COLOUR = "rgb(20,20,20)";
const CARENT_COLOUR = "rgb(50,50,50)";
const CARET_HEIGHT = ENTITY_DEFAULT_HEIGHT/7+4;
const CARET_WIDTH = 3;

var JSEnums = {
	MenuItemSelected: { ItemEntity: 'ItemEntity', ItemHand: 'ItemHand', ItemRelation: 'ItemRelation' }
};

var Entity = function(x,y,width,height,index){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.index = index; //items with greater index should be drawn on top; it's equivalent of z-index
	this.caption = "title";
	this.isSelected = false;
	this.isCaptionBeingEdited = false;
	
	function drawCaret(ctx, upperX, upperY){
		ctx.strokeStyle = CARENT_COLOUR;
		ctx.beginPath();
		ctx.lineWidth = CARET_WIDTH;
		ctx.moveTo(upperX,upperY);
		ctx.lineTo(upperX,upperY+CARET_HEIGHT);
		ctx.closePath();
		ctx.stroke();
	}
	
	this.containsPoint = function(pointX,pointY){
		return (pointX >= this.x && pointX <= (this.x+this.width) &&
			pointY >= this.y && pointY <= (this.y+this.height));
	};
	
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.lineWidth = ENTITY_BORDER_WIDTH;
		ctx.strokeStyle = (this.isSelected === true) ?  ENTITY_SELECTED_BORDER_COLOR : ENTITY_BORDER_COLOR;
		ctx.rect(this.x, this.y, ENTITY_DEFAULT_WIDTH, ENTITY_DEFAULT_HEIGHT);
		ctx.fillStyle = ENTITY_FILL_COLOR;
		ctx.fill();
		ctx.stroke();
		
		ctx.font = CAPTION_FONT;
		
		ctx.fillStyle = ENTITY_BORDER_COLOR;
		var textMetrics = ctx.measureText(this.caption);
		var textX = this.x+ENTITY_DEFAULT_WIDTH/3;
		
		ctx.textBaseline="top"; 
		ctx.fillText(this.caption, parseInt(textX), parseInt(this.y+ENTITY_DEFAULT_HEIGHT/4));
		//console.log('stroke style:'+ctx.strokeStyle);
		//ctx.fill();
		if(true === this.isCaptionBeingEdited)
			drawCaret(ctx, parseInt(textX+textMetrics.width+4), parseInt(this.y+ENTITY_DEFAULT_HEIGHT/4));
	};
};
