const box = document.getElementById("box")

window.addEventListener("resize", firstDraw)

const COL = .5, PXL = 80, MIN = .2, SPN = 0.6, LIM = .8, col = ["#d20218", "#34487a", "#ffd203", "#000"]

let bar = false
toggleBar()

document.getElementById("oBarButton").addEventListener("click", toggleBar)
window.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
        toggleBar()
    }
})

function toggleBar() {
    bar = !bar 
    let width = Math.floor(box.clientWidth / box.clientHeight * (box.clientHeight-180))
    document.querySelector("body").style.gridTemplateRows = bar ? "1fr 200px" : "1fr 20px"
    console.log(width.toString())
    box.style.width = bar ? width.toString() + "px": "calc(100% - 40px)"
}

let nCol, nRow, lim


function draw() {
    box.innerHTML = ""

    let s = ""
    for (let i = 0; i < nCol; i++) {
        s += (Math.random() + MIN) + "fr "
    }
    box.style.gridTemplateColumns = s.trim()

    s = ""
    for (let i = 0; i < nRow; i++) {
        s += (Math.random() + MIN) + "fr "
    }
    box.style.gridTemplateRows = s.trim()

    const cells = document.createDocumentFragment()

    let c = nCol*nRow+nCol
    for (let i = 0; i < c; i++) {
        
        let elm = document.createElement("div")
        elm.classList.add("cell")
        if (i < lim * c) {
            if (Math.random() > SPN) {
                elm.classList.add("col2")
                i++
            }
            if (Math.random() > SPN) {
                elm.classList.add("row2")
                if (elm.classList.contains("col2")) {
                    i += 2
                } else {
                    i++
                }
            }
        }
        cells.appendChild(elm)
    }
    box.appendChild(cells)

    let arr = box.style.gridTemplateColumns.trim().split(" ").map(val => parseFloat(val))
    let sum = arr.reduce((acc, value) => acc + value, 0.0)
    let fr = 0.2 / sum

    Array.from(box.children).forEach((elm) => {
        if (elm.clientWidth + 6 < Math.floor(box.clientWidth*fr)) {
            elm.remove()
        } else if (Math.random() > COL) {
            elm.style.backgroundColor = col[Math.floor(Math.random() * col.length)]
        } else {
            elm.style.backgroundColor = "#fff"
        }
    })
}

box.addEventListener("click", () => {
    drawReq()
})

function firstDraw() {
    nCol = Math.ceil(box.clientWidth/PXL)
    nRow = Math.ceil(box.clientHeight/PXL)

    lim = LIM/450*box.clientWidth
    drawReq()
}

function drawReq() {
    let time = performance.now()
    draw()
    document.querySelector("title").innerHTML = `FA_Mondrian (${performance.now()-time}ms)`
}

firstDraw()