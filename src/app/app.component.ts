import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatButtonModule } from '@angular/material/button'
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { RecipesModule } from './recipes/recipes.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CoreModule, 
    MatToolbarModule, 
    MatIcon, 
    MatSidenavModule, 
    MatListModule,
    MatButtonModule,
    FlexLayoutModule, 
    CommonModule, 
    RecipesModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cooking Recipes';
  currentView = "latest";

  showView(view: string) {
    this.currentView = view;
  }
}
