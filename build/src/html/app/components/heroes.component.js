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
var hero_service_1 = require("../services/hero.service");
var HeroesComponent = (function () {
    function HeroesComponent(heroServiceInstance, router) {
        this.heroServiceInstance = heroServiceInstance;
        this.router = router;
    }
    HeroesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.heroServiceInstance
            .getHeroes()
            .then(function (heroArray) { return _this.heroes = heroArray; })
            .catch(function (error) { return console.error(error); });
    };
    HeroesComponent.prototype.onSelect = function (hero) {
        this.selectedHero = hero;
    };
    HeroesComponent.prototype.goToDetail = function () {
        // Não passei objeto {relativeTo: ActivatedRoute}, então a navegação é absoluta
        this.router.navigate(['/details', this.selectedHero.id]);
    };
    return HeroesComponent;
}());
HeroesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-heroes',
        templateUrl: 'heroes.component.html',
        styleUrls: ['heroes.component.css']
    }),
    __metadata("design:paramtypes", [hero_service_1.HeroService, router_1.Router])
], HeroesComponent);
exports.HeroesComponent = HeroesComponent;
//# sourceMappingURL=heroes.component.js.map