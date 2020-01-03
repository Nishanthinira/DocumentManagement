var myVars;
var myGroups;
// set the dimensions and margins of the graph
var margin = { top: 20, right: 0, bottom: 20, left: 60 },
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#mydataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json("http://172.24.133.45:2000/api/Graphs/GetDates", function (data) {
    myVars = data
    d3.json("http://172.24.133.45:2000/api/Graphs/GetCandidates", function (data) {
        myGroups = data
        console.log(myGroups)
        // Labels of row and columns
        // var myGroups = ["Ezhil", "Gowthami", "Kabilan", "Nishanthini", "Pavana", "Praveen"]
        // var myVars = ["06-12-2019", "10-12-2019", "07-12-2019", "08-12-2019", "09-12-2019", "18-12-2019"]
        // Build X scales and axis:
        var x = d3.scaleBand()
          .range([0, width])
          .domain(myGroups)
          .padding(0.01);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))

        // Build X scales and axis:
        var y = d3.scaleBand()
          .range([height, 0])
          .domain(myVars)
          .padding(0.01);
        svg.append("g")
          .call(d3.axisLeft(y));
        //
        // Build color scale
        var myColor = d3.scaleLinear()
          .range(["white", "#ff55ee"])
          .domain([1, 100])

        //Read the data
        d3.json("http://172.24.133.45:2000/api/Graphs/GetCandidateDetails", function (data) {

            // create a tooltip
            var tooltip = d3.select("#mydataviz")
              .append("div")
              .style("opacity", 0)
              .attr("class", "tooltip")
              .style("background-color", "white")
              .style("border", "solid")
              .style("border-width", "2px")
              .style("border-radius", "5px")
              .style("padding", "5px")
              .style("width", "150px")

            // Three function that change the tooltip when user hover / move / leave a cell
            var mouseover = function (d) {
                tooltip.style("opacity", 1)
            }
            var mousemove = function (d) {
                tooltip
                  .html("Marks of " + d.CandidateName + " on \n" + d.Date + " is : " + d.Marks)
                  .style("left", (d3.mouse(this)[0] + 70) + "px")
                  .style("top", (d3.mouse(this)[1]) + "px")
            }
            var mouseleave = function (d) {
                tooltip.style("opacity", 0)
            }
            console.log(data)
            // add the squares
            svg.selectAll()
              .data(data, function (d) { return d.CandidateName + ':' + d.Date; })
              .enter()
              .append("rect")
                .attr("x", function (d) { return x(d.CandidateName) })
                .attr("y", function (d) { return y(d.Date) })
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function (d) { return myColor(d.Marks) })
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)
        })
    });
});