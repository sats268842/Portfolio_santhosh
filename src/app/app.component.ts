import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements OnInit {

  isReady = false;
  isShown:boolean = true;
  public loading: boolean;

  imageUrl = "http://santhoshthomas.xyz/assets/images/profilepic.jpg";
  site = "http://santhoshthomas.xyz/";
  author = "Santhosh Thomas"
  description = "A design-minded front-end software engineer focused on building beautiful interfaces & experiences. I' m currently pursuing Computer Science and Engineering from APJ Abdul Kalam Technological University. As a software engineer, I enjoy bridging the gap between engineering and design combining my technical knowledge with my keen eye for design to create a beautiful product. My goal is to always build applications that are scalable and efficient under the hood while providing engaging, pixel-perfect user experiences. My goal is to always build applications that are scalable and efficient under the hood while providing engaging, pixel-perfect user experiences.";
  router: any;
  display:boolean;
  ngOnInit() {
    this.myform = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4),]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]]
    });
  }

  myform: FormGroup;
  title = 'Santhosh Thomas Portfolio';

  constructor(private formBuilder: FormBuilder,
              private db: AngularFirestore,
              private http: HttpClient,
              private metaTagService: Meta,
              private _snackBar: MatSnackBar
    ) { setTimeout(() => {
      this.isReady = true;
    }, 500);
      this.metaTagService.addTags([

        // <!-- Primary Meta Tags -->
        { name: 'keywords', content: 'Angular SEO Integration, Angular, Bootstrap, Html, CSS, Portfolio, Developer, Designer, UI, UX, Freelancer, Indian, Kerala, Student, Adoor, santhosh, thomas, graphic design, web design, website builder, adobe, photoshop, illustrator, flutter, app, firebase, html, css, sjcet, palai, santhoshthomas, web, hacker, figma, XD, sketch, UI, UX, Prototype, Freelancer, backend, frontend, webdeveloper, ProductDesinger, Kottayam, AWS, santhosh_thomas, santhoshdeveloper, santhoshsjcet, santhoshadoor, SJCETPALAI, SJCET, ' },
        {name: 'description', content: this.description},
        { name: 'author', content: this.author },
        { name: 'owner', content: this.author },
        { name: 'creator', content: this.author },
        { name: 'Copyright', content: this.author },
        { name: 'title', content: this.author },
        {name: 'robots', content: 'index, follow'},
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'UTF-8' },

        // <!-- Twitter -->
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: this.site },
        { name: 'twitter:title', content: this.author },
        { name: 'twitter:description', content: this.description },
        { name: 'twitter:creator', content: this.author },
        { name: 'twitter:image', content: this.imageUrl },
        { name: ' twitter:description', content: this.description },

         //  <!-- Open Graph / Facebook -->
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: this.site },
        { name: 'og:title', content: this.author },
        { name: 'og:description', content: this.description },
        { name: 'og:image', content: this.imageUrl },

      ]);
  }
  getErrorEmail() {
    return this.myform.get('email').hasError('required') ? 'Field is required' :
      this.myform.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.myform.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  createContactForm(){

  }


  onSubmit() {

    this.loading = true;
    if (this.myform.valid) {
    console.log('Your form data : ', this.myform.value );
    const {name, email, message} = this.myform.value;
    const date = Date();
    const html = `
      <div>From: ${name}</div>
      <div>Email: <a href="mailto:${email}">${email}</a></div>
      <div>Date: ${date}</div>
      <div>Message: ${message}</div>
    `;
    let formRequest = { name, email, message, date, html };
    this.db.collection('message').add(formRequest);
    console.log(email);

    const to = 'https://us-central1-angular-fea89.cloudfunctions.net/sendMail';
    const me = 'https://us-central1-angular-fea89.cloudfunctions.net/sendMailMe';

    const obj = {
      name: name,
      email: email,
      message: message,
    };
    var popmessage;
       this.http.post(to, obj).subscribe(data => {

        console.log(data)}, error => {
           popmessage = "Message Failed Sent";
          this.loading = false;
      });
        this.http.post(me, obj).subscribe(data => {

          console.log(data)}, error => {
           popmessage = "Message Failed Sended";
            this.loading = false;
        });
          this.loading = false;
          popmessage = "Message Successfully Sended";

          var action = "Close";
         this.openSnackBar(popmessage, action);
         this.myform.clearValidators;
         this.myform.updateValueAndValidity;

         this.myform.reset();
      }
}
openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 2000,
  });
}
}
