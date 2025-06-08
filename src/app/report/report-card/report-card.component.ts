import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReportDTO } from '../../dto/report-dtos';
@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css'
})
export class ReportCardComponent {
  @Input() report!: ReportDTO;

  @Output() suspend = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  suspendUser() {
    this.suspend.emit();
  }

  rejectReport() {
    this.reject.emit();
  }
}
