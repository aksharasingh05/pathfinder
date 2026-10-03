const ROWS = 20,
  COLS = 40;
let grid = [];
let start, goal;

function createGrid() {
  const el = document.getElementById("grid");
  el.innerHTML = "";
  grid = [];

  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const div = document.createElement("div");
      div.className = "cell";
      div.dataset.r = r;
      div.dataset.c = c;
      el.appendChild(div);

      row.push({
        r,
        c,
        div,
        wall: false,
        weight: 1,
        g: Infinity,
        h: 0,
        f: Infinity,
        parent: null,
      });
    }
    grid.push(row);
  }

  start = grid[10][5];
  goal = grid[10][34];
  start.div.classList.add("start");
  goal.div.classList.add("goal");
}

let mouseDown = false;
let dragging = null; // 'start', 'goal', or null
let drawMode = true; // true = adding, false = erasing
let paintMud = false; // decided when the mouse goes down

function nodeFromEvent(e) {
  const div = e.target.closest(".cell");
  if (!div) return null;
  return grid[+div.dataset.r][+div.dataset.c];
}

function setWall(n, value) {
  if (n === start || n === goal) return;
  n.wall = value;
  if (value) {
    // a wall replaces any mud
    n.weight = 1;
    n.div.classList.remove("mud");
  }
  n.div.classList.toggle("wall", value);
}

function setMud(n, value) {
  if (n === start || n === goal || n.wall) return;
  n.weight = value ? 5 : 1;
  n.div.classList.toggle("mud", value);
}

function moveEndpoint(n) {
  if (n.wall) return;
  if (dragging === "start" && n !== goal) {
    start.div.classList.remove("start");
    start = n;
    n.div.classList.add("start");
  } else if (dragging === "goal" && n !== start) {
    goal.div.classList.remove("goal");
    goal = n;
    n.div.classList.add("goal");
  }
}

function setupMouse() {
  const el = document.getElementById("grid");

  el.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (animating) return;
    const n = nodeFromEvent(e);
    if (!n) return;
    mouseDown = true;
    paintMud = document.getElementById("mudMode").checked;

    if (n === start) dragging = "start";
    else if (n === goal) dragging = "goal";
    else if (paintMud) {
      drawMode = n.weight === 1; // first cell decides: add or remove mud
      setMud(n, drawMode);
    } else {
      drawMode = !n.wall;
      setWall(n, drawMode);
    }
  });

  el.addEventListener("mouseover", (e) => {
    const n = nodeFromEvent(e);
    if (!n) return;

    // Tooltip: show the values from the last run
    const fmt = (v) => (v === Infinity ? "-" : +v.toFixed(1));
    n.div.title =
      `(${n.r}, ${n.c})  weight ${n.weight}\n` +
      `g=${fmt(n.g)}  h=${fmt(n.h)}  f=${fmt(n.f)}`;

    if (!mouseDown || animating) return;
    if (dragging) moveEndpoint(n);
    else if (paintMud) setMud(n, drawMode);
    else setWall(n, drawMode);
  });

  document.addEventListener("mouseup", () => {
    mouseDown = false;
    dragging = null;
  });
}
