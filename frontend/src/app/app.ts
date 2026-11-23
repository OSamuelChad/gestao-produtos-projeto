import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from '@openng/optimus-ui/confirmdialog';
import { ToastModule } from '@openng/optimus-ui/toast';
import { Header } from './layout/header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, ToastModule, ConfirmDialogModule],
  template: `
    <app-header />
    <main class="mx-auto w-full max-w-6xl px-4 py-8">
      <router-outlet />
    </main>
    <p-toast position="top-right" />
    <p-confirmdialog />
  `,
})
export class App {}
