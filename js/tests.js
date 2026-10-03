function selfTest() {
  const out = [];
  const check = (name, ok) => out.push((ok ? "PASS  " : "FAIL  ") + name);
  const run = (a, h = "manhattan") => runAlgorithm(a, h);

  // 1. Open board: optimal algorithms agree
  const bfsR = run("bfs"),
    dijR = run("dijkstra"),
    asR = run("astar");
  const grR = run("greedy"),
    dfsR = run("dfs");
  check(
    "BFS, Dijkstra and A* give the same path length",
    asR.path.length > 0 &&
      bfsR.path.length === dijR.path.length &&
      dijR.path.length === asR.path.length,
  );
  check(
    "A* explores no more nodes than Dijkstra",
    asR.visited.length <= dijR.visited.length,
  );
  check("Greedy finds a path", grR.path.length > 0);
  check(
    "DFS path is not shorter than BFS path",
    dfsR.path.length >= bfsR.path.length,
  );

  // 2. Goal walled in: nobody finds a path
  const ring = neighbors(goal);
  ring.forEach((n) => (n.wall = true));
  ["bfs", "dfs", "dijkstra", "greedy", "astar"].forEach((a) =>
    check(
      "No path when goal is walled in (" + a + ")",
      run(a).path.length === 0,
    ),
  );
  ring.forEach((n) => (n.wall = false));

  // 3. Mud band: BFS must be worse than Dijkstra and A*
  const band = [];
  for (let r = 7; r <= 13; r++)
    for (let c = 18; c <= 20; c++) band.push(grid[r][c]);
  band.forEach((n) => (n.weight = 5));
  const bCost = pathCost(run("bfs").path);
  const dCost = pathCost(run("dijkstra").path);
  const aCost = pathCost(run("astar").path);
  check("Mud: BFS costs more than Dijkstra", bCost > dCost);
  check("Mud: A* cost equals Dijkstra cost", aCost === dCost);
  band.forEach((n) => (n.weight = 1));

  console.log(out.join("\n"));
  console.log(
    out.filter((l) => l.startsWith("FAIL")).length === 0
      ? "ALL TESTS PASSED"
      : "SOME TESTS FAILED",
  );
}
