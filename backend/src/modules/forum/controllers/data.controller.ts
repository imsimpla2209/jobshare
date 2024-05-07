/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable import/prefer-default-export */
import Job, { JobCategory } from '@modules/job/job.model'
import excel from 'exceljs'
import Post from '../models/Post'
import ApiErrorResponse from '../utils/ApiErrorResponse'

export const ideasExcel = async (req: any, res: any, next: any) => {
  try {
    const options = req?.query
    let queryOpts = {}
    if (options?.cateId) {
      const category = await JobCategory.findById(options?.cateId)
      if (!category) {
        return next(new ApiErrorResponse(`Not found category id ${options?.cateId}`, 500))
      }
      queryOpts = { categories: { $in: [options.cateId] } }
    }
    if (req?.query.from) {
      const dateOptions = req.query
      queryOpts = {
        ...queryOpts,
        createdAt: {
          $gte: new Date(dateOptions.from),
          $lt: new Date(dateOptions.to),
        },
      }
    }
    console.log(queryOpts)
    const ideas = await Post.find(queryOpts)
      .populate({
        path: 'publisherId',
        select: ['name', 'department'],
        populate: {
          path: 'department',
          select: ['name'],
        },
      })
      .populate({
        path: 'specialEvent',
        select: ['title'],
      })
      .populate({
        path: 'categories',
        select: ['name'],
      })

    if (!ideas[0]) {
      return res.status(202).json({ message: `No data match your demand!!!` })
    }

    const ideaRows = []
    ideas.forEach(idea => {
      ideaRows.push({
        id: idea?.id,
        title: idea?.title,
        publisher: idea?.publisherId?.name,
        date: idea?.createdAt,
        category: `${idea?.categories?.map(cate => cate.name)}`,
        votesCount: idea?.meta?.likesCount - idea?.meta?.dislikesCount,
        comment: idea?.comments?.length,
        views: idea?.meta?.views,
        specialEvent: idea?.specialEvent?.title,
        department: idea?.publisherId?.department?.name,
        files: idea?.files,
      })
    })

    const workbook = new excel.Workbook()
    const worksheet = workbook.addWorksheet('Ideas')

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 20 },
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Publisher', key: 'publisher', width: 20 },
      { header: 'Date', key: 'date', width: 10 },
      { header: 'Categories', key: 'category', width: 30 },
      { header: 'Total votes', key: 'votesCount', width: 5 },
      { header: 'Total comments', key: 'comment', width: 5 },
      { header: 'Total views', key: 'views', width: 5 },
      { header: 'Special event', key: 'specialEvent', width: 35 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Files attachment', key: 'files', width: 100 },
    ]
    worksheet.addRows(ideaRows)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    return await workbook.xlsx.write(res).then(function () {
      res.status(200).end()
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export async function testQuery(req: any, res: any, next: any) {
  res.status(200).json('oke')
}
