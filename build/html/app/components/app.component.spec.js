"use strict";
var app_routing_module_1 = require("../app-routing.module");
var app_component_1 = require("./app.component");
var dashboard_component_1 = require("./dashboard.component");
var graph_component_1 = require("./graph.component");
var hero_detail_component_1 = require("./hero-detail.component");
var hero_search_component_1 = require("./hero-search.component");
var heroes_component_1 = require("./heroes.component");
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
describe('AppComponent', function () {
    var de;
    var comp;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                app_component_1.AppComponent,
                hero_detail_component_1.HeroDetailComponent,
                heroes_component_1.HeroesComponent,
                dashboard_component_1.DashboardComponent,
                hero_search_component_1.HeroSearchComponent,
                graph_component_1.GraphComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpModule,
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(platform_browser_1.By.css('h1'));
    });
    it('should create component', function () { return expect(comp).toBeDefined(); });
    it('should have expected <h1> text', function () {
        fixture.detectChanges();
        var h1 = de.nativeElement;
        expect(h1.innerText).toMatch(/angular/i, '<h1> should say something about "Angular"');
    });
});
//# sourceMappingURL=app.component.spec.js.map