/*

Copyright by Greg Ross, 2008

This file is part of Magic Table.

Magic Table is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Magic Table is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Magic Table.  If not, see <http://www.gnu.org/licenses/>.
*/

function Table(tableContainer, model, x, y)
{
	me = this;
    this.model = model;
    var tableWidth = model.columnCount * model.columnWidth;
    var tableHeight = model.rowCount * model.rowHeight;
    var tableArea;
	var cellClassName = "tableCell";
	var cellBackgroundColour = "#aaaaff";
	var focusColour = "#ff6666";
	var focusCell = null;
	var focusColumn = null;
	var tableBackColour = '##aaaaff';
	var ID_DELIMITER = "_";
	var parentShape;
	var pathObject;
	var fisheye = new Fisheye();
    
	init();
	
    function drawOuterBox()
    {
        var box = document.createElement("v:rect");
        box.style.left = 0 + "px";
        box.style.top = 0 + "px";
        box.style.width = tableWidth + "px";
        box.style.height = tableHeight + "px";
        box.strokecolor = "#777777";
        box.fillcolor = tableBackColour;
        
        var boxFill = document.createElement("v:fill");
        boxFill.type = "solid";
        boxFill.color2 = "fill lighten(0)";
        boxFill.method = "sigma";
        boxFill.angle = 45;
        boxFill.focus = "50%";
        box.appendChild(boxFill);
        
        tableArea.appendChild(box);
    }

	function setupCellShape()
	{
		parentShape = document.createElement("v:shape");
		parentShape.id = cellClassName + ID_DELIMITER + i + ID_DELIMITER + j;
		parentShape.className = cellClassName;
		parentShape.style.left = "0px";
		parentShape.style.top = "0px";
		parentShape.style.width = tableWidth + "px";
		parentShape.style.height = tableHeight + "px";
		parentShape.strokecolor = "#000000";
		parentShape.fillcolor = cellBackgroundColour;
		
		var cellFill = document.createElement("v:fill");
		cellFill.type = "solid";
		cellFill.color2 = "fill lighten(0)";
		cellFill.method = "sigma";
		cellFill.angle = 135;
		cellFill.focus = "50%";
		parentShape.appendChild(cellFill);
		
		pathObject = document.createElement("v:path");
	}
    
    function renderCells()
    {
		var rowCount = me.model.rowCount;
		var colCount = me.model.columnCount;
		var cellWidth = me.model.columnWidth;
		var cellHeight = me.model.rowHeight;
		var cellPath = "";
		
        for (var i = 0; i < rowCount; i++) 
        {
            for (var j = 0; j < colCount; j++) 
            {
				var left = j * cellWidth;
				var top = i * cellHeight;
				
				cellPath += getCellDimension(left, top, (left + cellWidth), (top + cellHeight));
            }
        }
		
		pathObject.v = cellPath + " e";
    }
    
    function init()
    {
        tableArea = document.createElement("v:group");
        tableArea.setAttribute("className", "vgroupstyle");
        tableArea.coordorigin = "0, 0";
		tableArea.coordsize = tableWidth + "," + tableHeight;
        tableArea.style.top = "0px";
        tableArea.style.left = "0px";
        tableArea.style.width = tableWidth + "px";
        tableArea.style.height = tableHeight + "px";
		
		var targetDiv = document.createElement("div");
		targetDiv.id = 'tableDiv';
        targetDiv.appendChild(tableArea);
		targetDiv.style.width = tableWidth + "px";
		targetDiv.style.height = tableHeight + "px"
		targetDiv.style.top = y;
		targetDiv.style.left = x;
		
		tableContainer.appendChild(targetDiv);

        drawOuterBox();
		setupCellShape();
		renderCells();
		parentShape.appendChild(pathObject);
		tableArea.appendChild(parentShape);
		
		//document.attachEvent("onmousemove", expandCell);
		document.attachEvent("onmousemove", expandColumn);
    }
    
	function expandCell()
	{
		var cellShape = window.event.srcElement;
		var cellPath;
		
		if (typeof cellShape == 'object') 
		{
			if (cellShape.className == cellClassName) 
			{
				// Expand cell;
				if (focusCell != cellShape)
				{
					
				}
				
				cellWidth = me.model.columnWidth;
				cellHeight = me.model.rowHeight;
				
				// Contract previous.
				if (focusCell != null && focusCell != cellShape)
				{
					
				}
				
				focusCell = cellShape;
			}
		}
	}
	
	function expandColumn()
	{
		var cellShape = window.event.srcElement;
		var cellPath;
		var col;
		
		if (typeof cellShape == 'object') 
		{
			if (cellShape.className == cellClassName) 
			{
				var xCoord = window.event.x ;
		        var yCoord = window.event.y ;
				//self.status = "X= "+ xCoord + "  Y= " + yCoord; 
				
				fisheye.setLensPosition(xCoord, yCoord);
				
				renderCells();
		
				// Expand column.
				if (focusColumn != col)
				{
					
				}
				
				cellWidth = me.model.columnWidth;
				cellHeight = me.model.rowHeight;
				
				// Contract previous.
				if (focusColumn != null && focusColumn != col)
				{
					
				}
				
				focusColumn = col;
			}
		}
	}
	
	function setCellDimension(cell, x1, y1, x2, y2)
	{
		var path = "m " + x1 + "," + y1;
		path +=  " l " + x2 + "," + y1;
		path += "," + x2 + "," + y2;
		path += "," + x1 + "," + y2;
		path += "," + x1 + "," + y1;
		path += " e ";
		cell.v = path;
	}
	
	function getCellDimension(x1, y1, x2, y2)
	{
		var tl = fisheye.transform({x:x1, y:y1});
		var tr = fisheye.transform({x:x2, y:y1});
		var br = fisheye.transform({x:x2, y:y2});
		var bl = fisheye.transform({x:x1, y:y2});
		
		var path = "m " + tl.x + "," + tl.y;
		path +=  " l " + tr.x + "," + tr.y;
		path += "," + br.x + "," + br.y;
		path += "," + bl.x + "," + bl.y;
		path += "," + tl.x + "," + tl.y;
		
		return path;
	}
	
	function duffLoopModifyColumn(iterations)
	{
	    var row = -1;
	    var n = iterations / 8;
	    var caseTest = iterations % 8;    
	
	    do 
		{
	        switch (caseTest)
	        {
		        case 0: row += 1;
		        case 7: row += 1;
		        case 6: row += 1;
		        case 5: row += 1;
		        case 4: row += 1;
		        case 3: row += 1;
		        case 2: row += 1;
		        case 1: row += 1;
	        }
	        caseTest = 0;
	    }
	    while (--n > 0);
	}
}
