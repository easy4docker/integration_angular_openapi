import { Component, OnInit } from '@angular/core';
import { SwaggerEngineService } from '../swagger-engine.service';

@Component({
  selector: 'app-showdata',
  templateUrl: './showdata.component.html',
  styleUrls: ['./showdata.component.css']
})
export class ShowdataComponent implements OnInit {
  public showData: any = {}
  constructor(private _showdata: SwaggerEngineService) { }

  ngOnInit(): void {
    this._showdata.getData()
      .subscribe(data => this.showData = JSON.stringify(data))
  }

}
