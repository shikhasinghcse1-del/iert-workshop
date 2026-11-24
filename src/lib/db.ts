import fs from "fs";
import path from "path";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  credits: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_email: string;
  item: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_private: boolean;
}

export interface Comment {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export interface Coupon {
  code: string;
  discount_credits: number;
  max_uses: number;
  used_count: number;
  redeemed_by: string[];
}

export interface DbSchema {
  users: User[];
  orders: Order[];
  notes: Note[];
  comments: Comment[];
  coupons: Coupon[];
  sessions: { token: string; user_id: string; created_at: number }[];
}

const DB_FILE_PATH = path.join(process.cwd(), "data", "local-db.json");

function getDefaultData(): DbSchema {
  return {
    users: [
      {
        id: "user-a-1111",
        email: "usera@example.com",
        password: "Password123!",
        name: "User A",
        role: "user",
        credits: 0,
      },
      {
        id: "user-b-2222",
        email: "userb@example.com",
        password: "Password123!",
        name: "User B",
        role: "user",
        credits: 0,
      },
      {
        id: "admin-3333",
        email: "admin@example.com",
        password: "Admin123!",
        name: "Admin User",
        role: "admin",
        credits: 1000,
      },
    ],
    orders: [
      {
        id: "ORD-101",
        user_id: "user-a-1111",
        user_email: "usera@example.com",
        item: "FlowVault Pro Starter Kit",
        amount: 49.99,
        status: "delivered",
        created_at: "2026-01-10T14:22:00Z",
      },
      {
        id: "ORD-102",
        user_id: "user-a-1111",
        user_email: "usera@example.com",
        item: "Enterprise Vector Indexer",
        amount: 199.0,
        status: "processing",
        created_at: "2026-01-15T09:15:00Z",
      },
      {
        id: "ORD-201",
        user_id: "user-b-2222",
        user_email: "userb@example.com",
        item: "Automated Payroll Engine",
        amount: 850.0,
        status: "completed",
        created_at: "2026-01-12T11:45:00Z",
      },
      {
        id: "ORD-202",
        user_id: "user-b-2222",
        user_email: "userb@example.com",
        item: "Confidential B2B License",
        amount: 1200.0,
        status: "active",
        created_at: "2026-01-18T16:30:00Z",
      },
    ],
    notes: [
      {
        id: "note-1",
        user_id: "user-a-1111",
        title: "Project Roadmap",
        content: "User A project roadmap",
        is_private: true,
      },
      {
        id: "note-2",
        user_id: "user-b-2222",
        title: "Payout Secret",
        content: "CONFIDENTIAL: User B payout secret PIN 9482",
        is_private: true,
      },
    ],
    comments: [
      {
        id: "comm-1",
        author_name: "FlowVault Team",
        body: "Welcome to FlowVault community discussion. Leave your feedback below!",
        created_at: "2026-01-01T10:00:00.000Z",
      },
    ],
    coupons: [
      {
        code: "PRO50",
        discount_credits: 500,
        max_uses: 1,
        used_count: 0,
        redeemed_by: [],
      },
    ],
    sessions: [],
  };
}

// In-memory cache synced to disk
let inMemoryData: DbSchema | null = null;

function loadData(): DbSchema {
  if (inMemoryData) {
    return inMemoryData;
  }
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      inMemoryData = JSON.parse(raw);
      return inMemoryData!;
    }
  } catch {
    // fallback to default
  }
  inMemoryData = getDefaultData();
  saveData(inMemoryData);
  return inMemoryData;
}

function saveData(data: DbSchema): void {
  inMemoryData = data;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export const db = {
  reset(): void {
    const fresh = getDefaultData();
    saveData(fresh);
  },

  getUserByEmail(email: string): User | undefined {
    const data = loadData();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserById(id: string): User | undefined {
    const data = loadData();
    return data.users.find((u) => u.id === id);
  },

  getAllUsers(): User[] {
    const data = loadData();
    return data.users;
  },

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const data = loadData();
    const idx = data.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    data.users[idx] = { ...data.users[idx], ...updates };
    saveData(data);
    return data.users[idx];
  },

  createSession(userId: string): string {
    const data = loadData();
    const token = "fv_sess_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    data.sessions.push({
      token,
      user_id: userId,
      created_at: Date.now(),
    });
    saveData(data);
    return token;
  },

  getUserBySession(token: string): User | undefined {
    if (!token) return undefined;
    const data = loadData();
    const session = data.sessions.find((s) => s.token === token);
    if (!session) return undefined;
    return data.users.find((u) => u.id === session.user_id);
  },

  getOrderById(id: string): Order | undefined {
    const data = loadData();
    return data.orders.find((o) => o.id === id);
  },

  getOrdersByUserId(userId: string): Order[] {
    const data = loadData();
    return data.orders.filter((o) => o.user_id === userId);
  },

  getAllOrders(): Order[] {
    const data = loadData();
    return data.orders;
  },

  getNotesByUserId(userId: string): Note[] {
    const data = loadData();
    return data.notes.filter((n) => n.user_id === userId);
  },

  getAllNotes(): Note[] {
    const data = loadData();
    return data.notes;
  },

  getComments(): Comment[] {
    const data = loadData();
    return data.comments;
  },

  addComment(authorName: string, body: string): Comment {
    const data = loadData();
    const newComment: Comment = {
      id: "comm-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      author_name: authorName,
      body,
      created_at: new Date().toISOString(),
    };
    data.comments.push(newComment);
    saveData(data);
    return newComment;
  },

  getCoupon(code: string): Coupon | undefined {
    const data = loadData();
    return data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  },

  // Non-atomic increment for asynchronous demonstration
  redeemCoupon(userId: string, code: string, discountCredits: number): { success: boolean; credits: number; coupon: Coupon } {
    const data = loadData();
    const coupon = data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    const user = data.users.find((u) => u.id === userId);
    if (!coupon || !user) {
      throw new Error("Invalid coupon or user");
    }

    coupon.used_count += 1;
    coupon.redeemed_by.push(userId);
    user.credits += discountCredits;

    saveData(data);
    return { success: true, credits: user.credits, coupon };
  },
};
