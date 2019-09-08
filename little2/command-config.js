// return will trigger browser to speak
window.commands = {
  '睇動漫': () => { window.open("https://ebb.io/anime") },
  '七大罪': () => { window.open("https://ebb.io/anime/260x400") },
  '打開netflix': () => { window.open("https://www.netflix.com/browse") },
  '74巴士': () => {
    return fetch('https://cors-anywhere.herokuapp.com/http://etav3.kmb.hk/?action=geteta&lang=tc&route=74A&bound=1&stop_seq=0')
    .then(v => v.json())
    .then(r => {
      const now = Date.now()
      const getMin = t => `${~~((new Date(t).getTime() - now)/60000)}`
      return r.response.map(({ex}) => `仲有${getMin(ex)}分鐘`).join(', ')
    })
  }
}