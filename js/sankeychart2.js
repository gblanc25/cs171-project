class SankeyChart2 {

    // constructor method to initialize SankeyChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.initVis();
    }

    initVis() {
        let vis = this;
        // set the dimensions and margins of the graph
        vis.margin = {top: 40, right: 25, bottom: 20, left: 20};

        // Set dynamic width, height, and svg
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // append the svg object to the parentElement
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + 2 * vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        //add titles
        vis.svg.append('g')
            .attr('class', 'sankey-title')
            .append('text')
            .text('Median Family Income')
            .attr('transform', `translate(0, -15)`)
            .attr('text-anchor', 'left');

        vis.svg.append('g')
            .attr('class', 'sankey-title')
            .append('text')
            .text('Educational Attainment')
            .attr('transform', `translate(${vis.width}, -15)`)
            .attr('text-anchor', 'end');


        // format variables
        vis.formatNumber = d3.format(",.0f"), // zero decimal places
            vis.format = function(d) { return vis.formatNumber(d); },
            vis.color = d3.scaleOrdinal(['#58776c', 'tan', 'darkred', 'gray', '#77C3EC']);


        // Set the sankey diagram properties
        vis.sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .size([vis.width, vis.height])
            .nodeSort(null) //creates sankey nodes as ordered in the data


        vis.path = vis.sankey.links();
        vis.wrangleData()
    }

    wrangleData(){
        let vis = this;
        vis.displayData = vis.data.slice();
        vis.displayData2 = vis.data.slice();

        vis.displayData.sort((a,b) => {return (+b.income) - (+a.income)})

        vis.displayData2.sort((a,b) => {return (+b.cat4_18to24) - (+a.cat4_18to24)})

        vis.sankeyData = {"nodes":[], "links":[]};
        vis.sankeyData.nodes = [
            {"node": 0, "name": 'top 20 % of states'},
            {"node": 1, "name": '20-40 %'},
            {"node": 2, "name": '40-60 %'},
            {"node": 3, "name": '60-80 %'},
            {"node": 4, "name": 'bottom 20 % of states'},
            {"node": 5, "name": 'top 20 % of states'},
            {"node": 6, "name": '20-40 %'},
            {"node": 7, "name": '40-60 %'},
            {"node": 8, "name": '60-80 %'},
            {"node": 9, "name": 'bottom 20 % of states'}]


        for (var i =0; i<50; i++){
            let currentState = vis.displayData[i].State
            let pos = vis.displayData2.map(e => e.State).indexOf(currentState)
            vis.sankeyData.links.push({
                "source": Math.floor(i/10),
                "target": Math.floor(pos/10 + 5),
                "value": 2,
                "class": currentState,
                "outcome": vis.displayData[i].cat4_18to24,
                "income": vis.displayData[i].income
            })
        }


        vis.updateVis()

    }

    updateVis() {
        let vis = this;

        vis.graph = vis.sankey(vis.sankeyData);

        // add in the links
        vis.link = vis.svg.append("g").selectAll(".link")
            .data(vis.graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("id", d=>{return d.class})
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke-width", function(d) {
                return d.width; });
        // .attr("stroke-width", 20)
        //
        // vis.link
        //     .attr("id", d => {
        //         console.log (d)
        //     })

        vis.svg.selectAll("#Colorado")
            .style("stroke", "green")
            .style("stroke-opacity", 1)
            .attr("id", d => {
                document.getElementById("outcome-row2").innerHTML = d.outcome + "%";
                document.getElementById("income-row2").innerHTML = "$"+d3.format(",")(d.income);
        })

        vis.svg.selectAll("#Pennsylvania")
            .style("stroke", "yellow")
            .style("stroke-opacity", 1)
            .attr("id", d => {
                document.getElementById("outcome-row3").innerHTML = d.outcome + "%";
                document.getElementById("income-row3").innerHTML = "$"+d3.format(",")(d.income);
            })


        vis.svg.selectAll(".link")
            .on('mouseover', function(event, d) {
                if (d.class !== "Colorado" && d.class !== "Pennsylvania") {
                    d3.select(this).style("stroke-opacity", 0.2)
                }

            })




        // add the link titles
        vis.link.append("title")
            .text(function(d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + vis.format(d.value); });

        // add in the nodes
        var node = vis.svg.append("g").selectAll(".node")
            .data(vis.graph.nodes)
            .enter().append("g")
            .attr("class", "node");

        // add the rectangles for the nodes
        node.append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("height", function(d) {
                return d.y1 - d.y0;})
            // .attr("height", 20)
            .attr("width", vis.sankey.nodeWidth())
            .style("fill", function(d) {
                return d.color = vis.color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) {
                return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + vis.format(d.value); });

        // add in the title for the nodes
        node.append("text")
            .attr("x", function(d) { return d.x0 - 6; })
            .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x0 < vis.width / 2; })
            .attr("x", function(d) { return d.x1 + 6; })
            .attr("text-anchor", "start");


    }
}

//
// document.getElementById("outcome-row3").innerHTML = d.outcome + "%";
// document.getElementById("income-row3").innerHTML = "$"+d3.format(",")(d.income);

