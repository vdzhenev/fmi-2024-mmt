import { IdType } from "../../shared/shared-types";


export enum RecipeStatus{
    Active = 1, Inactive
}

export class RecipeCreateDto {
    constructor(
        public title: string,
        public content: string,
        public tags: string[],
        public imageUrl: string,
        public status: RecipeStatus = RecipeStatus.Active,
        public publishDate: number,
    ) {}
}

export class Recipe extends RecipeCreateDto{
    static className = 'Recipe';
    public id: IdType = 0;
}

export type RecipeFilterType = RecipeStatus | undefined;
