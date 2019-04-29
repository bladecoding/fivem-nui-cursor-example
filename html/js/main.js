theWheel = null;
function hideWheel() {
	$('#wheelparent').hide();
	theWheel.removeWheel();
	theWheel = null;
}
function showWheel() {
	$('#wheelparent').show();
	theWheel = new wheelnav("wheel");
	theWheel.slicePathFunction = slicePath().DonutSlice;
	theWheel.clockwise = false;
	theWheel.clickModeRotate = false;
	theWheel.colors = ['#3299BB'];
	theWheel.selectedNavItemIndex = null;
	theWheel.createWheel(["A", "B", "C", "D"]);
	for(let n of theWheel.navItems) {
		n.navigateFunction = function() {
			$.post(`http://${GetParentResourceName()}/wheelResult`, JSON.stringify({
				clicked: theWheel.currentClick, 
				clickedTitle: theWheel.navItems[theWheel.currentClick].title
			}));
			hideWheel();
		};
	}
}


hoveredElement = null;
window.addEventListener('message', (event) => {
    const item = event.data

    switch(item.action) {
        case 'SetVisible':
					if (item.visible) {
						showWheel();
					} else {
						hideWheel();
					}
          break;
				case 'Mouse':
					//Simulate mouse events from Lua
					var ev = document.createEvent("MouseEvent");
					var el = document.elementFromPoint(item.x, item.y);
					ev.initMouseEvent(
							item.type,
							true /* bubble */, true /* cancelable */,
							window, null,
							item.x, item.y, 0, 0, /* coordinates */
							false, false, false, false, /* modifier keys */
							0 /*left*/, null
					);
					el.dispatchEvent(ev);
					
					//Simulate hover events
					if (item.type == "mousemove" && hoveredElement != el) {
						//mouseout the old element
						if (hoveredElement != null) {
							var ev = document.createEvent("MouseEvent");
							ev.initMouseEvent(
									'mouseout',
									true /* bubble */, true /* cancelable */,
									window, null,
									item.x, item.y, 0, 0, /* coordinates */
									false, false, false, false, /* modifier keys */
									0 /*left*/, null
							);
							hoveredElement.dispatchEvent(ev);
						}
						
						//mouseover the new element
						hoveredElement = el; 
						var ev = document.createEvent("MouseEvent");
						ev.initMouseEvent(
								'mouseover',
								true /* bubble */, true /* cancelable */,
								window, null,
								item.x, item.y, 0, 0, /* coordinates */
								false, false, false, false, /* modifier keys */
								0 /*left*/, null
						);
						hoveredElement.dispatchEvent(ev);
					}
					break;
    }
});

$(document).ready(function() {	
	document.body.addEventListener("mousemove", function(event) {
        var cursor = document.getElementById("cursor");
        var x = event.screenX - 4;
        var y = event.screenY - 4;
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
  });
});
