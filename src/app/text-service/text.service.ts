import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {WordComponent} from '../word/word.component';
import {StyleDTO} from '../style.dto';
import {map, withLatestFrom} from 'rxjs/operators';
import {filter} from 'rxjs/internal/operators/filter';
import {StylingEnum} from '../styling.enum';
import {DatamuseDTO} from '../datamuse.dto';

@Injectable({
  providedIn: 'root'
})
export class TextService {
  public selectedWord$ = new Subject<WordComponent>();
  public selectStyle$ = new Subject<StyleDTO>();

  private previousWord: WordComponent;

  constructor(private http: HttpClient) {
    this.selectStyle$.pipe(
      withLatestFrom(this.selectedWord$, (styleCommand, word) => ({styleCommand, word})),
      filter(({word}) => word !== null),
    ).subscribe(({styleCommand, word}) => {
      switch (styleCommand.command) {
        case StylingEnum.BOLD:
          word.isBold = !word.isBold;
          break;
        case StylingEnum.ITALIC:
          word.isItalic = !word.isItalic;
          break;
        case StylingEnum.UNDERLINE:
          word.isUnderline = !word.isUnderline;
          break;
        case StylingEnum.COLOR:
          word.color = styleCommand.parameters[0];
          break;
      }
    });
  }

  getMockText(): Observable<string> {
    return of(`A year ago I was in the audience at a gathering of designers in San Francisco.
        There were four designers on stage, and two of them worked for me. I was there to support them.
        The topic of design responsibility came up, possibly brought up by one of my designers, I honestly don’t remember the details.
        What I do remember is that at some point in the discussion I raised my hand and suggested, to this group of designers,
        that modern design problems were very complex. And we ought to need a license to solve them.
    `);
  }

  selectWord(wordComponent: WordComponent) {
    if (this.previousWord) {
      this.previousWord.isSelected = false;
    }
    wordComponent.isSelected = true;
    this.getSynonyms(wordComponent.word).subscribe(console.log);

    this.selectedWord$.next(wordComponent);
    this.previousWord = wordComponent;
  }

  setStyle(styleCommand: StyleDTO) {
    this.selectStyle$.next(styleCommand);
  }

  getSynonyms(word: string): Observable<string[]> {
    if (word[word.length - 1].toLowerCase() === 's') {
      word = word.slice(0, -1); // API seems not to handle plurals
    }

    return this.http.get<DatamuseDTO[]>(`https://api.datamuse.com/words?rel_syn=${word}`).pipe(
      map(data => data.map(item => item.word))
    );
  }
}
