import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatelogComponent } from './catelog.component';

describe('CatelogComponent', () => {
  let component: CatelogComponent;
  let fixture: ComponentFixture<CatelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatelogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
