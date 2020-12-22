// Pre-made palettes
let pal1 = ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F", "#F9F871", "#9BDE7E", "#4BBC8E", "#039590", "#1C6E7D"]
let pal2 = ["#4499EE", "#00B9F9", "#00D3E4", "#00E7BA", "#99F48C", "#CDEC7A", "#F6E278", "#FFD885", "#C7C768", "#8BB558"]
let pal3 = ["#AA3B46", "#AF417F", "#8C5DB9", "#007DE0", "#0096E2", "#00A7BF", "#4A83C7", "#786AB5", "#974F94", "#A33467"]

// Demo
drawBarChart({"React": 71.7, "Vue.js": 40.5, "Angular": 21.9, "Preact": 9.5, "Svelite": 6.8, "Ember": 3.6},
  {defaultWidth: 1000, valuePosition: "top", barColors: pal1, labelColor: "#FFFFFF",
   barWidth: "60%", yAxis: "% of Current Developers", title:"Most Popular Front-End Frameworks"},
  $("body"));

// Main bar chart creation function
function drawBarChart(data, options, element){ // TO DO: Make options an optional variable

  // General Variables
  let values = Object.values(data);
  let maxValue = Math.max(...values);
  let length = Object.keys(data).length; // To Do: make this compatible with tiered bar charts
  // let total = values.reduce((a, b) => a + b, 0);

  // Tick values
  let axis1 = (maxValue * 1.1).toFixed(0); // To Do: Make these values snap to multiples of 2, 5, 10, etc.
  let axis2 = ((maxValue * 1.1)*4/5).toFixed(0);
  let axis3 = ((maxValue * 1.1)*3/5).toFixed(0);
  let axis4 = ((maxValue * 1.1)*2/5).toFixed(0);
  let axis5 = ((maxValue * 1.1)*1/5).toFixed(0);

  // Label Titles
  let yAxisLabel = "";
  if (options.yAxis) yAxisLabel=options.yAxis;
  let xAxisLabel = "";
  if (options.xAxis) xAxisLabel=options.xAxis;

  // Chart Title
  let chartTitle = "";
  if (options.title) chartTitle = options.title;
  let titleFont = "Arial";
  if (options.titleFont) titleFont = options.titleFont;
  let titleFontSize = "20px";
  if (options.titleFontSize) titleFontSize = options.titleFontSize;
  let titleColor = "#FFFFFF";
  if (options.titleColor) titleColor = options.titleColor;

  // Value Position variable
  let valuePosition = "top";
  if (options.valuePosition) valuePosition = options.valuePosition;

  // Width + Height Variables
  let defaultWidth = 1000;
  if (options.defaultWidth) defaultWidth = options.defaultWidth;
  let chartWidth = defaultWidth;
  let chartHeight = 300;
  if (options.chartHeight) chartHeight = options.chartHeight;
  let axisTicksWidth = 25;
  let BarsTotalWidth = chartWidth-axisTicksWidth;
  let barWidth = "70%"
  if (options.barWidth) barWidth = options.barWidth;

  // Initialization
  createChart();
  createBars();
  setWidth();
  setBarSpacing(barWidth);
  setTitle(chartTitle, titleFont, titleFontSize, titleColor)

  // Optional Features
  if (options.autoWidth !== "off") autoWidth();
  if (options.valuePosition) setValuePos(options.valuePosition);
  if (options.barColors) setBarColors(options.barColors);
  if (options.labelColor) setLabelColor(options.labelColor);
  if (options.backgroundColor) setBackgroundColor(options.backgroundColor);

  // FUNCTION DEFINITIONS BELOW

  // Lay down HTML for chart axes and title
  function createChart(){
    element.prepend('<div id="bar-chart-lib"><div id="chart-title"><p>Bar Chart Title</p></div><div id="chart"><span id="y-axis-label">'
      +yAxisLabel+'</span><ul id="axis-ticks"><li><span>'
      +axis1+'</span></li><li><span>'
      +axis2+'</span></li><li><span>'
      +axis3+'</span></li><li><span>'
      +axis4+'</span></li><li><span>'
      +axis5+'</span></li></ul><ul id="bars"></ul><span id="x-axis-label">'
      +xAxisLabel+'</span></div></div>');
    $('#bar-chart-lib #axis-ticks li').height(chartHeight/5 - 1);
    $('#bar-chart-lib #y-axis-label').css("top", chartHeight/2+"px");
  }

  // Create bars and assign height based on % of total data value
  function createBars(){
    let index = 0;
    $.each(data,function(property, value){
      $("#bar-chart-lib #bars").append('<li><div class="bar"><span class=bar-value>'+value+'</span></div><span class=bar-title>'+property+'</span></li>')
        .children("li").height(chartHeight);
      $("#bar-chart-lib .bar").eq(index).height((value / maxValue) * chartHeight / 1.1 );
      index++;
    });
  }

  // Set value position depending on chosen option: top, middle, or bottom
  function setValuePos(position){
    if (position === "top") $("#bar-chart-lib .bar-value").addClass("value-top");
    else if (position === "middle") {
      $("#bar-chart-lib .bar-value").each(function() {
        height = $(this).parent().height();
        $(this).addClass("value-bottom").css("bottom", (height/2)-5+"px");
      });
    }
    else if (position === "bottom") $(".bar-value").addClass("value-bottom");
    // If bar is too short, set value position above the bar instead.
    $("#bar-chart-lib .bar-value").each(function() {
      height = $(this).parent().height();
      if (height < 25) $(this).removeClass(["value-top", "value-bottom"]).addClass("value-above");
    });
  }

  // Set width and margins of chart and bar containers
  function setWidth(){
    $("#bar-chart-lib #chart").width(chartWidth);
    $("#bar-chart-lib #axis-ticks").width(axisTicksWidth);
    $("#bar-chart-lib #axis-ticks li").css("padding-right", BarsTotalWidth);
    $("#bar-chart-lib #bars").width(BarsTotalWidth);
    $("#bar-chart-lib #bars li").width(BarsTotalWidth / length);
    $("#bar-chart-lib #x-axis-label").width(BarsTotalWidth);
  }

  // Set width of bars and space between bars
  function setBarSpacing(widthPercent){
    $("#bar-chart-lib .bar").width(widthPercent).css("margin-left", BarsTotalWidth * ((1 - parseFloat(widthPercent)/100)*0.5) / length )
  }

  // Adjust width and margins of bars on window resize
  function autoWidth(){
    $(window).resize(function() {
      chartWidth = Math.max(300, Math.min($(window).width()-100, defaultWidth)); // Clamp the value of chartwidth to between 300 and window width - 100
      BarsTotalWidth = chartWidth-axisTicksWidth;
      setWidth();
      setBarSpacing(barWidth);
    });
  }

  // Set color of bars to a single color or individually according to an array of colors
  function setBarColors(color){
    if (typeof color === "string") $("#bar-chart-lib .bar").css("background-color", color);
    else if (Array.isArray(color)) $.each(color, function(index) {
      $("#bar-chart-lib .bar").eq(index).css("background-color", color[index]);
    });
  }

  // Set color of label text
  function setLabelColor(color){
    $("#bar-chart-lib span").css("color", color);
  }

  function setTitle(title, font, size, color){
    $("#bar-chart-lib #chart-title").text(title).css({"font-family":font, "font-size":size, "font-color":color});
  }

  function setBackgroundColor(color){
    $('#bar-chart-lib #bars').css("background-color", color);
  }
}
