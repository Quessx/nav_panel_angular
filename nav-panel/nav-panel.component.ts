import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { NavItemComponent } from './nav-item/nav-item.component';
import { LanguageService } from '@i18n/language.service';
import { langData } from './lang/nav-panel.lang';
import { EmployeesStore } from '@stores/employees/employees.store';
import { INVALID_ROUTES } from '@ui/nav-panel/nav-panel.const';

@Component({
    selector: 'nav-panel',
    templateUrl: './nav-panel.component.html',
    styleUrl: './nav-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NavItemComponent]
})
export class NavPanelComponent implements OnInit {
    protected links = signal<Route[]>([]);
    protected router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    public employeesStore = inject(EmployeesStore);

    constructor() {
        LanguageService.setLangData(langData[LanguageService.getLangStatic()]);
    }
    private optionsEmployee = computed(() => {
        let options: { path: string; link: string }[] = this.employeesStore.getAsEmployeeCardModel().map((employee) => {
            langData[LanguageService.getLangStatic()][employee.getId()] = employee.getName();
            return {
                path: employee.getId(),
                link: '',
            }
        });
        LanguageService.setLangData(langData[LanguageService.getLangStatic()]);
        return options;
    });
    protected getNavOptions(route: Route): Route[] {
        if (!route.path) return [];

        switch (route.path) {
            case 'loyalty':
                return this.filterValidRoutes(route.children || []);
            case 'settings':
                return this.getSettingsRoutes(route);
            case 'employees':
                return this.optionsEmployee();
            default:
                return [];
        }
    }

    private getSettingsRoutes(route: Route): Route[] {
        return this.filterValidRoutes((route.children || [])
            .map(child => ({
                ...child,
                path: child.path,
                link: child.path === 'employees' ? child.path : `${route.path}/${child.path}`
            })))
    }
    ngOnInit(): void {
        this.links.set(this.getValidRoutes());
    }

    private getValidRoutes(): Route[] {
        const routes = this.activatedRoute.snapshot.routeConfig?.children || this.router.config;
        return this.filterValidRoutes(routes);
    }

    private filterValidRoutes(routes: Route[]): Route[] {
        return routes.filter(route =>
            !!route.path && !INVALID_ROUTES.includes(route.path)
        );
    }
}
