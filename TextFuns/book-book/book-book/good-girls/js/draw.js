var DRAW = (function(){


  return {
    draw: function (filename, author, book) {
      var width = window.innerWidth,
        height = window.innerHeight;

      var colors = {
        'montgomery': 'hsla(27, 96%, 51%, 1)',
        'hartley': 'hsla(122, 100%, 21%, 1)',
        'both': 'hsla(233, 47%, 21%, 1)'
      };

      d3.select('.'+author).remove();

      var svg = d3.select('#'+book)
          .append('svg')
          .attr('width', width)
          .attr('class', author);

      (book === 'together') ? svg.attr('height', height) : svg.attr('height', height/2);

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

        DRAW['to'][author] = setInterval(changeWord, 250);   
      })
    },

    'to': {
      'hartley': undefined,
      'montgomery': undefined,
      'both': undefined
    },

    clearInt: function(author) {
      clearInterval(this['to'][author]);
      this['to'][author] = undefined;
    }

  }


})();



$(document).ready(function(){
  DRAW.draw('data/_montgomerySorted.csv', 'montgomery', 'anne');
  DRAW.draw('data/_hartleySorted.csv', 'hartley', 'etiquette');


  $('#together-link').on('click', function(){
    console.log(DRAW.to);
    $('#anne, #etiquette').addClass('hidden');
    DRAW.clearInt('hartley');
    DRAW.clearInt('montgomery');

    $('#together').removeClass('hidden');
    DRAW.draw('data/_sharedSorted.csv', 'both', 'together');
  });

  $('#apart-link').on('click', function(){
    console.log(DRAW.to);
    $('#anne, #etiquette').removeClass('hidden');
    DRAW.clearInt('both');
    
    $('#together').addClass('hidden');
    DRAW.draw('data/_montgomerySorted.csv', 'montgomery', 'anne');
    DRAW.draw('data/_hartleySorted.csv', 'hartley', 'etiquette');
  });

  $('.legend').on('click', 'a', function(){
    $('.selected').toggleClass('selected');
    $(this).addClass('selected');
  })

});