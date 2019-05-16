import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
 
import { StripeService as NgxStripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";
import { StripeService } from '../../stripe.service';

@Component({
  selector: 'app-stripe-ticket-purchase',
  templateUrl: './stripe-ticket-purchase.component.html',
  styleUrls: ['./stripe-ticket-purchase.component.css']
})
export class StripeTicketPurchaseComponent implements OnInit {
  @Input() ticketPrice: number
  @Input() creatorId: number
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
 
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };
 
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
 
  stripeTest: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private ngxstripeService: NgxStripeService,
    private stripeService: StripeService
  ) {}
 
  ngOnInit() {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
  }
 
  buy() {
    const name = this.stripeTest.get('name').value;
    this.ngxstripeService.stripe
      .createToken(this.card.getCard(), { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token.id);
          let data = {
            source_token : result.token.id,
            amount : this.ticketPrice, //convert ticket price to cents for Stripe
            creatorId : this.creatorId
          }
          console.log(data)
          this.stripeService.sendToken(data).subscribe(
            res => console.log(res),
            err => console.log(err)
          )
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }
}