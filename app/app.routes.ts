import {nsProvideRouter} from "nativescript-angular/router"
import { RouterConfig } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';

export const routes: RouterConfig = [
    { path: "", component: ListComponent },
    { path: "detail", component: DetailComponent }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, {})
];
