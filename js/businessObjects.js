const ENTITY_DEFAULT_WIDTH = 100;
const ENTITY_DEFAULT_HEIGHT = 70;
const ENTITY_BORDER_WIDTH = 2;
const ENTITY_FILL_COLOR = "rgb(240,240,240)";
const ENTITY_BORDER_COLOR = "rgb(10,10,10)";
const ENTITY_SELECTED_BORDER_COLOR = "rgb(61,145,64)";
//Defines how far from side's end NE/NW/SE/SW sockets are
const ENTITY_REL_SOCKET_OFFSET = 10;
const CAPTION_FONT = "14px Arial";
const CAPTION_FONT_COLOUR = "rgb(20,20,20)";
const CAPTION_MIN_OFFSET = 2;
const CARENT_COLOUR = "rgb(50,50,50)";
const CARET_HEIGHT = ENTITY_DEFAULT_HEIGHT/7+4;
const CARET_WIDTH = 3;

var JSEnums = {
	MenuItemSelected: { ItemEntity: 'ItemEntity', ItemHand: 'ItemHand', ItemRelation: 'ItemRelation' },
	RelationshipLocation: { N: 1, NE: 2, E: 3, SE: 4, S: 5, SW: 6, W: 7, NW: 8 }
};

var Point = function(x,y){
	this.x = x;
	this.y = y;
}

var Entity = function(x,y,width,height,index){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.index = index; //items with greater index should be drawn on top; it's equivalent of z-index
	this.caption = "Entity";
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
	
	//try strategy pattern here?
	this.getLocationPoint = function(location){
		if(location === JSEnums.RelationshipLocation.N){
			return new Point(this.x + parseInt(this.width / 2), this.y);
		}
		else if(location === JSEnums.RelationshipLocation.NE){
			return new Point(this.x + this.width - ENTITY_REL_SOCKET_OFFSET, this.y);
		}
		else if(location === JSEnums.RelationshipLocation.E){
			return new Point(this.x + this.width, this.y + parseInt(this.height/2));
		}
		else if(location === JSEnums.RelationshipLocation.SE){
			return new Point(this.x + this.width - ENTITY_REL_SOCKET_OFFSET, this.y+this.height);
		}
		else if(location === JSEnums.RelationshipLocation.S){
			return new Point(this.x + parseInt(this.width / 2), this.y+this.height);
		}
		else if(location === JSEnums.RelationshipLocation.SW){
			return new Point(this.x + ENTITY_REL_SOCKET_OFFSET, this.y+this.height);
		}
		else if(location === JSEnums.RelationshipLocation.W){
			return new Point(this.x, this.y + parseInt(this.height/2));
		}
		else if(location === JSEnums.RelationshipLocation.NW){
			return new Point(this.x + ENTITY_REL_SOCKET_OFFSET, this.y);
		}
		else throw new Error("Unknown relationship location - should be in according enum!");
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
		
		ctx.fillStyle = CAPTION_FONT_COLOUR;
		var textMetrics = ctx.measureText(this.caption);
		var textX = (textMetrics.width >= ENTITY_DEFAULT_WIDTH) ? this.x+CAPTION_MIN_OFFSET :
			this.x+((ENTITY_DEFAULT_WIDTH - textMetrics.width)/2);
		
		ctx.textBaseline="top"; 
		ctx.fillText(this.caption, parseInt(textX), parseInt(this.y+ENTITY_DEFAULT_HEIGHT/4));
		//console.log('stroke style:'+ctx.strokeStyle);
		//ctx.fill();
		if(true === this.isCaptionBeingEdited)
			drawCaret(ctx, parseInt(textX+textMetrics.width+4), parseInt(this.y+ENTITY_DEFAULT_HEIGHT/4));
	};
};

var Relationship = function(entityFrom, entityTo, fromPart, toPart, fromLocation, toLocation){
	this.entityFrom = entityFrom;
	this.entityTo = entityTo;
	this.fromPart = fromPart;
	this.toPart = toPart;
	this.fromLocation = fromLocation;
	this.toLocation = toLocation;
	
	this.draw = function(ctx){
		var pointFrom = this.entityFrom.getLocationPoint(this.fromLocation);
		var pointTo = this.entityTo.getLocationPoint(this.toLocation);
		
		ctx.beginPath();
		ctx.moveTo(pointFrom.x, pointFrom.y);
		ctx.lineTo(pointTo.x, pointTo.y);
		ctx.closePath();
		ctx.stroke();
	}
};