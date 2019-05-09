import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-word',
  template: `{{ word }}`,
  styleUrls: ['./word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordComponent {
  @Input() @HostBinding('class.bold') isBold = false;
  @Input() @HostBinding('class.italic') isItalic = false;
  @Input() @HostBinding('class.underline') isUnderline = false;
  @Input() @HostBinding('class.selected') isSelected = false;
  @Input() word = '';

  @Output() onClick = new EventEmitter<boolean>();

  @HostListener('click') handleClick() {
    this.onClick.emit();
  }
}
