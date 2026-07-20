import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TopicsView from '../views/TopicsView.vue'
import LearnView from '../views/LearnView.vue'
import QuizView from '../views/QuizView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/topics', name: 'topics', component: TopicsView },
  { path: '/learn/:topicId', name: 'learn', component: LearnView, props: true },
  { path: '/quiz/:topicId', name: 'quiz', component: QuizView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
