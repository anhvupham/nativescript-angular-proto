import {Component, ElementRef, NgZone, OnInit, ViewChild} from "@angular/core";

@Component({
  selector: "detail",
  templateUrl: "pages/detail/detail.component.html",
})
export class DetailComponent implements OnInit {
  grocery = "Foo";

  constructor() {
    this.grocery = "Bar";
  }

  ngOnInit() {
    
  }
}