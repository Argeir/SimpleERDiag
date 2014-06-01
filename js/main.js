var canvMain = document.getElementById("main-canv");
var ctxMain = canvMain.getContext("2d");
var isMouseDown = false;
var moveFromPoint = null;

const CANV_WIDTH = canvMain.width;
const CANV_HEIGHT = canvMain.height;
const VERSION = 0.4;

document.addEventListener('keydown', handleKeyDown, true);
canvMain.addEventListener('mousedown', handleMouseDown, false);
canvMain.addEventListener('mouseup', function(){ isMouseDown = false; }, false);
canvMain.addEventListener('mousemove', handleMouseMove, false);

$("#version-info > span").text("SimpleERDiag v"+VERSION);

function handleMouseDown(ev){
	isMouseDown = true;
	
	var pos = moveFromPoint = {
       x : ev.pageX - canvMain.offsetLeft,
       y : ev.pageY - canvMain.offsetTop
	};
	
	var activeItem = lowerMenuManager.getSelectedItem();
	//console.log(activeItem);
	//console.info(pos);
	if(activeItem === JSEnums.MenuItemSelected.ItemEntity){		
		entityManager.drawNewEntity(pos.x,pos.y);
	}
	else if(activeItem === JSEnums.MenuItemSelected.ItemHand){
		entityManager.selectEntity(pos.x,pos.y);
	}
	else if(activeItem === JSEnums.MenuItemSelected.ItemRelation){
		
	}
	else throw new Error("Unknown active item selected");
}

function handleMouseMove(ev){
	if(!isMouseDown || lowerMenuManager.getSelectedItem() != 
			JSEnums.MenuItemSelected.ItemHand)
		return;
	
	var pos = {
       x : ev.pageX - canvMain.offsetLeft,
       y : ev.pageY - canvMain.offsetTop
	};
	entityManager.moveEntity(pos.x, pos.y);
}

function handleKeyDown(ev){
	console.info(ev.which);
	var editedEntity = entityManager.getSelectedEntity();
	if(null === editedEntity)
		return;
	
	if(BACKSPACE_CHAR === ev.which && editedEntity.caption.length > 0){
		editedEntity.caption = editedEntity.caption.slice(0,-1); //remove last char
	}
	else if(String.fromCharCode(ev.which) != ""){
		var typedChar = String.fromCharCode(ev.which);
		editedEntity.caption += (true === ev.shiftKey) ? typedChar : typedChar.toLowerCase();
	}
	
	entityManager.redraw();
	//console.log(editedEntity);
}

var entityManager = (function(ctx){
	const entityCollection = [];
	var selectedEntity = null;
	
	function getMaxEntityIndex(){
		if(entityCollection.length === 0)
			return -1;
			
		var maxIndex = -1;
		entityCollection.map(function(item){ if(item.index > maxIndex) maxIndex = item.index; });	
		return maxIndex;
	}
	
	function getEntityByCoordinates(x,y){
		//console.debug(entityCollection);
		var maxIndex = -1;
		var resEntity = null;
		for(var i=0; i < entityCollection.length; i++){
			if(entityCollection[i].containsPoint(x,y) && entityCollection[i].index > maxIndex){
				maxIndex = entityCollection[i].index;
				resEntity = entityCollection[i];
			}
		}
		return resEntity;
	}
	
	function drawAllEntities(){
		ctx.clearRect(0, 0, CANV_WIDTH, CANV_HEIGHT);
		entityCollection.map(function(item){ item.draw(ctx); });
		relationshipManager.drawAllRelationships();
	}
	
	return{
		drawNewEntity: function(x,y){
			var entityX = x-(ENTITY_DEFAULT_WIDTH/2);
			var entityY = y-(ENTITY_DEFAULT_HEIGHT/2);
			var entityIdx = getMaxEntityIndex()+1;
			
			entityCollection.push(new Entity(entityX,entityY,ENTITY_DEFAULT_WIDTH,ENTITY_DEFAULT_HEIGHT,entityIdx));
			drawAllEntities();
		},
		
		selectEntity: function(clickX,clickY){
			entityCollection.map(function(item){ item.isSelected = false; item.isCaptionBeingEdited = false; });
			//entityCollection.sort(function(itemA,itemB){ return itemB.index - itemA.index; });
			
			var clickedEntity = selectedEntity = getEntityByCoordinates(clickX,clickY);
			
			//console.log('selected:');
			//console.log(clickedEntity);
			if(clickedEntity !== null){
				clickedEntity.isSelected = true;
				clickedEntity.isCaptionBeingEdited = true;
			}
			
			drawAllEntities();
		},		
		moveEntity: function(moveToX, moveToY){
			if(selectedEntity === null)
				return;
				
			//console.info('moving');
			//console.info(selectedEntity);
			var deltaX = moveToX - moveFromPoint.x;
			var deltaY = moveToY - moveFromPoint.y;
			
			selectedEntity.x += deltaX;
			selectedEntity.y += deltaY;
			
			drawAllEntities();
			moveFromPoint = { x: moveToX, y: moveToY };
		},		
		getSelectedEntity: function(){
			return selectedEntity;
		},
		getEntity: function(index){
			return entityCollection[index];
		},
		redraw: function(){
			drawAllEntities();
		}
	};
})(ctxMain);

var relationshipManager = (function(ctx){
	const relationshipCollection = [];
	
	return{
		addRelationship: function(entityFrom, entityTo, relFrom, relTo, locFrom, locTo){
			relationshipCollection.push(new Relationship(entityFrom, entityTo, relFrom, relTo, locFrom, locTo));
		},
		drawAllRelationships: function(){
			relationshipCollection.map(function(item){ item.draw(ctx) });
		}
	};
})(ctxMain);
