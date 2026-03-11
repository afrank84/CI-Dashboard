async function loadDashboard(){

const index = await fetch("data/index.json")
const files = await index.json()

let durations=[]
let labels=[]

for(const file of files){

const res = await fetch("data/"+file)
const data = await res.json()

const row=document.createElement("tr")

row.innerHTML=`
<td>${data.repository}</td>
<td class="${data.status==="success"?"pass":"fail"}">${data.status}</td>
<td>${data.branch}</td>
<td>${data.commit.substring(0,7)}</td>
<td>${data.duration_seconds}s</td>
<td>${data.tests_passed}/${data.tests_passed+data.tests_failed}</td>
<td><a href="${data.run_url}" target="_blank">View</a></td>
`

document.getElementById("repoTable").appendChild(row)

labels.push(data.repository)
durations.push(data.duration_seconds)

}

createChart(labels,durations)

}

function createChart(labels,data){

new Chart(
document.getElementById("durationChart"),
{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Build Duration (seconds)",
data:data,
backgroundColor:"#38bdf8"
}]
}
})

}

loadDashboard()
