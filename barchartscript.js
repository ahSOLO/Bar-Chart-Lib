// Input Test Variable
drawBarChart({First: 50, Second: 30, Third: 20},
  {defaultWidth: 1000, valuePosition: "top", barColors: ["#000000", "#C0C0C0", "#008080"], labelColor: "#FF0000", barWidth: "60%"},
  $("body"));

function drawBarChart(data, options, element){

  // General Variables
  let values = Object.values(data);
  let length = Object.keys(data).length;
  let total = values.reduce((a, b) => a + b, 0);

  // Default Options
  let defaultWidth = 1000;
  if (options.defaultWidth) defaultWidth = options.defaultWidth;
  let valuePosition = "top";
  if (options.valuePosition) valuePosition = options.valuePosition;

  // Width + Height Variables
  let chartWidth = defaultWidth;
  let axisLabelWidth = 25;
  let BarsTotalWidth = chartWidth-axisLabelWidth;
  let barHeight = 300;

  // Initialization
  createChart();
  createBars();
  setWidth();
  if (options.autoWidth !== "off") autoWidth();
  if (options.valuePosition) setValuePos(options.valuePosition);
  if (options.barColors) setBarColors(options.barColors);
  if (options.labelColor) setLabelColor(options.labelColor);
  if (options.barWidth) setBarSpacing(options.barWidth);

  // Lay down HTML for chart axes and title
  function createChart(){
    element.prepend('<div id="bar-chart-lib"><div id="title"><p>Bar Chart Title</p></div><div id="chart"><ul id="axis-labels"><li><span>100%</span></li><li><span>75%</span></li><li><span>50%</span></li><li><span>25%</span></li></ul><ul id="bars"></ul></div></div>')
  }

  // Create bars and assign height based on % of total data value
  function createBars(){
    let index = 0;
    $.each(data,function(property, value){
      $("#bars").append('<li><div class="bar"><span class=bar-value>'+value+'</span></div><span class=bar-title>'+property+'</span></li>');
      $(".bar").eq(index).height(barHeight * value/total);
      index++;
    });
  }

  // Set value position depending on chosen option: top, middle, or bottom
  function setValuePos(position){
    if (position === "top") $(".bar-value").addClass("value-top");
    else if (position === "middle") {
      $(".bar-value").each(function() {
        height = $(this).parent().height();
        $(this).addClass("value-bottom").css("bottom", (height/2)-5+"px");
      });
    }
    else if (position === "bottom") $(".bar-value").addClass("value-bottom");
  }

  // Set width and margins of chart and bars
  function setWidth(){
    $("#chart").width(chartWidth);
    $("#axis-labels").width(axisLabelWidth);
    $("#bars").width(BarsTotalWidth);
    $("#bars li").width(BarsTotalWidth / length);
    $(".bar").css("margin-left", BarsTotalWidth * 0.15 / length);
  }

  // Adjust width and margins of bars on window resize
  function autoWidth(){
    $(window).resize(function() {
      chartWidth = Math.max(300, Math.min($(window).width()-100, defaultWidth)); // Clamp the value of chartwidth to between 300 and window width - 100
      BarsTotalWidth = chartWidth-axisLabelWidth;
      setWidth();
    });
  }

  // Set color of bars to a single color or individually according to an array of colors
  function setBarColors(color){
    if (typeof color === "string") $(".bar").css("background-color", color);
    else if (Array.isArray(color)) $.each(color, function(index) {
      $(".bar").eq(index).css("background-color", color[index]);
    });
  }

  // Set width of bars and space between bars
  function setBarSpacing(widthPercent){
    $(".bar").width(widthPercent).css("margin-left", BarsTotalWidth * ((1 - parseFloat(widthPercent)/100)/2) / length )
  }

  // Set color of label text
  function setLabelColor(color){
    $("span").css("color", color);
  }

}
