/* ---------- Helpers ---------- */

function neighbors(n, diag = false) {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  if (diag) dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
  return dirs
    .map(([dr, dc]) => grid[n.r + dr]?.[n.c + dc])
    .filter((x) => x && !x.wall);
}

function buildPath(end) {
  const p = [];
  for (let n = end; n; n = n.parent) p.unshift(n);
  return p;
}

function resetNodes() {
  grid.flat().forEach((n) => {
    n.g = Infinity;
    n.h = 0;
    n.f = Infinity;
    n.parent = null;
  });
}

/* ---------- A*, Dijkstra, Greedy (one shared function) ---------- */
// Dijkstra: priority = g      A*: priority = g + h      Greedy: priority = h

function bestFirst(mode, hfn, diag = false) {
  resetNodes();
  const open = new MinHeap((x, y) => x.p - y.p);
  const closed = new Set();
  const visited = [];

  start.g = 0;
  open.push({ n: start, p: 0 });

  while (open.size) {
    const { n: cur } = open.pop();
    if (closed.has(cur)) continue; // skip stale heap entries
    closed.add(cur);
    visited.push(cur);

    if (cur === goal) return { visited, path: buildPath(goal) };

    for (const nb of neighbors(cur, diag)) {
      if (closed.has(nb)) continue;
      const ng = cur.g + nb.weight;
      if (ng < nb.g) {
        nb.g = ng;
        nb.parent = cur;
        nb.h = mode === "dijkstra" ? 0 : hfn(nb, goal);
        nb.f = mode === "greedy" ? nb.h : nb.g + nb.h;
        open.push({ n: nb, p: nb.f });
      }
    }
  }
  return { visited, path: [] }; // no path exists
}

/* ---------- BFS (queue) ---------- */

function bfs(diag = false) {
  resetNodes();
  const queue = [start];
  const seen = new Set([start]); // marked when first discovered
  const visited = [];
  let head = 0; // index instead of shift(), O(1)

  start.g = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    visited.push(cur);

    if (cur === goal) return { visited, path: buildPath(goal) };

    for (const nb of neighbors(cur, diag)) {
      if (seen.has(nb)) continue;
      seen.add(nb);
      nb.parent = cur;
      nb.g = cur.g + 1;
      queue.push(nb);
    }
  }
  return { visited, path: [] };
}

/* ---------- DFS (stack) ---------- */

function dfs(diag = false) {
  resetNodes();
  const stack = [start];
  const closed = new Set();
  const visited = [];

  while (stack.length) {
    const cur = stack.pop();
    if (closed.has(cur)) continue;
    closed.add(cur);
    visited.push(cur);

    if (cur === goal) return { visited, path: buildPath(goal) };

    for (const nb of neighbors(cur, diag)) {
      if (!closed.has(nb)) {
        nb.parent = cur;
        stack.push(nb);
      }
    }
  }
  return { visited, path: [] };
}

/* ---------- Dispatcher used by the UI ---------- */

function runAlgorithm(name, heuristicName, diag = false) {
  const hfn = H[heuristicName];
  switch (name) {
    case "astar":
      return bestFirst("astar", hfn, diag);
    case "dijkstra":
      return bestFirst("dijkstra", hfn, diag);
    case "greedy":
      return bestFirst("greedy", hfn, diag);
    case "bfs":
      return bfs(diag);
    case "dfs":
      return dfs(diag);
  }
}
