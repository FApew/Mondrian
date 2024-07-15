const box = document.getElementById("box")

const Icol = document.getElementById("oInCOL")
const Tcol = document.getElementById("oTxtCOL")
const Ipxl = document.getElementById("oInPXL")
const Tpxl = document.getElementById("oTxtPXL")
const Ispn = document.getElementById("oInSPN")
const Tspn = document.getElementById("oTxtSPN")
const Imin = document.getElementById("oInMIN")
const Tmin = document.getElementById("oTxtMIN")

const Isave = document.getElementById("oSave")

let InArr = [Icol, Ipxl, Ispn, Imin]

let COL = .5, PXL = 80, SPN = .6, MIN = .2, col = ["#d20218", "#34487a", "#ffd203", "#000"]

Isave.addEventListener("click",save)

InArr.forEach((I) => {
    I.addEventListener("input", () => {
        COL = parseFloat(1-Icol.value/10)
        PXL = parseFloat(Ipxl.value)
        SPN = parseFloat(1-Ispn.value/10)
        MIN = parseFloat(Imin.value/10)

        Tcol.innerHTML = Math.round((1-COL)*100) + "%"
        Tpxl.innerHTML = PXL + "px"
        Tspn.innerHTML = Math.round((1-SPN)*100) + "%"
        Tmin.innerHTML = MIN + "fr"

        firstDraw()
    })
})

window.addEventListener("resize", () => {
    if (bar) {
        toggleBar()
    }
    firstDraw()
})

let bar = false

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

    box.style.border = "3px solid #000"
    box.style.width = bar ? width.toString() + "px": "calc(100% - 40px)"
}

let nCol, nRow

box.addEventListener("click", () => {
    drawReq()
})

function firstDraw() {
    let body = document.querySelector("body")
    nCol = Math.ceil((body.clientWidth-40)/PXL)
    nRow = Math.ceil((body.clientHeight-40)/PXL)

    drawReq()
}

function drawReq() {
    let time = performance.now()

    draw()

    document.querySelector("title").innerHTML = `FA_Mondrian (${performance.now()-time}ms)`
}

function draw() {
    box.innerHTML = ""

    let s = ""
    for (let i = 0; i < nCol; i++) {
        s += (Math.random() + parseFloat(MIN)) + "fr "
    }
    box.style.gridTemplateColumns = s
    

    s = ""
    for (let i = 0; i < nRow; i++) {
        s += (Math.random() + parseFloat(MIN)) + "fr "
    }
    box.style.gridTemplateRows = s

    let c = nCol*nRow

    while (c > 0) {
        let temp = 1
        let elm = document.createElement("div")

        elm.classList.add("cell")
        box.appendChild(elm)

        if (Math.random() > SPN && c > 2) {
            let w = elm.clientWidth
            let c1 = Math.round(elm.getBoundingClientRect().left + document.documentElement.scrollLeft)

            elm.classList.add("col2")

            let c2 = Math.round(elm.getBoundingClientRect().left + document.documentElement.scrollLeft)
            if (elm.clientWidth > w && c1 == c2) {
                temp = 2
            } else {
                elm.classList.remove("col2")
            }
        }
        if (Math.random() > SPN && ((elm.classList.contains("col2") && c > 4) || (!elm.classList.contains("col2") && c > 2))) {
            let h = elm.clientHeight
            let c1 = Math.round(elm.getBoundingClientRect().left + document.documentElement.scrollLeft)

            elm.classList.add("row2")
            
            let c2 = Math.round(elm.getBoundingClientRect().left + document.documentElement.scrollLeft)
            if (elm.clientHeight > h && c1==c2) {
                if (elm.classList.contains("col2")) {
                    temp = 4
                } else {
                    temp = 2
                }
            } else {
                elm.classList.remove("row2")
            }    
        }
        c -= temp
    }

    Array.from(box.children).forEach((elm) => {
        if (Math.random() > COL) {
            elm.style.backgroundColor = col[Math.floor(Math.random() * col.length)]
        } else {
            elm.style.backgroundColor = "#fff"
        }
    })
}

function save() {
    console.log("ciao")
    html2canvas(box).then(canvas => {
        const url = canvas.toDataURL("image/png")
        const link = document.createElement("a")

        link.download = "FAmondrian.png"
        link.href = url

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    })
}

firstDraw()