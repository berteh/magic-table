function fisheyeCheckBoxClickEventHandler(checkbox)
{
	checkbox.fisheyeTable.fisheyeEnabled = checkbox.checked;
	checkbox.fisheyeTable.redraw();
}

function barfillCheckBoxClickEventHandler(checkbox)
{
	checkbox.fisheyeTable.barFillEnabled = checkbox.checked;
	checkbox.fisheyeTable.redraw();
}

/**
 * @param tableModel - contains the data and meta data for rendering the table
 * @param x - the x-axis position of the table
 * @param y - the y-axis position of the table
 * @param width - the table's with
 * @param height - the table's height
 * @param tableTitle - the title that appears above the table
 * @param targetElement - the element in which the table html will be nested. If this is ommitted the table's position
 * will be absolute, otherwise it will be relative to the target element.
 */
function FisheyeTable(tableModel, x, y, width, height, tableTitle, targetElement)
{
	var me = this;
	var id = allocateId();
	this.targetDiv;

	this.fisheyeEnabled = true;
	this.barFillEnabled = false;
	this.autoSize = false;
	
	var DEFAULT_FISHEYE_MARGIN = 43;
	var fisheyeLeftMargin = DEFAULT_FISHEYE_MARGIN;
	var fisheyeRightMargin = DEFAULT_FISHEYE_MARGIN;
	var fisheyeTopMargin = DEFAULT_FISHEYE_MARGIN;
	var fisheyeBottomMargin = DEFAULT_FISHEYE_MARGIN;
	
	var buffer
    var canvas;
	var pixelOffset = 0.5;
	var topMargin = 25;
	var xMargin = 10;
	var bottomMargin = 60;
	var tableWidth;
	var tableHeight;
	var lensRadius = 75;
	var img;
	var bodyMousePosition = null;
	var cells = [];
	var fisheye = null;
	var contentColumnCount;
	var contentRowCount;
	var controlPanel;
	
	var bufferContext = null;
	var canvasContext = null;
	var backgroundColour = 'rgb(0, 0, 0)';
	
	this.setBarFill = function(barfill)
	{
		this.barFillEnabled = barfill;
		this.redraw();
	}
	
	this.enableFisheye = function(setFisheye)
	{
		this.fisheyeEnabled = setFisheye;
		this.redraw();
	}
	
	function allocateId()
	{
		var count = 0;
		var name = "fiheyeTable";
		
		do
		{
			count++;
		}
		while(document.getElementById(name+count))
		
		return name+count;
	}
	
	function getRowHeight(row)
	{
		if (me.fisheyeEnabled) 
		{
			if (me.autoSize || tableModel.rowCount - tableModel.columnHeaderCount == 0) return 15;
			
			var h = (height - (fisheyeTopMargin + fisheyeBottomMargin)) / (tableModel.rowCount - tableModel.columnHeaderCount);
			return h - (h%1);
		}
		
		return tableModel.getRowHeight(row);
	}
	
	function getColumnWidth(column)
	{
		if (me.fisheyeEnabled) 
		{
			if (me.autoSize || tableModel.columnCount - tableModel.rowHeaderCount == 0) return 15;
			
			var w = (width - (fisheyeLeftMargin + fisheyeRightMargin)) / (tableModel.columnCount - tableModel.rowHeaderCount);
			return w - (w%1);
		}
		
		return tableModel.getColumnWidth(column);
	}
	
	function getSumOfRowHeights(justDataRows)
	{
		var sum = 0;
		var startRow;
		
		if (justDataRows == true)
			startRow = tableModel.columnHeaderCount;
		else
			startRow = 0;
			
		for (var i = startRow; i < tableModel.rowCount; i++)
			sum += tableModel.getRowHeight(i);
			
		return sum;
	}
	
	function getSumOfColumnWidths(justDataColumns)
	{
		var sum = 0;
		var startCol;
		
		if (justDataColumns == true)
			startCol = tableModel.rowHeaderCount;
		else
			startCol = 0;
			
		for (var i = startCol; i < tableModel.columnCount; i++)
			sum += tableModel.getColumnWidth(i);
			
		return sum;
	}
	
	this.redraw = function()
	{
		fisheyeLeftMargin = DEFAULT_FISHEYE_MARGIN;
		fisheyeTopMargin = DEFAULT_FISHEYE_MARGIN;
			
		if (!me.fisheyeEnabled)
		{
			fisheyeLeftMargin = 0;
			fisheyeTopMargin = 0;
		}
			
		this.removeTable(id);
		init();
	}
	
	function adjustTableMarginForCellDimensions()
	{
		if (!me.fisheyeEnabled) return;
		
		var marginOffsetX = fisheyeLeftMargin%getColumnWidth();
		var marginOffsetY = fisheyeTopMargin%getRowHeight();
		fisheyeLeftMargin = DEFAULT_FISHEYE_MARGIN;
		
		fisheyeTopMargin = DEFAULT_FISHEYE_MARGIN;
	}
	
    function init()
    {
		var t = me.fisheyeEnabled ? 1 : 0;
		contentColumnCount = (tableModel.columnCount - tableModel.rowHeaderCount * t);
		contentRowCount = (tableModel.rowCount - tableModel.columnHeaderCount * t);
		
		createTargetDiv();
		
        fisheye = new Fisheye();
		fisheye.setLensRadius(lensRadius);
        var IE = document.all ? true : false
        
        if (!targetDiv) 
            return;
			
		adjustTableMarginForCellDimensions();
        setTableSize();
        createTableCanvas(targetDiv, tableWidth, tableHeight);
		setTitle();
		createControlPanel();
		createControlPanelForm();
        
        if (!isCanvasSupported()) 
            return;
        
        canvasContext = canvas.getContext("2d");
		CanvasTextFunctions.enable(canvasContext);
		
		createBackBuffer(tableWidth, tableHeight);
		bufferContext = buffer.getContext("2d");
		CanvasTextFunctions.enable(bufferContext);
		bufferContext.drawImage(canvas, 0, 0, tableWidth, tableHeight);
		
		bufferContext.clearRect(0, 0, canvas.width, canvas.height);
		bufferContext.fillStyle = backgroundColour;
		bufferContext.fillRect(0, 0, tableWidth, tableHeight);
		
		createCells();
        renderAllCells(bufferContext);
		
		targetDiv.onmousemove = getBodyMouseXY;
        addEvent(targetDiv, "mousemove", renderFocus);
		
		canvas.scroll;
    }
	
	function setTableSize()
	{
		if (me.autoSize) 
		{
			tableWidth =  getSumOfColumnWidths(true) + fisheyeLeftMargin + fisheyeRightMargin;
			tableHeight = getSumOfRowHeights(true) + fisheyeTopMargin + fisheyeBottomMargin;
		}
		else 
		{
			tableWidth = width;
			tableHeight = height;
		}
	}
	
	function createTargetDiv()
	{
		this.targetDiv = document.createElement("div");
		this.targetDiv.id = id;
		this.targetDiv.className = "fisheyeTable";
		this.targetDiv.style.background = '#0066fb'
		this.targetDiv.style.position = 'absolute';
		
		if (!targetElement) 
			document.body.appendChild(this.targetDiv);
		else 
			targetElement.appendChild(this.targetDiv);
			
		this.targetDiv.style.left = x + "px";
		this.targetDiv.style.top = y + "px";
	}
	
	function setTitle()
	{
		var titleSpan = document.createElement("span");
		titleSpan.id = "tableTitle";
		titleSpan.innerHTML = tableTitle;
		titleSpan.style.fontFamily = "arial";
		titleSpan.style.fontSize = "15pt";
		
		var titleDiv = document.createElement("div");
		titleDiv.style.position = 'absolute';
		titleDiv.style.width = tableWidth + xMargin + "px";
		titleDiv.style.height = topMargin + "px";
		titleDiv.style.background = '#0066fb'
		
		titleDiv.appendChild(titleSpan);
		titleDiv.style.top =  '0px';
		titleDiv.style.textAlign = "center";
		
		targetDiv.appendChild(titleDiv);
	}
	
	function createControlPanel()
	{
		controlPanel = document.createElement("div");
		controlPanel.id = "controlPanel";
		controlPanel.style.textAlign = "center";
		controlPanel.style.position = 'absolute';
		controlPanel.style.width = tableWidth + "px";
		controlPanel.style.height = (bottomMargin - 10) + "px";
		controlPanel.style.background = '#777777'
		controlPanel.style.left = xMargin/2 + "px";
		controlPanel.style.top = (tableHeight + topMargin + 5) + "px";
		targetDiv.appendChild(controlPanel);
	}
	
	function createControlPanelForm()
	{
		var form = document.createElement("form");
		form.id = "fisheyeTableForm";

		createCheckBox(form, "Fisheye", "fisheyeCheckBoxClickEventHandler(this)", me.fisheyeEnabled);
		createCheckBox(form, "Bar fill", "barfillCheckBoxClickEventHandler(this)", me.barFillEnabled);
		
		controlPanel.appendChild(form);
	}
	
	function createCheckBox(form, label, functionSignature, checked)
	{
		var fisheyeLabel = document.createElement("label");
		fisheyeLabel.innerHTML = label;
		form.appendChild(fisheyeLabel);
		
		var fisheyeCheckBox = document.createElement("input");
		fisheyeCheckBox.checked = checked;
		fisheyeCheckBox.setAttribute("type", "checkbox");
		fisheyeCheckBox.fisheyeTable = me;
		fisheyeCheckBox.setAttribute("onClick", functionSignature);
		fisheyeLabel.appendChild(fisheyeCheckBox);
		
		var spacer = document.createElement("span");
		spacer.innerHTML = "&nbsp;&nbsp;&nbsp;"
		form.appendChild(spacer);
	}
	
	function createBackBuffer(tableWidth, tableHeight)
	{
		buffer = document.createElement("canvas");
		buffer.id = "buffer";
		buffer.className = "buffer";
		targetDiv.appendChild(buffer);
		
		var canvasSize = getDesiredCanvasDimensions();
		
		buffer.setAttribute("width", canvasSize.width);
        buffer.setAttribute("height", canvasSize.height);
		buffer.style.display = "none";
	}
	
	function createTableCanvas(targetDiv, tableWidth, tableHeight)
	{
		targetDiv.style.width = tableWidth + xMargin + 'px';
		targetDiv.style.height = tableHeight + bottomMargin + topMargin + 'px';
		
		var scrolDivContainer = document.createElement("div");
		scrolDivContainer.style.background = '#000000'
		scrolDivContainer.style.position = 'absolute';
		scrolDivContainer.style.width = tableWidth + "px";
        scrolDivContainer.style.height = tableHeight + "px";
		scrolDivContainer.style.left = (targetDiv.clientWidth/2) - (tableWidth/2) + 'px';
		scrolDivContainer.style.top = topMargin + 'px';
		
		var scrollingDiv = document.createElement("div");
		scrollingDiv.style.width = tableWidth + 5 + "px";
        scrollingDiv.style.height = tableHeight + 5 + "px";
		scrollingDiv.style.left = (targetDiv.clientWidth/2) - (tableWidth/2) + 'px';
		scrollingDiv.style.top = topMargin + 'px';
		scrollingDiv.style.overflow = 'auto';
		scrolDivContainer.appendChild(scrollingDiv);
		
		if (!me.fisheyeEnabled)
		{
			scrollingDiv.style.width = tableWidth + "px";
        	scrollingDiv.style.height = tableHeight + "px";
		}
		
		var canvasSize = getDesiredCanvasDimensions();
		
		canvas = document.createElement("canvas");
        canvas.id = "tableCanvas";
		canvas.className = "tableCanvas";
        canvas.setAttribute("width", canvasSize.width);
        canvas.setAttribute("height", canvasSize.height);
		canvas.style.left = '0px';
		canvas.style.top =  '0px';
		scrollingDiv.appendChild(canvas);
		targetDiv.appendChild(scrolDivContainer);
	}
    
    function addEvent(targetDiv, eventName, handlerName)
    {
        if (targetDiv.addEventListener) 
            targetDiv.addEventListener(eventName, handlerName, false);
        else 
            if (targetDiv.attachEvent) 
                targetDiv.attachEvent("on" + eventName, handlerName);
    }
    
    function getBodyMouseXY(evt)
    {
        var x, y;
       	
        if (evt.pageX) 
            x = evt.pageX;
        else 
            if (evt.clientX) 
                x = evt.clientX +
                (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        
        if (evt.pageY) 
            y = evt.pageY;
        else 
            if (evt.clientY) 
                y = evt.clientY +
                (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        
        bodyMousePosition = 
        {
            x: x,
            y: y
        };
    }
    
    var getElementPosition = function(element)
    {
        var posX = element.offsetLeft;
        var posY = element.offsetTop;
        try 
        {
            while (element.offsetParent) 
            {
                posX += element.offsetParent.offsetLeft;
                posY += element.offsetParent.offsetTop;
                
				if (element == document.getElementsByTagName('body')[0]) 
                    break
                else 
                    element = element.offsetParent;
            }
        } 
        catch (e) 
        {
        }
		
        return {x:posX, y:posY};
    }
    
    function getRelativeMousePosition()
    {
        if (bodyMousePosition) 
        {
			var tablePosition = getElementPosition(canvas);
            return {
                x: bodyMousePosition.x - tablePosition.x,
                y: bodyMousePosition.y - tablePosition.y
            };
        }
        
        return null;
    }
    
    function isCanvasSupported()
    {
        if (canvas.getContext) 
            return true;
        else 
            return false;
    }
    
    function createCells()
    {
        var count = 0;
        var leftX, rightX = 0, bottomY = fisheyeTopMargin + pixelOffset, topY;
        var cellWidth;
        var cellHeight;
		var newX;
        
        for (var i = 0; i < contentRowCount; i++) 
        {
			cellHeight = getRowHeight(i);
			newX = fisheyeLeftMargin + pixelOffset;
			
            for (var j = 0; j < contentColumnCount; j++) 
            {
				cellWidth = getColumnWidth(j);
                leftX = newX;
				
				if (j == 0)
					topY = bottomY;
				
				rightX = leftX + cellWidth + pixelOffset;
				bottomY = topY + cellHeight;
				
				newX = rightX - pixelOffset;
                
                cells[count] = new TableCell(leftX, topY, rightX, bottomY);
                count++;
            }
        }
    }
	
	function clearFocusArea(focusDiameter, marginOffsetX, marginOffsetY, mousePosX, mousePosY)
	{
		canvasContext.fillStyle = backgroundColour;
		var fillWidth = focusDiameter-marginOffsetX;
		canvasContext.fillRect(mousePosX+marginOffsetX, mousePosY+marginOffsetY,
			fillWidth, focusDiameter-marginOffsetY);
	}
	
	function renderScaleTextForFisheye(x, y, focusRow, focusColumn)
	{
		var contentWidth =  contentColumnCount * getColumnWidth();
		var contentLeftEdge = fisheyeLeftMargin + pixelOffset;
		var contentRightEdge = contentWidth + contentLeftEdge;
		
		var contentHeight = contentRowCount * getRowHeight();
		var contentTopEdge = fisheyeTopMargin + pixelOffset;
		var contentBottomEdge = contentHeight + contentTopEdge;
		var columnHeader = tableModel.getContentAt(0, focusColumn);
		var rowHeader = tableModel.getContentAt(focusRow, 0);
		
		if (x <= contentRightEdge + 20 && tableModel.columnHeaderCount > 0)
			renderAxisText(x, y, focusRow, focusColumn, contentWidth, contentLeftEdge, contentTopEdge,
				contentBottomEdge, columnHeader, "xAxis");
			
		if (y <= contentBottomEdge + 20 && tableModel.rowHeaderCount > 0)
			renderAxisText(y, x, focusRow, focusColumn, contentHeight, contentTopEdge, contentLeftEdge,
			contentRightEdge, rowHeader, "yAxis");
	}
	
	function renderAxisText(x, y, focusRow, focusColumn, contentWidth, contentLeftEdge, contentTopEdge,
			contentBottomEdge, cellText, axis)
	{
		if (cellText == null) return;
		
		var font = "sans";
	  	var fontsize = 16;
		
		x = contentWidth/2 + contentLeftEdge;
		
		if (y > contentTopEdge + lensRadius)
			y = DEFAULT_FISHEYE_MARGIN/2;
		else
			y = contentBottomEdge + (fisheyeBottomMargin/2) + 5;
		
		canvasContext.strokeStyle = 'rgb(255, 255, 255)';
		
		if (axis == "xAxis")
			canvasContext.drawTextCenter(font, fontsize, x, y, cellText + "");
		else
			canvasContext.drawTextCenter(font, fontsize, y, x, cellText + "", 90);
	}
	
	function renderFocus()
	{
		if (!me.fisheyeEnabled) return;
		
		var mousePosition = getRelativeMousePosition();
		var t = me.fisheyeEnabled ? 1 : 0;
		fisheye.setLensPosition(mousePosition.x, mousePosition.y);
		
		drawBackgroundCells();
		
		var r = lensRadius + Math.max(getRowHeight(), getColumnWidth()) + 10;
		var focusDiameter = r * 2;
		
		var marginOffsetX = fisheyeLeftMargin%getColumnWidth();
		var marginOffsetY = fisheyeTopMargin%getRowHeight();
		
		var mousePosX = mousePosition.x - r;
		var mousePosY = mousePosition.y - r;
		
		var horizontalOffset = (mousePosX - (mousePosX % getColumnWidth())) + marginOffsetX + pixelOffset;
		var verticalOffset = (mousePosY - (mousePosY % getRowHeight())) + marginOffsetY + pixelOffset;
		
		clearFocusArea(focusDiameter, marginOffsetX, marginOffsetY, mousePosX, mousePosY);
		
		var i = 0;
		var j = 0;
		var baseRow, baseCol;
		var cellValue;
		var maxCellArea = 0;
		var focusRow = null, focusColumn = null;
		
		var yPosition;
		do
		{
			xPosition = horizontalOffset;
			j = 0;
			do
			{
				yPosition = i * getRowHeight() + verticalOffset;
				xPosition = j * getColumnWidth() + horizontalOffset;
				
				baseCol = parseInt(xPosition/getColumnWidth()) - parseInt((fisheyeLeftMargin/getColumnWidth()));
				baseRow = parseInt(yPosition/getRowHeight()) - parseInt((fisheyeTopMargin/getRowHeight()));
				
				cellValue = null;
				
				if (baseRow < contentRowCount && baseCol < contentColumnCount)
					cellValue = tableModel.getContentAt(baseRow+tableModel.columnHeaderCount*t, baseCol+tableModel.rowHeaderCount*t);
				
				if (baseRow >= 0  && baseCol >= 0 && baseRow < tableModel.rowCount-tableModel.columnHeaderCount*t && baseCol < tableModel.columnCount-tableModel.rowHeaderCount*t) 
				{
					var cellCoordinates = getFisheyeCellCoordinates(xPosition, yPosition, getColumnWidth(), getRowHeight());
					
					if (cellCoordinates.x1 > 0 && cellCoordinates.y1 > 0) 
					{
						tableModel.getCellRendererAt(baseRow, baseCol, true).drawCell(canvasContext, baseCol+tableModel.rowHeaderCount, cellCoordinates, cellValue, me.barFillEnabled, getColumnWidth());
						
						var cellArea = TableGeometry.getArea(cellCoordinates.x1, cellCoordinates.y1, cellCoordinates.x2, cellCoordinates.y2, cellCoordinates.x3, cellCoordinates.y3, cellCoordinates.x4, cellCoordinates.y4);
						if (cellArea > maxCellArea) 
						{
							maxCellArea = cellArea;
							focusRow = baseRow;
							focusColumn = baseCol;
						}
					}
				}
				
				j++;
			}
			while (xPosition < (mousePosition.x + r) - getColumnWidth())
			i++;
		}
		while (yPosition < (mousePosition.y + r) - getRowHeight())
		
		if (focusRow != null && focusColumn != null)
			renderScaleTextForFisheye(mousePosition.x, mousePosition.y, focusRow+tableModel.columnHeaderCount, focusColumn+tableModel.rowHeaderCount);
	}
	
	function getFisheyeCellCoordinates(xPosition, yPosition, columnWidth, rowHeight)
	{
		var tl, tr, br, bl;
		
		tl = fisheye.transform(
		{
			x: xPosition,
			y: yPosition
		});
		
		tr = fisheye.transform(
		{
			x: xPosition + columnWidth,
			y: yPosition
		});
		
		br = fisheye.transform(
		{
			x: xPosition + columnWidth,
			y: yPosition + rowHeight
		});
		
		bl = fisheye.transform(
		{
			x: xPosition,
			y: yPosition + rowHeight
		});
		
		return {x1:tl.x, y1:tl.y, x2:tr.x, y2:tr.y, x3:br.x, y3:br.y, x4:bl.x, y4:bl.y};
	}
	
	function drawBackgroundCells()
	{
		var canvasSize = getDesiredCanvasDimensions();
		canvasContext.drawImage(buffer, 0, 0, canvasSize.width, canvasSize.height);
	}
	
	function getDesiredCanvasDimensions()
	{
		var h = tableHeight;
		var w = tableWidth;
		
		if (!me.fisheyeEnabled)
		{
			h = getSumOfRowHeights(false);
			w = getSumOfColumnWidths(false);
		}
		
		return {width:w, height:h};
	}
    
    function renderAllCells(bufferContext)
    {
		var tlX, tlY;
		var count = 0;
		var i = contentRowCount;
		var j;
		var cellRenderer;
		var t = me.fisheyeEnabled ? 1 : 0;
		var row, column;
        
		if (contentRowCount > 0 && contentColumnCount > 0)
		{
			do {
				j = contentColumnCount;
				
				do {
					row = contentRowCount - i + tableModel.columnHeaderCount*t;
					column = contentColumnCount - j + tableModel.rowHeaderCount*t;
					var cellValue = tableModel.getContentAt(row, column);
					
					tlX = cells[count].x1;
					tlY = cells[count].y1;
					
					cellRenderer = tableModel.getCellRendererAt(row, column, false);
						
					cellRenderer.drawCell(bufferContext, row, column, tlX, tlY, getColumnWidth(column),
						getRowHeight(row), cellValue, me.fisheyeEnabled, me.barFillEnabled);
					
					count++;
				}
				while (--j > 0)
			}
			while (--i > 0)
		}
		
		drawBackgroundCells();
    }
    
    init();
}

FisheyeTable.prototype.removeTable = function(id)
{
	try
	{
		targetDiv.parentNode.removeChild(document.getElementById(id));
	}
	catch (err){}
}


function TableCell(x1, y1, x2, y2)
{
    this.x1 = x1;
	this.y1 = y1;
    this.x2 = x2;
	this.y2 = y2;
}


var TableGeometry = {};

TableGeometry.getArea = function(tlX, tlY, trX, trY, brX, brY, blX, blY)
{
	return 0.5 * (tlX*trY - trX*tlY + trX*brY - brX*trY + brX*blY - blX*brY + blX*tlY - tlX*blY);
}

TableGeometry.getCentre = function(tlX, tlY, trX, trY, brX, brY, blX, blY)
{
	var second_factor;
	var polygon_area = TableGeometry.getArea(tlX, tlY, trX, trY, brX, brY, blX, blY);
	
    var X = 0;
    var Y = 0;
	var points = [];
	points[0] = {x:tlX, y:tlY};
	points[1] = {x:trX, y:trY};
	points[2] = {x:brX, y:brY};
	points[3] = {x:blX, y:blY};
	points[4] = {x:tlX, y:tlY};
    
    for(var i = 0; i < 4; i++)
    {
        second_factor = points[i].x * points[i + 1].y - points[i + 1].x * points[i].y;
        
        X = (X + (points[i].x + points[i + 1].x) * second_factor);
        Y = (Y + (points[i].y + points[i + 1].y) * second_factor);
    }

    X /= (6 * polygon_area);
    Y /= (6 * polygon_area);

    return {x:X, y:Y};
}


var TableMath = {};

TableMath.isNumber = function(value)
{
	return !isNaN(value) && value != null;
}

TableMath.calculateBarWidth = function(tableModel, cellValue, maxWidth, column)
{
	if (TableMath.isNumber(cellValue)) 
	{
		var minValue = tableModel.getMinValueForColumn(column);
		var maxValue = tableModel.getMaxValueForColumn(column);
		
		if (minValue == maxValue) return maxWidth;
		
		var factor = (cellValue - minValue) / (maxValue - minValue);
		return factor * maxWidth;
	}
	return 0.5;
}

TableMath.calculateBarWidthFraction = function(tableModel, cellValue, maxWidth, column)
{
	if (TableMath.isNumber(cellValue)) 
	{
		var minValue = tableModel.getMinValueForColumn(column);
		var maxValue = tableModel.getMaxValueForColumn(column);
		
		if (minValue == maxValue) return 1;
		
		var factor = (cellValue - minValue) / (maxValue - minValue);
		return factor;
	}
	return 0;
}


var TableGradientColourProvider = {};

TableGradientColourProvider.createGradient = function(tableModel, rgbArray)
{
	return new ColourGradient(tableModel.getMinValue(), tableModel.getMaxValue(), rgbArray);
}

TableGradientColourProvider.getColourFromValue = function(colourGradient, cellValue, defaultColour)
{
	var colr;
				
	if (TableMath.isNumber(cellValue)) 
	{
		var rgbColour = colourGradient.getColour(cellValue);
		colr = 'rgb(' + rgbColour.red + ',' + rgbColour.green + ',' + rgbColour.blue + ')';
	}
	else 
		colr = defaultColour;
		
	return colr;
}