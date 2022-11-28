/* * * * * * * * * * * * * *
*      class BarVis        *
* * * * * * * * * * * * * */


class BarVis {

    constructor(parentElement, fundingData) {
        this.parentElement = parentElement;
        this.fundingData = fundingData;
        this.displayData = [];

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 65, left: 60};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title geo-text')
            .append('text')
            .text('Top 10 States with highest per-student Funding')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        // axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'axis y-axis');

        // initiate scales
        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .padding(0.1)

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)


        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)


        this.wrangleData();
    }

    wrangleData() {
        let vis = this

        vis.fundingData.sort((a, b) => {
            return +b[selectedCategory2] - +a[selectedCategory2]
        })


        vis.topTenData = vis.fundingData.slice(0, 10)

        vis.updateVis()

    }

    updateVis() {
        let vis = this;

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip');

        //update domains
        vis.xScale.domain(vis.topTenData.map(d => d["State"]))
        vis.yScale.domain([0, d3.max(vis.topTenData, d => +d[selectedCategory2])])

        //create bars
        vis.stateBars = vis.svg.selectAll(".bars")
            .data(vis.topTenData, d => d["State"])

        let colorScale = d3.scaleLinear()
            .range(["#FFFFFF", "#023020"])
            .domain([0, d3.max(vis.topTenData, d => +d[selectedCategory2])])

        vis.stateBars
            .enter()
            .append("rect")
            .merge(vis.stateBars)
            .attr("class", "bars")
            .transition()
            .attr("x", d => vis.xScale(d["State"]))
            .attr("y", d => vis.yScale(+d[selectedCategory2]))
            .attr("width", vis.xScale.bandwidth())
            .attr("height", d => (vis.height - vis.yScale(+d[selectedCategory2])))
            .style("fill", d => colorScale(+d[selectedCategory2]))

        vis.stateBars
            .exit().remove()

        // update axes
        vis.xScale
            .domain(vis.topTenData.map(d => d["State"]))

        vis.yScale
            .domain([0, d3.max(vis.topTenData, d => d[selectedCategory2])])

        vis.svg.select(".x-axis")
            .transition()
            .call(vis.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-45)"
            });

        vis.svg.select(".y-axis")
            .call(vis.yAxis)
        // .text(d => )

        vis.svg.append("text")
            // .attr("x", 0)
            .attr("text-anchor", "middle")
            // .attr("y", vis.height/2)
            .attr('transform', `translate (${-vis.margin.left+10}, ${vis.height/2}) rotate(270)`)
            .attr("font-size", "small")
            .text("Per-student Funding ($)")

    }
}

function formatAbbreviation(x) {
    let s = d3.format(".3s")(x);
    switch (s[s.length - 1]) {
        case "G":
            return s.slice(0, -1) + "B";
    }
    return s;
}
