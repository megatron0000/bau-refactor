"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
require("./rxjs-extensions");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./components/app.component");
var dashboard_component_1 = require("./components/dashboard.component");
var graph_component_1 = require("./components/graph.component");
var hero_detail_component_1 = require("./components/hero-detail.component");
var hero_search_component_1 = require("./components/hero-search.component");
var heroes_component_1 = require("./components/heroes.component");
var hero_service_1 = require("./services/hero.service");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
// Imports for loading & configuring the in-memory web api
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            app_routing_module_1.AppRoutingModule,
            http_1.HttpModule,
        ],
        declarations: [
            app_component_1.AppComponent,
            hero_detail_component_1.HeroDetailComponent,
            heroes_component_1.HeroesComponent,
            dashboard_component_1.DashboardComponent,
            hero_search_component_1.HeroSearchComponent,
            graph_component_1.GraphComponent
        ],
        bootstrap: [app_component_1.AppComponent],
        providers: [hero_service_1.HeroService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map