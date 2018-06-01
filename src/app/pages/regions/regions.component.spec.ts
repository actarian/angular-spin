import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RegionsComponent } from './regions.component';

describe('RegionsComponent', () => {
    let component: RegionsComponent;
    let fixture: ComponentFixture<RegionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegionsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
