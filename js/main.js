let timers = []; // every pending setTimeout, so we can cancel them
let animating = false;

/* ---------- Helpers ---------- */

function setBusy(busy) {
  animating = busy;
  document
    .querySelectorAll(
      "#controls button, #controls select, #controls input[type=checkbox]",
    )
    .forEach((el) => (el.disabled = busy));
}

function getDelay() {
  const v = +document.getElementById("speed").value; // 1..100
  return (101 - v) / 4; // 25 ms (slow) to 0.25 ms (fast)
}

function clearVisuals() {
  timers.forEach(clearTimeout);
  timers = [];
  grid.flat().forEach((n) => n.div.classList.remove("visited", "path"));
  resetNodes();
}

/* ---------- Animation ---------- */

function animate(result, delay) {
  setBusy(true);

  result.visited.forEach((n, i) => {
    timers.push(
      setTimeout(() => {
        if (n !== start && n !== goal) n.div.classList.add("visited");
      }, i * delay),
    );
  });

  const pathStart = result.visited.length * delay;

  result.path.forEach((n, i) => {
    timers.push(
      setTimeout(
        () => {
          if (n !== start && n !== goal) n.div.classList.add("path");
        },
        pathStart + i * 30,
      ),
    );
  });

  const end = pathStart + result.path.length * 30 + 50;
  timers.push(
    setTimeout(() => {
      setBusy(false);
      if (result.path.length === 0) alert("No path found!");
    }, end),
  );
}

/* ---------- Stats dashboard ---------- */

const NAMES = {
  astar: "A*",
  dijkstra: "Dijkstra",
  greedy: "Greedy Best-First",
  bfs: "BFS",
  dfs: "DFS",
};

function pathCost(path) {
  // total cost of the path, counting mud weights (start cell excluded)
  return path.slice(1).reduce((sum, n) => sum + n.weight, 0);
}

function addStatsRow(label, result, ms) {
  const tbody = document.querySelector("#stats tbody");
  const tr = document.createElement("tr");
  const found = result.path.length > 0;
  const cells = [
    label,
    result.visited.length,
    found ? result.path.length : "No path",
    found ? pathCost(result.path) : "-",
    ms.toFixed(2),
  ];
  cells.forEach((text) => {
    const td = document.createElement("td");
    td.textContent = text;
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
}

function timedRun(algo, heur) {
  const diag = document.getElementById("diag").checked;
  const t0 = performance.now();
  const result = runAlgorithm(algo, heur, diag);
  const ms = performance.now() - t0;
  return { result, ms };
}

function renderComparison(rows) {
  const tbody = document.querySelector("#compareTable tbody");
  tbody.innerHTML = ""; // each comparison replaces the last

  const found = rows.filter((r) => r.result.path.length > 0);
  const best = {
    nodes: Math.min(...found.map((r) => r.result.visited.length)),
    cost: Math.min(...found.map((r) => pathCost(r.result.path))),
    ms: Math.min(...found.map((r) => r.ms)),
  };

  rows.forEach(({ label, result, ms }) => {
    const ok = result.path.length > 0;
    const cost = ok ? pathCost(result.path) : null;
    const cells = [
      { t: label },
      {
        t: result.visited.length,
        best: ok && result.visited.length === best.nodes,
      },
      { t: ok ? result.path.length : "No path" },
      { t: ok ? cost : "-", best: ok && cost === best.cost },
      { t: ms.toFixed(2), best: ok && ms === best.ms },
      { t: ok ? (cost === best.cost ? "Yes" : "No") : "-" },
    ];
    const tr = document.createElement("tr");
    cells.forEach((c) => {
      const td = document.createElement("td");
      td.textContent = c.t;
      if (c.best) td.classList.add("best");
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
/* ---------- Button wiring ---------- */

document.getElementById("run").addEventListener("click", () => {
  clearVisuals();
  const algo = document.getElementById("algo").value;
  const heur = document.getElementById("heuristic").value;
  const { result, ms } = timedRun(algo, heur);

  let label = NAMES[algo];
  if (algo === "astar" || algo === "greedy") {
    label += " (" + heur + ")";
  }
  addStatsRow(label, result, ms);

  animate(result, getDelay());
});

document.getElementById("compare").addEventListener("click", () => {
  clearVisuals();
  const heur = document.getElementById("heuristic").value;
  const rows = ["bfs", "dfs", "dijkstra", "greedy", "astar"].map((algo) => {
    const { result, ms } = timedRun(algo, heur);
    let label = NAMES[algo];
    if (algo === "astar" || algo === "greedy") label += " (" + heur + ")";
    return { label, result, ms };
  });
  renderComparison(rows);
});

document.getElementById("clearStats").addEventListener("click", () => {
  document.querySelector("#stats tbody").innerHTML = "";
  document.querySelector("#compareTable tbody").innerHTML = "";
});

document.getElementById("clearPath").addEventListener("click", clearVisuals);

document.getElementById("clearAll").addEventListener("click", () => {
  clearVisuals();
  createGrid();
});

document.getElementById("maze").addEventListener("click", () => {
  if (animating) return;
  clearVisuals();
  generateRandomMaze();
});

/* ---------- Startup ---------- */

createGrid();
setupMouse();
