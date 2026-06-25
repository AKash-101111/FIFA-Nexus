import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent),
    title: 'FIFA Nexus | The Ultimate Football Intelligence Platform'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
    title: 'Register | FIFA Nexus'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Reset Password | FIFA Nexus'
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Command Center | FIFA Nexus',
        data: { animation: 'DashboardPage' }
      },
      {
        path: 'live',
        loadComponent: () => import('./pages/live-center/live-center.component').then(m => m.LiveCenterComponent),
        title: 'Live Center | FIFA Nexus',
        data: { animation: 'LiveCenterPage' }
      },
      {
        path: 'groups',
        loadComponent: () => import('./pages/groups/groups.component').then(m => m.GroupsComponent),
        title: 'Groups | FIFA Nexus',
        data: { animation: 'GroupsPage' }
      },
      {
        path: 'fixtures',
        loadComponent: () => import('./pages/fixtures/fixtures.component').then(m => m.FixturesComponent),
        title: 'Fixtures | FIFA Nexus',
        data: { animation: 'FixturesPage' }
      },
      {
        path: 'knockout',
        loadComponent: () => import('./pages/knockout/knockout.component').then(m => m.KnockoutComponent),
        title: 'Knockout Stage | FIFA Nexus',
        data: { animation: 'KnockoutPage' }
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/teams/teams.component').then(m => m.TeamsComponent),
        title: 'Teams | FIFA Nexus',
        data: { animation: 'TeamsPage' }
      },
      {
        path: 'players',
        loadComponent: () => import('./pages/players/players.component').then(m => m.PlayersComponent),
        title: 'Players | FIFA Nexus',
        data: { animation: 'PlayersPage' }
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics/analytics-dashboard.component').then(m => m.AnalyticsDashboardComponent),
        title: 'Analytics Intelligence | FIFA Nexus',
        data: { animation: 'AnalyticsPage' }
      },
      {
        path: 'ai-insights',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { animation: 'AiInsightsPage' }
      },
      {
        path: 'ai-workspace',
        loadComponent: () => import('./pages/ai-workspace/ai-workspace.component').then(m => m.AiWorkspaceComponent),
        title: 'AI Command Center | FIFA Nexus',
        data: { animation: 'AiWorkspacePage' }
      },
      {
        path: 'highlights',
        loadComponent: () => import('./pages/highlights/highlights-hub.component').then(m => m.HighlightsHubComponent),
        title: 'Highlights Hub | FIFA Nexus',
        data: { animation: 'HighlightsPage' }
      },
      {
        path: 'fantasy',
        loadComponent: () => import('./pages/fantasy/fantasy-league.component').then(m => m.FantasyLeagueComponent),
        title: 'Fantasy League Pro | FIFA Nexus',
        data: { animation: 'FantasyPage' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings | FIFA Nexus',
        data: { animation: 'SettingsPage' }
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Command Center | FIFA Nexus',
        data: { animation: 'AdminPage' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
