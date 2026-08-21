import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDetailsComponent } from './audio-details.component';

describe('AudioDetailsComponent', () => {
  let component: AudioDetailsComponent;
  let fixture: ComponentFixture<AudioDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
