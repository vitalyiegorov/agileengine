import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';

import {TextService} from '../text-service/text.service';
import {StyleDTO} from '../style.dto';
import {StylingEnum} from '../styling.enum';
import {WordComponent} from '../word/word.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  public styleSelect = new Subject<StyleDTO>();
  public stylingEnum = StylingEnum;
  public selectedWord$: Observable<WordComponent>;
  public colors = ['black', 'red', 'green'];

  private unsubscribe$ = new Subject();

  constructor(private textService: TextService) {
  }

  ngOnInit(): void {
    this.styleSelect
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(styleCommand => this.textService.setStyle(styleCommand));

    this.selectedWord$ = this.textService.selectedWord$.asObservable();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
