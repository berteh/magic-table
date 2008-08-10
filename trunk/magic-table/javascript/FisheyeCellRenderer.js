function FisheyeCellRenderer(tableModel, colourRamp)
{
	var colourGradient;
	var defaultCellBackgroundColour = 'rgb(255, 255, 255)';
	var gridColour = 'rgb(0, 0, 0)';
	
	function init()
	{
		colourGradient = TableGradientColourProvider.createGradient(tableModel, colourRamp);
	}
	
	function renderCellText(canvasContext, cellValue, tlX, tlY, trX, trY, brX, brY, blX, blY)
	{
		if (cellValue == null) return;
		
		var sValue = cellValue + "";
		var font = "sans";
	  	var fontsize = 10;
		var centerPoint = TableGeometry.getCentre(tlX, tlY, trX, trY, brX, brY, blX, blY);
		canvasContext.drawTextCenter(font, fontsize, centerPoint.x, centerPoint.y, sValue);
	}
	
	this.drawCell = function(canvasContext, column, cellCoordinates, cellValue, barFillEnabled, cellWidth)
	{
		var colr = TableGradientColourProvider.getColourFromValue(colourGradient, cellValue, defaultCellBackgroundColour);
		
		if (!barFillEnabled) 
		{
			canvasContext.fillStyle = colr;
			canvasContext.beginPath();
			canvasContext.moveTo(cellCoordinates.x1, cellCoordinates.y1);
			canvasContext.lineTo(cellCoordinates.x2, cellCoordinates.y2);
			canvasContext.lineTo(cellCoordinates.x3, cellCoordinates.y3);
			canvasContext.lineTo(cellCoordinates.x4, cellCoordinates.y4);
			canvasContext.lineTo(cellCoordinates.x1, cellCoordinates.y1);
			canvasContext.fill();
			
			canvasContext.strokeStyle = gridColour;
			canvasContext.lineWidth = 0.5;
			canvasContext.stroke();
		}
		else
		{
			// Fill polygon background for fisheye cell.
			canvasContext.fillStyle = defaultCellBackgroundColour;
			canvasContext.beginPath();
			canvasContext.moveTo(cellCoordinates.x1, cellCoordinates.y1);
			canvasContext.lineTo(cellCoordinates.x2, cellCoordinates.y2);
			canvasContext.lineTo(cellCoordinates.x3, cellCoordinates.y3);
			canvasContext.lineTo(cellCoordinates.x4, cellCoordinates.y4);
			canvasContext.lineTo(cellCoordinates.x1, cellCoordinates.y1);
			canvasContext.fill();
			
			canvasContext.strokeStyle = gridColour;
			canvasContext.lineWidth = 0.5;
			canvasContext.stroke();
			
			// Calculate and fill polygon according to cell value.
			var widthFraction = TableMath.calculateBarWidthFraction(tableModel, cellValue, cellWidth, column);
			
			canvasContext.fillStyle = colr;
			canvasContext.beginPath();
			canvasContext.moveTo(cellCoordinates.x1, cellCoordinates.y1);
			
			var dx = parseFloat((cellCoordinates.x2 - cellCoordinates.x1) * widthFraction) + cellCoordinates.x1;
			var dy = parseFloat((cellCoordinates.y2 - cellCoordinates.y1) * widthFraction) +  cellCoordinates.y1;
			canvasContext.lineTo(dx, dy);
			
			dx =  parseFloat((cellCoordinates.x3 - cellCoordinates.x4) * widthFraction) + cellCoordinates.x4;
			dy = parseFloat((cellCoordinates.y3 - cellCoordinates.y4) * widthFraction) + cellCoordinates.y4;
			
			canvasContext.lineTo(dx, dy-0.5);
			canvasContext.lineTo(cellCoordinates.x4, cellCoordinates.y4-0.5);
			canvasContext.lineTo(cellCoordinates.x1, cellCoordinates.y1);
			canvasContext.fill();
			
			// Stroke the path.			
			canvasContext.beginPath();
			canvasContext.moveTo(cellCoordinates.x1, cellCoordinates.y1);
			var dx = parseFloat((cellCoordinates.x2 - cellCoordinates.x1) * widthFraction) + cellCoordinates.x1;
			var dy = parseFloat((cellCoordinates.y2 - cellCoordinates.y1) * widthFraction) +  cellCoordinates.y1;
			canvasContext.lineTo(dx, dy);
			
			dx =  parseFloat((cellCoordinates.x3 - cellCoordinates.x4) * widthFraction) + cellCoordinates.x4;
			dy = parseFloat((cellCoordinates.y3 - cellCoordinates.y4) * widthFraction) + cellCoordinates.y4;
			
			canvasContext.moveTo(dx, dy);
			canvasContext.lineTo(cellCoordinates.x4, cellCoordinates.y4);
			canvasContext.lineTo(cellCoordinates.x1, cellCoordinates.y1);
			
			canvasContext.strokeStyle = gridColour;
			canvasContext.lineWidth = 0.5;
			canvasContext.stroke();
		}
		
		var cellArea = TableGeometry.getArea(cellCoordinates.x1, cellCoordinates.y1, cellCoordinates.x2, cellCoordinates.y2, cellCoordinates.x3, cellCoordinates.y3, cellCoordinates.x4, cellCoordinates.y4);
		
		if (cellArea > 1500) 
			renderCellText(canvasContext, cellValue, cellCoordinates.x1, cellCoordinates.y1, cellCoordinates.x2, cellCoordinates.y2, cellCoordinates.x3, cellCoordinates.y3, cellCoordinates.x4, cellCoordinates.y4);
	}
	
	init();
}
