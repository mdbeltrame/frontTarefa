import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StringConstants } from '../../static/constants/string.constants';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrl: './modal-confirmacao.component.css',
})
export class ModalConfirmacaoComponent {
  @Input() titulo: string = '';
  @Input() mensagem: string = '';
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  readonly CANCELAR = StringConstants.TITULOS.CANCELAR;
  readonly CONFIRMAR = StringConstants.TITULOS.CONFIRMAR;

  onConfirmar(): void {
    this.confirmar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
