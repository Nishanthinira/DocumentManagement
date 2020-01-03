﻿var skill;
function draw(period, charttype) {
    if (charttype === "Pie Chart") {
        function dsPieChart() {
            document.getElementById('error').innerHTML = " ";
            document.getElementById('pieChart').innerHTML = " ";
            var dataset;
            //       d3.json("http://172.24.133.45:2000/api/Graphs/GetToppersListBySkills?skillType=" + '@ViewBag.SkillType' + " &Duration=" + period, function (data) {
            d3.json("http://172.24.133.45:2000/api/Graphs/GetToppersListBySkills?skillType=" + '@ViewBag.SkillType' + "&Duration=" + period, function (data) {

                dataset = data

                console.log(dataset)
                if (dataset == null) {
                    document.getElementById('error').innerHTML = "<h2>Sorry! Insufficient Data ....<br/> This Occurs in following conditions :<br/> * Not Filling out both the drop downs <br/> * Either the team has not done any tests in this skill this week <br> * Or The team has done Insufficient no of test (i.e) <2 this week  </h2>";

                }

                var width = 500,
                       height = 500,
                       outerRadius = Math.min(width, height) / 2,
                       innerRadius = outerRadius * .999,
                       // for animation
                       innerRadiusFinal = outerRadius * .5,
                       innerRadiusFinal3 = outerRadius * .45,
                       color = d3.scale.category20()    //builtin range of colors
                ;

                var vis = d3.select("#pieChart")
                     .append("svg:svg")              //create the SVG element inside the <body>
                     .data([dataset])                   //associate our data with the document
                         .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                         .attr("height", height)
                            .append("svg:g")                //make a group to hold our pie chart
                         .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
                ;

                var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
                         .outerRadius(outerRadius).innerRadius(innerRadius);

                // for animation
                var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
                var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

                var pie = d3.layout.pie()           //this will create arc data for us given a list of values
                     .value(function (d) { return d.Marks; });    //we must tell it out to access the value of each element in our data array

                var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                     .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
                     .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                         .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                            .attr("class", "slice")    //allow us to style things in the slices (like text)
                            .on("mouseover", mouseover)
                                 .on("mouseout", mouseout)
                ;

                arcs.append("svg:path")
                       .attr("fill", function (d, i) { return color(i); }) //set the color for each slice to be chosen from the color function defined above
                       .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
                            .append("svg:title") //mouseover title showing the figures
                           .text(function (d) { return d.data.CandidateName + ": " + d.data.Marks + "%"; });

                d3.selectAll("g.slice").selectAll("path").transition()
                        .duration(750)
                        .delay(10)
                        .attr("d", arcFinal)
                ;

                // Add a label to the larger arcs, translated to the arc centroid and rotated.
                // source: http://bl.ocks.org/1305337#index.html
                arcs.filter(function (d) { return d.endAngle - d.startAngle > .2; })
                      .append("svg:text")
                    .attr("dy", ".5em")
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
                     .text(function (d) { return d.data.CandidateName; })
                ;

                // Computes the label angle of an arc, converting from radians to degrees.
                function angle(d) {
                    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
                    return a > 90 ? a - 180 : a;
                }


                // Pie chart title
                vis.append("svg:text")
                    .attr("dy", ".10em")
                  .attr("text-anchor", "middle")
                  .text('@ViewBag.SkillType')
                  .attr("class", "title")
                ;



                function mouseover() {
                    d3.select(this).select("path").transition()
                        .duration(750)
                                  .attr("stroke", "red")
                                  .attr("stroke-width", 0.5)
                                  .attr("d", arcFinal3)
                    ;
                }

                function mouseout() {
                    d3.select(this).select("path").transition()
                        .duration(750)
                                  .attr("stroke", "white")
                                  .attr("stroke-width", 1.5)
                                  .attr("d", arcFinal)
                    ;
                }
            });
        }
        dsPieChart();
    }
    if (charttype === "Bar Chart") {
        document.getElementById('error').innerHTML = " ";
        document.getElementById('pieChart').innerHTML = " ";
        var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin

        svg.append("text")
           .attr("transform", "translate(100,0)")
           .attr("x", 50)
           .attr("y", 50)


        var xScale = d3.scaleBand().range([0, width]).padding(0.4),
            yScale = d3.scaleLinear().range([height, 0]);

        var g = svg.append("g")
                   .attr("transform", "translate(" + 100 + "," + 100 + ")");

        d3.json("http://172.24.133.45:2000/api/Graphs/GetToppersListBySkills?skillType=" + '@ViewBag.SkillType' + "&Duration=" + period, function (data) {
            console.log(data)
            xScale.domain(data.map(function (d) { return d.CandidateName; }));
            yScale.domain([0, d3.max(data, function (d) { return d.Marks; })]);

            g.append("g")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(xScale))
             .append("text")
             .attr("y", height - 250)
             .attr("x", width - 100)
             .attr("text-anchor", "end")
             .attr("font-size", "20px")
             .attr("stroke", "black")
             .text("Date");

            g.append("g")
             .call(d3.axisLeft(yScale).tickFormat(function (d) {
                 return d;
             })
             .ticks(10))
             .append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 6)
             .attr("dy", "-5.1em")
             .attr("text-anchor", "end")
             .attr("font-size", "18px")
             .attr("stroke", "black")
             .text('@ViewBag.SkillType');

            g.selectAll(".bar")
             .data(data)
             .enter().append('g').attr('class', 'BarGraphe').append("rect")
             .attr("class", "bar")
             .attr("x", function (d) { return xScale(d.CandidateName); })
             .attr("y", function (d) { return yScale(d.Marks); })
             .attr("width", xScale.bandwidth())
             .attr("height", function (d) { return height - yScale(d.Marks); });

            d3.selectAll(".BarGraphe")
             .append("text")
             .transition()
             .duration(800)
             .text(function (d) { return '' + d.Marks; })
             .attr("x", function (d) { return xScale(d.CandidateName) + xScale.bandwidth() / 5; })
             .attr("y", function (d) { return yScale(d.Marks) - 10; })
             .delay(function (d, i) { console.log(i); return (i * 100) });
        });
    }

}

//function getSelected() {
//    var x = document.getElementById("period").value;
//    aler(x)
//    document.getElementById("demo").innerHTML = x;
//}
function ChartsChange(el) {
    var x = document.getElementById("period");
    var e = document.getElementById(el);
    var chart = e.options[e.selectedIndex].text;
    var period = x.options[x.selectedIndex].value;
    draw(period, chart)
}
function PeriodChange(el) {
    var x = document.getElementById("charts");
    var e = document.getElementById(el);
    var chart = x.options[x.selectedIndex].text;
    var period = e.options[e.selectedIndex].value;
    draw(period, chart)
}