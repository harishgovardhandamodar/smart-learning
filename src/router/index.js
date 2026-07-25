import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/topics', name: 'topics', component: () => import('../views/TopicsView.vue') },
  { path: '/learn/:topicId', name: 'learn', component: () => import('../views/LearnView.vue'), props: true },
  { path: '/quiz/:topicId', name: 'quiz', component: () => import('../views/QuizView.vue'), props: true },
  { path: '/fun-facts', name: 'fun-facts', component: () => import('../views/FunFactsView.vue') },
  { path: '/enroll', name: 'enroll', component: () => import('../views/EnrollView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/focus', name: 'focus', component: () => import('../views/FocusedLearnView.vue') },
  { path: '/focus/:pathId/lesson/:lessonIndex', name: 'lesson', component: () => import('../views/LessonView.vue'), props: true },
  { path: '/focus/:pathId', name: 'focus-path', component: () => import('../views/FocusedLearnView.vue'), props: true },
  { path: '/focus/manage', name: 'manage-paths', component: () => import('../views/ManagePathsView.vue') },
  { path: '/engine', name: 'adaptive-engine', component: () => import('../views/AdaptiveEngineView.vue') },
  { path: '/engine/physics-week', name: 'physics-week', component: () => import('../views/PhysicsWeekView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
