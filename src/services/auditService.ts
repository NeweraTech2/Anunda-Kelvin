import { AuditLog } from '../types/index.ts';

let LOCAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'usr-admin-01',
    userName: 'Store Administrator',
    userRole: 'Super Admin',
    action: 'INVENTORY_STOCK_UPDATE',
    entity: 'Product',
    entityId: 'prod-01',
    details: 'Stock for Sony WH-1000XM5 updated to 12 units',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-002',
    userId: 'usr-admin-01',
    userName: 'Store Administrator',
    userRole: 'Super Admin',
    action: 'ORDER_STATUS_CHANGE',
    entity: 'Order',
    entityId: 'ord-84920',
    details: 'Status changed from Processing to Shipped (Tracking: FRG-NBO-84920)',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-003',
    userId: 'usr-admin-01',
    userName: 'Store Administrator',
    userRole: 'Super Admin',
    action: 'COUPON_ACTIVATED',
    entity: 'Promotion',
    entityId: 'coup-01',
    details: 'Coupon NEWERA10 activated for 10% discount',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const auditService = {
  async getLogs(): Promise<AuditLog[]> {
    return LOCAL_AUDIT_LOGS;
  },

  async logAction(
    user: { id: string; fullName: string; role: string },
    action: string,
    entity: string,
    details?: string,
    entityId?: string
  ): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action,
      entity,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    };
    LOCAL_AUDIT_LOGS.unshift(newLog);
    return newLog;
  },
};
