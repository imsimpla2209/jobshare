/* eslint-disable class-methods-use-this */
import { ApiError } from 'common/errors'
import httpStatus from 'http-status'
import CrudService from 'providers/crud/crud.service'
import { IJobTag } from '../job.interfaces'
import { JobTag } from '../job.model'

class TagService extends CrudService<IJobTag, { name: string }, { name: string }> {
  constructor() {
    super(JobTag)
  }

  async createCatogory(categoryBody: { name: string }) {
    if (await JobTag.isNameTaken(categoryBody.name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This skill already exists')
    }
  }
}

const tagService = new TagService()

export default tagService
