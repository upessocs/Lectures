var data = [1,2, 10, 32, 33];

var posts = [
    "post 1 some random data",
    "post 2 some random data",
    "post 3 some random data",
    "post 4 some random data",
    "post 5 some random data",
];

var lists = d3.select("#list")
.selectAll("li")
.data(data)
.enter()
.append("li")
.text(d=>d)


var lists = d3.select("#posts")
.selectAll("p")
.data(posts)
.enter()
.append("p")
.text(d=>d)