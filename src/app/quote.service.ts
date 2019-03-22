import { Injectable } from '@angular/core';

export class Quote{
  quote: string;
  author: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor() { }

  allQuotes : Array<Quote> = [ 
    {quote: "Lorem this ipsum.", author: "Shakespeare"}, 
    {quote: "Dolor sit with my amet.", author: "Zézinho"},
    {quote: "Nunquam sequitur with my dogs", author: "Captain America" } 
  ];
}
