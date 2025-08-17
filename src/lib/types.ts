export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: Category;
};

export type CartItem = Omit<Product, 'stock' | 'category'> & {
  quantity: number;
};
