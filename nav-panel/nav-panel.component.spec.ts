import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPanelComponent } from './nav-panel.component';

describe('NavPanelComponent', () => {
    let component: NavPanelComponent;
    let fixture: ComponentFixture<NavPanelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavPanelComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NavPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
