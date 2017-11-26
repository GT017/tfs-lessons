import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Purchase} from '../../model/purchase';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

const digitRegex = /^\d*\.?\d+$/;

@Component({
  selector: 'tfs-purchase-preview',
  templateUrl: './purchase-preview.component.html',
  styleUrls: ['./purchase-preview.component.css']
})
export class PurchasePreviewComponent implements OnInit, OnChanges {
  @Input() purchase: Purchase;
  @Input() isOpen: boolean;
  @Output() previewClick = new EventEmitter();
  @Output() previewDelete = new EventEmitter();
  @Output() edit = new EventEmitter<Purchase>();
  isEdit = false;
  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder ) {}

  getErrors(errors: any): string {
    if (errors['required']) {
      return 'поле обязательно для заполнения';
    }

    if (errors['min']) {
      return `минимальное значение ${errors['min']['min']}`;
    }

    if (errors['max']) {
      return `максимальное значение ${errors['max']['max']}`;
    }

    if (errors['minlength']) {
      return `минимальная длина — ${errors['minlength']['requiredLength']}`;
    }

    if (errors['maxlength']) {
      return `максимальная длина — ${errors['maxlength']['requiredLength']}`;
    }

    if (errors['pattern'] && errors['pattern']['requiredPattern'] === digitRegex.toString()) {
      return `разрешены лишь цифры`;
    }
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      price: ['', [Validators.required, Validators.min(10), Validators.max(1000000), Validators.pattern(digitRegex)]],
      date: [''],
      comment: ['']
    });
  }

  ngOnChanges({isOpen}: SimpleChanges) {
    this.isOpen = isOpen.currentValue;

    if (!this.isOpen && this.isEdit) {
      this.toggleEdit();
    }
  }

  onClick() {
    this.previewClick.emit();
  }

  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();

    this.previewDelete.emit();
  }

  onEditPurchase(purch: Purchase) {
    if (!purch) {
      const price = parseFloat(this.editForm.value.price);

      if (!isFinite(price) || this.editForm.invalid) {
        return;
      }

      const date = this.editForm.value.date
        ? new Date(this.editForm.value.date)
        : new Date();

      const newPurchase: Purchase = {
        title: this.editForm.value.title,
        price: Math.floor(price * 100) / 100,
        date: date.toISOString()
      };

      if (this.editForm.value.comment) {
        newPurchase.comment = this.editForm.value.comment;
      }

      if (this.editForm.value.id) {
        newPurchase.id = this.editForm.value.id;
      }
      this.edit.emit(newPurchase);
    } else {
      const newPurchase = Object.assign({}, purch, {id: this.purchase.id});
      this.edit.emit(newPurchase);
    }
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  onEditClick() {
    this.toggleEdit();
  }
}
