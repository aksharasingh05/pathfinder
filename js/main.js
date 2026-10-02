let timers = []; // every pending setTimeout, so we can cancel them
let animating = false;

/* ---------- Helpers ---------- */

function setBusy(busy) {
  animating = busy;
  document
    .querySelectorAll("#controls button, #controls select")
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

/* ---------- Button wiring ---------- */

document.getElementById("run").addEventListener("click", () => {
  clearVisuals();
  const algo = document.getElementById("algo").value;
  const heur = document.getElementById("heuristic").value;
  const result = runAlgorithm(algo, heur);
  animate(result, getDelay());
});

document.getElementById("clearPath").addEventListener("click", clearVisuals);

document.getElementById("clearAll").addEventListener("click", () => {
  clearVisuals();
  createGrid();
});

/* ---------- Startup ---------- */

createGrid();
setupMouse();
