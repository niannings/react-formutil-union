export function get(o: any, path: string) {
  return path
    .split(/[.[\]]/g)
    .filter(Boolean)
    .reduce((cur, k) => (cur === null || cur === undefined ? cur : cur[k]), o)
}

function isEffectiveValue(o: any) {
  return o !== null && o !== undefined
}

export function set(o: any, path: string, value: any) {
  if (!isEffectiveValue(o) || !path) {
    return
  }

  const tokens = path.split(/[.[\]]/g).filter(Boolean)
  const len = tokens.length
  let i = 1

  while (i < len) {
    const cur = tokens[i - 1]
    const next = tokens[i]

    if (!o[cur]) {
      if (Number.isNaN(+next)) {
        o[cur] = {}
      } else {
        o[cur] = []
      }
    }

    o = o[cur]
    i++
  }

  o[tokens[i - 1]] = value
}

let start = 0

export function uniqueId(prefix?: string) {
  return (prefix || '') + start++
}

export function uniq(arr: any[]) {
  return [...new Set(arr)]
}
