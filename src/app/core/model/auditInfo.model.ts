export class AuditInfo {
  createdAt: string;
  lastModified: string;

  constructor() {
    const now = new Date().toISOString();
    this.createdAt = now;
    this.lastModified = now;
  }
    onActivity(): void {
    this.lastModified = new Date().toISOString();
  }
}
