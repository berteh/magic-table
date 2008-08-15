Hashtable.prototype.hash = null;
Hashtable.prototype.keys = null;

/**
 * A JavaScript implementation of a hash table.
 * Original Author: Uzi Refaeli
 * @constructor
 */
function Hashtable()
{
    this.hash = new Array();
    this.keys = new Array();
}

/**
 * Asociate an object with a key in the hash table
 * @member Hashtable
 * @param {Object} key
 * @param {Object} value
 */
Hashtable.prototype.put = function(key, value)
{
    if (value == null) 
        return;
    
    if (this.hash[key] == null) 
        this.keys[this.keys.length] = key;
    
    this.hash[key] = value;
}

/**
 * Get an item corresponding to the given key.
 * @member Hashtable
 * @param key
 * @return the object corresponding to the given key
 */
Hashtable.prototype.get = function(key)
{
    return this.hash[key];
}

/**
 * Returns the number of items in the hash table.
 * @member Hashtable
 */
Hashtable.prototype.size = function()
{
    return this.hash.length;
}


/**
 * Returns a string representation of this Hashtable object in the form of a set of entries,
 * enclosed in braces and separated by the ASCII characters ", " (comma and space).
 * Each entry is rendered as the key, an equals sign =, and the associated element,
 * where the toString method is used to convert the key and element to strings.
 * @member Hashtable
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