import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe, RecipeStatus } from '../../model/recipe-model';
import { MessageService } from '../../../core/message.service';
import { RecipesService } from '../../services/recipes.service';
import { DialogService } from '../../../core/dialog.service';
import { shallowEquals } from '../../../shared/utils';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mode = 'edit';
  @Input() recipe: Recipe = new Recipe('', '', [], '', RecipeStatus.Active, Date.now());
  @Output() recipeModified = new EventEmitter<Recipe>();
  @Output() recipeCanceled = new EventEmitter<void>();
  title = 'Recipe Details';
  isCanceled = false;

  get isNewRecipe() {
    return !this.recipe || !this.recipe.id;
  }

  form: FormGroup = this.buildForm();

  private statusSubscription: Subscription | undefined;

  formErrors = {
    title: '',
    content: '',
    imageUrl: ''
  };

  validationMessages = {
    title: {
      required: 'Recipe name is required.',
      minlength: 'Recipe name must be at least 5 characters long.',
      maxlength: 'Recipe name cannot be more than 60 characters long.'
    },
    content: {
      minlength: 'Description must be at least 5 characters long.',
      maxlength: 'Description cannot be more than 2048 characters long.'
    },
    imageUrl: {
      pattern: 'Image URL should be valid (ex. http://example.com/image/path.jpeg).'
    }
  };

  constructor(private fb: FormBuilder, private recipesService: RecipesService, private messageService: MessageService,
              private dialogService: DialogService) { }

  ngOnInit() {
      
  }

  ngOnChanges(changes: SimpleChanges): void {
    const recipeChange = changes['recipe'];
    if (recipeChange && recipeChange.currentValue !== recipeChange.previousValue) {
      this.reset();
    }
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  buildForm() {
    return this.fb.group({
      id: {value: this.recipe.id, disabled: true},
      title: [this.recipe.title,
        [Validators.required, Validators.minLength(5), Validators.maxLength(60)]
      ],
      content: [this.recipe.content,
        [Validators.required, Validators.minLength(5), Validators.maxLength(2048)]
      ],
      imageUrl: [this.recipe.imageUrl,
        [
          Validators.pattern(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i)
        ]
      ],
      tags: [this.recipe.tags],
      stauts: {value: this.recipe.status},
      publishDate: {value: this.recipe.publishDate}
    });
    this.statusSubscription = this.form.statusChanges.subscribe(() => this.onStatusChanged());
  }

  submitRecipe() {
    this.recipe = this.form.getRawValue();
    const submittedRecipe =  this.form.getRawValue();
    if(submittedRecipe.id === 0) {
      submittedRecipe.id = undefined;
    }
    if(submittedRecipe.tags != '') {
      submittedRecipe.tags = submittedRecipe.tags?.split(',');
    }
    this.recipeModified.emit(submittedRecipe);
    this.reset();
  }

  reset() {
    if ( this.form && this.recipe) {
      this.form.reset(this.recipe);
    }
  }
  cancelRecipe() {
    this.recipeCanceled.emit();
    this.isCanceled = true;
    // this.router.navigate([PRODUCTS_ROUTE]);
  }

  public canDeactivate(): Observable<boolean> | boolean {
    // Allow navigation if no user or the user data is not changed
    // tslint:disable-next-line:prefer-const
    let rawFormRecipe = this.form?.getRawValue() as Recipe;
    // delete rawFormRecipe.id;
    const {id, ...prod_without_id} = this.recipe;
    if (this.isCanceled || shallowEquals(prod_without_id, rawFormRecipe)) {
      return true;
    }
    // Otherwise ask the user to confirm loosing changes using the dialog service
    return this.dialogService.confirm('Discard changes?');
  }

  protected onStatusChanged() {
    if (!this.form) { return; }
    const form = this.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      // this.formErrors[field] = '';
      const control = form.get(field);

      if (control && (control.dirty || control.touched) && control.invalid) {
        // const messages = this.validationMessages[field];
        for (const key in control.errors) {
          // this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}
