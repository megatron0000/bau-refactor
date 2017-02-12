"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var hero_search_service_1 = require("../services/hero-search.service");
var HeroSearchComponent = (function () {
    function HeroSearchComponent(heroSearchService, router) {
        this.heroSearchService = heroSearchService;
        this.router = router;
        this.searchTerms = new Subject_1.Subject();
    }
    HeroSearchComponent.prototype.search = function (term) {
        this.searchTerms.next(term);
    };
    HeroSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.heroes = this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(function (term) { return term ?
            _this.heroSearchService.search(term) :
            Observable_1.Observable.of([]); })
            .catch(function (error) {
            console.error(error.message || error);
            return Observable_1.Observable.of([]);
        });
    };
    HeroSearchComponent.prototype.goToDetail = function (hero) {
        this.router.navigate(['/details', hero.id]);
    };
    return HeroSearchComponent;
}());
HeroSearchComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'hero-search',
        templateUrl: 'hero-search.component.html',
        styleUrls: ['hero-search.component.css'],
        providers: [hero_search_service_1.HeroSearchService]
    }),
    __metadata("design:paramtypes", [hero_search_service_1.HeroSearchService, router_1.Router])
], HeroSearchComponent);
exports.HeroSearchComponent = HeroSearchComponent;
//# sourceMappingURL=hero-search.component.js.map