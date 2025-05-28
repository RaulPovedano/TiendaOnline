import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly SERVICE_ID = 'service_8el6em4';
  private readonly TEMPLATE_ID = 'template_kxqla9k';
  private readonly PUBLIC_KEY = 'cmLwsYuLl7nfBc6ml';

  constructor() {
    emailjs.init(this.PUBLIC_KEY);
  }

  sendContactEmail(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Observable<any> {
    return from(
      emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        {
          from_name: contactData.name,
          from_email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
          to_email: 'raulpovedano87@gmail.com',
          reply_to: contactData.email
        }
      )
    );
  }
} 