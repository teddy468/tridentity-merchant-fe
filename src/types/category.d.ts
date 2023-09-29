declare interface Category {
  id: number;
  name: string;
  description: string;
  parent_category_id: number | null;
  cover: string;
  image: string;
  attributes: {
    [key: string]: string[];
  };
  product_count: number;
}

declare interface CategoryTree extends Category {
  parent?: CategoryTree;
  children: CategoryTree[];
}

declare interface GetCategoryResponse extends Category {}

declare type GetCategoriesResponse = Category[];

declare interface GetCategoriesError {}

declare interface GetCategoryError {}
