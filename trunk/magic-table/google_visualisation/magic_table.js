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
		tableWidth, tableHeight, "Bar-fill", this.containerElement);
	
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