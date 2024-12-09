import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-display-two-three-phase-reading',
  standalone: true,
  imports: [TranslateModule, FaIconComponent, TooltipModule],
  templateUrl: './display-two-three-phase-reading.component.html',
  styleUrl: './display-two-three-phase-reading.component.scss',
})
export class DisplayTwoThreePhaseReadingComponent {
  @Input() phaseCount!: number;
  @Input() firstPhaseValue!: number;
  @Input() secondPhaseValue!: number;
  @Input() thirdPhaseValue!: number;
}
