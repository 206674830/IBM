import { Component, OnInit  } from '@angular/core';
import { StockListService } from '../stock-list.service';
import { interval } from 'rxjs';
import { stockModel } from './stock-model';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css'],

})
export class StockListComponent implements OnInit {
  stockList:stockModel[]=[];
  originalStockList:stockModel[]=[];
  sortList:stockModel[]=[];
  first = 0;
  rows = 20;
  math=Math;
  maxGap:number=0;
   dayToBuy:Date=new Date();
   dayTosell:Date=new Date();
    date:Date=new Date();
  constructor(private stockListService:StockListService) { }

  ngOnInit(): void {
    this.getStockList();
  }


  getStockList(){
    this.stockListService.getData().subscribe((data:any)=>{
      this.stockList= Object.keys(data["Time Series (Daily)"])
    .map(key => {return new stockModel(
        new Date(key),
        data["Time Series (Daily)"][key]["1. open"],
        data["Time Series (Daily)"][key]["4. close"],
        data["Time Series (Daily)"][key]["2. high"],
        data["Time Series (Daily)"][key]["3. low"])
    });
    this.originalStockList=[...this.stockList];
  this.culculate();
  });
  }

  onDateSelected($event:any){
      this.stockList= this.originalStockList.filter(x=> x.date.setHours(0,0,0,0) == $event.setHours(0,0,0,0));
  }

  clear(){
      this.stockList=this.originalStockList;
  }
culculate(){
    this.sortList=this.stockList.sort((a,b)=>{return a.date.getTime()-  b.date.getTime()});
    let index=0;
    let minIndex=0;
    let maxIndex=0;
    let gap=0;

    while (index < this.sortList.length) {    
       let listBetweenIndexes=[...this.sortList].slice(index+1,this.sortList.length);//cut array from current index to end of array
       let max= Math.max(...listBetweenIndexes.map(x=>{return x.high})); 
       let indexOfLargestHigh=listBetweenIndexes.findIndex(x=>x.high==max);//find index of max value in the cut array
       let indexOfLargestHighInOriginalList=this.sortList.findIndex(x=>x==listBetweenIndexes[indexOfLargestHigh]);//find index of max value in the original array
       let listBetweenIndexToMax=[...this.sortList].slice(index ,indexOfLargestHighInOriginalList);//cut array from current index to the index of max value
       let min= Math.min(...listBetweenIndexToMax.map(x=>{return x.low})); 
       let indexOfsmallestLow=listBetweenIndexToMax.findIndex(x=>x.low==min);//find index of min value in the cut array
       let indexOfsmallestLowInOriginalList=this.sortList.findIndex(x=>x==listBetweenIndexToMax[indexOfsmallestLow]);//find index of min value in the original array

     if(max-min>gap){
         gap=max-min;
         maxIndex=indexOfLargestHighInOriginalList;
         minIndex=indexOfsmallestLowInOriginalList;
     }

     index=indexOfLargestHighInOriginalList+1;
     if(index>=this.sortList.length-1)
          break;
      
    }

    this.maxGap=gap;
    this.dayToBuy=this.sortList[minIndex].date;
    this.dayTosell=this.sortList[maxIndex].date;
}

  next() {
    this.first = this.first + this.rows;
}

prev() {
    this.first = this.first - this.rows;
}

reset() {
    this.first = 0;
    this.stockList=this.originalStockList;
}

isLastPage(): boolean {
    return this.stockList ? this.first === (this.stockList.length - this.rows): true;
}

isFirstPage(): boolean {
    return this.stockList ? this.first === 0 : true;
}


}
