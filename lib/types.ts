export type ApiUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  role?: string;
  tier?: string;
  credits?: number;
  totalSongsGenerated?: number;
};

export type CreditLedgerEntry = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
};

export type Subscription = {
  id: string;
  tier: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  provider?: string;
};
