// API service for centralized data fetching

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Price {
  id: string;
  currency: string;
  unit_amount: number;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  prices: Price[];
}

export interface CartItem {
  id: string;
  title: string;
  priceId: string;
  currency: string;
  unit_amount: number;
  quantity: number;
  image?: string | null;
}

export interface CheckoutResponse {
  url: string;
}

export interface SearchResponse {
  products: Product[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

export interface AuthResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  error?: string;
}

// Generic API client with error handling
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Products API
  async getProducts(): Promise<Product[]> {
    const response = await this.request<ProductsResponse>("/api/products/get", {
      cache: "no-store",
    });
    return response.products;
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await this.request<ProductResponse>(
        `/api/products/${id}`,
        {
          cache: "no-store",
        }
      );
      return response.product;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return null;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) {
      return [];
    }

    const response = await this.request<SearchResponse>(
      `/api/products/search?q=${encodeURIComponent(query)}`
    );
    return response.products;
  }

  // Checkout API
  async createCheckoutSession(cart: CartItem[]): Promise<CheckoutResponse> {
    return this.request<CheckoutResponse>("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ cart }),
    });
  }

  // Auth API
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Product upload API
  async uploadProduct(formData: FormData): Promise<UploadResponse> {
    const url = `${API_BASE_URL}/api/products/add`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Product upload failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
