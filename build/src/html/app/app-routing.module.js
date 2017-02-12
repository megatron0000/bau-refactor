"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var dashboard_component_1 = require("./components/dashboard.component");
var graph_component_1 = require("./components/graph.component");
var hero_detail_component_1 = require("./components/hero-detail.component");
var hero_search_component_1 = require("./components/hero-search.component");
var heroes_component_1 = require("./components/heroes.component");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var routes = [
    {
        path: '',
        redirectTo: '/graph',
        pathMatch: 'full'
    },
    {
        path: 'graph',
        component: graph_component_1.GraphComponent
    },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent
    },
    {
        path: 'details/:id',
        component: hero_detail_component_1.HeroDetailComponent
    },
    {
        path: 'heroes',
        component: heroes_component_1.HeroesComponent
    },
    {
        path: 'search',
        component: hero_search_component_1.HeroSearchComponent
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map