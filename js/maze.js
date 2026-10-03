function generateRandomMaze(density = 0.28) {
  grid.flat().forEach((n) => {
    n.wall = false;
    n.weight = 1;
    n.div.classList.remove("wall", "mud");
    if (n === start || n === goal) return;
    if (Math.random() < density) {
      n.wall = true;
      n.div.classList.add("wall");
    }
  });
}
