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

/**
 * The table model defines the data and meta-data for the table.
 * @author Greg Ross
 * @constructor
 * @param rowCount the number of rows in the table, including headers
 * @param columnCount the number of columns in the able, including headers
 * @param defaultRowHeight the default row height when the fisheye feature is turned off
 * @param defaultColumnWidth the default column width when the fisheye feature is turned off
 * @param rowHeaderCount the number of row headers
 * @param columnHeaderCount the number of column headers
 * @param clrRamp the colour ramp applied to the table to encode numbers
 */
greg.ross.visualisation.TableModel = function(rowCount, columnCount, defaultRowHeight, defaultColumnWidth, rowHeaderCount, columnHeaderCount, clrRamp)
{
	this.matrix = new greg.ross.visualisation.Matrix();
	this.rowCount = rowCount;
	this.columnCount = columnCount;
	this.rowHeaderCount = rowHeaderCount;
	this.columnHeaderCount = columnHeaderCount;
	this.minValue = 0;
	this.maxValue = 0;
	
	this.minRowValues = [];
	this.maxRowValues = [];
	this.minColumnValues = [];
	this.maxColumnValues = [];
	
	this.rowGradients = [];
	
	this.rowHeights = [];
	this.columnWidths = [];
	
	var minRowHeight = 5;
	var minColumnWidth = 5;
	
	var colourRamp;
	
	this.fisheyeColumnWidth = 15;
	this.fisheyeRowHeight = 15;
	
	this.fisheyeCellRenderer = new greg.ross.visualisation.FisheyeCellRenderer(this, colourRamp);
	this.defaultCellRenderer = new greg.ross.visualisation.DefaultCellRenderer(this, greg.ross.visualisation.CellAlignment.CENTRE, colourRamp);
	this.scaleCellRenderer = new greg.ross.visualisation.ScaleCellRenderer(this, greg.ross.visualisation.CellAlignment.CENTRE);
	init();
	
	function init()
	{
		if (clrRamp)
			colourRamp = clrRamp;
		else
			colourRamp = getDefaultColourRamp();
	}
	
	function getDefaultColourRamp()
	{
		var colour1 = {red:0, green:0, blue:255};
		var colour2 = {red:0, green:255, blue:255};
		var colour3 = {red:0, green:255, blue:0};
		var colour4 = {red:255, green:255, blue:0};
		var colour5 = {red:255, green:0, blue:0};
		return [colour1, colour2, colour3, colour4, colour5];
	}
	
	/**
	 * Return the cell render for the cell specified by the given row and column indices.
	 * @member greg.ross.visualisation.TableModel
	 * @param row the row of the cell that is to be rendered
	 * @param column the column of the cell that is to be rendered
	 * @param isFisheyeCell true if the fisheye feature is turned on
	 */
	this.getCellRendererAt = function(row, column, isFisheyeCell)
	{
		if (isFisheyeCell) 
			return this.fisheyeCellRenderer;
		else 
		{
			if (greg.ross.visualisation.TableMath.isNumber(this.rowHeaderCount))
			{
				if (column < this.rowHeaderCount)
					return this.scaleCellRenderer;
			}
			
			if (greg.ross.visualisation.TableMath.isNumber(this.columnHeaderCount))
			{
				if (row < this.columnHeaderCount)
					return this.scaleCellRenderer;
			}
			
			return this.defaultCellRenderer;
		}
	}
	
	/**
	 * Return the height of the given row.
	 * @member greg.ross.visualisation.TableModel
	 * @param row
	 */
	this.getRowHeight = function(row)
	{
		if (!greg.ross.visualisation.TableMath.isNumber(row)) return defaultRowHeight;
		if (!this.rowHeights[row]) return defaultRowHeight;
		
		return this.rowHeights[row];
	}
	
	/**
	 * Return the width of the given column.
	 * @member greg.ross.visualisation.TableModel
	 * @param column
	 */
	this.getColumnWidth = function(column)
	{
		if (!greg.ross.visualisation.TableMath.isNumber(column)) return defaultColumnWidth;
		if (!this.columnWidths[column]) return defaultColumnWidth;
		
		return this.columnWidths[column];
	}
	
	/**
	 * Use this method to set the height of the given row.
	 * @member greg.ross.visualisation.TableModel
	 * @param row
	 * @param height
	 */
	this.setRowHeight = function(row, height)
	{
		this.rowHeights[row] = height;
	}
	
	/**
	 * Use this method to set the width of the given column.
	 * @member greg.ross.visualisation.TableModel
	 * @param column
	 * @param width
	 */
	this.setColumnWidth = function(column, width)
	{
		this.columnWidths[column] = width;
	}
	
	/**
	 * Call this method after adding numerical data to the table. This allows the table to
	 * track the maximum and minimum values across rows and columns.
	 * @member greg.ross.visualisation.TableModel
	 */
	this.recalculateMinMaxValues = function()
	{
		var i = this.rowCount;
		var j = this.columnCount;
		
		this.minRowValues = [];
		this.maxRowValues = [];
		this.minColumnValues = [];
		this.maxColumnValues = [];
		
		do
		{
			j = this.columnCount;
			do
			{
				var row = this.rowCount - i;
				var column = this.columnCount - j
				var value = this.getContentAt(row, column);
				
				if (greg.ross.visualisation.TableMath.isNumber(value)) 
				{
					if (this.minRowValues[row] == undefined) this.minRowValues[row] = value;
					if (this.maxRowValues[row] == undefined) this.maxRowValues[row] = value;
					if (this.minColumnValues[column] == undefined) this.minColumnValues[column] = value;
					if (this.maxColumnValues[column] == undefined) this.maxColumnValues[column] = value;
		
					if (value < this.minRowValues[row]) 
						this.minRowValues[row] = value;
					if (value > this.maxRowValues[row]) 
						this.maxRowValues[row] = value;
					if (value < this.minColumnValues[column]) 
						this.minColumnValues[column] = value;
					if (value > this.maxColumnValues[column]) 
						this.maxColumnValues[column] = value;
				}
			}	
			while(--j > 0)
		}
		while(--i > 0)
		
		this.createRowColourGradients();
	}
	
	/**
	 * This method is called after recalculating the min and max values across the table.
	 * Its purpose is to create colour gradients relative to each row's min and max values.
	 * @member greg.ross.visualisation.TableModel
	 */
	this.createRowColourGradients = function()
	{
		this.rowGradients = [];
		var i = this.rowCount;
		var row;
		
		do
		{
			row = this.rowCount - i;
			this.rowGradients[row] = new greg.ross.visualisation.ColourGradient(this.getMinValueForRow(row), this.getMaxValueForRow(row), colourRamp);
			//greg.ross.visualisation.TableGradientColourProvider.createGradientForRow(tableModel, colourRamp, row);
		}
		while (--i > 0)
	}
	
	/**
	 * Return the value at the cell specified by the row and column parameters.
	 * @member greg.ross.visualisation.TableModel
	 * @param row
	 * @param column
	 */
	this.getContentAt = function(row, column)
	{
		if (!isRowValid(row) || !isColumnValid(column)) return null;
		
		return this.matrix.get([row, column]);
	}
	
	/**
	 * Put a value in the table at the specified row and column.
	 * @member greg.ross.visualisation.TableModel
	 * @param row
	 * @param column
	 * @param value
	 */
	this.setContentAt = function(row, column, value)
	{
		if (!isRowValid(row) || !isColumnValid(column)) return;
		
		this.matrix.put([row, column], value);
		this.fisheyeCellRenderer = new greg.ross.visualisation.FisheyeCellRenderer(this, colourRamp);
		this.defaultCellRenderer = new greg.ross.visualisation.DefaultCellRenderer(this, greg.ross.visualisation.CellAlignment.CENTRE, colourRamp);
		
		if (greg.ross.visualisation.TableMath.isNumber(value))
		{
			value = parseFloat(value);
			
			if (this.minRowValues[row] == undefined) this.minRowValues[row] = value;
			if (this.maxRowValues[row] == undefined) this.maxRowValues[row] = value;
			if (this.minColumnValues[column] == undefined) this.minColumnValues[column] = value;
			if (this.maxColumnValues[column] == undefined) this.maxColumnValues[column] = value;
			
			if (value < this.minRowValues[row]) this.minRowValues[row] = value;
			if (value > this.maxRowValues[row]) this.maxRowValues[row] = value;
			if (value < this.minColumnValues[column]) this.minColumnValues[column] = value;
			if (value > this.maxColumnValues[column]) this.maxColumnValues[column] = value;
		}
	}
	
	function isRowValid(row)
	{
		return row >= 0 && row < rowCount;
	}
	
	function isColumnValid(column)
	{
		return column >= 0 && column < columnCount;
	}
}

/**
 * Determine the smallest numeric value in the table.
 * @member greg.ross.visualisation.TableModel
 */
greg.ross.visualisation.TableModel.prototype.getMinValue = function()
{
	return this.matrix.minValue;
}

/**
 * Determine the largest numeric value in the table.
 * @member greg.ross.visualisation.TableModel
 */
greg.ross.visualisation.TableModel.prototype.getMaxValue = function()
{
	return this.matrix.maxValue;
}

/**
 * Return the smallest numeric value in the given row.
 * @member greg.ross.visualisation.TableModel
 * @param row
 */
greg.ross.visualisation.TableModel.prototype.getMinValueForRow = function(row)
{
	return this.minRowValues[row];
}

/**
 * Return the largest numeric value in the given row.
 * @member greg.ross.visualisation.TableModel
 * @param row
 */
greg.ross.visualisation.TableModel.prototype.getMaxValueForRow = function(row)
{
	return this.maxRowValues[row];
}

/**
 * Return the smallest numeric value in the given column.
 * @member greg.ross.visualisation.TableModel
 * @param column
 */
greg.ross.visualisation.TableModel.prototype.getMinValueForColumn = function(column)
{
	return this.minColumnValues[column];
}

/**
 * Return the largest numeric value in the given column.
 * @member greg.ross.visualisation.TableModel
 * @param column
 */
greg.ross.visualisation.TableModel.prototype.getMaxValueForColumn = function(column)
{
	return this.maxColumnValues[column];
}

/**
 * Return the colour gradient for a given row.
 * @member greg.ross.visualisation.TableModel
 * @param row
 */
greg.ross.visualisation.TableModel.prototype.getColourGradientForRow = function(row)
{
	return this.rowGradients[row];
}


greg.ross.visualisation.CellAlignment = {};
greg.ross.visualisation.CellAlignment.LEFT = 0;
greg.ross.visualisation.CellAlignment.CENTRE = 1;
greg.ross.visualisation.CellAlignment.RIGHT = 2;