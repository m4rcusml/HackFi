export type UserRole = "investidor" | "vencedor" | "admin";

export type StoredUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  profile: Record<string, string>;
};

export type SessionUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
};

const USERS_KEY = "hackfi_users";
const SESSION_KEY = "hackfi_session";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getDashboardPath(role: UserRole) {
  if (role === "investidor") return "/investor";
  if (role === "vencedor") return "/winner";
  return "/admin";
}

export function getUsers(): StoredUser[] {
  if (!canUseStorage()) return [];

  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): SessionUser | null {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function registerUser(input: {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  profile: Record<string, string>;
}) {
  const users = getUsers();
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = users.find((user) => user.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { ok: false as const, error: "Ja existe uma conta cadastrada com este email." };
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    role: input.role,
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password,
    createdAt: new Date().toISOString(),
    profile: input.profile,
  };

  users.push(user);
  saveUsers(users);

  const session: SessionUser = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  setSession(session);
  return { ok: true as const, user: session };
}

export function loginUser(input: { email: string; password: string }) {
  const users = getUsers();
  const normalizedEmail = input.email.trim().toLowerCase();

  const user = users.find(
    (entry) =>
      entry.email.toLowerCase() === normalizedEmail && entry.password === input.password,
  );

  if (!user) {
    return { ok: false as const, error: "Email ou senha invalidos." };
  }

  const session: SessionUser = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  setSession(session);
  return { ok: true as const, user: session };
}
