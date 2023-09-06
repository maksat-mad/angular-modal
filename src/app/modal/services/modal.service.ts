import { DOCUMENT } from '@angular/common';
import {
  EnvironmentInjector,
  Inject,
  Injectable,
  TemplateRef,
  createComponent,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable()
export class ModalService {
  private modalNotifier?: Subject<string>;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private environmentInjector: EnvironmentInjector
  ) {}

  open(content: TemplateRef<any>, options?: { size?: string; title?: string }) {
    const contentViewRef = content.createEmbeddedView(null);

    const modalComponent = createComponent(ModalComponent, {
      environmentInjector: this.environmentInjector,
      projectableNodes: [contentViewRef.rootNodes]
    });

    modalComponent.instance.size = options?.size;
    modalComponent.instance.title = options?.title;
    modalComponent.instance.closeEvent.subscribe(() => this.closeModal());
    modalComponent.instance.submitEvent.subscribe(() => this.submitModal());

    modalComponent.hostView.detectChanges();

    this.document.body.appendChild(modalComponent.location.nativeElement);

    this.modalNotifier = new Subject();
    return this.modalNotifier?.asObservable();
  }

  closeModal() {
    this.modalNotifier?.complete();
  }

  submitModal() {
    this.modalNotifier?.next('confirm');
    this.closeModal();
  }
}
