import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

// Features:
// - Offline-first expense splitter (Angular 18, mobile-friendly)
// - Create groups, add members, log expenses (amount, desc, date, payer, split)
// - Auto-calculates balances ("who owes whom")
// - IndexedDB for local storage (fallback: localStorage)
// - Soft color palette, rounded corners, polished UI

interface Member {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  payerId: string;
  splitWithIds: string[];
}

interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
}

@Component({
  selector: 'app-splitify',
  template: `
    <div class="splitify-container">
      <!-- Navigation -->
      <nav class="nav-bar">
        <button *ngFor="let g of groups; let i = index"
          [class.active]="selectedGroupIndex === i"
          (click)="selectGroup(i)">
          {{ g.name }}
        </button>
        <button class="add-btn" (click)="showAddGroup = true">＋</button>
      </nav>

      <!-- Add Group Modal -->
      <div *ngIf="showAddGroup" class="modal">
        <div class="modal-content">
          <h3>Add Group</h3>
          <input type="text" [(ngModel)]="newGroupName" maxlength="24" placeholder="Group Name"/>
          <div class="modal-actions">
            <button (click)="addGroup()">Add</button>
            <button (click)="showAddGroup = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="groups.length > 0; else noGroups">
        <div class="group-header">
          <h2>{{ currentGroup?.name }}</h2>
          <button class="summary-btn" (click)="showSummary = !showSummary">
            {{ showSummary ? 'Expenses' : 'Summary' }}
          </button>
        </div>

        <!-- Members Management -->
        <section class="members-section" *ngIf="!showSummary">
          <h4>Members</h4>
          <div class="members-list">
            <span *ngFor="let m of currentGroup?.members">{{ m.name }}</span>
            <button class="add-btn" (click)="showAddMember = true">＋</button>
          </div>
        </section>
        <div *ngIf="showAddMember" class="modal">
          <div class="modal-content">
            <h3>Add Member</h3>
            <input type="text" [(ngModel)]="newMemberName" maxlength="18" placeholder="Name"/>
            <div class="modal-actions">
              <button (click)="addMember()">Add</button>
              <button (click)="showAddMember = false">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Expenses List & Add Expense -->
        <section *ngIf="!showSummary" class="expenses-section">
          <h4>Expenses</h4>
          <ul>
            <li *ngFor="let exp of currentGroup?.expenses">
              <div class="expense-row">
                <span class="desc">{{ exp.description }}</span>
                <span class="amt">\${{ exp.amount.toFixed(2) }}</span>
                <span class="meta">
                  by {{ getMemberName(exp.payerId) }},
                  split: {{ exp.splitWithIds.map(getMemberName).join(', ') }}
                </span>
              </div>
            </li>
          </ul>
          <button class="add-btn wide" (click)="showAddExpense = true">＋ Add Expense</button>
        </section>
        <div *ngIf="showAddExpense" class="modal">
          <div class="modal-content">
            <h3>Add Expense</h3>
            <input type="text" [(ngModel)]="newExpenseDesc" maxlength="32" placeholder="Description"/>
            <input type="number" [(ngModel)]="newExpenseAmt" min="0.01" step="0.01" placeholder="Amount"/>
            <input type="date" [(ngModel)]="newExpenseDate"/>
            <label>Payer:
              <select [(ngModel)]="newExpensePayerId">
                <option *ngFor="let m of currentGroup?.members" [value]="m.id">{{ m.name }}</option>
              </select>
            </label>
            <label>Split with:</label>
            <div class="split-with-list">
              <label *ngFor="let m of currentGroup?.members">
                <input type="checkbox" [value]="m.id"
                  [(ngModel)]="memberChecked[m.id]"/> {{ m.name }}
              </label>
            </div>
            <div class="modal-actions">
              <button (click)="addExpense()">Add</button>
              <button (click)="showAddExpense = false">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Summary Screen -->
        <section *ngIf="showSummary" class="summary-section">
          <h4>Summary</h4>
          <div class="totals">
            <div *ngFor="let m of currentGroup?.members">
              {{ m.name }}: <b>\${{ getTotalSpent(m.id) | number:'1.2-2' }}</b>
              (Net: <span [class.positive]="getNetBalance(m.id) >= 0"
                          [class.negative]="getNetBalance(m.id) < 0">
                \${{ getNetBalance(m.id) | number:'1.2-2' }}
              </span>)
            </div>
          </div>
          <div class="balances">
            <h5>Who owes whom:</h5>
            <div *ngFor="let row of getOweRows()">
              {{ row.from }} owes {{ row.to }}: <b>\${{ row.amount | number:'1.2-2' }}</b>
            </div>
            <div *ngIf="getOweRows().length === 0">All settled up!</div>
          </div>
        </section>
      </div>

      <ng-template #noGroups>
        <div class="empty-state">
          <p>No groups yet. Tap "+" to create your first group!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .splitify-container { max-width: 420px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif; background: #f8fafc; border-radius: 22px; box-shadow: 0 2px 12px #0001; min-height: 95vh; padding-bottom: 16px; }
    .nav-bar { display: flex; gap: 6px; background: #e3eaf7; border-radius: 22px 22px 0 0; padding: 6px 10px; position: sticky; top: 0; z-index: 2; }
    .nav-bar button { flex: 1 1 auto; background: none; border: none; padding: 9px 0; border-radius: 15px; color: #476088; font-weight: 500; font-size: 1rem; transition: background 0.2s; }
    .nav-bar button.active, .nav-bar button:hover { background: #dbeafe; }
    .nav-bar .add-btn { flex: none; width: 34px; background: #c7d7f4; color: #335; font-size: 1.25em; }
    .group-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 14px 0 14px; }
    .group-header h2 { font-size: 1.35em; color: #3a4666; margin: 0; }
    .summary-btn { background: #e0e7ef; border: none; border-radius: 12px; padding: 6px 16px; color: #3a4666; font-weight: 500; }
    .members-section, .expenses-section, .summary-section { margin: 12px 14px; background: #fff; border-radius: 14px; box-shadow: 0 2px 8px #0001; padding: 12px 12px 10px 12px; }
    .members-list { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .members-list span { background: #e8eefa; border-radius: 10px; padding: 3px 10px; font-size: 0.97em; color: #5a6788; }
    .members-list .add-btn { background: #c7d7f4; color: #335; font-size: 1.1em; border: none; border-radius: 50%; width: 28px; height: 28px; }
    .expenses-section ul { list-style: none; padding: 0; margin: 0; }
    .expense-row { display: flex; flex-direction: column; gap: 2px; padding: 7px 0; border-bottom: 1px solid #eef2fa; }
    .expense-row .desc { font-weight: 500; color: #42537a; }
    .expense-row .amt { color: #6180bd; font-weight: 600; }
    .expense-row .meta { font-size: 0.93em; color: #8ca0c4; }
    .expenses-section .add-btn.wide { width: 100%; margin-top: 10px; background: #c7d7f4; color: #335; border-radius: 10px; }
    .summary-section .totals { margin-bottom: 12px; }
    .summary-section .totals div { margin-bottom: 3px; }
    .summary-section .positive { color: #23a36a; font-weight: 500; }
    .summary-section .negative { color: #e55c61; font-weight: 500; }
    .summary-section .balances { background: #f5f8fd; border-radius: 10px; padding: 8px; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #002a3a30; display: flex; align-items: center; justify-content: center; z-index: 10; }
    .modal-content { background: #fff; border-radius: 13px; padding: 20px 18px; box-shadow: 0 2px 14px #0002; min-width: 260px; }
    .modal-content input, .modal-content select { display: block; width: 98%; margin: 7px 0 11px 0; padding: 7px 8px; border-radius: 7px; border: 1px solid #dde3ee; background: #f8fbff; }
    .modal-content label { font-size: 0.99em; color: #345; }
    .split-with-list { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 8px; }
    .split-with-list label { background: #eef3fa; border-radius: 7px; padding: 3px 7px; }
    .modal-actions { text-align: right; }
    .modal-actions button { margin-left: 7px; border-radius: 8px; border: none; background: #c7d7f4; color: #335; padding: 6px 17px; font-weight: 500; }
    .empty-state { text-align: center; color: #789; margin-top: 60px; }
    @media (max-width: 500px) {
      .splitify-container { border-radius: 0; min-height: 100vh; }
    }
  `]
})
export class SplitifyComponent extends CommonExternalComponent {
  groups: Group[] = [];
  selectedGroupIndex: number = 0;

  // Modal state
  showAddGroup: boolean = false;
  newGroupName: string = '';

  showAddMember: boolean = false;
  newMemberName: string = '';

  showAddExpense: boolean = false;
  newExpenseDesc: string = '';
  newExpenseAmt: number = 0;
  newExpenseDate: string = '';
  newExpensePayerId: string = '';
  memberChecked: Record<string, boolean> = {};

  showSummary: boolean = false;

  constructor() {
    super();
    this.loadData();
  }

  get currentGroup(): Group | undefined {
    return this.groups[this.selectedGroupIndex];
  }

  // --- GROUPS ---
  selectGroup(idx: number): void {
    this.selectedGroupIndex = idx;
    this.showSummary = false;
    this.resetExpenseModal();
  }

  addGroup(): void {
    const name = this.newGroupName.trim();
    if (!name) return;
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      members: [],
      expenses: []
    };
    this.groups.push(newGroup);
    this.selectedGroupIndex = this.groups.length - 1;
    this.showAddGroup = false;
    this.newGroupName = '';
    this.saveData();
  }

  // --- MEMBERS ---
  addMember(): void {
    const name = this.newMemberName.trim();
    if (!name || !this.currentGroup) return;
    const member: Member = { id: crypto.randomUUID(), name };
    this.currentGroup.members.push(member);
    this.showAddMember = false;
    this.newMemberName = '';
    this.saveData();
  }

  // --- EXPENSES ---
  resetExpenseModal(): void {
    this.newExpenseDesc = '';
    this.newExpenseAmt = 0;
    this.newExpenseDate = '';
    this.newExpensePayerId = this.currentGroup?.members[0]?.id ?? '';
    this.memberChecked = {};
    (this.currentGroup?.members || []).forEach(m => this.memberChecked[m.id] = false);
  }

  addExpense(): void {
    if (!this.currentGroup) return;
    const desc = this.newExpenseDesc.trim();
    const amt = Number(this.newExpenseAmt);
    const date = this.newExpenseDate || new Date().toISOString().slice(0,10);
    const payerId = this.newExpensePayerId;
    const splitWithIds = Object.entries(this.memberChecked)
      .filter(([_, checked]) => checked).map(([id]) => id);

    if (!desc || amt <= 0 || !payerId || splitWithIds.length === 0) return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      description: desc,
      amount: amt,
      date,
      payerId,
      splitWithIds
    };
    this.currentGroup.expenses.push(expense);
    this.showAddExpense = false;
    this.resetExpenseModal();
    this.saveData();
  }

  getMemberName = (id: string): string => {
    return this.currentGroup?.members.find(m => m.id === id)?.name ?? 'Unknown';
  };

  // --- SUMMARY CALCULATIONS ---
  getTotalSpent(memberId: string): number {
    return (this.currentGroup?.expenses ?? [])
      .filter(e => e.payerId === memberId)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  getNetBalance(memberId: string): number {
    let net = 0;
    for (const e of this.currentGroup?.expenses ?? []) {
      const share = e.amount / e.splitWithIds.length;
      if (e.payerId === memberId) {
        net += e.amount - (e.splitWithIds.includes(memberId) ? share : 0);
      }
      if (e.splitWithIds.includes(memberId) && e.payerId !== memberId) {
        net -= share;
      }
    }
    return Math.round(net * 100) / 100;
  }

  getOweRows(): Array<{from: string, to: string, amount: number}> {
    if (!this.currentGroup) return [];
    const members = this.currentGroup.members;
    const balances: {[id: string]: number} = {};
    members.forEach(m => balances[m.id] = this.getNetBalance(m.id));

    const debtors = members.filter(m => balances[m.id] < -0.01)
      .map(m => ({ id: m.id, bal: balances[m.id] }));
    const creditors = members.filter(m => balances[m.id] > 0.01)
      .map(m => ({ id: m.id, bal: balances[m.id] }));

    const results: Array<{from: string, to: string, amount: number}> = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i], creditor = creditors[j];
      const amt = Math.min(-debtor.bal, creditor.bal);
      if (amt < 0.01) break;
      results.push({
        from: this.getMemberName(debtor.id),
        to: this.getMemberName(creditor.id),
        amount: Math.round(amt * 100) / 100
      });
      debtors[i].bal += amt;
      creditors[j].bal -= amt;
      if (Math.abs(debtors[i].bal) < 0.01) i++;
      if (Math.abs(creditors[j].bal) < 0.01) j++;
    }
    return results;
  }

  // --- LOCAL STORAGE (IndexedDB wrapper, fixed) ---
  async loadData(): Promise<void> {
    try {
      const db = await this.openDb();
      const tx = db.transaction('splitify', 'readonly');
      const store = tx.objectStore('splitify');
      const req = store.get('groups');
      req.onsuccess = () => {
        if (req.result && req.result.value) {
          this.groups = req.result.value;
        } else {
          this.groups = [];
        }
        db.close();
        if (this.groups.length && this.selectedGroupIndex >= this.groups.length) {
          this.selectedGroupIndex = 0;
        }
      };
      req.onerror = () => {
        this.loadFromLocalStorage();
        db.close();
      };
    } catch {
      this.loadFromLocalStorage();
    }
  }

  async saveData(): Promise<void> {
    try {
      const db = await this.openDb();
      const tx = db.transaction('splitify', 'readwrite');
      tx.objectStore('splitify').put({ key: 'groups', value: this.groups });
      tx.oncomplete = () => db.close();
    } catch {
      this.saveToLocalStorage();
    }
  }

  private openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('splitify-db', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('splitify')) {
          db.createObjectStore('splitify', { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private loadFromLocalStorage(): void {
    const raw = localStorage.getItem('splitify-groups');
    this.groups = raw ? JSON.parse(raw) : [];
    if (this.groups.length && this.selectedGroupIndex >= this.groups.length) {
      this.selectedGroupIndex = 0;
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('splitify-groups', JSON.stringify(this.groups));
  }
}