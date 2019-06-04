var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var radius = 50;

class Line {
	constructor(x, y, c_x, c_y) {
		this.x = x;
		this.y = y;
		this.c_x = c_x;
		this.c_y = c_y;

		this.changed = false;
		this.angle = 0;
		this.target_angle = 0;
	}

	lerp(start, end, amt) {
		return (1-amt)*start+amt*end;
	}

	update() {
		if (this.angle > this.target_angle-Math.PI/4) {
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (i == 0 && j == 0) continue;
					if (i != 0 && j != 0) continue;

					if (!lines[this.c_y+i] || !lines[this.c_y+i][this.c_x+j]) continue;

					let line = lines[this.c_y+i][this.c_x+j];
					if (line.target_angle < this.target_angle) line.change();

					//lines[this.c_y+i][this.c_x+j].target_angle = this.target_angle;
					//lines.changed = true;
				}
			}
		}

		//if (this.angle >= this.target_angle || Math.abs(this.angle-this.target_angle) < Number.EPSILON) {
		//	this.changed = false;
		//}

		this.angle = this.lerp(this.angle, this.target_angle, 0.1);
	}

	draw() {
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x+Math.cos(this.angle)*radius, this.y+Math.sin(this.angle)*radius);
		ctx.stroke();
	}

	change() {
		this.target_angle += Math.PI/2;
		this.changed = true;
	}
}

var lines = [];

function resize_canvas(){
	if (canvas.width < window.innerWidth) canvas.width = window.innerWidth;
	if (canvas.height < window.innerHeight) canvas.height = window.innerHeight;

	lines = [];
	let gap_x = canvas.width % radius / 2;
	let gap_y = canvas.height % radius / 2;
	for (let i = 0; i < Math.floor(canvas.height / radius); i++) {
		lines.push([]);
		for (let j = 0; j < Math.floor(canvas.width / radius); j++) {
			lines[i].push(new Line(gap_x+j*radius, gap_y+i*radius, j, i));
		}
	}
}

function drawloop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let y_lines of lines) {
		for (let line of y_lines) {
			line.update();
			line.draw();
		}
	}
	window.requestAnimationFrame(drawloop);
}

var down = false;
function mousedown(e) {
	down = true;

	let c_x = Math.floor((e.x - radius/2) / radius);
	let c_y = Math.floor((e.y - radius/2) / radius);
	if (lines[c_y] && lines[c_y][c_x]) {
		line = lines[c_y][c_x];
		line.change();
		//line.target_angle += Math.PI/2;
	}
}

function mouseup() {
	down = false;
}

let old_cx = -1;
let old_cy = -1;
function mousemove(e) {
	if (!down) return;

	let c_x = Math.floor((e.x - radius/2) / radius);
	let c_y = Math.floor((e.y - radius/2) / radius);
	
	if (c_x == old_cx && c_y == old_cy) return;

	if (lines[c_y] && lines[c_y][c_x]) {
		line = lines[c_y][c_x];
		line.change();
		//line.target_angle += Math.PI/2;
	}

	old_cx = c_x;
	old_cy = c_y;
}

function autorun() {
	canvas.addEventListener('mousedown', mousedown);
	canvas.addEventListener('mouseup', mouseup);
	canvas.addEventListener('mousemove', mousemove);
	resize_canvas();
	drawloop();
}

if (document.addEventListener) document.addEventListener("DOMContentLoaded", autorun, false);
else if (document.attachEvent) document.attachEvent("onreadystatechange", autorun);
else window.onload = autorun;
