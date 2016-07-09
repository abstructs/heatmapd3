var getData = function() {
  return $.getJSON(
    // python -m SimpleHTTPSever
  //   "/global-temperature.json",
  //   function(json) {
  //     return json
  //   }
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
   )

};
var createMap = function(data) {
  var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December']

  var margin = {top: 30, bottom: 30, right: 30, left: 30},
      height = 550 - margin.top - margin.bottom,
      width = 1100 - margin.right - margin.left;

  var maxYear = d3.max(data.monthlyVariance, function(d){
    return d.year;
  }),
  minYear = d3.min(data.monthlyVariance, function(d){
    return d.year;
  });
  var varianceMax = d3.max(data.monthlyVariance, function(d){
    return d.variance;
  }),
  varianceMin = d3.min(data.monthlyVariance, function(d){
    return d.variance;
  });
  var maxMonth = d3.max(data.monthlyVariance, function(d){
    var date = new Date()
    date.setMonth(d.month - 1)
    date.setDate(1)
    return date;
  }),
  minMonth = d3.min(data.monthlyVariance, function(d){
    var date = new Date()
    date.setMonth(d.month - 1)
    date.setDate(0)
    return date;
  });

  var xAxisScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([50, width - 85]),
  yAxisScale = d3.scaleTime()
      .domain([minMonth, maxMonth])
      .range([50, 392]),
  legendAxisScale = d3.scaleLinear()
      .domain([varianceMin, varianceMax])
      .range([0, 200]);

  var y = d3.scaleTime()
      .domain([minMonth, maxMonth])
      .range([40.8, 383]),
  x = d3.scaleTime()
      .domain([minYear, maxYear])
      .range([70, width - 67]),
  legendScale = d3.scaleLinear()
      .domain([varianceMin, varianceMax])
      .range([0, 176]),
  color = d3.scaleQuantize()
      .domain([varianceMin, varianceMax])
      .range(['#6600ff', '#6699ff', '#3399ff', '#33cccc', '#ccffcc', '#ffcc66', '#ff9933', '#ff6600', '#cc0000', '#800000']);

  var bottomAxis = d3.axisBottom(xAxisScale),
  leftAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat('%b')),
  legendAxis = d3.axisBottom(legendAxisScale);

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var map = d3.select('body').select('svg');

  map.attr('height', height + 40)
  map.attr('width', width)
  map.style('background-color', 'white');

  d3.select('body').select('svg').selectAll('.map')
  .data(data.monthlyVariance).enter()
  .append("g")
  .append("rect")
  .attr('x', function(d){return x(d.year)})
  .attr('y', function(d){
    var date = new Date();
    date.setMonth(d.month - 1);
    return y(date);
  })
  .attr('height', '34px')
  .attr('width', '4px')
  .attr('fill', function(d){return color(d.variance)})
  .attr('float', 'left')
  .on("mouseover", function(d) {
    div.transition()
        .duration(5)
        .style("opacity", .9);
    div.html(d.year + ' - ' + months[d.month - 1] + '</br>' + d.variance + ' &#8451;</br>' + d.variance + data.baseTemperature + ' &#8451;')
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 65) + "px");
  })
  .on("mouseout", function(d) {
    div.transition()
        .duration(200)
        .style("opacity", 0);
  });

  d3.select('body').select('svg').selectAll('.map')
  .data(data.monthlyVariance).enter()
  .append("g")
  .append("rect")
  .attr('x', function(d){return legendScale(d.variance) + 750})
  .attr('y', 465)
  .attr('width', 25)
  .attr('height', '20px')
  .style('fill', function(d){return color(d.variance)})

  d3.select("body").select("svg")
      .append("g")
      .attr("width", 10)
      .attr("transform", "translate(750, 485)")
      .call(legendAxis)

  d3.select("body").select("svg")
      .append("g")
      .attr("width", width - 50)
      .attr("transform", "translate(20, 425)")
      .call(bottomAxis)

  d3.select("body").select("svg")
      .append("g")
      .attr("height", height - 50)
      .attr("transform", "translate(69)")
      .call(leftAxis)
      .select('path')
      .attr('stroke', 'white')

  d3.select("svg").append("text")  // create the title for the graph
    .attr("x", width / 2 + 5)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Monthly Global Land-Surface Temperature");

    d3.select("svg")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(30, " + (height / 2 - 7) + ")rotate(-90)")
      .text("Months");

    d3.select("svg")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (width / 2 + 5) + ", 470)")
      .text("Years");

    d3.select("svg")
      .append("text")
      .attr("text-anchor", "middle")
      .style("font-size", "8px")
      .attr("transform", "translate(" + (width / 2 + 5) + ", 525)")
      .html(function(){
        return "*Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average. Estimated Jan 1951-Dec 1980 absolute temperature &#8451;: 8.66 +/- 0.07."
      })



}
$(function(){
  var promise = getData();
  promise.success(function(data){
    createMap(data);
  });
});
