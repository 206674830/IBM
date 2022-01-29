export class stockModel{
    date:Date;
    open:number;
    close:number;
    high:number;
    low:number;
    constructor(date:Date,open:number,close:number,high:number,low:number){
        this.date=date;
        this.open=open;
        this.close=close;
        this.high=high;
        this.low=low;      
    }
}