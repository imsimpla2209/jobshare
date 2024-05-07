import config from '@config/config'
import { adminRouter } from '@modules/admin/routers/admin.router'
import { commentRouter } from '@modules/forum/routers/comment.router'
import { dataRouter } from '@modules/forum/routers/data.router'
import { departmentRouter } from '@modules/forum/routers/department.router'
import { postRouter } from '@modules/forum/routers/post.router'
import { specialEventRouter } from '@modules/forum/routers/specialEvent.router'
import { testRouter } from '@modules/forum/routers/test.router'
import express, { Router } from 'express'
import authRoute from './auth.route'
import clientRoute from './client.route'
import contractRoute from './contract.route'
import freelancerRoute from './freelancer.route'
import jobRoute from './job.route'
import messageRoute from './message.route'
import notifyRoute from './notify.route'
import paymentRoute from './payment.route'
import proposalRoute from './proposal.route'
import docsRoute from './swagger.route'
import userRoute from './user.route'
import skillsRouter from './skill.route'
import categoriesRouter from './category.route'

const router = express.Router()

interface IRoute {
  path: string
  route: Router
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/clients',
    route: clientRoute,
  },
  {
    path: '/jobs',
    route: jobRoute,
  },
  {
    path: '/freelancers',
    route: freelancerRoute,
  },
  {
    path: '/proposals',
    route: proposalRoute,
  },
  {
    path: '/contracts',
    route: contractRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/notify',
    route: notifyRoute,
  },
  {
    path: '/messages',
    route: messageRoute,
  },
  {
    path: '/department',
    route: departmentRouter,
  },
  {
    path: '/event',
    route: specialEventRouter,
  },
  {
    path: '/posts',
    route: postRouter,
  },
  {
    path: '/postComments',
    route: commentRouter,
  },
  {
    path: '/admin',
    route: adminRouter,
  },
  {
    path: '/test',
    route: testRouter,
  },
  {
    path: '/data',
    route: dataRouter,
  },
  {
    path: '/skills',
    route: skillsRouter,
  },
  {
    path: '/categories',
    route: categoriesRouter,
  },
]

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
]

defaultIRoute.forEach(route => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach(route => {
    router.use(route.path, route.route)
  })
}

export default router
