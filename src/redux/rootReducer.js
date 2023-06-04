// ** Reducers Imports
import layout from './layout'
import navbar from './navbar'
import roles from '../views/roles-permission/roles/store'
import permissions from '../views/roles-permission/permission/store'
import levelMaster from '../views/masters/level/store'
import testimonial from '../views/masters/testimonial/store'
import functions from '../views/masters/functions/store'
import business from '../views/businessUnitMaster/store'
import city from '../views/masters/city/store'
import attendance from '../views/attendance/store'
import learningTrack from '../views/masters/learning-tracks/store'
import auth from './authentication'
import sponsorMaster from '../views/masters/sponsor/store'
import masterModule from '../views/masters/modules/store'
import designationMaster from '../views/masters/designation/store'
import talentPhilosophy from '../views/masters/talent-philosophy/store'
import careerAspiration from '../views/users-screens/screens/talent-philosophy/my-career-aspiration/store'
import myJourney from '../views/users-screens/screens/my-journey/store'
import bannerMaster from '../views/masters/banner/store'
import trainerMaster from '../views/masters/trainer/store'
import userMaster from '../views/masters/user/store'
import subTrack from '../views/masters/learning-tracks/trackDetails/store'
import careerAspirationAdmin from '../views/careerAspiration/store'
import enroll from '../views/enroll/store'
import fileUpload from '../views/fileUpload/store'

const rootReducer = {
  auth,
  navbar,
  layout,
  permissions,
  roles,
  levelMaster,
  masterModule,
  functions,
  designationMaster,
  talentPhilosophy,
  careerAspiration,
  myJourney,
  business,
  city,
  attendance,
  learningTrack,
  testimonial,
  sponsorMaster,
  bannerMaster,
  userMaster,
  trainerMaster,
  subTrack,
  careerAspirationAdmin,
  enroll,
  fileUpload
}

export default rootReducer
