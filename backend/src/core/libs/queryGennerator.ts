/* eslint-disable class-methods-use-this */
class QueryGen {
  public numRanges(from?: number, to?: number) {
    const range: any = {}
    if (from >= 0) {
      range.$gte = from || 0
    }
    if (to >= 0) {
      range.$lte = to || 100000000000
    }
    return range
  }

  public generateLookupStage(populateString) {
    const stages = populateString.split(',').map(item => {
      const [from, localField] = item.split(':')
      const lookupStage = {
        $lookup: {
          from: from.trim(),
          localField: localField.trim(),
          foreignField: '_id', // Assuming the foreign field is always '_id'
          as: localField.trim(),
        },
      }
      return lookupStage
    })

    return stages
  }
}

const instance = new QueryGen()
export default instance

// let filterByFreelancer = []

// if (freelancer) {
//   filterByFreelancer.push({ appliedFreelancers: { $nin: [freelancer?._id] } })
//   filterByFreelancer.push({ blockFreelancers: { $nin: [freelancer?._id] } })
//   if (freelancer?.jobs?.length) {
//     filterByFreelancer.push({ _id: { $nin: freelancer?.jobs } })
//   }
//   if (freelancer?.favoriteJobs?.length) {
//     filterByFreelancer.push({ _id: { $nin: freelancer?.favoriteJobs?.map(j => j?.toString()) } })
//   }
// }

// filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

// const categoryFilter = categories?.length ? { categories: { $in: categories || [] } } : {}

// const skillFilter = skills?.length ? { 'reqSkills.skill': { $in: skills || [] } } : {}

// const filter = {
//   $and: [
//     {
//       $or: [
//         { title: { $regex: `${similarDocs?.similarKeys}`, $options: 'si' } },
//         { description: { $regex: `${similarDocs?.similarKeys}`, $options: 'si' } },
//         { categories: { $in: similarDocs?.similarJobCats?.map(c => c.toString()) || [] } },
//         { 'reqSkills.skill': { $in: similarDocs?.similarSkills || [] } },
//         { tags: { $in: similarDocs?.similarTags || [] } },
//         { 'preferences.locations': { $in: similarDocs?.similarLocations || [] } },
//       ],
//     },
//     ...filterByFreelancer,
//     { isDeleted: { $ne: true } },
//     categoryFilter,
//     skillFilter,
//     { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
//   ],
// }
// options.sortBy = 'updatedAt:desc'

// options.populate = 'client,categories,reqSkills.skill'
// if (!options.projectBy) {
//   options.projectBy =
//     'client, categories, title, description, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences'
// }

// const jobs = await Job.paginate(filter, options)
// return jobs