// defaults
let canvas = document.getElementById('canvas')
canvas.width = window.innerWidth - 60
canvas.height = window.innerHeight - 400
let numSides = 5
let global_radius = 50
let drawDelay = 2

// canvas setup
let ctx = canvas.getContext('2d', { willReadFrequently: true })
let canvasColor = '#000000'
ctx.fillStyle = canvasColor
ctx.fillRect(0, 0, canvas.width, canvas.height)
let rotateBy = 0 // range: [0, 360), convert to radians
let drawColor = 'red'
let isDrawing = false
let restoreArray = []
let index = -1

// title
const canvasType = document.getElementById('canvasType')
canvasType.innerHTML = `Polygon`

// change color
function change_color(element) {
  drawColor = element.style.background
}

// mouse events
canvas.addEventListener('mousedown', tapDraw, false)
canvas.addEventListener('mousemove', drawCond, false)
canvas.addEventListener('mouseup', stop, false)
canvas.addEventListener('mouseout', stop, false)

// touch events
canvas.addEventListener('touchstart', start, false)
canvas.addEventListener('touchend', stop, false)

// tap to draw single instance
function tapDraw() {
  ctx.strokeStyle = drawColor
  start()
  drawPolygon(numSides, global_radius, -Math.PI / 2)
}

// delay to add spacing between polygons
let count = -1
function drawCond() {
  // draw()
  if (isDrawing) {
    console.log(drawDelay)
    if (count == 0) draw()
    else if (count == drawDelay) count = -1
    count++
  }
}

// initialize image in array
function start() {
  isDrawing = true
  ctx.beginPath()
}

function draw() {
  if (isDrawing) {
    ctx.strokeStyle = drawColor
    drawPolygon(numSides, global_radius, -Math.PI / 2)
    // drawRect(x(), y());
    // drawEllipse(x(), y())
    console.log(x(), y())
    // console.log(canvas.height, canvas.width)
    // ctx.fillStyle = `rgb(100,${y()},${x()})`;
    // ctx.fill();
  }
}

// function drawEllipse(hr, vr) {
//   ctx.ellipse(x(), y(), hr, vr, Math.PI, 0, 2 * Math.PI)
//   ctx.stroke()
// }

function drawPolygon(sides, radius, rotateBy) {
  console.log(sides)
  let full = 2 * Math.PI
  dtheta = full / sides
  ctx.moveTo(
    x() + radius * Math.cos(rotateBy),
    y() + radius * Math.sin(rotateBy)
  )
  for (let t = rotateBy + dtheta; t <= full + rotateBy; t += dtheta)
    ctx.lineTo(x() + radius * Math.cos(t), y() + radius * Math.sin(t))
  ctx.stroke()
  ctx.closePath()
  console.log('drawPolygon...')
}

// function drawRect(w, h) {
//   ctx.rect(x() - w / 2, y() - h / 2, w, h)
//   ctx.stroke()
// }

//closes path and disable drawing
function stop() {
  if (isDrawing) {
    ctx.closePath()
    isDrawing = false
  }

  if (event.type != 'mouseout') {
    restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    index += 1
  }
  console.log(restoreArray)
}

function clearCanvas() {
  ctx.fillStyle = canvasColor
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  restoreArray = []
  index = -1
}

function undo() {
  if (index <= 0) {
    clearCanvas()
    console.log('undo')
  } else {
    index -= 1
    restoreArray.pop()
    ctx.putImageData(restoreArray[index], 0, 0)
  }
}

// x and y coordinate
function x() {
  return event.clientX - canvas.offsetLeft
  // due to canvas margin on left
}
function y() {
  return event.clientY - canvas.offsetTop
}

// resize on window change
window.addEventListener('resize', () => {
  const canvasContainer = document.getElementById('canvasContainer')

  const newCanvas = document.createElement('canvas')
  const newContext = newCanvas.getContext('2d', { willReadFrequently: true })
  newCanvas.width = window.innerWidth - 60
  newCanvas.height = 500
  newContext.fillStyle = canvasColor
  newContext.fillRect(0, 0, newCanvas.width, newCanvas.height)

  newContext.drawImage(canvas, 0, 0)
  canvasContainer.replaceChild(newCanvas, canvas)

  canvas = newCanvas
  ctx = newContext

  canvas.addEventListener('mousedown', tapDraw, false)
  canvas.addEventListener('mousemove', drawCond, false)
  canvas.addEventListener('mouseup', stop, false)
  canvas.addEventListener('mouseout', stop, false)
})

// copy canvas to clipboard
function copToClip() {
  canvas.toBlob((blob) => {
    const item = new ClipboardItem({ 'image/png': blob })

    navigator.clipboard
      .write([item])
      .then(() => {
        console.log('Canvas image copied to clipboard!')
      })
      .catch((error) => {
        console.error('Unable to copy canvas image to clipboard:', error)
      })
  }, 'image/png')
}

// change canvas color
const canvasColorPicker = document.getElementById('canvasColorPicker')
canvasColorPicker.addEventListener('change', () => {
  canvasColor = canvasColorPicker.value
  ctx.fillStyle = canvasColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
})
