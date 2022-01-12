clockElem = document.getElementsByClassName('clk');
timedis = document.getElementById('timedis');
datedis = document.getElementById('datedis');

hrDiv = clockElem[0];
minDiv = clockElem[1];
secDiv = clockElem[2];
alarmData = {};

function audioPause(audio){
	setTimeout(function(){
		audio.pause();
		let pause = document.getElementById("pause");
  		pause.style.display = 'inline-block';
  		pause.innerHTML = "P";
	},60000);
}
let audioObject;
handle = setInterval(function(){

	date = new Date();

	let hour = date.getHours();
	let minute = date.getMinutes();
	let second = date.getSeconds();

	let hourWidth = hour*(100/24);
	let minuteWidth = minute*(100/60);
	let secondWidth = second*(100/60);

	hourWidth += (100/(24*60*60))
	minuteWidth += (100/(60*60))
	secondWidth += (100/60)

	hrDiv.style.height = hourWidth + "%";
	minDiv.style.height = minuteWidth + "%";
	secDiv.style.height = secondWidth + "%";

	if(secondWidth >= 100) secondWidth = 0;
	if(minuteWidth >= 100) minuteWidth = 0;
	if(hourWidth >= 100) hourWidth = 0;

	dt = date;
	timedis.innerHTML = `${dt.getHours() < 10 ? "0"+dt.getHours():dt.getHours()}:${dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes() }:${dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds()}`;
	datedis.innerHTML = `${dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()}/${dt.getMonth() < 10 ? "0"+(dt.getMonth()+1) : (dt.getMonth()+1)}/${dt.getFullYear()}`;

	for (const [key, value] of Object.entries(alarmData)) {
  		let alarmid = value.alarmid;
  		let alarmtime = value.time;

  		let diffMs = (alarmtime - date.getTime());
		let diffDays = Math.floor(diffMs / 86400000); // days
		let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
		let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

  		document.getElementById(`ringin${alarmid}`).innerHTML = `Ring in ${diffHrs} hr ${diffMins} min`;

  		if(diffMs<=0){
  			let pause = document.getElementById("pause");
  			pause.style.display = 'inline-block';
  			pause.innerHTML = "PA";
  			var audio = new Audio('assets/song.mp3');
  			audioObject = audio;
			audio.play();
			audio.loop = true;
			delete alarmData[key];
			document.getElementById(`deleteSection${alarmid}`).remove();
			audioPause(audio);
  		} 
	}

},1000);

pause.addEventListener('click',function(){
	audioObject.pause();
	pause.innerHTML = 'P';
	pause.style.display = 'none';
});

hourrange = document.getElementById("hrsetrange");
minrange = document.getElementById("minsetrange");
hrrangedis = document.getElementById("hrsetrangedis");
minrangedis = document.getElementById("minsetrangedis");

hourrange.addEventListener('mousemove',function(){
	hrrangedis.innerHTML = hourrange.value;
})

minrange.addEventListener('mousemove',function(){
	minrangedis.innerHTML = minrange.value;
})


saveAlarm = document.getElementById("saveAlarm");

template = `
	<div class="card card-body-back" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title card-title-color">{CHANGE}</h5>
        <h6 class="card-subtitle mb-2 text-muted">Ring in {CHANGE}</h6>
        <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked>
        <button type="button" class="btn btn-outline-dark">Delete</button>
      </div>
      </div>
    </div>
`;
alarms = document.getElementById("alarms");
alt = document.getElementById("alert");
msg = document.getElementById("msg");
alt.style.display = 'none';
const maxalarms = 3
let num = 0;
saveAlarm.addEventListener('click',function(){
	let date = new Date();
	if(num == maxalarms){
		msg.innerHTML = "You Can not add more then 3 Alarms.";
		alt.style.display = 'block';
		setTimeout(function(){
				document.getElementById("alert").style.display = 'none';
			},1000);
	}else{
		let hr = hourrange.value;
		let min = minrange.value;
		let node = document.createElement('div');

		let d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hr, min,0);
		console.log(d);
		let diffMs = (d - date);
		if(diffMs < 0){
			msg.innerHTML = "Yout Enter Past Time,can't set alarm.";
			document.getElementById("alert").style.display = 'block';
			setTimeout(function(){
				document.getElementById("alert").style.display = 'none';
			},2000);
		}else{
			num++;
			var diffDays = Math.floor(diffMs / 86400000); // days
			var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
			var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

			node.id = `deleteSection${num}`;
			node.innerHTML = `
				<div class="card card-body-back" style="width: 18rem;" id="alarmcard${num}">
			      <div class="card-body">
			        <h5 class="card-title card-title-color">Alarm Set For : ${hr < 10 ? "0" + hr:hr}:${min < 10 ? "0" + min:min}:00</h5>
			        <h6 class="card-subtitle mb-2 text-muted" id="ringin${num}">Ring in ${diffHrs} hr ${diffMins} min</h6>
			        <div class="form-check form-switch">
			        <button type="button" onclick="EleRemove(this)" class="btn btn-outline-danger alarmDelBtns" iddata="${num}" id="delalarm${num}">Delete</button>
			      </div>
			      </div>
			    </div>
			`;
			
			alarmData[`alarm${num}`] = {
				alarmid:num,
				time:d.getTime()
			};
			alarms.appendChild(node);
			alarmSetting();
		}
	}
});

function EleRemove(el){
	key = `alarm${el.attributes.iddata.nodeValue}`;
	delete alarmData[key];
	el.parentElement.parentElement.parentElement.parentElement.remove();
	num--;
}

function alarmSetting(){
	let alarms = document.getElementById('alarms');
	console.log(alarms.children.length);
}

/*
HOURS - 
24 hrs = 100%
1 hr = (100/24)%
60 min = (100/24)%
1 min = (100/(24*60))%
60 sec = (100/(24*60))%
1 sec = (100/(24*60*60))%
*/

/* 
Minute - 
60 minute = 100%
1 minute = (100/60)%
60 sec = (100/60)%
1 sec = (100/(60*60))%
*/

/* 
Second - 
60 second - 100%
1 second - (100/60)%
*/
