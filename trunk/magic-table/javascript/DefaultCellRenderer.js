function DefaultCellRenderer(tableModel, cellAlignment, colourRamp)
{
	var colourGradient;
	var defaultCellBackgroundColour = 'rgb(255, 255, 255)';
	var gridColour = 'rgb(0, 0, 0)';
	
	function init()
	{
		colourGradient = TableGradientColourProvider.createGradient(tableModel, colourRamp);
	}
	
	function renderCellText(canvasContext, cellValue, x1, y1, width, height, fisheyeEnabled)
	{
		if (cellValue == null) return;
		
		var sValue = cellValue + "";
		var font = "sans";
	  	var fontsize = 10;
		
		if (CanvasTextFunctions.measure(font, fontsize, sValue) < width && !fisheyeEnabled) 
		{
			var h = CanvasTextFunctions.descent(font, fontsize) + fontsize;
			var x = (x1 + width) - width / 2;
			var y = (y1 + height) - height / 2;
			
			switch (cellAlignment)
			{
				case CellAlignment.LEFT:
				{
					canvasContext.drawText(font, fontsize, x1+3, y + h/2, sValue);
					break;
				}
				case CellAlignment.CENTRE:
				{
					canvasContext.drawTextCenter(font, fontsize, x, y + h/2, sValue);
					break;
				}
				case CellAlignment.RIGHT:
				{
					x = x1 + width - 3;
					canvasContext.drawTextRight(font, fontsize, x, y + h/2, sValue);
					break;
				}
			}
		}
	}
	
	init();
	
	this.drawCell = function(canvasContext, row, column, x1, y1, width, height, cellValue, fisheyeEnabled, barFillEnabled)
	{
		var colr = TableGradientColourProvider.getColourFromValue(colourGradient, cellValue, defaultCellBackgroundColour);
		
		if (!barFillEnabled) 
		{
			canvasContext.fillStyle = colr;
			canvasContext.fillRect(x1+0.5, y1+0.5, width-0.5, height-0.5);
		}
		else
		{
			canvasContext.fillStyle = defaultCellBackgroundColour;
			canvasContext.fillRect(x1+0.5, y1+0.5, width-0.5, height-0.5);
			
			var barWidth = TableMath.calculateBarWidth(tableModel, cellValue, width, column);
			canvasContext.fillStyle = colr;
			canvasContext.fillRect(x1+0.5, y1+0.5, barWidth, height-0.5);
		}
		
		canvasContext.strokeStyle = gridColour;
        canvasContext.lineWidth = 1;
		canvasContext.beginPath();
		canvasContext.moveTo(x1, y1 + height);
		canvasContext.lineTo(x1+width, y1+height);
		canvasContext.lineTo(x1 + width, y1);
		canvasContext.stroke();
		
		renderCellText(canvasContext, cellValue, x1, y1, width, height, fisheyeEnabled);
	}
}
