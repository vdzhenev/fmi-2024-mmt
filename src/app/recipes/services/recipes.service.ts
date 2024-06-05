import { Injectable, Inject, inject } from '@angular/core';
import { Recipe } from '../model/recipe-model';
import { Observable } from 'rxjs';
import { IdType } from '../../shared/shared-types';
import { API, ApiClientHttpService, ApiClientService } from '../../core/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(@Inject(API) private backend: ApiClientService) {}

  findAll(): Observable<Recipe[]> {
    return this.backend.findAll(Recipe);
  }
  findById(id: IdType): Observable<Recipe> {
    return this.backend.findById(Recipe, id);
  }
  create(entity: Recipe): Observable<Recipe> {
    return this.backend.create(Recipe, entity);
  }
  update(entity: Recipe): Observable<Recipe> {
    return this.backend.update(Recipe, entity);
  }
  deleteById(id: IdType): Observable<Recipe> {
    return this.backend.deleteById(Recipe, id);
  }

}
