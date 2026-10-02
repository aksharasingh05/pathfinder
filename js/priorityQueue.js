class MinHeap {
  constructor(cmp) {
    this.a = [];
    this.cmp = cmp; // cmp(x, y) < 0 means x comes out first
  }

  get size() {
    return this.a.length;
  }

  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      // bubble up
      const p = (i - 1) >> 1; // parent index
      if (this.cmp(a[i], a[p]) < 0) {
        [a[i], a[p]] = [a[p], a[i]];
        i = p;
      } else break;
    }
  }

  pop() {
    const a = this.a;
    if (a.length === 0) return undefined;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        // sift down
        const l = 2 * i + 1,
          r = l + 1;
        let m = i;
        if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l;
        if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
    return top;
  }
}
