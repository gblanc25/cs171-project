
class OutcomeScatter {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = data;

        this.initVis();
    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};

        // Set dynamic width, height, and svg
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.width / 2;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height / 1.5)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Define scales
        vis.y = d3.scaleLinear()
            .domain([100, 0])
            .range([0, vis.height / 2])

        vis.x = d3.scaleLinear()
            .range([0, vis.width - 10 * vis.margin.left - 10 * vis.margin.right])

        // Define axis
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        // Append y-axis
        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + 10 * vis.margin.left + ", 0)")
            .call(vis.yAxis);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(" + 10 * vis.margin.left + "," + (vis.height / 2) + ")")
            .call(vis.xAxis);

        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("text-anchor", "middle")
            .attr("y", vis.height / 1.75 + vis.margin.bottom)
            .attr("stroke", "black")
            .attr("font-size", "small")
            .text("Amount of Funding ($)")

        vis.svg.append("text")
            .attr("x", -vis.height / 4)
            .attr("text-anchor", "middle")
            .attr("y", 7 * vis.margin.left)
            .attr("stroke", "black")
            .attr("transform", "rotate(270)")
            .attr("font-size", "small")
            .text("Percent With Bachelor's Degrees")

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        let points = [];

        vis.svg.selectAll(".outcome_title").remove();

        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("class", "outcome_title")
            .attr("text-anchor", "middle")
            .attr("y", 0)
            .attr("stroke", "black")
            .text(function () {
                if (counter === 0) {
                    return ("Bachelor's Degree Achievement vs. TOTAL Per-Student Funding")
                }
                else {
                    if (n === 0) {
                        return ("Bachelor's Degree Achievement vs. FEDERAL Per-Student Funding")
                    }
                    else if (n === 1) {
                        return ("Bachelor's Degree Achievement vs. STATE Per-Student Funding")
                    }
                    else {
                        return ("Bachelor's Degree Achievement vs. LOCAL Per-Student Funding")
                    }
                }
                if (counter === 2) {
                    return ("Bachelor's Degree Achievement vs. Per-Student Funding")
                }
            })

        vis.data.forEach(function (d) {
            if (document.getElementById('total_check').checked) {
                points.push({
                    "name": d.State.replace(" ", "_"),
                    "type": "total",
                    "funding": +d["Funding_LocalperStudent"] + +d["Funding_StateperStudent"] + +d["Funding_FederalperStudent"],
                    "bachelors": d["cat4_18to24"]
                })
            }

            if (document.getElementById('local_check').checked) {
                points.push({
                    "name": d.State.replace(" ", "_"),
                    "type": "local",
                    "funding": +d["Funding_LocalperStudent"],
                    "bachelors": d["cat4_18to24"]
                })
            }

            if (document.getElementById('state_check').checked) {
                points.push({
                    "name": d.State.replace(" ", "_"),
                    "type": "state",
                    "funding": +d["Funding_StateperStudent"],
                    "bachelors": d["cat4_18to24"]
                })
            }

            if (document.getElementById('federal_check').checked) {
                points.push({
                    "name": d.State.replace(" ", "_"),
                    "type": "federal",
                    "funding": +d["Funding_FederalperStudent"],
                    "bachelors": d["cat4_18to24"]
                })
            }

        })

        this.displayData = points;

        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */

    updateVis() {
        let vis = this;

        vis.svg.selectAll('.circle_label')
            .style("display", "none")



        // Update domains
        vis.x
            .domain([0, d3.max(this.displayData, function (d) {
                return d["funding"];
            })])

        vis.y
            .domain([d3.max(this.displayData, function (d) {
                return Math.min(d["bachelors"] + 20, 100);
            }), 0])

        // Update the x-axis
        vis.svg.select(".x-axis").transition().call(vis.xAxis);
        vis.svg.select(".y-axis").transition().call(vis.yAxis);

        let circles = vis.svg.selectAll("circle")
            .data(this.displayData, d=>d)

        circles.enter().append("circle")
            .merge(circles)
            .attr("cx", (d) => 10 * vis.margin.left + vis.x(d["funding"]))
            .attr("cy", (d) => vis.y(d["bachelors"]))
            .attr("opacity", 0)
            .transition()
            .attr("r", 10)
            .attr("fill", function(d) {
                if (d["type"] === "local") {
                    return "darkred";
                }
                else if (d["type"] === "state") {
                    return "#77C3EC";
                }
                else if (d["type"] === "total") {
                    return "tan";
                }
                else {
                    return "#58776c";
                }
            })
            .attr("opacity", 0.75)
            .attr("stroke", "black")
            .attr("stroke-width", "2px")

        vis.svg.selectAll('circle')
            .on('mouseover', function(event, d) {
                d3.select("#label_" + d["name"] + "_" + d["type"]).style("display", "block");
            })
            .on('mouseout', function(event, d) {
                d3.select('#label_' + d["name"] + "_" + d["type"]).style("display", "none");
            })

        let labels = vis.svg.selectAll(".circle_label")
            .data(this.displayData, d=>d)

        labels.enter().append("text")
            .attr("x", (d) => 10.5 * vis.margin.left + vis.x(d["funding"]))
            .attr("y", (d) => 0.9 * vis.y(d["bachelors"]))
            .attr("class", "circle_label")
            .attr("id", (d) => "label_" + d["name"] + "_" + d["type"])
            .style("display", "none")
            .text((d) => (d["name"]).replace("_", " "))

        circles.exit().remove()
        labels.exit().remove()
    }
}