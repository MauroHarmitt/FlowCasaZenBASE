interface Purchase {
  id: string;
  packId: string;
  studentId: string;
  teacherId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  purchaseDate: Date;
  packTitle: string;
  teacherName: string;
}

const PURCHASES_STORAGE_KEY = 'flowcasa_zen_purchases';

const getPurchases = (): Purchase[] => {
  const purchasesJson = localStorage.getItem(PURCHASES_STORAGE_KEY);
  return purchasesJson ? JSON.parse(purchasesJson) : [];
};

const savePurchases = (purchases: Purchase[]) => {
  localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
};

export const createPurchase = (purchaseData: Omit<Purchase, 'id' | 'purchaseDate'>): Purchase => {
  const purchases = getPurchases();
  const newPurchase: Purchase = {
    ...purchaseData,
    id: `purchase_${Date.now()}`,
    purchaseDate: new Date(),
  };
  purchases.push(newPurchase);
  savePurchases(purchases);
  return newPurchase;
};

export const getPurchasesByStudent = (studentId: string): Purchase[] => {
  const purchases = getPurchases();
  return purchases.filter(purchase => purchase.studentId === studentId);
};

export const getPurchasesByTeacher = (teacherId: string): Purchase[] => {
  const purchases = getPurchases();
  return purchases.filter(purchase => purchase.teacherId === teacherId);
};

export const getPurchaseById = (purchaseId: string): Purchase | undefined => {
  const purchases = getPurchases();
  return purchases.find(purchase => purchase.id === purchaseId);
};

export const updatePurchaseStatus = (purchaseId: string, status: Purchase['status'], transactionId?: string): Purchase | null => {
  const purchases = getPurchases();
  const index = purchases.findIndex(p => p.id === purchaseId);
  if (index !== -1) {
    purchases[index].status = status;
    if (transactionId) {
      purchases[index].transactionId = transactionId;
    }
    savePurchases(purchases);
    return purchases[index];
  }
  return null;
};

export const getTotalSalesByTeacher = (teacherId: string): number => {
  const purchases = getPurchasesByTeacher(teacherId);
  return purchases
    .filter(purchase => purchase.status === 'completed')
    .reduce((total, purchase) => total + purchase.amount, 0);
};

export const getTotalPurchasesByStudent = (studentId: string): number => {
  const purchases = getPurchasesByStudent(studentId);
  return purchases
    .filter(purchase => purchase.status === 'completed')
    .reduce((total, purchase) => total + purchase.amount, 0);
};

export const getRecentPurchases = (limit: number = 10): Purchase[] => {
  const purchases = getPurchases();
  return purchases
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, limit);
};

export const getPurchaseStats = () => {
  const purchases = getPurchases();
  const completedPurchases = purchases.filter(p => p.status === 'completed');
  
  return {
    totalPurchases: purchases.length,
    completedPurchases: completedPurchases.length,
    totalRevenue: completedPurchases.reduce((total, p) => total + p.amount, 0),
    pendingPurchases: purchases.filter(p => p.status === 'pending').length,
    failedPurchases: purchases.filter(p => p.status === 'failed').length,
  };
};
