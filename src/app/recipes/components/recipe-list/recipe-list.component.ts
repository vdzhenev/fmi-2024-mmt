import { Component, OnInit, HostBinding } from '@angular/core';
import { Recipe, RecipeStatus } from '../../model/recipe-model';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { slideInDownAnimation } from '../../../shared/animations';
import { MessageService } from '../../../core/message.service';

@Component({
  selector: 'app-recipe-list',
  animations: [slideInDownAnimation],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;

  recipes: Recipe[] = [];
  selectedRecipe: Recipe | undefined;
  currentMode = 'present';
  currentView: string = 'latest';
  messages: string | undefined;
  errors: string | undefined;

  constructor(private service: RecipesService, private messageService: MessageService) { }

  ngOnInit() {
    // this.route.queryParams.subscribe(qparams => {
    //   if (qparams['refresh']) {
    //     this.refresh();
    //   }
    // });
    this.refresh();
  }

  selectRecipe(recipe: Recipe | undefined) {
    this.selectedRecipe = recipe;
    // this.router.navigate([PRODUCTS_ROUTE, this.currentMode, recipe.id]);
  }

  setMode(mode: string) {
    this.selectRecipe(undefined);
    this.currentMode = mode;
  }

  setView(view: string) {
    this.selectRecipe(undefined);
    this.currentView = view;
  }

  onAddRecipe() {
    this.setMode('edit');
    this.selectedRecipe = new Recipe('', '', [], '', RecipeStatus.Active, Date.now());
    // this.router.navigate(['recipes', 'create']);
  }

  onDeleteRecipe(recipe: Recipe) {
    this.service.deleteById(recipe.id)
      .subscribe({
        next: deleted => {
          this.recipes = this.recipes.filter(p => p.id !== deleted.id);
          this.showMessage(`Recipe '${deleted.title}' was successfully deleted.`);
        },
        error: err => this.showError(err)
      });
    this.selectRecipe(undefined);
  }

  onRecipeModified(recipe: Recipe) {
    if (recipe.id) { // edit mode
      this.service.update(recipe).subscribe({
        next: updated => {
          this.recipes = this.recipes.map(p => p.id === updated.id? updated: p)
          this.recipes.sort((a, b)=>b.publishDate-a.publishDate);
          this.showMessage(`Recipe '${updated.title}' updated successfully.`);
        },
        error: err => this.showError(err)
      });
    } else {
      this.service.create(recipe).subscribe({
        next: created => {
          this.recipes = this.recipes.concat(created);
          this.recipes.sort((a, b)=>b.publishDate-a.publishDate);
          this.showMessage(`Recipe '${created.title}' created successfully.`);
        },
        error: err => this.showError(err)
      });
    }
  }

  onRecipeCanceled() {
    this.selectRecipe(undefined);
  }

  private refresh() {
    this.service.findAll()
      .subscribe({
        next: recipes => this.recipes = recipes.sort((a,b)=>b.publishDate-a.publishDate),
        error: err => this.showError(err)
      });
  }

  private showMessage(msg: string) {
    this.messageService.success(msg);
  }

  private showError(err: string) {
    this.messageService.error(err);
  }

}
