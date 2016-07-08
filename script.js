var getData = function() {
  return $.getJSON(
    // python -m SimpleHTTPSever
    "/global-temperature.json",
    function(json) {
      return json
    }
  )
};
createDataSet = function() {
  var data = [];
  for (var i = 0; i < 75; i++) {
    var rand = Math.floor((Math.random() * 100) + 10)
    data.push(rand);
  }
  return data
}
var createMap = function(data) {
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
    return date;
  }),
  minMonth = d3.min(data.monthlyVariance, function(d){
    var date = new Date()
    date.setMonth(d.month - 1)
    return date;
  });

  var xAxisScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([50, width - 85]);

  var yAxisScale = d3.scaleLinear()
      .domain([1, 12])
      .range([50, 392]);

  var y = d3.scaleTime()
      .domain([minMonth, maxMonth])
      .range([50, 392]);

  var x = d3.scaleTime()
      .domain([minYear, maxYear])
      .range([70, width - 67]);

  var color = d3.scaleLinear()
      .domain([varianceMin, varianceMax])
      .range(['blue', 'orange']);

  var bottomAxis = d3.axisBottom(xAxisScale).ticks(30);
  var leftAxis = d3.axisLeft(yAxisScale);

  var map = d3.select('body').select('svg');

  map.attr('height', height)
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

  d3.select("body").select("svg")
      .append("g")
      .attr("width", width - 50)
      .attr("transform", "translate(20, 425)")
      .call(bottomAxis)

  d3.select("body").select("svg")
      .append("g")
      .attr("height", height - 50)
      .attr("transform", "translate(70)")
      .call(leftAxis)

  d3.select("svg").append("text")  // create the title for the graph
    .attr("x", width / 2 + 5)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Heat Map");

    d3.select("svg")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(30, " + (height / 2 - 7) + ")rotate(-90)")
      .text("Months");

    d3.select("svg")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (width / 2 + 5) + ", 465)")
      .text("Years");


}
$(function(){
  var promise = getData();
  promise.success(function(data){
    createMap(data);
  });
});
