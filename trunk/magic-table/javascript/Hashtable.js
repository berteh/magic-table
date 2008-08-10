/*******************************************************************************************
 * Object: Hashtable
 * Description: Implementation of hashtable
 * Original Author: Uzi Refaeli
 *******************************************************************************************/

Hashtable.prototype.hash = null;
Hashtable.prototype.keys = null;

function Hashtable()
{
    this.hash = new Array();
    this.keys = new Array();
}

Hashtable.prototype.put = function(key, value)
{
    if (value == null) 
        return;
    
    if (this.hash[key] == null) 
        this.keys[this.keys.length] = key;
    
    this.hash[key] = value;
}

Hashtable.prototype.get = function(key)
{
    return this.hash[key];
}

Hashtable.prototype.size = function()
{
    return this.hash.length;
}


/**
 * toString
 * Returns a string representation of this Hashtable object in the form of a set of entries,
 * enclosed in braces and separated by the ASCII characters ", " (comma and space).
 * Each entry is rendered as the key, an equals sign =, and the associated element,
 * where the toString method is used to convert the key and element to strings.
 * Return: a string representation of this hashtable.
 */
Hashtable.prototype.toString = function()
{
    try 
    {
        var s = new Array(this.keys.length);
        s[s.length] = "{";
        
        for (var i = 0; i < this.keys.length; i++) 
        {
            s[s.length] = this.keys[i];
            s[s.length] = "=";
            var v = this.hash[this.keys[i]];
            if (v) 
                s[s.length] = v.toString();
            else 
                s[s.length] = "null";
            
            if (i != this.keys.length - 1) 
                s[s.length] = ", ";
        }
    } 
    catch (e) 
    {
        //do nothing here :-)
    }
    finally 
    {
        s[s.length] = "}";
    }
    
    return s.join("");
}