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
    {quote: "All of us know something. All of us ignore something. Thus, all of us always learn.", 
      author: "Paulo Freire"},
    {quote: "No one is born fully-formed: it is through self-experience in the world that we become what we are.", 
      author: "Paulo Freire"},
    {quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", 
      author: "Malcolm X"},
    {quote: "It is the mark of an educated mind to be able to entertain a thought without accepting it.", 
      author: "Aristotle"},
    {quote: "The highest result of education is tolerance.", 
      author: "Hellen Keller"},
    {quote: "Don't let schooling interfere with your education.", 
        author: "Mark Twain"},
    {quote: "I was taught that the way of progress was neither swift nor easy.", 
      author: "Marie Curie"},
    {quote: "The internet could be a very positive step towards education, organisation and participation in a meaningful society.", 
      author: "Noam Chomsky"},
    {quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", 
      author: "Benjamin Franklin"},
    {quote: "Education is the most powerful weapon which you can use to change the world.", 
      author: "Nelson Mandela"},
    {quote: "The future belongs to young people with an education and the imagination to create.", 
      author: "Barack Obama"},
    {quote: "Early childhood education is the key to the betterment of society.", 
      author: "Maria Montessori"},
    {quote: "The more I study, the more insatiable do I feel my genius for it to be.", 
      author: "Ada Lovelace"},
    {quote: "I like to learn. That's an art and a science.", 
      author: "Katherine Johnson"},
    {quote: "To me programming is more than an important practical art. It is also a gigantic undertaking in the foundations of knowledge.", 
      author: "Grace Hopper"},
  ];
}
