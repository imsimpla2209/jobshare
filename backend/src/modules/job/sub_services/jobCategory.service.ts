/* eslint-disable class-methods-use-this */
import { ApiError } from 'common/errors'
import httpStatus from 'http-status'
import CrudService from 'providers/crud/crud.service'
import { IJobCategory } from '../job.interfaces'
import { JobCategory } from '../job.model'
import mongoose from 'mongoose'

class CategoryService extends CrudService<IJobCategory, { name: string }, { name: string }> {
  constructor() {
    super(JobCategory)
  }

  public async getAllCategories() {
    const categories = await JobCategory.find().sort({ updatedAt: -1 }).lean()

    return categories
  }
  public async createCategory(categoryBody) {
    if (await JobCategory.isNameTaken(categoryBody.name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This category already exists')
    }
    return JobCategory.create(categoryBody)
  }

  public async getCategoryById(id: mongoose.Types.ObjectId) {
    return JobCategory.findById(id)
  }

  public async updateCategoryById(categoryId: mongoose.Types.ObjectId, updateBody) {
    const category = await this.getCategoryById(categoryId)
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'category not found')
    }
    Object.assign(category, updateBody)
    await category.save()
    return category
  }

  public async deleteCategoryById(categoryId: mongoose.Types.ObjectId) {
    const category = await this.getCategoryById(categoryId)
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'category not found')
    }
    await category.deleteOne()
    return category
  }
}

const categoryService = new CategoryService()

export default categoryService
