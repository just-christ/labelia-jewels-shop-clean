const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://labelia-backend.onrender.com/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Products
  async getProducts() {
    return this.request('/products');
  }

  async getProductById(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(product: any, token: string) {
    return this.request('/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: any, token: string) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string, token: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Orders (Cash on Delivery)
  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(token: string) {
    return this.request('/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateOrderStatus(id: string, status: string, token: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  }

  async deleteOrder(id: string, token: string) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async deletePromotion(id: string, token: string) {
    return this.request(`/promotions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updatePromotion(id: string, promotion: any, token: string) {
    return this.request(`/promotions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(promotion),
    });
  }

  async createPromotion(promotion: any, token: string) {
    return this.request('/promotions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(promotion),
    });
  }

  async getPromotions(token: string) {
    return this.request('/promotions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async validatePromoCode(code: string) {
    return this.request('/promotions/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Customers
  async getCustomers(token: string) {
    return this.request('/customers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
