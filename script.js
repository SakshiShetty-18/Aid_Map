const incidents = [
 {id:"INC-001",title:"Flood rescue",description:"Rising water, 3 elderly people trapped near the old bus stand.",location:"Old Bus Stand, Demo Village",people:3,reports:2,score:92,priority:"Critical",status:"Awaiting review",factors:[["Rescue urgency",40],["People affected",12],["Elderly vulnerability",15],["Rising water",15],["Corroborating reports",10]]},
 {id:"INC-002",title:"Road blocked by floodwater",description:"Floodwater is blocking the main access road near the clinic.",location:"River Road, Demo Village",people:12,reports:4,score:78,priority:"High",status:"Awaiting review",factors:[["Access blocked",30],["People affected",18],["Flood severity",20],["Corroborating reports",10]]},
 {id:"INC-003",title:"Waterlogging reported",description:"Waterlogging reported near the market. No injuries reported.",location:"Market Street, Demo Village",people:5,reports:1,score:48,priority:"Medium",status:"Awaiting review",factors:[["Hazard level",18],["People affected",10],["Access impact",12],["Report reliability",8]]},
 {id:"INC-004",title:"Family needs evacuation",description:"A family reports fast-rising water entering their ground floor.",location:"South Bank, Demo Village",people:6,reports:3,score:86,priority:"Critical",status:"Awaiting review",factors:[["Rescue urgency",35],["People affected",16],["Rising water",25],["Corroborating reports",10]]},
 {id:"INC-005",title:"Medical supplies needed",description:"Volunteer requests basic medical supplies for an isolated household.",location:"Hillview Hamlet",people:2,reports:1,score:63,priority:"High",status:"Awaiting review",factors:[["Medical need",25],["Isolation",18],["People affected",10],["Report reliability",10]]},
 {id:"INC-006",title:"Unclear help request",description:"Help needed near the temple. Exact location is unclear.",location:"Temple area — verify location",people:0,reports:2,score:55,priority:"Medium",status:"Location needs verification",factors:[["Unverified emergency",20],["Location uncertainty",15],["Corroborating reports",10],["Potential exposure",10]]},
 {id:"INC-007",title:"Minor waterlogging",description:"Shallow water reported on a residential lane.",location:"North Lane, Demo Village",people:3,reports:1,score:28,priority:"Low",status:"Awaiting review",factors:[["Hazard level",10],["People affected",8],["Access impact",5],["Report reliability",5]]},
 {id:"INC-008",title:"Power outage reported",description:"Local power outage reported; extent of impact is unknown.",location:"Riverbank Ward",people:20,reports:3,score:69,priority:"High",status:"Awaiting review",factors:[["Service disruption",22],["People affected",20],["Safety impact",17],["Corroborating reports",10]]}
];
let selectedId = "INC-001";
let history = [];
let zones = {"Village C":"Needs verification","Hillview Hamlet":"Needs verification","Riverbank Ward":"Needs verification"};
const $ = id => document.getElementById(id);
function priorityClass(p){return p.toLowerCase()}
function renderList(){
 const search=$("searchInput").value.toLowerCase(), filter=$("priorityFilter").value;
 const filtered=incidents.filter(i=>(filter==="All"||i.priority===filter)&&`${i.id} ${i.title} ${i.description} ${i.location}`.toLowerCase().includes(search));
 $("queueCount").textContent=`${filtered.length} reports`;
 $("incidentList").innerHTML=filtered.map(i=>`<div class="incident-item ${i.id===selectedId?'selected':''}" data-id="${i.id}"><div class="incident-strip ${i.priority}"></div><div><h4>${i.id} · ${escapeHtml(i.title)}</h4><p>${escapeHtml(i.description)}</p><div class="location">⌖ ${escapeHtml(i.location)} · ${i.people} people · ${i.reports} report${i.reports===1?'':'s'}</div></div><span class="priority ${priorityClass(i.priority)}">${i.score}/100</span></div>`).join("")||'<p class="empty-history">No incidents match these filters.</p>';
 document.querySelectorAll(".incident-item").forEach(el=>el.addEventListener("click",()=>selectIncident(el.dataset.id)));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function selectIncident(id){selectedId=id;renderList();renderDetails()}
function renderDetails(){
 const i=incidents.find(x=>x.id===selectedId); if(!i)return;
 $("detailTitle").textContent=`${i.id} · ${i.title}`;$("detailDescription").textContent=i.description;$("detailLocation").textContent=i.location;$("detailPeople").textContent=`${i.people} people affected`;$("detailReports").textContent=`${i.reports} report${i.reports===1?'':'s'}`;$("detailScore").textContent=i.score;$("scoreRing").textContent=i.score;
 $("detailPriority").textContent=i.priority.toUpperCase();$("detailPriority").className=`priority ${priorityClass(i.priority)}`;
 $("detailStatus").textContent=i.status;$("detailStatus").className="status "+(i.status.includes("Approved")?"status-approved":"status-pending");
 const total=i.factors.reduce((a,f)=>a+f[1],0);
 $("scoreBreakdown").innerHTML=i.factors.map(([label,val])=>`<div class="factor"><span>${escapeHtml(label)}</span><strong>+${val}</strong><div class="factor-track"><span style="width:${Math.min(100,val/40*100)}%"></span></div></div>`).join("")+`<div class="factor"><strong>Total illustrative score</strong><strong>${total}/100</strong></div>`;
}
function logAction(action,detail,reason=""){
 history.unshift({id:selectedId,action,detail,reason,time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})});
 renderHistory();toast(`${action} recorded for ${selectedId}`);
}
function renderHistory(){
 $("historyList").innerHTML=history.length?history.map(h=>`<div class="history-row"><span class="history-symbol">✓</span><div><b>${escapeHtml(h.action)} · ${escapeHtml(h.id)}</b><p>${escapeHtml(h.detail)}${h.reason?' — Reason: '+escapeHtml(h.reason):''}</p></div><span class="history-time">${h.time}</span></div>`).join(""):'<p class="empty-history">No actions yet. Approve, edit, override, or verify an item to record an action.</p>';
}
let toastTimer;
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2600)}
function updateCounts(){
 $("activeCount").textContent=incidents.filter(i=>!i.status.startsWith("Resolved")).length;
 $("criticalCount").textContent=incidents.filter(i=>i.priority==="Critical"&&!i.status.includes("Approved")).length;
 $("pendingCount").textContent=incidents.filter(i=>!i.status.includes("Approved")).length;
 $("zoneCount").textContent=Object.values(zones).filter(z=>z!=="Verification requested").length;
}
$("searchInput").addEventListener("input",renderList);$("priorityFilter").addEventListener("change",renderList);
document.querySelectorAll(".map-pin[data-incident]").forEach(pin=>pin.addEventListener("click",()=>selectIncident(pin.dataset.incident)));
$("showAll").addEventListener("click",()=>{$("searchInput").value="";$("priorityFilter").value="All";renderList();toast("Showing all simulated incidents")});
$("approveBtn").addEventListener("click",()=>{const i=incidents.find(x=>x.id===selectedId);i.status="Approved by Coordinator";logAction("Recommendation approved",`${i.title} · Priority ${i.priority}`);renderDetails();renderList();updateCounts()});
$("editBtn").addEventListener("click",()=>{const i=incidents.find(x=>x.id===selectedId);$("editDescription").value=i.description;$("editLocation").value=i.location;$("editPeople").value=i.people;$("editDialog").showModal()});
$("editForm").addEventListener("submit",e=>{e.preventDefault();const i=incidents.find(x=>x.id===selectedId);i.description=$("editDescription").value;i.location=$("editLocation").value;i.people=Number($("editPeople").value);$("editDialog").close();logAction("Incident edited",`Description/location/people updated for ${i.title}`);renderList();renderDetails()});
$("overrideBtn").addEventListener("click",()=>{$("overridePriority").value=incidents.find(x=>x.id===selectedId).priority;$("overrideReason").value="";$("overrideDialog").showModal()});
$("overrideForm").addEventListener("submit",e=>{e.preventDefault();const i=incidents.find(x=>x.id===selectedId),old=i.priority;i.priority=$("overridePriority").value;const reason=$("overrideReason").value.trim();i.score=({Critical:92,High:75,Medium:50,Low:25})[i.priority];i.factors=[["Coordinator override",i.score]];i.status="Priority overridden";$("overrideDialog").close();logAction("Priority overridden",`${old} → ${i.priority}`,reason);renderList();renderDetails();updateCounts()});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).close()));
document.querySelectorAll(".verify-btn").forEach(b=>b.addEventListener("click",()=>{zones[b.dataset.zone]="Verification requested";b.textContent="✓ Verification requested";b.disabled=true;b.classList.add("hidden");history.unshift({id:b.dataset.zone,action:"Silent zone flagged",detail:"Coordinator requested verification",reason:"Low or missing report activity",time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})});renderHistory();updateCounts();toast(`${b.dataset.zone} marked for verification`)}));
$("clearHistory").addEventListener("click",()=>{history=[];renderHistory();toast("Demo decision history cleared")});
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav-link").forEach(n=>n.classList.remove("active"));b.classList.add("active");const view=b.dataset.view;$("pageTitle").textContent=view==="Overview"?"Disaster Response Control Center":view; if(view==="Silent Zones")document.querySelector(".zones-panel").scrollIntoView({behavior:"smooth",block:"center"});else if(view==="Decision History")$("historyList").scrollIntoView({behavior:"smooth",block:"center"});else if(view==="All Reports"||view==="Incident Map")document.querySelector(".workspace").scrollIntoView({behavior:"smooth",block:"start"});else window.scrollTo({top:0,behavior:"smooth"});if(view==="All Reports")toast("Use search and priority filters to explore all reports");}));
renderList();renderDetails();renderHistory();updateCounts();
