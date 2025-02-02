import { Test2Component } from './components/test2-external/test2-external.component';
import { WeatherComponent } from './components/weather-external/weather-external.component';
import { BarChartComponent } from './components/barChart-external/barChart-external.component';
import { NgModule } from '@angular/core';
import { PasswordExternalComponent } from './components/password-external/password-external.component';
import { TextExternalComponent } from './components/text-external/text-external.component';
import { TableExternalComponent } from './components/table-external/table-external.component';
import { FilterGroupExternalComponent } from './components/filter-group-external/filter-group-external.component';
import {TableModule} from 'primeng/table';
import { DropdownExternal } from './components/dropdown-external/dropdown-external.component';
import { ChartsExternalComponent } from './components/charts-external/charts-external.component';

import {PasswordModule} from 'primeng/password';
import {DropdownModule} from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { RowDataHandlerDirective } from './components/table-external/rowDataHandler/row-data-handler.directive';
import { IframeExternalComponent } from './components/iframe-external/iframe-external.component';
import { ListPipe } from './pipes/list/list.pipe';
import { GenerateWithAiComponent } from './components/generate-with-ai/generate-with-ai.component';
import { StackblitzEditorComponent } from './components/stackblitz-editor/stackblitz-editor.component';
import { IMPORT_MODULES } from './constant/stackblitz-constant';

@NgModule({
    declarations: [PasswordExternalComponent,
        TextExternalComponent,
        TableExternalComponent,
        FilterGroupExternalComponent,
        DropdownExternal,
        ChartsExternalComponent,
        RowDataHandlerDirective,
        IframeExternalComponent,
        ListPipe,
        GenerateWithAiComponent,
        StackblitzEditorComponent, BarChartComponent, WeatherComponent, Test2Component],
    imports: IMPORT_MODULES,
    exports: [PasswordExternalComponent,
        TextExternalComponent,
        TableExternalComponent,
        FilterGroupExternalComponent,
        TableModule,
        DropdownExternal,
        IframeExternalComponent,
        ChartsExternalComponent, PasswordModule, DropdownModule,
        GenerateWithAiComponent, BarChartComponent, WeatherComponent, Test2Component],
    providers: [
        DialogService 
    ]
})
export class PrimengSelectorsModule { }

//Create BaseProperties class for hmi-external
