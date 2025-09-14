// const host = `https://dell-i7.tail9f300.ts.net`
// const host = `https://upes-win-pg.tail9f300.ts.net`
const host = `https://prateekrajgautam-upesmarks.hf.space`
// const host = `http://127.0.0.1:7860`

const apiurl = `${host}/api/marks/`


async function reload() {
    append(appheader, gen(h3, "title", "Marks for Preview Only", "title"), "o")

    append(appmain, gen("section", "hero", gen("h1", "", "Marks Preview"), 'section container'), 'over')

    append(hero, gen(div, "marksmain"))


    append(marksmain, gen(span, "", "Select subject/batch  ", ""))
    append(marksmain, gen(select, "subject", "", ""))
    subject.type = "radio"
    var subjectlist = "python,soft computing,major project 1".split(",")
    subjectlist.forEach((s) => {
        append(subject, gen(option, s, s))
    })

    async function checkserver() {
        var url = `${host}/serverstatus`
        var resp = await fetch(url)
        if (resp.status == "200") {
            console.log("Server is up")
            var data = await resp.json()
            console.log(data.subjects)
            subjectlist = data.subjects
            console.log(subjectlist)
            append(subject, "", "o")
            subjectlist.forEach((s) => {
                append(subject, gen(option, s, s))
            })
        }
        return true
    }

    var serverlive = checkserver()


    if (serverlive) {
        console.log("Server is live")
    }
    else {
        console.log("Server is not live")
    }


    append(marksmain, gen(span, "", "Enter sapid  ", ""))
    append(marksmain, gen(input, "sapid", "", ""))
    append(marksmain, gen(button, "showmarks", "Show Marks", "", { "onclick": "getandshowmarks()", "tabindex": 1 }))


    setTimeout(() => {
        GeneratorWebHelper().init()
    }, 1000)

    var sap = localStorage.getItem("sapid");
    grab("#sapid")[0].value = sap;

}

reload()



async function getandshowmarks() {
    var sub = grab("#subject")[0].value
    var sap = grab("#sapid")[0].value
    localStorage.setItem("sapid", sap)
    var requesturl = `${apiurl}${sub}/${sap}`


    var dummydata = {
        "MID": 10,
        "IA": 10,
        "END": 50
    }

    var resp = await fetch(requesturl)

    //success
    if (resp.status == "200") {
        console.log(resp.ok)
        console.log(resp.status)

        const data = await resp.json()
        // console.log(data)
        // console.log(resp.headers)

        append(marksmain, "", "o")
        var rowcount = 0;

        data.forEach(datarow => {
            // append(marksmain, gen(h2,"",`Backlog No ${rowcount+1}`))
            append(marksmain, gen(div, `row${rowcount}`, "", "row"))
            //show data each row

            if (sub.toLowerCase().includes("back")){
                append(`#row${rowcount}`, gen(span, "","Backlog No", "key"))
                append(`#row${rowcount}`, gen(span, "",`${rowcount+1}`, "val"))
            }
            
            for (const [key, val] of Object.entries(datarow)) {
                //log(key)
                //log(val)

                append(`#row${rowcount}`, gen(span, "", key, "key"))
                append(`#row${rowcount}`, gen(span, "", val, "val"))
            }
            rowcount++
        })





        append(marksmain, gen(button, "reloadbtn", "Reload", "", { "onclick": "reload()", "tabindex": 1 }))
    }










    //error
    if (resp.status != "200") {

        var dummydata = {
            "Status": resp.status,
            "Result": `Result Not Available for Said ${sap}`
        }
        console.log(resp.content)

        append(marksmain, "", "o")

        //show data
        for (const [key, val] of Object.entries(dummydata)) {
            //log(key)
            //log(val)

            append(marksmain, gen(span, "", key, "key"))
            append(marksmain, gen(span, "", val, "val"))
        }



        append(marksmain, gen(button, "reloadbtn", "Reload", "", { "onclick": "reload()" }))
    }

    return data
}

var marksscss = `
#marksmain{
display:flex;
flex-direction:column;


    .row{
        font-family: arial;
        margin:2em;
        box-shadow: 3px 2px 6px white;
        padding: 1em;
        border-radius: .5em;
        display: grid;
        grid-template-columns: minmax(200px,25%) minmax(200px,1fr) !important;
        overflow-x: auto;
        gap:.2em;
        
        span{
            padding:.2em;
            &:nth-child(odd){
            }
            &:nth-child(even){
            background-color:hsla(220,40%,40%,.2);
            }
        }
        
        &:nth-child(even){
            --hue:200;
        }
    
    }





  padding:1em 2em;
  border-radius: 1em;
  background-color: hsla(var(--hue),30%,20%,.6);
  backdrop-filter: blur(2px);
  box-shadow: 0px 0px 20px hsla(0,0%,50%,.3);
    &:hover{
      backdrop-filter: blur(6px);
      box-shadow: 0px 0px 20px hsla(0,0%,50%,.4);
      
  }

  span:nth-child(odd){
   
  }


}



input,select,option{
    text-transform:capitalize;
    padding:.2em;
}

.key{
    text-transform:uppercase;
    font-weight:500;
    font-size:.8em;
}
`

loadscss(marksscss)




