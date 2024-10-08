import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { MunicipioListComponent } from './components/municipio/municipio-list/municipio-list.component';
import { MunicipioFormComponent } from './components/municipio/municipio-form/municipio-form.component';
import { municipioResolver } from './components/municipio/resolver/municipio.resolver';

export const routes: Routes = [
    {path: 'estados',component: EstadoListComponent, title: 'Lista de Estados'},
    {path: 'estados/new',component: EstadoFormComponent, title: 'Novo Estado'},
    {path: 'municipios',component: MunicipioListComponent, title: 'Lista de Municipios'},
    {path: 'municipios/new',component: MunicipioFormComponent, title: 'Novo Municipio'},
    {path: 'municipios/edit/:id',component: MunicipioFormComponent, resolve: {municipio: municipioResolver}}
];
