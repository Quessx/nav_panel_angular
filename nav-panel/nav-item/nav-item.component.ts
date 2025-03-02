import { ChangeDetectionStrategy, Component, inject, input, Input, InputSignal, OnInit, QueryList, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

import { TranslatePipe } from '@i18n/translate.pipe';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { NgClass } from '@angular/common';
import { filter } from 'rxjs';
import { ExpendableIconComponent } from '../../../icons/expendable-icon/expendable-icon.component';

@Component({
    selector: 'nav-item',
    templateUrl: './nav-item.component.html',
    styleUrl: './nav-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterLink, RouterLinkActive, TuiIcon, TranslatePipe, CdkAccordion, CdkAccordionItem, NgClass, ExpendableIconComponent]
})
export class NavItemComponent implements OnInit {
    route: ActivatedRoute = inject(ActivatedRoute);
    router: Router = inject(Router);
    @Input()
    icon?: string;

    @Input()
    link?: string;

    @Input()
    text?: string;

    isChildActive: boolean = false;
    options: InputSignal<any> = input([]);

    constructor() {

    }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.updateChildActiveState();
        });
        this.updateChildActiveState();
    }

    updateChildActiveState() {
        this.isChildActive = this.options().some(() => {
            return this.link === this.router.routerState.snapshot.url.split('/')[1];
        });
    }

    onClickOption($event: Event): void {
        $event.preventDefault();
        $event.stopPropagation();
    }
}
