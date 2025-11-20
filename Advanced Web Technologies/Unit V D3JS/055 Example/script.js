const width = 400;
const height = 220;

/* ------------------------
   CHART 1 (NO ANIMATION)
-------------------------*/
const svg1 = d3.select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const list1 = d3.select("#data1");

let data1 = [40, 80, 55, 20];

function generateSizedArray() {
    const count = parseInt(document.getElementById("sizeSlider").value, 10);
    return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
}


const xScale1 = d3.scaleBand().range([0, width]).padding(0.2);
const yScale1 = d3.scaleLinear().range([height, 0]);

function renderWithoutAnimation(data) {
    xScale1.domain(data.map((d, i) => i));
    yScale1.domain([0, d3.max(data)]);
    
    const xAxis = d3.axisBottom(xScale1);
    const yAxis = d3.axisLeft(yScale1).ticks(5);
    
    const bars = svg1.selectAll("rect").data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale1(i))
        .attr("y", d => yScale1(d))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => height - yScale1(d));

    bars
        .attr("x", (d, i) => xScale1(i))
        .attr("y", d => yScale1(d))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => height - yScale1(d));

    bars.exit().remove()
    

    // UPDATE list1
    const li = d3.select("#data1")
    .selectAll("li")
    .data(data);

    // UPDATE
    li.text(d => d);

    // ENTER
    li.enter()
    .append("li")
    .text(d => d);

    // EXIT
    li.exit().remove();

}

function updateWithoutAnimation() {
    // data1 = data1.map(() => Math.floor(Math.random() * 100));
    if (document.getElementById("autoSizeToggle").checked) {
        data1 = generateSizedArray();
    } else {
        data1 = data1.map(() => Math.floor(Math.random() * 100));
    }

    renderWithoutAnimation(data1);
}


/* ------------------------
   CHART 2 (WITH ANIMATION)
-------------------------*/
const svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const list2 = d3.select("#data2");

let data2 = [40, 80, 55, 20];

const xScale2 = d3.scaleBand().range([0, width]).padding(0.2);
const yScale2 = d3.scaleLinear().range([height, 0]);

function renderWithAnimation(data) {
    xScale2.domain(data.map((d, i) => i));
    yScale2.domain([0, d3.max(data)]);

    const bars = svg2.selectAll("rect").data(data);

    const enterBars = bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale2(i))
        .attr("y", height)
        .attr("width", xScale2.bandwidth())
        .attr("height", 0)
        .attr("fill", "orange")
        .attr("stroke", "black");

    enterBars.merge(bars)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale2(i))
        .attr("y", d => yScale2(d))
        .attr("width", xScale2.bandwidth())
        .attr("height", d => height - yScale2(d));

    bars.exit()
        .transition()
        .duration(1000)
        .attr("y", height)
        .attr("height", 0)
        .remove();
}

function updateWithAnimation() {
    // data2 = data2.map(() => Math.floor(Math.random() * 100));
    if (document.getElementById("autoSizeToggle").checked) {
        data2 = generateSizedArray();
    } else {
        data2 = data2.map(() => Math.floor(Math.random() * 100));
}


    renderWithAnimation(data2);
}

/* ------------------------
   RESET BOTH
-------------------------*/
function resetBothCharts() {
    data1 = [40, 80, 55, 20];
    data2 = [40, 80, 55, 20];
    document.getElementById("sizeSlider").value = 4;
    document.getElementById("sizeValue").textContent = 4;
    document.getElementById("autoSizeToggle").checked = false;

    svg1.selectAll("*").remove();
    svg2.selectAll("*").remove();
    renderWithoutAnimation(data1);
    renderWithAnimation(data2);
}

renderWithoutAnimation(data1);
renderWithAnimation(data2);