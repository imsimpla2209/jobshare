/* eslint-disable new-cap */
import { ApiError } from 'common/errors'
import httpStatus from 'http-status'
import mongoose, { Document, Model } from 'mongoose'

type TDocument<T> = T & Document

export default class CrudService<T extends Document, ICreate, IUpdate> {
  constructor(private readonly model: Model<TDocument<T>>) {}

  async create(createBody: ICreate): Promise<T> {
    const createdObject = new this.model(createBody)
    return createdObject.save()
  }

  /**
   * Get  by id
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<T | null>}
   */
  getAll = async (limit?: number): Promise<T | null> =>
    this.model
      .find()
      .limit(limit || 10000)
      .lean()

  /**
   * Get  by id
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<T | null>}
   */
  getById = async (id: mongoose.Types.ObjectId): Promise<T | null> => this.model.findById(id).lean()

  /**
   * Get  by name
   * @param {string} name
   * @returns {Promise<T | null>}
   */
  getByname = async (name: string): Promise<T | null> => this.model.findOne({ name }).lean()

  /**
   * Get  by email
   * @param {string} email
   * @returns {Promise<T | null>}
   */
  getByEmail = async (email: string): Promise<T | null> => this.model.findOne({ email }).lean()

  /**
   * Get  by option
   * @param {object} options
   * @returns {Promise<T | null>}
   */
  getByOptions = async (Options: any): Promise<T | null> => this.model.findOne(Options).lean()

  /**
   * Update  by id
   * @param {mongoose.Types.ObjectId} Id
   * @param {UpdateBody} updateBody
   * @returns {Promise<T | null>}
   */
  updateById = async (id: mongoose.Types.ObjectId, updateBody: IUpdate): Promise<T | null> => {
    const updatedData = await this.getById(id)
    if (!updatedData) {
      throw new ApiError(httpStatus.NOT_FOUND, ' not found')
    }
    Object.assign(updatedData, updateBody)
    await updatedData.save()
    return updatedData
  }

  /**
   * Delete  by id
   * @param {mongoose.Types.ObjectId} Id
   * @returns {Promise<T | null>}
   */
  deleteById = async (Id: mongoose.Types.ObjectId): Promise<T | null> => {
    const deletedOne = await this.getById(Id)
    if (!deletedOne) {
      throw new ApiError(httpStatus.NOT_FOUND, ' not found')
    }
    await deletedOne.deleteOne()
    return deletedOne
  }
}
