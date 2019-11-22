export default (value) => {
  const date = new Date(value)

  const year = date.getFullYear()
  const dayWeek = date.getDay()
  const month = date.getMonth()
  const day = date.getDate()

  const months = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październk',
    'Listopad',
    'Grudzień'
  ]

  const days = [
    'Pon',
    'Wt',
    'Śr',
    'Czw',
    'Pt',
    'Sob',
    'Niedz'
  ]

  return `${days[dayWeek]}, ${day} ${months[month]} ${year}`
}