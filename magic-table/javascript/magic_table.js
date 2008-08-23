function MagicTable(container)
{
	this.containerElement = container;
}

MagicTable.prototype.draw = function(data, options)
{
	var defaultRowHeight = options.defaultRowHeight;
	var defaultColumnWidth = options.defaultColumnWidth;
	var tablePositionX = options.tablePositionX;
	var tablePositionY = options.tablePositionY;
	var tableHeight = options.tableHeight;
	var tableWidth = options.tableWidth;
	var rowHeaderCount = options.rowHeaderCount;
	var columnHeaderCount = options.columnHeaderCount;
	var rows = data.getNumberOfRows();
	var columns = data.getNumberOfColumns();
	var tableModel
	
	tableModel = new TableModel(rows, columns, defaultRowHeight, defaultColumnWidth, rowHeaderCount, columnHeaderCount);

	var i = rows - 1;
	var j;
	
	do
	{
		j = columns - 1;
		do
		{
			tableModel.setContentAt(i, j, data.getFormattedValue(i, j));
		}
		while (j-- > 0) 
	}
	while (i-- > 0)
	
	tableModel.recalculateMinMaxValues();
	
	var fisheyeTable = new FisheyeTable(tableModel, tablePositionX, tablePositionY,
		tableWidth, tableHeight, options.tableTitle, this.containerElement);
	
	fisheyeTable.setBarFill(options.enableBarFill);
	fisheyeTable.enableFisheye(options.enableFisheye);
}

MagicTable.prototype.escapeHtml = function(text)
{
  if (text == null)
    return '';
	
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

MagicTable.load = function()
{
	var sources = [];
	sources[0] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/Hashtable.js";
	sources[1] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/Fisheye.js";
	sources[2] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/javascript/Matrix.js";
	sources[3] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/TableModel.js";
	sources[4] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/fisheyeTable.js";
	sources[5] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/FisheyeCellRenderer.js";
	sources[6] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/DefaultCellRenderer.js";
	sources[7] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/ScaleCellRenderer.js";
	sources[8] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/CanvasTextFunctions.js";
	sources[9] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/ColourGradient.js";
	sources[10] = "http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/Matrix.js";
	
	var e;
	
	for (var i = 0; i < sources.length; i++) 
	{
		e = document.createElement("script");
		e.src = sources[i];
		e.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(e);
	}
}