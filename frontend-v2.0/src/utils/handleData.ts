import MiniSearch from 'minisearch'
import { stopWords } from 'src/api/constants'
import PouchDB from 'pouchdb'
import { updateFreelancerTracking } from 'src/api/freelancer-apis'
import { freelancerTrackingCategoriesStore, freelancerTrackingJobsStore, freelancerTrackingLocationsStore, freelancerTrackingSkillsStore } from 'src/Store/tracking.store'


export const handleFilter = (sortType: any, key?: any) => {
  let temp = sortType

  switch (temp) {
    case 'new':
      return 'tab=new'
    case 'hot':
      return 'tab=hot'
    case 'best':
      return 'tab=best'
    case 'oldest':
      return 'tab=oldest'
    case 'worst':
      return 'tab=worst'
    case 'keyword':
      return `keyword=${key.replace(' ', '-')}`
    default:
      break
  }
}

const miniSearch = new MiniSearch({
  fields: ['title', 'description'],
  idField: '_id',
  storeFields: ['client', 'categories', 'title', 'description', 'locations', 
  'complexity', 'payment', 'budget', 'createdAt', 'nOProposals', 
  'nOEmployee', 'preferences'],
  processTerm: (term) =>
  stopWords.has(term) ? null : term.toLowerCase(),
  searchOptions: {
    boost: { title: 2 },
    fuzzy: 0.3,
    processTerm: (term) => term.toLowerCase()
  },
})

const db = new PouchDB('data');

const handleCacheData = (data: any) => {
  db.bulkDocs(data).then(function (response) {
    console.log('cache okay vcl')
  }).catch(function (err) {
    console.log('cache failed', err);
  });
}

const handleGetCacheData = async () => {
  return await db.allDocs({ include_docs: true })
}

export const syncTrackingDataToBackend = (isSync = false, ) => {
  console.log('Sync Tracking Data')
  const formatData = {
    jobs: Object.values(freelancerTrackingJobsStore.state || {})?.map(job => ({
      id: job?.id,
      text: job?.text,
      event: job?.event,
      lastTimeView: job?.lastTimeView,
    })),
    skills: Object.values(freelancerTrackingSkillsStore.state || {})?.map(skill => ({
      id: skill?.id,
      text: skill?.text,
      event: skill?.event,
      lastTimeView: skill?.lastTimeView,
    })),
    categories: Object.values(freelancerTrackingCategoriesStore.state || {})?.map(category => ({
      id: category?.id,
      text: category?.text,
      event: category?.event,
      lastTimeView: category?.lastTimeView,
    })),
    locations: Object.values(freelancerTrackingLocationsStore.state || {})?.map(location => ({
      id: location?.id,
      text: location?.text,
      event: location?.event,
      lastTimeView: location?.lastTimeView,
    })),
  }

  if (isSync) {
    updateFreelancerTracking(formatData)
  }
}

const generatePsw = () => {
  function generateRandomPassword() {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@!%&()/";
    const length = 10; // Change this to your desired length
    let randomPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomPassword += chars.substring(randomIndex, randomIndex + 1);
    }
    return randomPassword;
  }

  const password = generateRandomPassword();
  return password

}

export { miniSearch, handleCacheData, db, handleGetCacheData, generatePsw }