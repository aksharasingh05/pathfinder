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
let drawMode = true; // true = adding walls, false = erasing walls

function nodeFromEvent(e) {
  const div = e.target.closest(".cell");
  if (!div) return null;
  return grid[+div.dataset.r][+div.dataset.c];
}

function setWall(n, value) {
  if (n === start || n === goal) return; // never wall the start or goal
  n.wall = value;
  n.div.classList.toggle("wall", value);
}

function moveEndpoint(n) {
  if (n.wall) return; // can't drop onto a wall
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
    if (n === start) dragging = "start";
    else if (n === goal) dragging = "goal";
    else {
      drawMode = !n.wall; // first cell decides: add or erase
      setWall(n, drawMode);
    }
  });

  el.addEventListener("mouseover", (e) => {
    if (!mouseDown) return;
    const n = nodeFromEvent(e);
    if (!n) return;
    if (dragging) moveEndpoint(n);
    else setWall(n, drawMode);
  });

  document.addEventListener("mouseup", () => {
    mouseDown = false;
    dragging = null;
  });
}
