var data = d3.json('classData.json').then(function(data){

  initialize(data);


})

var initialize = function(data){

  var homeworks =  data.map(function(d,i)
                  { return d.homework.map(function(d){

                        return d.grade;

                  });
                });

  console.log(homeworks)

  //console.log(corr(homeworks,0,1))

  var testarray = [];

for (var i = 0; i < homeworks.length; i++) {
  var temparray = [];
  for (var j = 0; j < homeworks.length; j++) {
    temparray.push(corr(homeworks,i,j));
  }
  testarray.push(temparray);
}
console.log(testarray);

var samearray = [];

for (var i = 0; i < homeworks.length; i++) {
var temparray = [];
for (var j = 0; j < homeworks.length; j++) {
  temparray.push(similar(homeworks,i,j));
}
samearray.push(temparray);
}

console.log(samearray);

  var svgheight= window.innerHeight;

  var svgwidth= svgheight;

  var margins =
    {
      top:50,
      bottom:50,
      left:100,
      right:100
    }

  var width = svgwidth -margins.left - margins.right;
  var height = svgheight -margins.top - margins.bottom;

  var xscale = d3.scaleLinear()
               .domain([0,22])
               .range([0, width]);

  var yscale = d3.scaleLinear()
              .domain([0,22])
              .range([height, 0]);



  var svg = d3.select("body").append("svg")
                             .attr("height",svgwidth)
                             .attr("width",svgheight);

  var strongcolorscale = d3.scaleLinear().domain([0.6,1.1]).range([0.9,1]);
  var weakcolorscale = d3.scaleLinear().domain([0,0.6]).range([0,0.4]);

  var ldata = [1,0.7,0.5,0];
  var tdata = ['|r|',1,0.7,0.5,0];
  svg.selectAll('.legendcolor').data(ldata).enter()
          .append('rect')
          .attr('x',function(d){return width+150;})
          .attr('y',function(d,i){return height/2+i*27;})
          .attr('width',15)
          .attr('height',15)
          .attr('fill',function(d){
            if(d<0.6){return d3.interpolateReds(weakcolorscale(d));}
            else{return d3.interpolateRdBu(strongcolorscale(d));}

          });
  svg.selectAll('.legendtext').data(tdata).enter()
          .append('text')
          .attr('x',function(d){return width+170;})
          .attr('y',function(d,i){return height/2+i*27-12;})
          .text(function(d){return d;});

  var rowmake = function(data,student){

    svg.selectAll(".row"+student)
         .data(data[student])
         .enter()
         .append("rect")
         .classed('square',true)
         .classed('row'+student,true)
         .attr("x", function(d,i) {return margins.left+xscale(i); })
         .attr("y", function(d){return margins.top+yscale(student)})
         .attr("height", 10)
         .attr("width", 10)
         .attr('fill',function(d){
           if(d<0.6){return d3.interpolateReds(weakcolorscale(Math.abs(d)));}
           else{return d3.interpolateRdBu(strongcolorscale(Math.abs(d)));}

         })
         // .classed('hidden',function(d){
         //   if(d>=0.99){return true;}
         // })
  }

  for (var i = 0; i < testarray.length; i++) {
    rowmake(testarray,i);
  }

  var imheight = svgheight/25;
  //console.log('window: '+svgheight)

  svg.selectAll('.verticalimg')
         .data(data)
         .enter()
         .append('svg:image')
         .attr('xlink:href',function(d){
           return d.picture;
         })
         .attr('x',function(d,i){
           return 55;
         })
         .attr('y',function(d,i){
           return margins.top+yscale(i)-5;
         })
         .attr('height',function(d){
           return 20;
         })
         .attr('width',20);

  svg.selectAll('.horizontalimg')
         .data(data)
         .enter()
         .append('svg:image')
         .attr('xlink:href',function(d){
           return d.picture;
         })
         .attr('x',function(d,i){
           return margins.left+xscale(i)-5;
         })
         .attr('y',function(d,i){
           return svgheight-25;
         })
         .attr('height',function(d){
           return 20;
         })
         .attr('width',20);

}

var similar = function(data,s1,s2){

  var student1 = data[s1];
  var student2 = data[s2];

  var same = 0;

  student1.forEach(function(d,i){
    if(d == student2[i]){same = same+1}
  })
  return same;
}

var corr = function(data,s1,s2){

  var student1 = data[s1];
  var student2 = data[s2];

  var n = student1.length;

  var m1 = d3.mean(student1);
  var m2 = d3.mean(student2);

  var sd1 = d3.deviation(student1);
  var sd2 = d3.deviation(student2);

  var r = student1.reduce(function(total,d,i){

    //console.log(total+(1/(n-1))*(student1[i]-m1)*(student2[i]-m2)*(1/sd1)*(1/sd2))
    return total+(1/(n-1))*(student1[i]-m1)*(student2[i]-m2)*(1/sd1)*(1/sd2);

  },0);

  return r;


}
