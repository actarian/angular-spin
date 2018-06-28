import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RegionSearchComponent } from './region-search.component';

describe('RegionSearchComponent', () => {
	let component: RegionSearchComponent;
	let fixture: ComponentFixture<RegionSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RegionSearchComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RegionSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
