import { TestBed } from '@angular/core/testing';
import { SwaggerEngineService } from './swagger-engine.service';


describe('SwaggerEngineService', () => {
  let service: SwaggerEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwaggerEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
