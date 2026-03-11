let repoData=[]

async function loadDashboard(){

const index=await fetch("data/index.json")
const files=await index.json()

for(const file of files){

const res=await fetch("data/"+file)
const data=await res.json()

repoData.push(data)

}

renderTable(repoData)
createCharts(repoData)

}

function renderTable(data){

const table=document.getElementById("repoTable")

data.forEach(repo=>{

const row=document.createElement("tr")

row.innerHTML=`
<td>${repo.repository}</td>
<td class="${repo.status==="success"?"pass":repo.status==="failure"?"fail":"running"}">${repo.status}</td>
<td>${repo.branch}</td>
<td>${repo.commit.substring(0,7)}</td>
<td>${repo.commit_author}</td>
<td>${repo.duration_seconds}s</td>
<td>${repo.coverage.percent}%</td>
<td>${repo.environment}</td>
`

table.appendChild(row)

})

}

function createCharts(data){

let success=0
let failure=0

let coverage=[]
let repos=[]
let queue=[]

data.forEach(repo=>{

repos.push(repo.repository)
coverage.push(repo.coverage.percent)
queue.push(repo.queue_seconds)

if(repo.status==="success") success++
if(repo.status==="failure") failure++

})

new Chart(
document.getElementById("successChart"),
{
type:"doughnut",
data:{
labels:["Success","Failure"],
datasets:[{
data:[success,failure],
backgroundColor:["#22c55e","#ef4444"]
}]
}
})

new Chart(
document.getElementById("coverageChart"),
{
type:"bar",
data:{
labels:repos,
datasets:[{
label:"Coverage %",
data:coverage,
backgroundColor:"#38bdf8"
}]
}
})

new Chart(
document.getElementById("queueChart"),
{
type:"bar",
data:{
labels:repos,
datasets:[{
label:"Queue Time (s)",
data:queue,
backgroundColor:"#facc15"
}]
}
})

}

document.getElementById("searchBox").addEventListener("keyup",function(){

const text=this.value.toLowerCase()

const filtered=repoData.filter(r=>r.repository.toLowerCase().includes(text))

document.getElementById("repoTable").innerHTML=`<tr>
<th>Repo</th>
<th>Status</th>
<th>Branch</th>
<th>Commit</th>
<th>Author</th>
<th>Duration</th>
<th>Coverage</th>
<th>Env</th>
</tr>`

renderTable(filtered)

})

loadDashboard()
