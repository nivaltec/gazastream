import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlaylistItemModalComponent } from './add-playlist-item-modal.component';

describe('AddPlaylistItemModalComponent', () => {
  let component: AddPlaylistItemModalComponent;
  let fixture: ComponentFixture<AddPlaylistItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlaylistItemModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlaylistItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
