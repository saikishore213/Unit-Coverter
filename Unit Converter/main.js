
var property = new Array();
var unit = new Array();
var factor = new Array();

 
property[0] = "Area";
unit[0] = new Array("Square meter (m^2)", "Acre (acre)", "Hectare", "Square centimeter", "Square kilometer",  "Square foot (ft^2)", "Square inch (in^2)", "Square mile (mi^2)", "Square yard (yd^2)");
factor[0] = new Array(1, 4046.856, 10000, .0001, 1000000, 9.290304E-02, 6.4516E-04, 2589988, .8361274);

property[1] = "Energy";
unit[1] = new Array("Joule (J)",  "Calorie (SI) (cal)",  "Horsepower-hour", "Kilocalorie (SI)(kcal)", "Kilocalorie (mean)(kcal)", "Kilowatt-hour (kW hr)", "Watt-hour (W hr)", "Watt-second (W sec)");
factor[1] = new Array(1,  4.1868,  2684077.3, 4186.8, 4190.02, 3600000,  3600, 1);

property[2] = "Length";
unit[2] = new Array("Meter (m)", "Angstrom (A')", "Centimeter (cm)", "Kilometer (km)",  "Foot (ft)", "Inch (in)", "Micrometer (mu-m)",  "Millimeter (mm)", "Nanometer (nm)", "Mile (nautical)", "Yard (yd)");
factor[2] = new Array(1, 1E-10,  .01, 1000, .3048, .0254, .000001,  .001, 1E-9, 1852, .9144);

property[3] = "Weight";
unit[3] = new Array("Kilogram (kgr)", "Gram (gr)", "Milligram (mgr)", "Microgram (mu-gr)", "Carat (metric)(ct)", "Pound mass (lbm)", "Ounce mass (ozm)", "Ton (metric)", "Tonne");
factor[3] = new Array(1, .001, 1e-6, .000000001, .0002, .4535924, .02834952,  1000, 1000);

property[4] = "Power";
unit[4] = new Array("Watt (W)", "Kilowatt (kW)", "Megawatt (MW)", "Milliwatt (mW)", "Calorie (thermo)/second", "Calorie (thermo)/minute",  "Kilocalorie (thermo)/min", "Kilocalorie (thermo)/sec");
factor[4] = new Array(1, 1000, 1000000, .001, .2930667, 6.973333E-02, 69.7333, 4184);

property[5] = "Temperature";
unit[5] = new Array("Degrees Celsius ('C)", "Degrees Fahrenheit ('F)", "Degrees Kelvin ('K)", "Degrees Rankine ('R)");
factor[5] = new Array(1, 0.555555555555, 1, 0.555555555555);
tempIncrement = new Array(0, -32, -273.15, -491.67);

property[6] = "Time";
unit[6] = new Array("Second (sec)", "Day (mean solar)", "Day (sidereal)", "Hour (mean solar)", "Hour (sidereal)", "Minute (mean solar)", "Minute (sidereal)", "Month (mean calendar)", "Second (sidereal)", "Year (calendar)", "Year (tropical)", "Year (sidereal)");
factor[6] = new Array(1, 8.640E4, 86164.09, 3600, 3590.17, 60, 60, 2628000, .9972696, 31536000, 31556930, 31558150);

property[7] = "Speed";
unit[7] = new Array("Meter/second (m/sec)", "Foot/minute (ft/min)", "Foot/second (ft/sec)", "Kilometer/hour (kph)", "Mile (US)/hour (mph)", "Mile (nautical)/hour", "Mile (US)/minute", "Mile (US)/second","Mach (STP)(a)");
factor[7] = new Array(1, 5.08E-03, .3048, .2777778, .44707, .514444, 26.8224, 1609.344, 340.0068750);

property[8] = "Volume";
unit[8] = new Array("Cubic Meter (m^3)", "Cubic centimeter (cm^3)", "Cubic millimeter (mm^3)", "Cubic foot (ft^3)", "Gallon", "Cubic inch (in^3)", "Liter ",  "Ounce ",  "Cubic yard");
factor[8] = new Array(1, .000001, .000000001, .02831685, .003785412, .00001638706, .001, .00002957353,  .7645549);


//  Functions


function UpdateUnitMenu(propMenu, unitMenu) {
  // Updates the units displayed in the unitMenu according to the selection of property in the propMenu.
  var i;
  i = propMenu.selectedIndex;
  FillMenuWithArray(unitMenu, unit[i]);
}

function FillMenuWithArray(myMenu, myArray) {
  // Fills the options of myMenu with the elements of myArray.
  var i;
  myMenu.length = myArray.length;
  for (i = 0; i < myArray.length; i++) {
    myMenu.options[i].text = myArray[i];
  }
}

function CalculateUnit(sourceForm, targetForm) {
  // A simple wrapper function to validate input before making the conversion
  var sourceValue = sourceForm.unit_input.value;

  // First check if the user has given numbers or anything that can be made to one...
  sourceValue = parseFloat(sourceValue);
  if (!isNaN(sourceValue) || sourceValue == 0) {
    // If we can make a valid floating-point number, put it in the text box and convert!
    sourceForm.unit_input.value = sourceValue;
    ConvertFromTo(sourceForm, targetForm);
  }
}

function ConvertFromTo(sourceForm, targetForm) {
  // Converts the contents of the sourceForm input box to the units specified in the targetForm unit menu and puts the result in the targetForm input box.In other words, this is the heart of the whole script...
  var propIndex;
  var sourceIndex;
  var sourceFactor;
  var targetIndex;
  var targetFactor;
  var result;

  // Start by checking which property we are working in...
  propIndex = document.property_form.the_menu.selectedIndex;

  // Let's determine what unit are we converting FROM (i.e. source) and the factor needed to convert that unit to the base unit.
  sourceIndex = sourceForm.unit_menu.selectedIndex;
  sourceFactor = factor[propIndex][sourceIndex];

 
  targetIndex = targetForm.unit_menu.selectedIndex;
  targetFactor = factor[propIndex][targetIndex];


  result = sourceForm.unit_input.value;
  // Handle Temperature increments!
  if (property[propIndex] == "Temperature") {
    result = parseFloat(result) + tempIncrement[sourceIndex];
  }
  result = result * sourceFactor;

  // use the targetFactor to convert FROM the base unit
  // to the target unit...
  result = result / targetFactor;
  // Again, handle Temperature increments!
  if (property[propIndex] == "Temperature") {
    result = parseFloat(result) - tempIncrement[targetIndex];
  }

  // All that's left is to update the target input box:
  targetForm.unit_input.value = result;
}

// This fragment initializes the property dropdown menu using the data defined above in the 'Data Definitions' section
window.onload = function(e) {
  FillMenuWithArray(document.property_form.the_menu, property);
  UpdateUnitMenu(document.property_form.the_menu, document.form_A.unit_menu);
  UpdateUnitMenu(document.property_form.the_menu, document.form_B.unit_menu)
}

// Restricting textboxes to accept numbers + navigational keys only
document.getElementByClass('numbersonly').addEventListener('keydown', function(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  if (!([8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
      (key == 65 && (e.ctrlKey || e.metaKey)) || // Select All 
      (key == 67 && (e.ctrlKey || e.metaKey)) || // Copy
      (key == 86 && (e.ctrlKey || e.metaKey)) || // Paste
      (key >= 35 && key <= 40) || // End, Home, Arrows
      (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) || // Numeric Keys
      (key >= 96 && key <= 105) // Numpad
      (key == 190) // Numpad
    )) e.preventDefault();
});