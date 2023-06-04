import { DefaultRoute } from '../router/routes'
import moment from 'moment'

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: '2-digit', day: '2-digit', year: 'numeric' }
) => {
  if (!value) return value
  return new Intl.DateTimeFormat('fr-CA', formatting).format(new Date(value))
}
// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const hasPermission = (temp) => {
  const data = JSON.parse(window.localStorage.getItem('userData'))?.permissions
  return data ? data.includes(temp) : false
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () =>
  JSON.parse(localStorage.getItem('userData'))?.accessToken
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

export const emailRegex = /^\S+@\S+\.\S+$/
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/
export const phoneRegex = /^([+]\d{2})?\d{10}$/
export const characterRegex = /^[0-9a-zA-Z_ ?=.*$-_!#~`]{0,100}$/
export const imageRegex = /([a-z\-_0-9\/\:\.%]*\.(jpg|jpeg|png|gif|photo|svg))/i
export const videoRegex =
  /^(?:(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|twitch\.tv|facebook\.com|twitter\.com|instagram\.com|soundcloud\.com|mixcloud\.com))\/(?:[\w\/]+)?(?:watch\?v=|embed\/|v\/)?([A-Za-z0-9_-]{11}|[A-Za-z0-9_-]{12})(?:\S+)?|(?:https?:\/\/)?(?:onedrive\.live\.com\/(?:download|embed))?\/(?:redir|photo)\?resid=([\w-]+)&(?:authkey=([\w-]+))?(?:\S+)?$/
export const numRegex = /^([1-9]|[1-9][0-9]|100)$/

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return DefaultRoute
  return '/login'
}
export const customStyles = {
  title: {
    style: {
      fontWeight: 'bold'
    }
  }
}
// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const titleCase = (str) => {
  if (str) {
    str = str.toLowerCase()
    str = str.split(' ')
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1).toUpperCase()
      return str.join(' ')
    }
  }
  return ''
}

export const getStatus = (
  enrollstatus,
  learnig_track_status,
  trackEnrollCloseDate,
  tracStatus
) => {
  let mystatus = ''
  switch (learnig_track_status) {
    case 'UPCOMMING':
      mystatus = 'Application coming soon'

      break
    case 'LAUNCHED':
      switch (enrollstatus) {
        case 'SUBMITTED':
          mystatus = 'Application submitted'
          break
        case 'ACCEPT':
          mystatus = tracStatus === 'COMPLETE' ? 'Completed' : 'In Progress'

          break
        case 'REJECT':
          mystatus = 'Application not accepted'
          break

        case 'HOLD':
          mystatus = 'Application on-hold'
          break
        default:
          const myTrackEnrollCloseDate = moment(
            new Date(trackEnrollCloseDate)
          ).format('M/D/YYYY')
          const MyCurrentDate = moment(new Date()).format('M/D/YYYY')
          mystatus = moment(myTrackEnrollCloseDate).isSameOrAfter(MyCurrentDate)
            ? 'Enroll Now'
            : 'Enrollment closed'
          break
      }
      break
  }
  return mystatus
}
