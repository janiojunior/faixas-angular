import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { MunicipioListComponent } from './components/municipio/municipio-list/municipio-list.component';
import { MunicipioFormComponent } from './components/municipio/municipio-form/municipio-form.component';
import { municipioResolver } from './components/municipio/resolver/municipio.resolver';
import { estadoResolver } from './components/estado/resolver/municipio.resolver';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { FaixaCardListComponent } from './components/faixa/faixa-card-list/faixa-card-list.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { 
        path: '', 
        component: UserTemplateComponent, 
        title: 'e-commerce',
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'ecommerce'},
        
            { path: 'ecommerce', component: FaixaCardListComponent, title: 'Lista de Cards de Faixas'},
            { path: 'login', component: LoginComponent, title: 'Login'},
        ]
    },    
    { 
        path: 'admin', 
        component: AdminTemplateComponent, 
        title: 'Administração',
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'estados'},
        
            { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados'},
            { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado'},
            { path: 'estados/edit/:id', component: EstadoFormComponent, resolve: {estado: estadoResolver}},
        
            { path: 'municipios', component: MunicipioListComponent, title: 'Lista de Municipios'},
            { path: 'municipios/new', component: MunicipioFormComponent, title: 'Novo Municipio'},
            { path: 'municipios/edit/:id', component: MunicipioFormComponent, resolve: {municipio: municipioResolver}},
        
        ]
    }
]