import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  moduleCode: string = `
    import { BricGisModule } from 'bric-gis';
    [...]
    @NgModule({
      declarations: [...],
      imports: [
        ...
        BricGisModule.forRoot()
      ],
      providers: [...],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
  `;
  constructor() { }

  ngOnInit() {
  }

}
