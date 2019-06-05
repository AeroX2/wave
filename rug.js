(() => {
	let CENTER_X = canvas.width / 2;
	let CENTER_Y = canvas.height / 2;


	class Point3D {
		constructor(x,y,z) {
			this.x = x;
			this.y = y;
			this.z = z;

			this.screen_x = -1;
			this.screen_y = -1;
		}

		dot(p) {
			return this.x*p.x+this.y*p.y+this.z*p.z;
		}

		cross(p) {
			return new Point3D(this.y*p.z - this.z*p.y,
							   this.z*p.x - this.x*p.z,
							   this.x*p.y - this.y*p.x);
		}

		minus(p) {
			return new Point3D(this.x-p.x,
							   this.y-p.y,
							   this.z-p.z);
		}

		lerp(start, end, amt) {
			return (1 - amt) * start + amt * end;
        }

		update() {
			let offset_x = this.x-sphere_center.x;
			let offset_z = this.z-sphere_center.z;

			let amt = 0.1;
			if (Math.pow(offset_x,2)+Math.pow(offset_z,2) < Math.pow(sphere_radius,2)) {
				this.y = this.lerp(this.y, -Math.sqrt(sphere_radius - offset_x*offset_x - offset_z*offset_z), amt);
			} else {
				this.y = this.lerp(this.y, 0, amt);
			}
		}

		draw() {
			let offset = this.minus(camera.position);
			let d = offset.dot(camera.c);
			if (d <= 0) return;
			let scale = 1/d;
			let proj_x = scale * offset.dot(camera.g);
			let proj_y = scale * offset.dot(camera.up);

			this.screen_x = CENTER_X + proj_x * 500;
			this.screen_y = CENTER_Y + proj_y * 500;

			ctx.lineTo(this.screen_x, this.screen_y);
			//ctx.arc(screen_x, screen_y, 500 * 0.01 * scale, 0, 2*Math.PI);
		}
	}

	let rect_size = 5;
	let granularity = 0.05;
	let line_gap = 0.05;

	let sphere_center = new Point3D(0,0,0);
	let sphere_radius = 1;

	let camera = {
		position: new Point3D(0,-5,8),
		c: new Point3D(0,0,-1),
		up: new Point3D(0,Math.sqrt(2),Math.sqrt(2)),
	}
	camera.g = camera.c.cross(camera.up);

	let points = [];

    function init() {
		resize();

	    points = [];
		for (let i = -rect_size; i <= rect_size; i += line_gap) {
			points.push([])
			for (let j = -rect_size; j <= rect_size; j += granularity) {
				points[points.length-1].push(new Point3D(j,0,i));
			}
		}
    }

	let move_right = true;

    function loop() {
		/*if (this.move_right) {
			camera.position.x += 0.01;
			if (camera.position.x > 0.5) this.move_right = false;
		} else {
			camera.position.x -= 0.01;
			if (camera.position.x < -0.5) this.move_right = true;
		}*/

		sphere_center.x = sphere_center.lerp(sphere_center.x, raycast_x, 0.05);
		sphere_center.z = sphere_center.lerp(sphere_center.z, raycast_z, 0.05);

		ctx.clearRect(0,0,canvas.width,canvas.height);

		for (let line of points) {
			ctx.beginPath();
			for (let point of line) {
				point.update();
				point.draw();
			}
			ctx.stroke();
		}
    }

    function resize() {
		CENTER_X = canvas.width / 2;
		CENTER_Y = canvas.height / 2;
    }

	let raycast_x = 0;
	let raycast_z = 0;
	function update_mouse(e) {
		let closest_point;
		let closest_d2 = 1000;

		for (let line of points) {
			for (let point of line) {
				let d2 = Math.pow(point.screen_x-e.x,2)+Math.pow(point.screen_y-e.y,2)
				if (d2 < closest_d2) {
					closest_point = point;
					closest_d2 = d2;
				}
			}
		}

		if (closest_point) {
			raycast_x = closest_point.x;
			raycast_z = closest_point.z;
		}
	}

	function mousedown(e) {
		update_mouse(e);
	}

	function mousedrag(e) {
		update_mouse(e);
	}

    load({
        title: 'Rug',
        init: init,
        loop: loop,
		resize: resize,
		mousedown: mousedown,
		mousemove: mousedrag,
    })
})();
