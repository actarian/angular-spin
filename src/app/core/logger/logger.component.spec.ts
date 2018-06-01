import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { LoggerComponent } from './logger.component';

describe('LoggerComponent', () => {
    let component: LoggerComponent;
    let fixture: ComponentFixture<LoggerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoggerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoggerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
