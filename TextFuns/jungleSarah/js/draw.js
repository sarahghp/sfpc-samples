function draw(filename, author, book) {
  var width = window.innerWidth,
    height = window.innerHeight;

  var colors = {
    'sinclair': 'hsla(182, 8%, 17%, 1)',
    'kipling': 'hsla(122, 100%, 21%, 1)',
    'both': 'hsla(233, 47%, 21%, 1)'
  };

  if (book === 'together'){
     var svg = d3.select('#'+book)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  } else { 
    var svg = d3.select('#'+book)
      .append('svg')
      .attr('width', width)
      .attr('height', height/2);
  }


  d3.text(filename, function(error, text){

    var n = 0,
        data = d3.csv.parseRows(text),
        dataView = [data[0][n]];   

    svg.append('rect')
      .data(dataView)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', colors[author]);

    d3.select('#'+book+'-word')
      .style('text-anchor', 'end')
      .text(dataView)    

    function changeWord() {

      // Update data view
      
      n++;
      n %= text.length;

      dataView = [data[0][n]];


      d3.select('#'+book+'-word')
        .text(dataView);

    }

    setInterval(changeWord, 250);   
  })

}


$(document).ready(function(){
  draw('data/_sinclairSorted.csv', 'sinclair', 'jungle');
  setTimeout(draw('data/_kiplingSorted.csv', 'kipling', 'junglebook'), 150);

  $('#together-link').on('click', function(){
    $('#jungle, #junglebook').addClass('hidden');
    $('#together').removeClass('hidden');
    setTimeout(draw('data/_sharedSorted.csv', 'both', 'together'), 150);
  });

  $('#apart-link').on('click', function(){
    $('#jungle, #junglebook').removeClass('hidden');
    $('#together').addClass('hidden');
  });

  $('.legend').on('click', 'a', function(){
    $('.selected').toggleClass('selected');
    $(this).addClass('selected');
  })

});