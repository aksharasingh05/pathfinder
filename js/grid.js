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
