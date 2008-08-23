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
var magic_table = {};

magic_table.load = function()
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