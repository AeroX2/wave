let canvas;
let ctx;

$(() => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
	canvas.addEventListener('mousedown', (e) => {
        let rect = canvas.getBoundingClientRect();
        let m = {
            x: e.x - rect.left,
            y: e.y - rect.top
        }
        if (content.mousedown) content.mousedown(m);
    });
	canvas.addEventListener('mouseup', (e) => {
        let rect = canvas.getBoundingClientRect();
        let m = {
            x: e.x - rect.left,
            y: e.y - rect.top
        }
        if (content.mouseup) content.mouseup(m);
    });
	canvas.addEventListener('mousemove', (e) => {
        let rect = canvas.getBoundingClientRect();
        let m = {
            x: e.x - rect.left,
            y: e.y - rect.top
        }
        if (content.mousemove) content.mousemove(m);
    });

    let title = Cookies.get('content')
    if (!title || !run_list[title]) title = Object.keys(run_list)[0];

    run(title);
});

function loop() {
    content.loop();
    window.requestAnimationFrame(loop);
}

function resize() {
	if (canvas.width < window.innerWidth) canvas.width = window.innerWidth;
    if (canvas.height < window.innerHeight) canvas.height = window.innerHeight;
    if (content.resize) content.resize();
}

let request;
let content = {};
let run_list = [];

function load(o) {
    if (!o.title) {
        console.log('Title property missing')
        return;
    }
    if (!o.init) {
        console.log('Init method missing')
        return;
    }
    if (!o.loop) {
        console.log('Loop method missing')
        return;
    }
    run_list[o.title] = o;
    
    let navItem = $.parseHTML(`
    <li class='nav-item' data-title='${o.title}'>
        <a class='nav-link' href='#'>${o.title}</a>
    </li>`);

    $('#navbarNav ul').append(navItem);

    $(navItem).click((e) => {
        $('.nav-item.active').removeClass('active');
        $(e.currentTarget).addClass('active');

        let title = $(e.currentTarget).data('title');
        run(title);
    });
}

function run(title) {
    let canvas = $("#canvas")[0];
    let cxt = canvas.getContext("2d");
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    resize();

    window.cancelAnimationFrame(request);

    content = run_list[title];
    content.init();

    request = window.requestAnimationFrame(loop);

    Cookies.set('content', title);
}