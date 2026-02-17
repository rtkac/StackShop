export type MutateCartFnInput =
  | {
      action: "add" | "remove" | "update";
      productId: string;
      quantity: number;
    }
  | {
      action: "clear";
      productId?: string;
      quantity?: number;
    };
