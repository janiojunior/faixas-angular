import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Municipio } from '../models/municipio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  private baseUrl = 'http://localhost:8080/municipios';

  constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Municipio[]> {
    return this.httpClient.get<Municipio[]>(this.baseUrl); 
  }

  findById(id: string): Observable<Municipio> {
    return this.httpClient.get<Municipio>(`${this.baseUrl}/${id}`); 
  }

  insert(municipio: Municipio): Observable<Municipio> {
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    }
    return this.httpClient.post<Municipio>(this.baseUrl, data);
  }

  update(municipio: Municipio): Observable<Municipio> {
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    }
    return this.httpClient.put<any>(`${this.baseUrl}/${municipio.id}`, data); 
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`); 
  }
}
