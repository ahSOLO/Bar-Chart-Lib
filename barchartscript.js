// Input Test Variable
let data = {First: 50, Second: 30, Third: 40};

// General Variables
let values = Object.values(data);
let length = Object.keys(data).length;
let total = values.reduce((a, b) => a + b, 0);

// Width Variables
let chartWidth = Math.max(300, Math.min($(window).width()-100, 1000));
let axisLabelWidth = 25;
let barWidth = chartWidth-axisLabelWidth;

// Initialization
$("#chart").width(chartWidth);
$("#axis-labels").width(axisLabelWidth);
$("#bars").width(barWidth);

let index = 0;
$.each(data,function(property, value){
  $("#bars").append('<li><div class="bar"><span class=bar-value>'+value+'</span></div><span class=bar-title>'+property+'</span></li>')
  $(".bar").eq(index)
  .height(300 * value/total)
  .css("margin-left", (barWidth * 0.15 / length)+'px' )
  ;
  index++;
});

$("#bars li").width(barWidth / length);

// Adjust width and margins of bars on window resize
$(window).resize(function() {
  chartWidth = Math.max(300, Math.min($(window).width()-100, 1000));
  barWidth = chartWidth-axisLabelWidth;
  $("#chart").width(chartWidth);
  $("#axis-labels").width(axisLabelWidth);
  $("#bars").width(barWidth);
  $(".bar").css("margin-left", barWidth * 0.15 / length);
});
