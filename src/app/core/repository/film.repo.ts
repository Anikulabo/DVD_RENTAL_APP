import { Injectable } from "@angular/core";
import { BaseRepository } from "./baseRepository";
import { Film } from "../model/film.model";
@Injectable({
  providedIn: 'root',
})
export class FilmRepository extends BaseRepository<Film> {
  protected idKey = 'filmId';
}
