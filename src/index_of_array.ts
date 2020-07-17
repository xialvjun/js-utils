export function index_of_array(parent: any[], child: any[]) {
  I: for (let i = 0; i < parent.length; i++) {
    J: for (let j = 0; j < child.length; j++) {
      if (parent[i + j] !== child[j]) {
        continue I;
      }
    }
    return i;
  }
  return -1;
}
