import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {concatMap, filter, map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {TextService} from '../text-service/text.service';
import {WordComponent} from '../word/word.component';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  private unsubscribe$ = new Subject();

  constructor(private textService: TextService,
              private resolver: ComponentFactoryResolver,
              private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.container.clear();

    const input$ = this.textService.getMockText();

    input$.pipe(
      map(text => text.trim().split(' ')),
      concatMap(words => words),
      filter(word => word && !/\s+/.test(word)),
      map(word => this.createComponent(word.trim())),
      takeUntil(this.unsubscribe$)
    ).subscribe(
      word => word,
      () => '', // TODO: Error handling
      () => this.cdRef.detectChanges()
    );

    this.textService.selectStyle$.subscribe(() => this.cdRef.detectChanges());
  }

  private createComponent(message): WordComponent {
    const factory = this.resolver.resolveComponentFactory(WordComponent);
    const componentRef = this.container.createComponent(factory);
    const wordInstance = componentRef.instance as WordComponent;
    wordInstance.word = message;

    wordInstance.onClick
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.textService.selectWord(wordInstance));

    return wordInstance;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
