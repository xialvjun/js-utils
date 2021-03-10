// 把一系列长英文字符串，转变成他们的缩写，例如 ['align-items', 'justify-content'] 变成 ['ai', 'jc']
// 适用于类似 atomic css 的需求
export const shorten = (longs: string[]) => {
  const reg = /\w+/g;
  const shorts: string[] = [];
  const dict: any = {};
  const lobjs = longs.map(l => {
    const match = l.match(reg);
    if (!match) {
      throw new Error(`MatchError: "${l}" can not match /${reg.source}/`);
    }
    return { l, match, lf: match.join('-') };
  });
  const lset = new Set(lobjs.map(l => l.lf));
  if (lset.size !== longs.length) {
    throw new Error(`ShortenSameError: can not shorten same words`);
  }
  for (const {l, match} of lobjs) {
    let len = match.map(_ => 0);
    len[0] = 1;
    let tt = '';
    while (true) {
      const t = match.map((l, idx) => l.slice(0, len[idx])).join('');
      if (tt === t) {
        throw new Error(`ShortenError: "${l}" shorten always same with others`);
      }
      if (shorts.lastIndexOf(t) < 0) {
        shorts.push(t);
        dict[l] = t;
        break;
      }
      const min = Math.min(...len);
      len[len.indexOf(min)]++;
    }
  }
  return dict;
}
