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
 * Fisheye lens model
 * @constructor
 */
function Fisheye()
{
	var focusHeight = 9;
	var lensX = 0;
	var lensY = 0;
	var lensRadius = 30;

	/**
	 * Return the Euclidean distance of the given point from the lens focus
	 * @member Fisheye
	 * @param x
	 * @param y
	 */
	function distanceFromFocus(x, y)
	{
		return distance(x - lensX, y - lensY);
	}

	/**
	 * Return the height at a point on the lens' surface
	 * @member Fisheye
	 * @param distance
	 */
	function heightAtPoint(distance)
	{
		if (focusHeight == 0 || distance > lensRadius)
			return 0;
		else
		{
			var t = distance / lensRadius;
			return Math.min(focusHeight * lens(t), focusHeight);
		}
	}

	/**
	 * The function that defines the lens shape.
	 * @member Fisheye
	 * @param t
	 */
	function lens(t)
	{
		return 1 - t;
	}

	function getScaleFactor(x, y)
	{
		var height = heightAtPoint(distanceFromFocus(x, y));
		return 10.0 / (10.0 - height);
	}

	/**
	 * transform the given coordinate according to its position under the lens
	 * @member Fisheye
	 * @param point the x coordinate of a point
	 */
	function transformX(x, scale)
	{
		return (x - lensX) * scale + lensX;
	}

	/**
	 * transform the given coordinate according to its position under the lens
	 * @member Fisheye
	 * @param point the y coordinate of a point
	 */
	function transformY(y, scale)
	{
		return (y - lensY) * scale + lensY;
	}

	/**
	 * transform the given coordinate according to its position under the lens
	 * @member Fisheye
	 * @param point the x-y coordinate of a point
	 */
	this.transform = function(point)
	{
		var scaleFactor = getScaleFactor(point.x, point.y);
		var newPoint = {x:point.x, y:point.y};

		if (scaleFactor != 1)
		{
			newPoint.x = Math.ceil(transformX(newPoint.x, scaleFactor));
			newPoint.y = Math.ceil(transformY(newPoint.y, scaleFactor));
			return newPoint;
		}

		return point;
	}
	
	/**
	 * Sets the radius of the lens
	 * @member Fisheye
	 * @param focusRadius
	 */
	this.setLensRadius = function(focusRadius)
	{
		lensRadius = focusRadius;
	}
	
	/**
	 * Sets the position of the lens.
	 * @member Fisheye
	 * @param x
	 * @param y
	 */
	this.setLensPosition = function(x, y)
	{
		setLensX(x);
		setLensY(y);
	}

	function setLensX(focusX)
	{
		if (lensX == focusX)
			return;
			
		lensX = focusX;
	}

	function setLensY(focusY)
	{
		if (lensY == focusY) return;
		
		lensY = focusY;
	}
	
	function distance(dx, dy)
	{
		return Math.sqrt((dx * dx) + (dy * dy));
	}
}