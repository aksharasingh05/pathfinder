const H = {
  manhattan: (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c),
  euclidean: (a, b) => Math.hypot(a.r - b.r, a.c - b.c),
  chebyshev: (a, b) => Math.max(Math.abs(a.r - b.r), Math.abs(a.c - b.c)),
};
