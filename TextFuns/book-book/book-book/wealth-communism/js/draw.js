var DRAW = (function(){


  return {
    draw: function (filename, author, book) {
      console.log(filename);
      var width = window.innerWidth,
        height = window.innerHeight;

      var colors = {
        'marx': 'hsla(0, 87%, 41%, 1)',
        'smith': 'hsla(182, 8%, 17%, 1)',
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
            textLength = data[0].length,
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
          n %= textLength;

          dataView = [data[0][n]];


          d3.select('#'+book+'-word')
            .text(dataView);

        }

        DRAW['to'][author] = setInterval(changeWord, 250);   
      })
    },

    'to': {
      'smith': undefined,
      'marx': undefined,
      'both': undefined
    },

    clearInt: function(author) {
      clearInterval(this['to'][author]);
      this['to'][author] = undefined;
    }

  }


})();



$(document).ready(function(){
  DRAW.draw('data/_marxSorted.csv', 'marx', 'communist');
  DRAW.draw('data/_smithSorted.csv', 'smith', 'wealth');


  $('#together-link').on('click', function(){
    $('#communist, #wealth').addClass('hidden');
    DRAW.clearInt('smith');
    DRAW.clearInt('marx');

    $('#together').removeClass('hidden');
    DRAW.draw('data/_sharedSorted.csv', 'both', 'together');
  });

  $('#apart-link').on('click', function(){
    $('#communist, #wealth').removeClass('hidden');
    DRAW.clearInt('both');
    
    $('#together').addClass('hidden');
    DRAW.draw('data/_marxSorted.csv', 'marx', 'communist');
    DRAW.draw('data/_smithSorted.csv', 'smith', 'wealth');
  });

  $('.legend').on('click', 'a', function(){
    $('.selected').toggleClass('selected');
    $(this).addClass('selected');
  })

});