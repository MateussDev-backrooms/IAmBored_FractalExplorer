//vars
let canvas
let ctx

let setRender = []
let resolution = 2;
let iterations = 128
let minx = -1.5, miny = -1.5
let maxx = 1.5, maxy = 1.5

let omousex = 0, omousey = 0
let sel = false;
let mouseX, mouseY
let selendX = 0, selendY = 0

function init() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    generateMandelbrot(iterations, resolution)
    setInterval(update, 25)
    render()

    //input
    window.addEventListener('mousedown', (e) => {
        sel = true
        omousex = mouseX
        omousey = mouseY
    })
    window.addEventListener('mouseup', (e) => {
        if(mouseX <= canvas.width && mouseY <= canvas.height) {
            sel = false
            let n_min = screenToMandelbrotPos(omousex, omousey)
            let n_max = screenToMandelbrotPos(selendX, selendY)
            minx = n_min.x
            miny = n_min.y
    
            maxx = n_max.x
            maxy = n_max.y
            generateMandelbrot(iterations, resolution)
        } else {
            sel = false;
        }
    })
    window.addEventListener('mousemove', (e) => {
        mouseX = e.pageX
        mouseY = e.pageY
        let fac = mouseX/canvas.width
        selendX = mouseX
        selendY = mouseY
    })
}
function update() {
    
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(let x=0; x<canvas.width; x+=resolution) {
        for(let y=0; y<canvas.height; y+=resolution) {
            ctx.fillStyle = setRender[x][y]
            ctx.fillRect(x, y, resolution, resolution)
        }
    }
    if(sel) {

        for(let x=Math.round(omousex); x<Math.round(selendX); x++) {
            for(let y=Math.round(omousey); y<Math.round(selendY); y++) {
                if(x==Math.round(omousex) || y==Math.round(omousey) || x==Math.round(selendX)-1 || y==Math.round(selendY)-1) {
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(x, y, resolution, resolution)
                }
            }
        }
    }
    ctx.fillStyle = 'white'
    ctx.font = "16px serif";
    ctx.textBaseline = 'top'
    ctx.fillText("it:"+iterations, 0, 0)
    requestAnimationFrame(render)
}

function generateMandelbrot(iteration, pixelSize) {
    setRender = []
    for(let x=0; x<canvas.width; x+=pixelSize) {
        setRender[x] = []
        for(let y=0; y<canvas.height; y+=pixelSize) {
            //generate function for mandelbrot set
            let f_x = 0, f_y = 0;
            let tmp = 0
            
            for(let i=0; i<iteration; i++) {

                // tmp = f_x*f_x - f_y*f_y + (maxx - minx)*(x / canvas.width) - maxx
                // f_y = 2*f_x*f_y + (maxy-miny)*(y / canvas.height) - maxy
                tmp = f_x*f_x - f_y*f_y + (maxx - minx)*(x / canvas.width) + minx
                f_y = 2*f_x*f_y + (maxy-miny)*(y / canvas.height) + miny

                f_x = tmp

                let dist = Math.sqrt(f_x*f_x + f_y*f_y)
                if(dist > 2) {
                    setRender[x][y] = `hsl(${i/iteration * 360}, 100%, 50%)`
                    break;
                } else {
                    setRender[x][y] = "#000000"
                }
            }
        }
    }
}

function screenToMandelbrotPos(x, y) {
    return {
        x: (maxx - minx) * (x/canvas.width) + minx,
        y: (maxy - miny) * (y/canvas.height) + miny
    }
}

function MandelbrotPostoScreen(x, y) {
    return {
        x: (x + maxx / (maxx - minx))*canvas.width,
        y: (y + maxy / (maxy - miny))*canvas.height
    }
}

function n_distance(x1, y1, x2, y2) {
    //returns distance between 2 positions. Doesn't use vectors
    let _a = x1 - x2, _b = y1 - y2;
    return Math.sqrt(Math.pow(_a, 2) + Math.pow(_b, 2));
}

function changeIterations() {
    let newit = document.getElementById('iterationcnt').value
    iterations = newit;
    generateMandelbrot(iterations, resolution)
}
function changeResolution() {
    let newres = document.getElementById('resolution').value
    resolution = Number(newres);
    generateMandelbrot(iterations, resolution)
}