Matrix.prototype.space = null;

function Matrix()
{
    this.space = new Hashtable();
	this.minValue = Number.MAX_VALUE;
	this.maxValue = Number.MIN_VALUE;
	
	this.isHashtable = function(value)
	{
		var isHash = false;
		
		if (typeof(value) == 'object')
		{
			var criterion = value.constructor.toString().match(/hashtable/i); 
			
			if (criterion != null)
				return true;
		}
		
		return isHash;
	}
	
	this.getMaxValue = function()
	{
		return maxValue;
	}
	
	this.getMinValue = function()
	{
		if (!isNan(minValue))
			return minValue;
	}
}

Matrix.prototype.put = function(indices, value)
{
	if (TableMath.isNumber(value))
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
			var newHash = new Hashtable();
			hash.put(previousIndex, newHash);
			hash = newHash;	
		}
		else if (!this.isHashtable(tempHash))
		{
			var oldValue = tempHash;
			var newHash = new Hashtable();
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

Matrix.prototype.get = function(indices)
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