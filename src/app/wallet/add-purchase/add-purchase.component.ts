import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Purchase} from '../../model/purchase';

@Component({
  selector: 'tfs-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {
  form: FormGroup;
  validationErrorMessages = {
    title: {
      required: 'поле обязательно для заполнения',
      minlength: 'минимальная длина — 3',
      maxlength: 'максимальная длина — 80'
    },
    price: {
      required: 'поле обязательно для заполнения',
      pattern: 'разрешены лишь цифры',
      min: 'минимальное значение 10',
      max: 'максимальное значение 1000000'
    }
  };
  @Output() addPurchase = new EventEmitter<Purchase>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      price: ['', [Validators.required, Validators.pattern('[0-9]*[.,]?[0-9]+'), Validators.min(10), Validators.max(1000000)]],
      date: [''],
      comment: ['']
    });
  }

  onSubmit() {
    const price = parseFloat(this.form.value.price);

    if (this.form.invalid) {
      return;
    }

    const purchase: Purchase = {
      title: this.form.value.title,
      price: Math.floor(price * 100) / 100,
      date: this.form.value.date ? new Date(this.form.value.date) : new Date(),
    };

    if (this.form.value.comment) {
      purchase.comment = this.form.value.comment;
    }

    this.addPurchase.emit(purchase);
  }

  getValidationErrorMessage(field) {
    const validationErrors = this.form.get(field).errors;
    const messages = this.validationErrorMessages[field];
    let message = '';

    for (let key in validationErrors) {
      if (validationErrors.hasOwnProperty(key)) {
        message += messages[key] + ' ';
      }
    }

    return message;
  }
}
