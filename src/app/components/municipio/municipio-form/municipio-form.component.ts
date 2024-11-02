import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { MunicipioService } from '../../../services/municipio.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Municipio } from '../../../models/municipio.model';
import {MatSelectModule} from '@angular/material/select';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-municipio-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, 
    RouterModule, MatSelectModule],
  templateUrl: './municipio-form.component.html',
  styleUrl: './municipio-form.component.css'
})
export class MunicipioFormComponent implements OnInit {
  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor(private formBuilder: FormBuilder,
    private municipioService: MunicipioService,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      estado: [null]
    })
  }

  ngOnInit(): void {
      this.estadoService.findAll().subscribe(data=> {
        this.estados = data;
        this.initializeForm();
      })
  }

  initializeForm(): void {
    const municipio: Municipio = this.activatedRoute.snapshot.data['municipio'];
    
    const estado = this.estados.find(estado => estado.id === (municipio?.estado?.id || null));
    
    this.formGroup = this.formBuilder.group({
      id: [(municipio && municipio.id) ? municipio.id : null],
      nome: [(municipio && municipio.nome) ? municipio.nome : null, 
              Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(10)])],
      estado: [estado]
    })

  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const municipio = this.formGroup.value;
      if (municipio.id ==null) {
        this.municipioService.insert(municipio).subscribe({
          next: (municipioCadastrado) => {
            this.router.navigateByUrl('/admin/municipios');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.municipioService.update(municipio).subscribe({
          next: (municipioAlterado) => {
            this.router.navigateByUrl('/admin/municipios');
          },
          error: (err) => {
            console.log('Erro ao Editar' + JSON.stringify(err));
          }
        });
      }
    } else {
      console.log("Formulário inválido.")
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const municipio = this.formGroup.value;
      if (municipio.id != null) {
        this.municipioService.delete(municipio).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/municipios');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  getErrorMessage(controlName : string, errors: ValidationErrors | null | undefined): string {
    if (!errors){
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]){
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'invalid field';
  }

  errorMessages: {[controlName: string]: {[errorName: string]: string}} = {
    nome : {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve conter ao menos 2 letras.',
      maxlength: 'O nome deve conter no máximo 10 letras.'
    }
  }


}
