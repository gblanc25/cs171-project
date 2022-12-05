class GeoVis3 {

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

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};

        // Set dynamic width, height, and svg
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.width = vis.width;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width * 2 + vis.margin.left + vis.margin.right)
            .attr("height", vis.width / 2 + vis.margin.top + 2 * vis.margin.bottom)
            .attr("class", "geovis3-map")
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + 0 + ")");

        vis.viewpoint = {"width":975, "height": 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        // define map elements
        vis.map =vis.svg.append("g")
            .attr("class", "usa")
            .attr("transform", `scale(${vis.zoom} ${vis.zoom})`);

        vis.path = d3.geoPath()

        vis.data = topojson.feature(vis.geoData, vis.geoData.objects.states).features

        // draw states
        vis.states = vis.map.selectAll(".state")
            .data(vis.data)
            .enter()
            .append("path")
            .attr("d", vis.path)
            .attr("fill", 'transparent')
            .attr("text-anchor", "end")
            .attr("stroke", 'black')
            .attr("stroke-width", 1)
            .attr("class", "states");

        vis.colorScale = d3.scaleLinear()
            .range(["#FFFFFF", "#023020"])

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */

    updateVis() {
        let vis = this;

        vis.colorScale.domain([d3.min(vis.fundingData, d=> +d["Funding_LocalperStudent"]),d3.max(vis.fundingData, d=> +d["Funding_LocalperStudent"])])

        vis.states
            .style("fill", d => {
                let stateName = d.properties.name

                let color = ""

                vis.fundingData.forEach(d => {
                    if (d.State === stateName){
                        color = vis.colorScale(+d["Funding_LocalperStudent"])
                    }

                })
                return color;
            })

        // enable tooltip for each state
        vis.svg.selectAll(".states")
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('fill', 'yellow');

                let fundingTotal = "";
                let fundingFederal = "";
                let fundingState = "";
                let fundingLocal = "";
                let deathsR = "";
                let stateName = d.properties.name;

                vis.fundingData.forEach(d => {
                    if (d["State"] === stateName){
                        fundingTotal = +d["Funding_TotalperStudent"]
                        fundingFederal = +d["Funding_FederalperStudent"]
                        fundingState = +d["Funding_StateperStudent"]
                        fundingLocal = +d["Funding_LocalperStudent"]
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
                                color = vis.colorScale(+d["Funding_LocalperStudent"])
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

            // once selected, call the bricks visualization
            .on('click', function(event, d) {

                selectedState = d.properties.name;

                vis.fundingData.forEach(d => {
                    if (d["State"] === selectedState){
                        if (+d["Funding_LocalperStudent"] < 5000) {
                            selectedFunding = 'Low';
                        }
                        else if (+d["Funding_LocalperStudent"] < 10000) {
                            selectedFunding = 'Medium';
                        }
                        else {
                            selectedFunding = 'High';
                        }
                    }

                })

                if (vis.parentElement === "brick-selector1") {
                    document.getElementById('close_button1').click();
                    bricks1.wrangleData();
                }
                else {
                    document.getElementById('close_button2').click();
                    bricks2.wrangleData();
                }

            })



    }
}

function formatAbbreviation(x) {
    let s = d3.format(".3s")(x);
    switch (s[s.length - 1]) {
        case "G": return s.slice(0, -1) + "B";
    }
    return s;
}
