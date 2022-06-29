/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LastPageComponent } from './last-page.component';

describe('LastPageComponent', () => {
  let component: LastPageComponent;
  let fixture: ComponentFixture<LastPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
