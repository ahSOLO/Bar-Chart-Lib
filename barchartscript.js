// Pre-made palettes
let pal1 = ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F", "#F9F871", "#9BDE7E", "#4BBC8E", "#039590", "#1C6E7D", "#5375A5", "#7F73AB"]
let pal2 = ["#4499EE", "#00B9F9", "#00D3E4", "#00E7BA", "#99F48C", "#CDEC7A", "#F6E278", "#FFD885", "#C7C768", "#8BB558", "#5AAA64", "#179C72"]
let pal3 = ["#AA3B46", "#AF417F", "#8C5DB9", "#007DE0", "#0096E2", "#00A7BF", "#4A83C7", "#786AB5", "#974F94", "#A33467", "#C07D96", "#BDA5AD"]

// Demo
drawBarChart({"React": 71.7, "Vue.js": 40.5, "Angular": 21.9, "Preact": 9.5, "Svelite": 6.8, "Ember": 3.6},
  {valuePosition: "top", barColors: pal1, labelColor: "#FFFFFF", defaultWidth: 500, autoWidth: "off", barWidth: "60%",
  yAxis: "% of Developers Currently Using", title:"Most Popular Front-End Frameworks"},
  $("body"));

drawBarChart({"Apple": 1971, "Saudi Aramco": 1956, "Amazon": 1592, "Microsoft": 1546, "Alphabet": 1116, "Alibaba": 863, "Facebook": 795, "Tencent": 724, "Berkshire Hathaway": 496, "Taiwan Semiconductor": 405},
  {valuePosition: "middle", barColors: pal3, labelColor: "#FFFFFF", chartHeight: 400, barWidth: "80%", yAxis: "Market Capitalization ($ Billion)",
  xAxis: "Company", title:"Top 10 Largest Companies in the World", titleFontSize: "30px", titleColor: "#007DE0"},
  $("body"));

drawBarChart({"United States":{"Apple": 1971, "Amazon": 1592, "Microsoft": 1546, "Alphabet": 1116, "Facebook": 795, "Berkshire Hathaway": 496}, "Saudi Arabia":{"Saudi Aramco": 1956}, "China":{"Alibaba": 863, "Tencent": 724}, "Taiwan":{"Taiwan Semiconductor": 405}},
  {valuePosition: "middle", barColors: ["#002868", "#BF0A30", "#002868", "#BF0A30", "#002868", "#BF0A30", "#006C35", "#df1B12", "#9b870c", "#000097"],
  labelColor: "#FFFFFF", chartHeight: 600, defaultWidth: 900, autoWidth: "off", barWidth: "95%",
  yAxis: "Market Capitalization ($ Billion)", xAxis: "Country", title:"Top 10 Largest Companies in the World by Country", titleFont: "Sans", titleFontSize: "25px"},
  $("body"));


// Main bar chart creation function
function drawBarChart(data, options, element){

  // Instance tracker (if multiple charts are on the same page)
  let instance = 0;
  while ( $("#bc_id_"+instance.toString()).length > 0) instance++;
  let ins = instance.toString();

  // General Variables
  let values = Object.values(data);
  let length = Object.keys(data).length;

  // Determine Max Value
  let maxValue = 0;
  let _total = 0;
  for (i = 0; i < values.length; i++){
    // If data input is an object (for a stacked bar chart), sum all the values within the object
    if (typeof values[i] === 'object' && values[i] !== null) _total = Object.values(values[i]).reduce((a,b) => a + b, 0);
    // Otherwise take the single value
    else _total = values[i];
    // assign maxValue to the highest totalled value
    if (_total > maxValue) maxValue = _total;
  }

  // Set space between longest bar and the top of the chart
  let chartOverreach = 1.1;
  let digits = maxValue.toString().split('.')[0].length;
  let multiplier = parseInt("1"+"0".repeat(digits-1))
  // If chart value is above 1, ensure the top tick on the y axis ends in 0
  if (multiplier > 1) chartOverreach = Math.ceil(maxValue / multiplier) * multiplier / maxValue;

  // Assign Tick values
  let axis1 = (maxValue * chartOverreach).toFixed(0);
  let axis2 = ((maxValue * chartOverreach)*4/5).toFixed(0);
  let axis3 = ((maxValue * chartOverreach)*3/5).toFixed(0);
  let axis4 = ((maxValue * chartOverreach)*2/5).toFixed(0);
  let axis5 = ((maxValue * chartOverreach)*1/5).toFixed(0);

  // Assign Label Titles
  let yAxisLabel = "";
  if (options.yAxis) yAxisLabel=options.yAxis;
  let xAxisLabel = "";
  if (options.xAxis) xAxisLabel=options.xAxis;

  // Chart Title variables
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

  // Assign Width + Height Variables
  let defaultWidth = $(window).width()-175;
  let minWidth = length * 90;
  if (options.defaultWidth) defaultWidth = options.defaultWidth;
  let chartWidth = Math.max(minWidth, defaultWidth);
  let chartHeight = 300;
  if (options.chartHeight) chartHeight = options.chartHeight;
  let axisTicksWidth = 18;
  let axisDigits = axis1.toString().split('.')[0].length;
  if (axisDigits > 1) axisTicksWidth = 18 + 9 * (axisDigits-1);
  let BarsTotalWidth = chartWidth-axisTicksWidth;
  let barWidth = "70%"
  if (options.barWidth) barWidth = options.barWidth;

  // Initialization
  createChart();
  createBars();
  setWidth();
  setBarSpacing(barWidth);
  setTitle(chartTitle, titleFont, titleFontSize, titleColor);
  setValuePos(valuePosition);

  // Optional Features
  if (options.autoWidth !== "off") autoWidth();
  if (options.barColors) setBarColors(options.barColors);
  if (options.labelColor) setLabelColor(options.labelColor);
  if (options.backgroundColor) setBackgroundColor(options.backgroundColor);
  if (options.animate !== "off") animateBars();

  // FUNCTION DEFINITIONS BELOW

  // Lay down HTML for chart, axes and title
  function createChart(){
    element.eq(0).append('<div class="bar-chart-lib" id="bc_id_'+ins+'"><div id="chart-title"><p>Bar Chart Title</p></div><div id="chart"><span id="y-axis-label">'
      +yAxisLabel+'</span><ul id="axis-ticks"><li><span>'
      +axis1+'</span></li><li><span>'
      +axis2+'</span></li><li><span>'
      +axis3+'</span></li><li><span>'
      +axis4+'</span></li><li><span>'
      +axis5+'</span></li></ul><ul id="bars"></ul><span id="x-axis-label">'
      +xAxisLabel+'</span></div></div><br>');
    // set space between ticks
    $('#bc_id_'+ins+' #axis-ticks li').height(chartHeight/5 - 1);
    // Center y-axis label
    $('#bc_id_'+ins+' #y-axis-label').css("top", chartHeight/2+"px");
  }

  // Create bars and assign height based on % of total data value
  function createBars(){
    let index = 0;
    let barHeight = 0;
    let heightTotal = 0;
    $.each(data,function(property, value){
      // If bar data is an object...
      if (typeof value === "object" && value !== null) {
        barHeight = (Object.values(value)[0] / maxValue) * chartHeight / chartOverreach
        heightTotal = barHeight;
        // create first bar along with category name
        $('#bc_id_'+ins+' #bars').append('<li><div class="bar"><span class=bar-value>'+Object.keys(value)[0] + ": " + Object.values(value)[0] +'</span></div><span class=bar-title>'+property+'</span></li>')
        // Set height of first bar
        $('#bc_id_'+ins+' .bar').eq(index).height(barHeight);
        // Start loop for creation of subsequent bars
        for (i = 1; i < Object.keys(value).length; i++){
          // Remove smooth corners on previous bar
          $('#bc_id_'+ins+' .bar').eq(index).css({"border-radius": "0px", "-webkit-border-radius": "0px", "-moz-border-radius": "0px"})
          // Create subsequent bar
          $('#bc_id_'+ins+' #bars li').eq(-1).append('<div class="bar"><span class=bar-value>'+Object.keys(value)[i] + ": " + Object.values(value)[i] +'</span></div>').height(chartHeight)
          index++;
          // Assign height to subsequent bar
          barHeight = (Object.values(value)[i] / maxValue) * chartHeight / chartOverreach;
          $('#bc_id_'+ins+' .bar').eq(index).height(barHeight)
            // start the subsequent bars where the previous bar ended
            .css("bottom", heightTotal);
          heightTotal+=barHeight;
        }
      }
      // If bar data is a number
      else {
        // Create bar along with category name
        $('#bc_id_'+ins+' #bars').append('<li><div class="bar"><span class=bar-value>'+value+'</span></div><span class=bar-title>'+property+'</span></li>')
        // Set bar height
        barHeight = (value / maxValue) * chartHeight / chartOverreach
        $('#bc_id_'+ins+' .bar').eq(index).height(barHeight);
      }
      index++;
    });
  // Set height for background behind bars
  $('#bc_id_'+ins+' #bars li').height(chartHeight);
  // Set bar title location
  $('#bc_id_'+ins+' .bar-title').css("top", chartHeight + 5);
  }

  // Position value text depending on chosen option: top, middle, or bottom
  function setValuePos(position){
    // top position
    if (position === "top") $('#bc_id_'+ins+' .bar-value').addClass("value-top");
    // middle position
    else if (position === "middle") {
      $('#bc_id_'+ins+' .bar-value').each(function() {
        height = $(this).parent().height();
        $(this).addClass("value-bottom").css("bottom", (height/2)-5+"px");
      });
    }
    // bottom position
    else if (position === "bottom") $('#bc_id_'+ins+' .bar-value').addClass("value-bottom");
    // If bar is too short, position the value above the bar instead.
    $('#bc_id_'+ins+' .bar-value').each(function() {
      height = $(this).parent().height();
      if (height < 25) $(this).removeClass(["value-top", "value-bottom"]).addClass("value-above");
    });
  }

  // Set width and margins of chart and bar containers
  function setWidth(){
    $('#bc_id_'+ins+' #chart').width(chartWidth);
    $('#bc_id_'+ins+' #axis-ticks').width(axisTicksWidth);
    $('#bc_id_'+ins+' #axis-ticks li').css("padding-right", chartWidth);
    $('#bc_id_'+ins+' #bars').width(BarsTotalWidth);
    $('#bc_id_'+ins+' #bars li').width(BarsTotalWidth / length);
    $('#bc_id_'+ins+' #x-axis-label').width(BarsTotalWidth);
  }

  // Set width of bars and space between bars
  function setBarSpacing(widthPercent){
    $('#bc_id_'+ins+' .bar')
      .width(widthPercent)
      .css("margin-left", BarsTotalWidth * ((1 - parseFloat(widthPercent)/100)*0.5) / length )
  }

  // Adjust width and margins of bars on window resize
  function autoWidth(){
    $(window).resize(function() {
      chartWidth = Math.max(minWidth, $(window).width()-175); // Clamp the value of chartwidth to between 300 and window width - 100
      BarsTotalWidth = chartWidth-axisTicksWidth;
      setWidth();
      setBarSpacing(barWidth);
    });
  }

  // Set color of bars to a single color or individually according to an array of colors
  function setBarColors(color){
    if (typeof color === "string") $('#bc_id_'+ins+' .bar').css("background-color", color);
    else if (Array.isArray(color)) $.each(color, function(index) {
      $('#bc_id_'+ins+' .bar').eq(index).css("background-color", color[index]);
    });
  }

  // Set color of label text
  function setLabelColor(color){
    $('#bc_id_'+ins+' span').css("color", color);
  }

  // Set title, font, fontsize and color of title
  function setTitle(title, font, size, color){
    $('#bc_id_'+ins+' #chart-title').text(title).css({"font-family":font, "font-size":size, "color":color});
  }

  // Set color of chart background
  function setBackgroundColor(color){
    $('#bc_id_'+ins+' #bars').css("background-color", color);
  }

  // Animate chart bars
  function animateBars(){
    $('#bc_id_'+ins+' .bar').each( function(index, bar){
      let height = $(this).height();
      $(this).height(0).animate({"height": height}, 900)
    });
  }
}
