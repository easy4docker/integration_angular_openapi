import { Component, OnInit } from '@angular/core';
// import { Swagger } from './hero.service';
import { SwaggerEngineService } from '../swagger-engine.service';

@Component({
  selector : 'app-xyz',
  template : 
  `<h3>=={{niu}}==
  </h3>`,
 // templateUrl: './xyz.component.html',
  styleUrls: ['./xyz.component.css']
})
/*
@Component({
  selector: 'app-xyz',
  templateUrl: './xyz.component.html',
  styleUrls: ['./xyz.component.css']
})*/
export class XyzComponent implements OnInit {
  public niu: any = {};
  constructor(private _engineService: SwaggerEngineService) { }
  ngOnInit(): void {
    this.niu = this._engineService.getData()
      .subscribe(data=>this.niu = JSON.stringify(data));

  }

}
