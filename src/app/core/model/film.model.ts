import { AutoIncrementPrimaryKey } from "../decorators";
import { MpaaRating } from "./Enums/mpaa-rating.enum";
import { AuditInfo } from "./auditInfo.model";
import { InvalidDataTypeException,MissingRequiredFieldException } from "../exceptions";
export class Film extends AuditInfo {
  @AutoIncrementPrimaryKey()
  filmId!: number;

  title: string;
  description?: string;
  releaseYear: number;
  rentalDuration: number;
  rentalRate: number;
  length: number;
  replacementCost: number;
  rating: MpaaRating;

  constructor(
    title: string,
    releaseYear: number,
    rentalDuration: number,
    rentalRate: number,
    length: number,
    replacementCost: number,
    rating: MpaaRating,
    description?: string
  ) {
    super();

    if (!title || typeof title !== 'string') {
      throw new MissingRequiredFieldException('title');
    }
    if (typeof releaseYear !== 'number') {
      throw new InvalidDataTypeException('releaseYear', 'number');
    }
    if (typeof rentalDuration !== 'number') {
      throw new InvalidDataTypeException('rentalDuration', 'number');
    }
    if (typeof rentalRate !== 'number') {
      throw new InvalidDataTypeException('rentalRate', 'number');
    }
    if (typeof length !== 'number') {
      throw new InvalidDataTypeException('length', 'number');
    }
    if (typeof replacementCost !== 'number') {
      throw new InvalidDataTypeException('replacementCost', 'number');
    }
    if (!(rating in MpaaRating)) {
      throw new InvalidDataTypeException('rating', 'MpaaRating enum value');
    }
    if (description !== undefined && typeof description !== 'string') {
      throw new InvalidDataTypeException('description', 'string');
    }

    this.title = title;
    this.description = description;
    this.releaseYear = releaseYear;
    this.rentalDuration = rentalDuration;
    this.rentalRate = rentalRate;
    this.length = length;
    this.replacementCost = replacementCost;
    this.rating = rating;
  }
}