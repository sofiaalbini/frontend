import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import 'zone.js';

type TravelPref = { id: string; text: string; createdAt: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
  <main class="container">
    <h1>Preferenze di viaggio</h1>
    <p class="subtitle">
      Scrivi qui sotto le tue preferenze (destinazioni, budget, periodo, stile di viaggio, interessi…)
    </p>

    <form (ngSubmit)="save()" class="card">
      <label for="prefs">Le tue preferenze</label>
      <textarea id="prefs" [(ngModel)]="model" name="prefs"
        placeholder="Es. Estate in Grecia, budget 800€, preferenza per spiagge tranquille e cibo locale..."
        rows="6"></textarea>

      <div class="actions">
        <button type="submit" [disabled]="!model.trim()">Salva</button>
        <button type="button" class="ghost" (click)="clearInput()" [disabled]="!model.trim()">Pulisci testo</button>
      </div>
    </form>

    <section *ngIf="items.length" class="list">
      <h2>Salvati</h2>
      <ul>
        <li *ngFor="let it of items">
          <div class="item">
            <div>
              <div class="when">{{ it.createdAt }}</div>
              <div class="text">{{ it.text }}</div>
            </div>
            <div class="row-actions">
              <button class="ghost" (click)="load(it)">Carica</button>
              <button class="danger" (click)="remove(it.id)">Elimina</button>
            </div>
          </div>
        </li>
      </ul>
      <div class="footer-actions">
        <button class="danger" (click)="removeAll()">Elimina tutto</button>
      </div>
    </section>

    <section *ngIf="!items.length" class="empty">
      <p>Nessuna preferenza salvata ancora.</p>
    </section>
  </main>
  `,
  styles: [
    `
    :host { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    .container { max-width: 760px; margin: 32px auto; padding: 0 16px; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    .subtitle { color: #555; margin: 0 0 16px; }
    .card { background: #fff; border: 1px solid #e6e6e6; border-radius: 12px; padding: 16px; }
    label { display:block; font-weight: 600; margin-bottom: 8px; }
    textarea { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; resize: vertical; }
    .actions { display:flex; gap: 8px; margin-top: 12px; }
    button { border: 0; border-radius: 8px; padding: 10px 14px; cursor: pointer; background: #1f6feb; color: white; }
    button:disabled{ opacity:.6; cursor:not-allowed; }
    .ghost { background: #f3f4f6; color: #222; }
    .danger { background: #e11d48; color: white; }
    .list { margin-top: 24px; }
    .list h2 { font-size: 20px; margin: 0 0 12px; }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
    .item { border: 1px solid #eee; border-radius: 10px; padding: 12px; display: flex; align-items: start; justify-content: space-between; gap: 12px; }
    .when { font-size: 12px; color: #666; margin-bottom: 6px; }
    .text { white-space: pre-wrap; }
    .row-actions { display: flex; gap: 8px; }
    .footer-actions { margin-top: 12px; }
    .empty { color: #666; margin-top: 16px; }
  `,
  ],
})
class AppComponent {
  model = '';
  items: TravelPref[] = [];

  ngOnInit() {
    this.items = this.loadAll();
  }

  save() {
    const entry: TravelPref = {
      id: crypto.randomUUID(),
      text: this.model.trim(),
      createdAt: new Date().toLocaleString(),
    };
    const all = [entry, ...this.items];
    localStorage.setItem('travel_prefs', JSON.stringify(all));
    this.items = all;
    this.model = '';
  }

  load(item: TravelPref) {
    this.model = item.text;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(id: string) {
    const filtered = this.items.filter((i) => i.id !== id);
    localStorage.setItem('travel_prefs', JSON.stringify(filtered));
    this.items = filtered;
  }

  removeAll() {
    localStorage.removeItem('travel_prefs');
    this.items = [];
  }

  clearInput() {
    this.model = '';
  }

  private loadAll(): TravelPref[] {
    const raw = localStorage.getItem('travel_prefs');
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

bootstrapApplication(AppComponent).catch((err) => console.error(err));
