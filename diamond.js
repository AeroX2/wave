(() => {
    let size = 50;

    class Diamond {
        constructor(x,y) {
            this.x = x;
            this.y = y;

            this.y_direction = false;
            this.squeeze_x = true;
            this.squeeze_y = false;

            this.top = { x: this.x, y: this.y - size };
            this.bottom = { x: this.x, y: this.y + size };
            this.left = { x: this.x - size, y: this.y };
            this.right = { x: this.x + size, y: this.y };
        }

		lerp(start, end, amt) {
			return (1 - amt) * start + amt * end;
        }

        update() {
            if (!this.y_direction) {
                if (Math.abs(this.left.x-this.right.x) < 5) {
                    this.squeeze_x = false;
                } else if (Math.abs(this.left.x - (this.x - size)) < 5) {
                    this.squeeze_x = true;
                    this.y_direction = true;
                }

                if (this.squeeze_x) {
                    this.left.x = this.lerp(this.left.x, this.right.x, 0.01);
                    this.right.x = this.lerp(this.right.x, this.left.x, 0.01);
                } else {
                    this.left.x = this.lerp(this.left.x, this.x - size, 0.01);
                    this.right.x = this.lerp(this.right.x, this.x + size, 0.01);
                }
            } else {
                if (Math.abs(this.top.y-this.bottom.y) < 5) {
                    this.squeeze_y = false;
                } else if (Math.abs(this.top.y - (this.y - size)) < 5) {
                    this.squeeze_y = true;
                    this.y_direction = false;
                }

                if (this.squeeze_y) {
                    this.top.y = this.lerp(this.top.y, this.bottom.y, 0.01);
                    this.bottom.y = this.lerp(this.bottom.y, this.top.y, 0.01);
                } else {
                    this.top.y = this.lerp(this.top.y, this.y-size, 0.01);
                    this.bottom.y = this.lerp(this.bottom.y, this.y+size, 0.01);
                }
            }
        }

        draw() {
			ctx.strokeStyle = "#000000";
			ctx.beginPath();
			ctx.moveTo(this.top.x, this.top.y);
			ctx.lineTo(this.right.x, this.right.y);
			ctx.lineTo(this.bottom.x, this.bottom.y);
			ctx.lineTo(this.left.x, this.left.y);
			ctx.lineTo(this.top.x, this.top.y);
			ctx.stroke();
        }
    }

    let diamonds = []

    function init() {
        resize();
    }

    function loop() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        for (let diamond of diamonds) {
            diamond.update();
            diamond.draw();
        }
    }

    function resize() {
        diamonds = [];
        let gap_x = canvas.width % size / 2;
        let gap_y = canvas.height % size / 2;
        for (let i = 0; i < Math.floor(canvas.height / size); i++) {
            for (let j = 0; j < Math.floor(canvas.width / size); j++) {
                diamonds.push(new Diamond(gap_x + j * size, gap_y + i * size));
            }
        }
    }

    load({
        title: 'Diamond',
        init: init,
        loop: loop,
		resize: resize,
    })
})();