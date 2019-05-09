import {StylingType} from './styling.type';

export class StyleDTO {
  constructor(public command: StylingType,
              public parameters?: any[]) {
  }
}
