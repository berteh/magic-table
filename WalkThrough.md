# A walk-through example #

Create a magic table in 3 simple steps...


---


## Step 1: define the table model ##

Decide on how many rows, columns, headers etc. and specify table dimensions.

```
var defaultRowHeight = 25;
var defaultColumnWidth = 70;
var tablePositionX = 150;
var tablePositionY = 60;
var tableHeight = 400;
var tableWidth = 600;
var rowHeaderCount = 1;
var columnHeaderCount = 1;
var rows = 23 + columnHeaderCount;
var columns = 13 + rowHeaderCount;
```

Now, instantiate the table model...


```
var tableModel = new greg.ross.visualisation.TableModel(rows, columns, defaultRowHeight, defaultColumnWidth, rowHeaderCount, columnHeaderCount);
```


---


## Step 2: add data to the model ##

Use the `setContentAt()` method to define the values that will be rendered in the table.

```
tableModel.setContentAt(0, 0, "expiry/maturity");
tableModel.setContentAt(1, 0, "01-Jan-08");
tableModel.setContentAt(2, 0, "02-Jan-08");
tableModel.setContentAt(3, 0, "03-Jan-08");
```

If there are one or more column or row headers defined on the table model, then the row and column indices from zero to the n-1th headers will be rendered by scale renderers.

### Important: ###

After adding all the data to the model, call the `tableModel.recalculateMinMaxValues()`. This ensures that the values used to determine colours and bar-fills properly reflect the data. It was decided not to call this as part of the the `setContentAt()` method because it would increase the time required to create the model by an order of n<sup>2</sup>. Instead, by calling it once after the addition of the data, the time required is linear with respect to the number of data items (n).

```
tableModel.recalculateMinMaxValues();
```

It is also possible to set individual row heights and column widths:

```
tableModel.setColumnWidth(0, 130);
tableModel.setRowHeight(0, 110);
```


---


## Step 3: define the fisheye table ##

Having defined the table model and the data, it's now time to create the fisheye table.

```
var fisheyeTable = new greg.ross.visualisation.FisheyeTable(tableModel, tablePositionX, tablePositionY,
					tableWidth, tableHeight, "Volatilities", targetElement);
```

If the `targetElement` is specified then the table will be rendered at a position relative to this element. Otherwise, the table will be rendered at a position relative to the body of the page.