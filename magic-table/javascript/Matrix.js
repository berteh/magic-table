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
 * This class represents an n-dimensional sparse matrix data structure.
 * @author Greg Ross
 * @constructor
 */
greg.ross.visualisation.Matrix = function()
{
    this.space = new greg.ross.visualisation.Hashtable();
	this.minValue = Number.MAX_VALUE;
	this.maxValue = Number.MIN_VALUE;
	
	this.isHashtable = function(value)
	{
		var isHash = false;
		
		if (typeof(value) == 'object')
		{
			var criterion = value.constructor.toString().match(/this.hash/i); 
			
			if (criterion != null)
				return true;
		}
		
		return isHash;
	}
	
	/**
	 * Return the maximum numeric value in the matrix.
	 * @member greg.ross.visualisation.Matrix
	 */
	this.getMaxValue = function()
	{
		return maxValue;
	}
	
	/**
	 * Return the minimum numeric value in the matrix.
	 * @member greg.ross.visualisation.Matrix
	 */
	this.getMinValue = function()
	{
		if (!isNan(minValue))
			return minValue;
	}
}

/**
 * Put a new value in the matrix.
 * @member greg.ross.visualisation.Matrix
 * @param indices an array specifying the n-dimensional element indices, e.g. [1, 0, 0, 2]
 * @param value
 */
greg.ross.visualisation.Matrix.prototype.put = function(indices, value)
{
	if (greg.ross.visualisation.TableMath.isNumber(value))
	{
		value = parseFloat(value);
		
		if (value < this.minValue) this.minValue = value;
		if (value > this.maxValue) this.maxValue = value;
	}
	
	var index = indices[0];
	var hash = this.space;
	
	for (var i = 1; i < indices.length; i++)
	{
		index = indices[i];
		var previousIndex = indices[i-1];
		var tempHash = hash.get(previousIndex);
		
		if (tempHash == null)
		{
			var newHash = new greg.ross.visualisation.Hashtable();
			hash.put(previousIndex, newHash);
			hash = newHash;	
		}
		else if (!this.isHashtable(tempHash))
		{
			var oldValue = tempHash;
			var newHash = new greg.ross.visualisation.Hashtable();
			hash.put(previousIndex, newHash);
			hash = newHash;
			hash.put(0, oldValue);
		}
		else
			hash = tempHash;	
	}
	
	if (this.isHashtable(hash.get(index)))
	{
		var tempHash = hash.get(index);
		tempHash.put(0, value);
	}
	else
		hash.put(index, value);
}

/**
 * Return a value from the matrix.
 * @member greg.ross.visualisation.Matrix
 * @param indices an array specifying the n-dimensional element indices, e.g. [1, 0, 0, 2]
 */
greg.ross.visualisation.Matrix.prototype.get = function(indices)
{
	var index = indices[0];
	var hash = this.space;
	
	for (var i = 1; i < indices.length; i++)
	{
		index = indices[i];
		var previousIndex = indices[i-1];
		
		if (!this.isHashtable(hash))
			if (index != 0)
				return null;
			else
				break;
		
		hash = hash.get(previousIndex);
		
		if (hash == null)
			return null;
	}
	
	if (!this.isHashtable(hash))
		return hash;
		
	return hash.get(index);
}

greg.ross.visualisation.Matrix.prototype.space = null;