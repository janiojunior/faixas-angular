import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Faixa } from '../../../models/faixa.model';
import { FaixaService } from '../../../services/faixa.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-faixa-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule],
  templateUrl: './faixa-form.component.html',
  styleUrl: './faixa-form.component.css'
})
export class FaixaFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private faixaService: FaixaService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const faixa: Faixa = this.activatedRoute.snapshot.data['faixa'];

    this.formGroup = this.formBuilder.group({
      id: [(faixa && faixa.id) ? faixa.id : null],
      nome: [(faixa && faixa.nome) ? faixa.nome : null],
      descricao: [(faixa && faixa.descricao) ? faixa.descricao : null]
    })

  }

  tratarErros(errorResponse: HttpErrorResponse) {

    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);

          if (formControl) {
            formControl.setErrors({apiError: validationError.message})
          }

        });
      }
    } else if (errorResponse.status < 400){
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }

  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const faixa = this.formGroup.value;

      // selecionando a operacao (insert ou update)
      const operacao = faixa.id == null
      ? this.faixaService.insert(faixa)
      : this.faixaService.update(faixa);

      // executando a operacao
      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/faixas'),
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const faixa = this.formGroup.value;
      if (faixa.id != null) {
        this.faixaService.delete(faixa).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/faixas');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'invalid field';
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve conter ao menos 2 letras.',
      maxlength: 'O nome deve conter no máximo 10 letras.',
      apiError: ' '
    },

    descricao: {
      required: 'A descricao deve ser informada.',
      minlength: 'O nome deve conter 2 letras.',
      maxlength: 'O nome deve conter 2 letras.',
      apiError: ' '
    }
  }

}
