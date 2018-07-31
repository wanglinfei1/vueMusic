import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Recommend = (resolve) => {
  import('components/recommend/index').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('components/singer/index').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('components/rank/index').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('components/search/index').then((module) => {
    resolve(module)
  })
}

const SingerDetails = (resolve) => {
  import('components/singer-details/singer-details').then((module) => {
    resolve(module)
  })
}

const disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
}

const topList = (resolve) => {
  import('components/top-list/top-list').then((module) => {
    resolve(module)
  })
}

const userCenter = (resolve) => {
  import('components/userCenter/userCenter').then((module) => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [{
        path: ':id',
        component: disc
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetails
      }]
    },
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: topList
      }]
    },
    {
      path: '/search',
      component: Search,
      children: [{
        path: ':id',
        component: SingerDetails
      }]
    },
    {
      path: '/user',
      component: userCenter
    }
  ]
})
