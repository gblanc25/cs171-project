
class GeoVis {

    constructor(parentElement, geoData, fundingData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.fundingData = fundingData;
        // this.displayData = data;

        this.initVis();
    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 80, left: 20};

        // Set dynamic width, height, and svg
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + 2 * vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.viewpoint = {"width":975, "height": 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        vis.map =vis.svg.append("g")
            .attr("class", "usa")
            .attr("transform", `scale(${vis.zoom} ${vis.zoom})`);

        vis.path = d3.geoPath()

        vis.data = topojson.feature(vis.geoData, vis.geoData.objects.states).features

        vis.states = vis.map.selectAll(".state")
            .data(vis.data)
            .enter()
            .append("path")
            .attr("d", vis.path)
            .attr("fill", 'transparent')
            .attr("stroke", 'black')
            .attr("stroke-width", 1)
            .attr("class", "states");

        vis.colorScale = d3.scaleLinear()
            .range(["#FFFFFF", "#023020"])

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');

        //make legend
        let gradientRange = d3.range(150);

        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width * 2.8 / 4}, ${vis.height - 25})`)

        vis.legendScale = d3.scaleLinear()
            .range(["#FFFFFF", "#023020"])
            .domain([0,150]);

        vis.legend.selectAll("rect")
            .data(gradientRange)
            .enter()
            .append("rect")
            .attr("x", (d,i) => i)
            .attr("y", 0)
            .attr("height", 20)
            .attr("width", 2)
            .style("fill", d=>vis.legendScale(d))

        vis.legendAxisGroup = vis.svg.append("g")
            .attr("class", "legend-axis")
            .attr('transform', `translate(${vis.width * 2.8 / 4}, ${vis.height - 20})`)

        vis.minText = vis.legendAxisGroup
            .append('text')
            .attr('x', 0)
            .attr('y', 30)
            .attr('class', 'legend-text')
            .style('text-anchor', 'middle');

        vis.maxText = vis.legendAxisGroup
            .append('text')
            .attr('class', 'text')
            .attr('x', 150)
            .attr('y', 30)
            .attr('class', 'legend-text')
            .style('text-anchor', 'middle');



        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // do stuff

        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */

    updateVis() {
        let vis = this;


        vis.colorScale.domain([d3.min(vis.fundingData, d=> +d[selectedCategory]),d3.max(vis.fundingData, d=> +d[selectedCategory])])


        vis.states
            .style("fill", d => {
                let stateName = d.properties.name
                // console.log(stateName)

                let color = ""

                vis.fundingData.forEach(d => {
                    if (d.State === stateName){
                        color = vis.colorScale(+d[selectedCategory])
                        // console.log(d[selectedCategory])
                    }

                })
                return color;
            })

        vis.svg.selectAll(".states")
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('fill', 'red');

                let fundingTotal = "";
                let fundingFederal = "";
                let fundingState = "";
                let fundingLocal = "";
                let deathsR = "";
                let stateName = d.properties.name;

                vis.fundingData.forEach(d => {
                    if (d["State"] === stateName){
                        fundingTotal = +d["Funding_Total"]
                        fundingFederal = +d["Funding_Federal"]
                        fundingState = +d["Funding_State"]
                        fundingLocal = +d["Funding_Local"]
                    }

                })

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3>${d.properties.name}<h3>
                             <h4> Total Funding: $${formatAbbreviation(fundingTotal)} </h4>
                             <h4> Federal Funding: $${formatAbbreviation(fundingFederal)} </h4>  
                             <h4> State Funding: $${formatAbbreviation(fundingState)} </h4>  
                             <h4> Local Funding: $${formatAbbreviation(fundingLocal)} </h4>

                         </div>`);
            })


            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .style("fill", d => {
                        let stateName = d.properties.name

                        let color = ""

                        vis.fundingData.forEach(d => {
                            if (d["State"] === stateName){
                                color = vis.colorScale(+d[selectedCategory])
                            }

                        })
                        return color;
                    })

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })


        //fix legend formatting
        vis.maxText.text(formatAbbreviation(d3.max(vis.fundingData, d => +d[selectedCategory])))
        vis.minText.text(formatAbbreviation(d3.min(vis.fundingData, d => +d[selectedCategory])))


    }
}

function formatAbbreviation(x) {
    let s = d3.format(".3s")(x);
    switch (s[s.length - 1]) {
        case "G": return s.slice(0, -1) + "B";
    }
    return s;
}