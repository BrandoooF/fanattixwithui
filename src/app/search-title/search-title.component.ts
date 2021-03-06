import { Component, OnInit } from '@angular/core';
import { FxEvent } from '../models/event';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { FilterServiceService } from '../filter-service.service';

@Component({
  selector: 'app-search-title',
  templateUrl: './search-title.component.html',
  styleUrls: ['./search-title.component.css']
})
export class SearchTitleComponent implements OnInit {
  results: any
  queryString = 'hello'

  constructor(
    private eventService: EventService, 
    private router: Router, 
    private route: ActivatedRoute,
    private filterService: FilterServiceService
  ) { }

  ngOnInit() {
    this.initWithQueryParams()
  }

  searchEventsByName(ev, eventName){
    ev.preventDefault()
    this.updateQueryParams(eventName)
    /*this.eventService.searchEventsByName(eventName).subscribe(
      res => {
        this.results = res
        console.log(this.results)
      },
      err => console.log(err)
    )*/
  }  

  goToEventDetail(id){
    this.router.navigate(['event', id])
    console.log('detail')
  }

  initWithQueryParams(){
    this.queryString = this.route.snapshot.queryParamMap.get('searchTerm')

    let params = {
      lat : parseFloat(this.route.snapshot.queryParamMap.get('lat')),
      lng : parseFloat(this.route.snapshot.queryParamMap.get('lng')),
      category_name : this.route.snapshot.queryParamMap.get('category_name'),
      type_name : this.route.snapshot.queryParamMap.get('type_name'),
      price : this.route.snapshot.queryParamMap.get('price'),
      searchTerm : this.route.snapshot.queryParamMap.get('searchTerm'),
    }   

    console.log(params)
    
    this.filter(params)
  }

  updateQueryParams(eventName){
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          searchTerm: eventName,
      },
      queryParamsHandling: 'merge',
    })

    this.route.queryParams.subscribe(
      val => {
        this.filter(val)
        console.log(val)
      },
      err => console.log(err)
    )    
  }

  filter(queryParams){
    console.log(queryParams)
    this.filterService.filter(queryParams).subscribe(
      res => {
        console.log(res)
        this.results = res
      },
      err => console.log(err)
    )
  }
  

}
