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
var hero_service_1 = require("../services/hero.service");
var DashboardComponent = (function () {
    function DashboardComponent(heroServiceInstance) {
        this.heroServiceInstance = heroServiceInstance;
        // Três propriedades para animar a route
        this.heroStateController = true;
        this.display = 'block';
        this.position = 'relative';
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.heroServiceInstance
            .getHeroes()
            .then(function (heroArray) { return _this.heroes = heroArray.slice(1, 5); })
            .catch(function (error) { return console.error(error); });
    };
    return DashboardComponent;
}());
__decorate([
    core_1.HostBinding('@heroState'),
    __metadata("design:type", Object)
], DashboardComponent.prototype, "heroStateController", void 0);
__decorate([
    core_1.HostBinding('style.display'),
    __metadata("design:type", Object)
], DashboardComponent.prototype, "display", void 0);
__decorate([
    core_1.HostBinding('style.position'),
    __metadata("design:type", Object)
], DashboardComponent.prototype, "position", void 0);
DashboardComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-dashboard',
        templateUrl: 'dashboard.component.html',
        styleUrls: ['dashboard.component.css'],
        animations: [
            core_1.trigger('heroState', [
                core_1.transition('void => *', [
                    core_1.style({
                        width: '10%',
                        height: '100%'
                    }),
                    core_1.animate('200ms ease')
                ]),
                core_1.transition('* => void', [
                    core_1.animate('200ms ease', core_1.style({
                        transform: 'translateX(-100%)'
                    }))
                ])
            ])
        ]
    }),
    __metadata("design:paramtypes", [hero_service_1.HeroService])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map