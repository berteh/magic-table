function Fisheye()
{
	var focusHeight = 9;
	var lensX = 0;
	var lensY = 0;
	var lensRadius = 30;

	function distanceFromFocus(x, y)
	{
		return distance(x - lensX, y - lensY);
	}

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

	function lens(t)
	{
		return 1 - t;
	}

	function getScaleFactor(x, y)
	{
		var height = heightAtPoint(distanceFromFocus(x, y));
		return 10.0 / (10.0 - height);
	}

	function transformX(x, scale)
	{
		return (x - lensX) * scale + lensX;
	}

	function transformY(y, scale)
	{
		return (y - lensY) * scale + lensY;
	}

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
	
	this.setLensRadius = function(focusRadius)
	{
		lensRadius = focusRadius;
	}
	
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