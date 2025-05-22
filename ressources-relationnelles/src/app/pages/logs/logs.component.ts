import { Component } from '@angular/core';

@Component({
  selector: 'app-logs-popup',
  template: `
    <button (click)="openSeq()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
      Ouvrir Logs (Seq)
    </button>
  `
})
export class LogsComponent {

openSeq(event: MouseEvent) {
  event.preventDefault(); // empêche la navigation normale

  const width = 600;
  const height = window.innerHeight;
  const left = window.innerWidth - width;
  const top = 0;

  window.open(
    'http://localhost:5341/',
    'seqLogs',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}
}
