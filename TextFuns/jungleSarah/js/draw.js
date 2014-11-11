function draw(filename, author) {
  var width = window.innerWidth,
    height = window.innerHeight;

  var colors = {
    'sinclair': 'hsla(197, 47%, 21%, 1)',
    'kipling': 'hsla(122, 100%, 21%, 1)',
    'both': 'hsla(233, 47%, 21%, 1)'
  };


  var svg = d3.select('.chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  d3.text('../data/_sinclairSorted.csv', function(error, text){

    var n = 0,
        data = d3.csv.parseRows(text),
        dataView = [data[0][n]];
    
    console.log(dataView);

    svg.append('rect')
      .data(dataView)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', colors[author]);

    d3.select('#word')
      .style('text-anchor', 'end')
      .text(dataView)

    // var chart = svg.selectAll('rect')
      // .data(dataView)
      // .enter()
      // .append('tect')
      //   .text(function(d){ return d; });
    

    // function changeWord() {

      // Update data view
      
      n++;
      n %= data.length;

      dataView = [data[0][n]];

      // Update circle & background

      var bookCircles = svg.selectAll('circle')
        .data(dataView);

      // console.log(dataView);

      svg.selectAll('rect')
         .data(dataView)
         .attr("width", "100%")
         .attr("height", "100%")
         .attr("fill", function(d){  return colors[author];  });  

      bookCircles.transition()
        .duration(1000)
        .ease('elastic')
        .attr('r', function(d, i){
          return Math.sqrt(rScale(d.pages)/Math.PI);
        }) /*square root of pages normalized over pi*/
        .attr('fill', function(d){ return colors[d.genre]; });
    // }

    // setInterval(changeWord, 1500);   
    // });
  })

}

$(document).ready(function(){
  draw('../data/_sinclairSorted.csv', 'sinclair');
});