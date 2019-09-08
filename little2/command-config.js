// return will trigger browser to speak
window.commands = {
  '睇動漫': () => { window.open("https://ebb.io/anime") },
  '七大罪': () => { window.open("https://ebb.io/anime/260x400") },
  '打開netflix': () => { window.open("https://www.netflix.com/browse") },
  'getBus': window.getBus = (busNumber, direction = 1, busStopNumber = 0) =>
    fetch('https://cors-anywhere.herokuapp.com/http://etav3.kmb.hk/?action=geteta&lang=tc&route=' + busNumber + '&bound=' + direction + '&stop_seq=' + busStopNumber)
    .then(v => v.json())
    .then(r => {
      const now = Date.now()
      const getMin = t => `${~~((new Date(t).getTime() - now)/60000)}`
      console.log(r)
      return r.response.map(({ex}) => getMin(ex))
  }),
  '74巴士': () => getBus('74A').then(t => t.join(', ')),
  '33巴士': () => getBus(33).then(t => t.join(', ')),
  '早晨': async () => {
    const bus74 = getBus('74A')
    const bus33 = getBus(33)
    return '33 仲有' + await bus33 + ', 74 仲有' + await bus74
  }
}